import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/server'
import type { Series } from '@/lib/types/series'

// ─── Hello World smoke-test ───────────────────────────────────────────────────
/**
 * Trigger event: "test/hello.world"
 * Payload: { data: { name: string } }
 */
export const helloWorld = inngest.createFunction(
  { id: 'hello-world', triggers: [{ event: 'test/hello.world' }] },
  async ({ event, step }) => {
    const message = await step.run('build-greeting', async () => {
      return `Hello, ${event.data.name ?? 'World'}! Inngest is working.`
    })

    await step.sleep('wait-a-moment', '1s')

    return { message }
  },
)

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

      // ── Step 7: Save everything to database ──────────────────────────────────
      await step.run('finalize-video', async () => {
        const supabase = createAdminClient()
        
        // 1. Update video record with final data
        const { error: videoError } = await supabase
          .from('videos')
          .update({
            status: 'ready',
            script: script,
            audio_url: voice.audioUrl,
            captions: captions,
            image_urls: images.images, // Now a JSONB array of {sceneId, url}
            video_url: '', // Placeholder for future use
          })
          .eq('id', videoId)

        if (videoError) {
          throw new Error(`Failed to finalize video: ${videoError.message}`)
        }

        // 2. Update series status
        const { error: seriesError } = await supabase
          .from('series')
          .update({ status: 'published' })
          .eq('id', seriesId)

        if (seriesError) {
          throw new Error(`Failed to update series status: ${seriesError.message}`)
        }

        return { success: true }
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
