import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/server'
import type { Series } from '@/lib/types/series'
import type { VideoStatus } from '@/lib/types/video'
import { createClerkClient } from '@clerk/nextjs/server'
import { sendResendEmail} from '@/lib/resend'
import { getVideoReadyEmailTemplate } from '@/lib/email-templates'

// ─── Generate Video ───────────────────────────────────────────────────────────
/**
 * Trigger event : "video/generate"
 * Payload       : { data: { seriesId: string } }
 *
 * Steps (run sequentially):
 *  1. fetch-series-data     — real: loads series row from Supabase
 *  2. generate-script       — placeholder: AI script generation
 *  3. generate-voice        — placeholder: TTS audio generation
 *  4. generate-captions     — placeholder: caption generation
 *  5. generate-images       — placeholder: image generation from prompts
 *  6. save-to-database      — placeholder: persist all assets
 */
export const generateVideo = inngest.createFunction(
  { id: 'generate-video', name: 'Generate Video', triggers: [{ event: 'video/generate' }] },
  async ({ event, step }) => {
    const { seriesId, videoId, isScheduled } = event.data as { 
      seriesId: string; 
      videoId: string; 
      isScheduled?: boolean 
    }

    if (!seriesId || !videoId) {
      throw new Error('Missing required event payload fields: seriesId or videoId')
    }

    // ── Step 1: Fetch series data from database ──────────────────────────────
    const series = await step.run('fetch-series-data', async (): Promise<Series> => {
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('id', seriesId)
        .single()

      if (error || !data) {
        throw new Error(`Series not found: ${seriesId}`)
      }

      return data as Series
    })

    // ── Step 2: Check & Deduct Credits ───────────────────────────────────────
    await step.run('deduct-credits', async () => {
      const { deductCreditsInternal } = await import('@/app/actions/credits')
      await deductCreditsInternal(
        series.user_id, 
        1, 
        `Video generation for series: ${series.series_name}`
      )
    })

    try {
      // ── Step 3: Generate video script using AI ───────────────────────────────
      const script = await step.run('generate-script', async () => {
        const { generateVideoScript } = await import('@/lib/gemini')
        const { VISUAL_STYLES } = await import('@/lib/data/styles')
        
        const style = VISUAL_STYLES.find(s => s.id === series.style_id)?.title || series.style_id
        
        return await generateVideoScript({
          niche: series.niche,
          title: series.series_name,
          duration: series.video_duration,
          style: style
        })
      })

      // ── Step 4: Generate voice using TTS model ───────────────────────────────
      const voice = await step.run('generate-voice', async () => {
        const { generateTTS } = await import('@/lib/tts')
        
        return await generateTTS({
          text: script.narration,
          voiceId: series.voice_id,
          seriesId: series.id
        })
      })

      // ── Step 5: Generate captions ────────────────────────────────────────────
      const captions = await step.run('generate-captions', async () => {
        const { generateCaptions } = await import('@/lib/captions')
        
        return await generateCaptions({
          audioUrl: voice.audioUrl,
          seriesId: series.id
        })
      })

      // ── Step 6: Generate images ──────────────────────────────────────────────
      const images = await step.run('generate-images', async () => {
        const { generateImages } = await import('@/lib/images')
        
        return await generateImages({
          scenes: script.scenes,
          seriesId: series.id,
          styleId: series.style_id
        })
      })

      // ── Step 7: Save all assets to database (video still rendering) ─────────
      await step.run('finalize-video', async () => {
        const supabase = createAdminClient()

        const { error: videoError } = await supabase
          .from('videos')
          .update({
            status: 'processing',
            script: script,
            audio_url: voice.audioUrl,
            captions: captions,
            image_urls: images.images,
            video_url: '',
          })
          .eq('id', videoId)

        if (videoError) {
          throw new Error(`Failed to finalize video: ${videoError.message}`)
        }

        return { success: true }
      })

      // ── Step 8: Render final MP4 with Remotion Lambda ────────────────────────
      await step.run('render-video', async () => {
        const { renderVideo } = await import('@/lib/render')
        const { CAPTION_STYLES } = await import('@/lib/data/captions')

        const captionStyle =
          CAPTION_STYLES.find((s) => s.id === series.caption_id) ?? CAPTION_STYLES[0]

        const lastWord = captions.words[captions.words.length - 1]
        const durationInSeconds = lastWord ? lastWord.end + 0.5 : 60

        await renderVideo({
          videoId,
          seriesId,
          audioUrl: voice.audioUrl,
          scenes: images.images.map((img: { sceneId: number; url: string }) => ({
            sceneId: img.sceneId,
            imageUrl: img.url,
          })),
          words: captions.words,
          captionStyle,
          durationInSeconds,
        })

        return { success: true }
      })

      // ── Step 9: Mark video Ready ───────────────────────────
      await step.run('mark-ready', async () => {
        const supabase = createAdminClient()

        const { error: videoError } = await supabase
          .from('videos')
          .update({ status: 'ready' })
          .eq('id', videoId)

        if (videoError) {
          throw new Error(`Failed to mark video ready: ${videoError.message}`)
        }

        const { error: seriesError } = await supabase
          .from('series')
          .update({ status: 'scheduled' })
          .eq('id', seriesId)

        if (seriesError) {
          throw new Error(`Failed to update series status: ${seriesError.message}`)
        }

        return { success: true }
      })

      // ── Step 10: Send email notification to user ─────────────────────────────
      if (!isScheduled) {
        await step.run('send-notification', async () => {
        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
        
        // 1. Fetch user details from Clerk
        const user = await clerk.users.getUser(series.user_id)
        const email = user.emailAddresses[0]?.emailAddress

        if (!email) {
          console.warn(`[Inngest] No email found for user ${series.user_id}`)
          return { skipped: true, reason: 'No email found' }
        }

        // 2. Prepare email content
        const thumbnailUrl = images.images[0]?.url || ''
        
        // Fetch the final video URL from the database
        const supabase = createAdminClient()
        const { data } = await supabase
          .from('videos')
          .select('video_url')
          .eq('id', videoId)
          .single()
          
        const videoUrl = data?.video_url

        if (!videoUrl) {
          console.error(`[Inngest] Video URL not found for video ${videoId}`)
          return { skipped: true, reason: 'Video URL not found' }
        }

        const emailHtml = getVideoReadyEmailTemplate({
          seriesName: series.series_name,
          thumbnailUrl,
          videoUrl,
          downloadUrl: videoUrl, // Using videoUrl for download as well for now
        })

        // 3. Send the email using Resend
        const result = await sendResendEmail({
          to: email,
          subject: `Your video for "${series.series_name}" is ready!`,
          body: emailHtml,
        })

        if (!result.success) {
          throw new Error(`Failed to send email notification: ${result.error}`)
        }

        return { success: true, emailSentTo: email }
      })
    }
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error during generation'

      // 1. Set video status to failed and save error
      await step.run('mark-as-failed', async () => {
        const supabase = createAdminClient()
        
        let friendlyMessage = errorMessage
        if (errorMessage.toLowerCase().includes('insufficient credits')) {
          friendlyMessage = 'Insufficient credits'
        } else if (errorMessage.toLowerCase().includes('auth') || errorMessage.toLowerCase().includes('permission')) {
          friendlyMessage = 'Account connection issue'
        } else if (errorMessage.toLowerCase().includes('timeout') || errorMessage.toLowerCase().includes('network')) {
          friendlyMessage = 'Network error. Retrying...'
        } else if (errorMessage.length > 50) {
          friendlyMessage = 'Generation failed. Please try again.'
        }

        await supabase
          .from('videos')
          .update({ 
            status: 'failed',
            last_error: friendlyMessage 
          })
          .eq('id', videoId)
        
        // Log the error on the series but keep it 'scheduled' (resilient)
        const isAuthError = errorMessage.toLowerCase().includes('auth') || errorMessage.toLowerCase().includes('permission')
        
        await supabase
          .from('series')
          .update({ 
            status: isAuthError ? 'failed' : 'scheduled',
            last_error: friendlyMessage
          })
          .eq('id', seriesId)
      })

      // 2. Refund credits (Only if deduction actually happened and it wasn't an "Insufficient credits" error)
      if (errorMessage !== 'Insufficient credits') {
        await step.run('refund-credits', async () => {
          const { createAdminClient } = await import('@/lib/supabase/server')
          const supabase = createAdminClient()
          
          const { data: userData } = await supabase
            .from('users')
            .select('credits')
            .eq('user_id', series.user_id)
            .single()
          
          const currentCredits = userData?.credits || 0
          
          await supabase
            .from('users')
            .update({ credits: currentCredits + 1 })
            .eq('user_id', series.user_id)
            
          await supabase
            .from('credit_transactions')
            .insert({
              user_id: series.user_id,
              amount: 1,
              type: 'bonus',
              description: `Refund for failed video generation: ${series.series_name}`
            })
        })
      }
      throw error
    }

    return {
      seriesId,
      series: series.series_name,
      status: 'complete',
    }
  },
)

// ── Series Scheduler (Cron) ──────────────────────────────────────────────────
/**
 * Runs every hour to find series that need video generation.
 * Generation happens 2 hours before the scheduled publish time.
 */
export const seriesScheduler = inngest.createFunction(
  { 
    id: 'series-scheduler', 
    name: 'Series Scheduler',
    triggers: [{ cron: '0 * * * *' }] // Run every hour
  },
  async ({ step }) => {
    const supabase = createAdminClient()
    
    // Fetch all active series
    const { data: seriesList, error } = await supabase
      .from('series')
      .select('*')
      .eq('status', 'scheduled')

    if (error || !seriesList) {
      return { error: error?.message || 'No active series found' }
    }

    const scheduledCount = 0
    const triggers = []

    for (const series of seriesList as Series[]) {
      const publishDate = new Date(series.publish_time)
      const now = new Date()

      // ── Start Date Protection ──
      // If the user selected a future date (e.g., next week), don't start yet.
      if (now < publishDate) {
        continue
      }
      
      // ── Daily Cycle Logic ──
      // Once the start date is reached, we use the TIME for daily recurring generation.
      const todayPublish = new Date(now)
      todayPublish.setHours(publishDate.getUTCHours(), publishDate.getUTCMinutes(), 0, 0)
      
      const generationTime = new Date(todayPublish.getTime() - 2 * 60 * 60 * 1000)
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

      // ── Logic A: Normal Scheduling (Generation is coming up in the next hour) ──
      const isUpcoming = generationTime >= now && generationTime < oneHourFromNow

      // ── Logic B: Catch-up (Scheduled time for today has already passed) ──
      const isPastDue = generationTime < now

      if (isUpcoming || isPastDue) {
        // Fetch user credits to ensure they have enough to generate
        const { getCreditsByUserId } = await import('@/app/actions/credits')
        const credits = await getCreditsByUserId(series.user_id)

        if (credits <= 0) {
          console.log(`[Scheduler] Skipping series ${series.id} due to insufficient credits for user ${series.user_id}`)
          
          await supabase
            .from('series')
            .update({ 
              last_error: 'Insufficient credits for scheduled generation. Please upgrade your plan.' 
            })
            .eq('id', series.id)

          continue
        }

        // Check if we already have a video generating/ready for this series recently
        // We use a 20-hour window to ensure we only generate one video per day
        const { data: existingVideo } = await supabase
          .from('videos')
          .select('id')
          .eq('series_id', series.id)
          .gte('created_at', new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString())
          .limit(1)

        if (!existingVideo || existingVideo.length === 0) {
          triggers.push(
            step.sendEvent(`trigger-workflow-${series.id}-${now.toDateString()}`, {
              name: 'series/schedule.workflow',
              data: { seriesId: series.id, isTest: false }
            })
          )
        }
      }
    }

    await Promise.all(triggers)

    return { scheduled: triggers.length }
  }
)

// ── Series Workflow (Daily Lifecycle) ────────────────────────────────────────
/**
 * Manages the daily lifecycle of a series:
 * 1. Sleep until generation time (2 hours before publish).
 * 2. Generate video.
 * 3. Sleep until publish time.
 * 4. Notify user and "publish" (placeholders).
 */
export const seriesWorkflow = inngest.createFunction(
  { 
    id: 'series-workflow', 
    name: 'Series Daily Workflow',
    triggers: [{ event: 'series/schedule.workflow' }]
  },
  async ({ event, step }) => {
    const { seriesId, isTest } = event.data as { seriesId: string; isTest?: boolean }
    const supabase = createAdminClient()

    // 1. Fetch series data
    const series = await step.run('fetch-series', async (): Promise<Series> => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('id', seriesId)
        .single()
      if (error || !data) throw new Error(`Series not found: ${seriesId}`)
      return data as Series
    })

    // 2. Calculate timing
    const publishTime = new Date(series.publish_time)
    const now = new Date()
    const nextPublish = new Date(now)
    nextPublish.setHours(publishTime.getUTCHours(), publishTime.getUTCMinutes(), 0, 0)
    if (nextPublish <= now && !isTest) {
      nextPublish.setDate(nextPublish.getDate() + 1)
    }
    
    const generationTime = new Date(nextPublish.getTime() - 2 * 60 * 60 * 1000)

    // 3. Sleep until generation (unless testing)
    if (!isTest && generationTime > now) {
      await step.sleepUntil('wait-for-generation', generationTime)
    }

    // 4. Create video record and trigger generation
    const videoId = await step.run('create-video-record', async () => {
      const { data, error } = await supabase
        .from('videos')
        .insert({
          series_id: seriesId,
          status: 'generating',
          last_error: null
        })
        .select('id')
        .single()
      
      if (error) throw new Error(`Failed to create video record: ${error.message}`)

      // Clear series error as well
      await supabase
        .from('series')
        .update({ last_error: null })
        .eq('id', seriesId)

      return data.id
    })

    // Invoke the generation function
    // We use invoke to wait for it to complete
    await step.invoke('run-generation', {
      function: generateVideo,
      data: { seriesId, videoId, isScheduled: true }
    })

    // 5. Sleep until publish time (unless testing)
    if (!isTest && nextPublish > now) {
      await step.sleepUntil('wait-for-publish', nextPublish)
    } else if (isTest) {
      // Small delay for test to feel "real"
      await step.sleep('test-delay', '10s')
    }

    // 6. Final publishing and notification
    const result = await step.run('publish-and-notify', async () => {
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
      const user = await clerk.users.getUser(series.user_id)
      const email = user.emailAddresses[0]?.emailAddress

      if (!email) return { skipped: true, reason: 'No email found' }

      // Fetch the generated video
      const { data: video } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single()

      if (!video || !video.video_url) {
        throw new Error('Video not ready or URL missing at publish time')
      }

      // Update video status to publishing
      await supabase
        .from('videos')
        .update({ status: 'publishing' })
        .eq('id', videoId)

      // Social Media Publishing
      const platforms = series.target_platforms || []
      const socialLogs = []

      if (platforms.includes('youtube')) {
        try {
          const { getYouTubeConnection, refreshYouTubeToken, uploadToYouTube } = await import('@/lib/youtube')
          const connection = await getYouTubeConnection(series.user_id)
          
          if (connection) {
            let token = connection.access_token
            const isExpired = new Date(connection.expires_at) <= new Date()
            
            if (isExpired && connection.refresh_token) {
              token = await refreshYouTubeToken(connection.id, connection.refresh_token)
            }
            
            if (token) {
              const youtubeVideoId = await uploadToYouTube({
                accessToken: token,
                videoUrl: video.video_url,
                title: series.series_name,
                description: `Created with Shorts Maker AI. Series: ${series.series_name}`,
              })
              
              console.log(`[YouTube] Successfully published video ${videoId} to YouTube: ${youtubeVideoId}`)
              socialLogs.push(`YouTube (Video ID: ${youtubeVideoId})`)
            } else {
              socialLogs.push('YouTube (Failed: No valid token)')
            }
          } else {
            socialLogs.push('YouTube (Skipped: Not connected)')
          }
        } catch (error: any) {
          console.error(`[YouTube] Error publishing video ${videoId}:`, error)
          socialLogs.push(`YouTube (Error: ${error.message})`)
        }
      }

      if (platforms.includes('instagram')) {
        console.log(`[Instagram] Placeholder: Publishing video ${videoId} to Instagram account`)
        socialLogs.push('Instagram (Placeholder)')
      }

      if (platforms.includes('tiktok')) {
        console.log(`[TikTok] Placeholder: Publishing video ${videoId} to TikTok account`)
        socialLogs.push('TikTok (Placeholder)')
      }

      // Analyze results
      const hasFailures = socialLogs.some(log => log.includes('Error:') || log.includes('Failed:'))
      const hasSuccess = socialLogs.some(log => 
        !log.includes('Error:') && 
        !log.includes('Failed:') && 
        !log.includes('Skipped:') && 
        !log.includes('Placeholder') &&
        log.includes('Video ID:') // Specifically looking for success markers
      )
      
      const requestedPlatforms = platforms.length > 0
      
      // Determine final video status
      let finalStatus: VideoStatus = 'published'
      let errorSummary = null

      if (requestedPlatforms) {
        if (!hasSuccess) {
          finalStatus = 'ready' // Revert to ready if none of the requested platforms succeeded
        }
        
        if (hasFailures) {
          const rawErrors = socialLogs.filter(l => l.includes('Error:') || l.includes('Failed:'))
          
          // Map to user-friendly messages
          const friendlyErrors = rawErrors.map(err => {
            const lowErr = err.toLowerCase()
            if (lowErr.includes('youtube data api') || lowErr.includes('disabled')) return 'YouTube API disabled'
            if (lowErr.includes('refresh_token') || lowErr.includes('token') || lowErr.includes('auth')) return 'Social account disconnected'
            if (lowErr.includes('permission')) return 'Missing permissions'
            return 'Publishing failed'
          })
          
          // Deduplicate and join
          errorSummary = Array.from(new Set(friendlyErrors)).join('; ')
        }
      }

      // Update video status
      await supabase
        .from('videos')
        .update({ 
          status: finalStatus,
          last_error: errorSummary
        })
        .eq('id', videoId)
        
      // Also update series with error if any, to show on the dashboard
      if (errorSummary) {
        await supabase
          .from('series')
          .update({ last_error: `Publishing failed: ${errorSummary}` })
          .eq('id', seriesId)
      } else {
        // Clear previous errors if successful
        await supabase
          .from('series')
          .update({ last_error: null })
          .eq('id', seriesId)
      }

      // Send Email (After publishing attempt)
      const emailHtml = getVideoReadyEmailTemplate({
        seriesName: series.series_name,
        thumbnailUrl: video.image_urls?.[0]?.url || '',
        videoUrl: video.video_url,
        downloadUrl: video.video_url,
      })

      const subject = hasSuccess 
        ? `Your video for "${series.series_name}" has been published!`
        : (requestedPlatforms && hasFailures)
          ? `Action Required: Publishing failed for "${series.series_name}"`
          : `Your video for "${series.series_name}" is ready!`

      const emailResult = await sendResendEmail({
        to: email,
        subject: subject,
        body: emailHtml,
      })

      return { 
        success: requestedPlatforms ? hasSuccess : true, 
        emailSent: emailResult.success, 
        platformsPublished: socialLogs,
        error: errorSummary,
        finalStatus
      }
    })

    const status = ('finalStatus' in result) ? (result as any).finalStatus : 'skipped'
    return { status: status || 'published', seriesId, videoId }
  }
)
