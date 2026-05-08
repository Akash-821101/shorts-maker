import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/server'
import type { Series } from '@/lib/types/series'
import { createClerkClient } from '@clerk/nextjs/server'
import { sendResendEmail, getVideoReadyEmailTemplate } from '@/lib/resend'

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
    const { seriesId, videoId } = event.data as { seriesId: string; videoId: string }

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

      // ── Step 9: Mark video and series as published ───────────────────────────
      await step.run('mark-published', async () => {
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
          .update({ status: 'published' })
          .eq('id', seriesId)

        if (seriesError) {
          throw new Error(`Failed to update series status: ${seriesError.message}`)
        }

        return { success: true }
      })

      // ── Step 10: Send email notification to user ─────────────────────────────
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
    } catch (error: any) {
      // Set video status to failed
      await step.run('mark-as-failed', async () => {
        const supabase = createAdminClient()
        await supabase
          .from('videos')
          .update({ status: 'failed' })
          .eq('id', videoId)
        
        await supabase
          .from('series')
          .update({ status: 'failed' })
          .eq('id', seriesId)
      })
      throw error
    }

    return {
      seriesId,
      series: series.series_name,
      status: 'complete',
    }
  },
)
