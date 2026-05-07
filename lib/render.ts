import {
  renderMediaOnLambda,
  getRenderProgress,
  type AwsRegion,
} from '@remotion/lambda/client'
import { createAdminClient } from './supabase/server'
import type { SceneInput, WordInput, CaptionStyle } from '../remotion/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RenderVideoParams {
  videoId: string
  seriesId: string
  audioUrl: string
  scenes: SceneInput[]
  words: WordInput[]
  captionStyle: CaptionStyle
  durationInSeconds: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

const POLL_INTERVAL_MS = 5_000
const MAX_WAIT_MS = 15 * 60 * 1_000 // 15 minutes

async function pollUntilDone(params: {
  renderId: string
  bucketName: string
  functionName: string
  region: AwsRegion
}): Promise<string> {
  const { renderId, bucketName, functionName, region } = params
  const deadline = Date.now() + MAX_WAIT_MS

  while (Date.now() < deadline) {
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName,
      region,
    })

    if (progress.fatalErrorEncountered) {
      const msg = progress.errors?.map((e) => e.message).join('; ') ?? 'Unknown render error'
      throw new Error(`Remotion render failed: ${msg}`)
    }

    if (progress.done) {
      if (!progress.outputFile) throw new Error('Render done but outputFile is missing')
      console.log(`[Render] Complete — output: ${progress.outputFile}`)
      return progress.outputFile
    }

    console.log(`[Render] Progress: ${Math.round((progress.overallProgress ?? 0) * 100)}%`)
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }

  throw new Error(`Remotion render timed out after ${MAX_WAIT_MS / 60_000} minutes`)
}

async function downloadAndUploadToSupabase(
  s3Url: string,
  seriesId: string,
  videoId: string,
): Promise<string> {
  console.log(`[Render] Downloading rendered video from S3…`)
  const res = await fetch(s3Url)
  if (!res.ok) throw new Error(`Failed to download rendered video: ${res.statusText}`)
  const buffer = Buffer.from(await res.arrayBuffer())

  const supabase = createAdminClient()
  const fileName = `${seriesId}/video-${videoId}.mp4`

  const { error } = await supabase.storage
    .from('shorts')
    .upload(fileName, buffer, { contentType: 'video/mp4', upsert: true })

  if (error) throw new Error(`Supabase upload failed: ${error.message}`)

  const { data: { publicUrl } } = supabase.storage.from('shorts').getPublicUrl(fileName)
  console.log(`[Render] Video stored at: ${publicUrl}`)
  return publicUrl
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Renders a short video using Remotion Lambda, uploads the MP4 to Supabase
 * Storage, and saves the public URL to the videos table.
 *
 * Required env vars:
 *   REMOTION_AWS_ACCESS_KEY_ID
 *   REMOTION_AWS_SECRET_ACCESS_KEY
 *   REMOTION_REGION           (e.g. "us-east-1")
 *   REMOTION_FUNCTION_NAME    (output of `npx remotion lambda functions deploy`)
 *   REMOTION_SERVE_URL        (output of `npx remotion lambda sites create remotion/index.ts`)
 */
export async function renderVideo(params: RenderVideoParams): Promise<string> {
  const {
    videoId,
    seriesId,
    audioUrl,
    scenes,
    words,
    captionStyle,
    durationInSeconds,
  } = params

  const region = getRequiredEnv('REMOTION_REGION') as AwsRegion
  const functionName = getRequiredEnv('REMOTION_FUNCTION_NAME')
  const serveUrl = getRequiredEnv('REMOTION_SERVE_URL')

  console.log(`[Render] Starting Remotion Lambda render for video ${videoId}`)

  const { renderId, bucketName } = await renderMediaOnLambda({
    region,
    functionName,
    serveUrl,
    composition: 'ShortVideo',
    inputProps: {
      audioUrl,
      scenes,
      words,
      captionStyle,
      durationInSeconds,
    },
    codec: 'h264',
    imageFormat: 'jpeg',
    jpegQuality: 90,
    // Higher value = fewer concurrent Lambdas = avoids AWS burst/concurrency limits.
    // 300 frames per chunk → ~6 Lambdas for a 60s video (1800 frames total).
    framesPerLambda: 300,
    concurrencyPerLambda: 1,
    // Public ACL so we can fetch the output URL directly
    privacy: 'public',
    maxRetries: 3,
    outName: `video-${videoId}.mp4`,
    logLevel: 'warn',
  })

  console.log(`[Render] Lambda job started — renderId=${renderId}, bucket=${bucketName}`)

  // Poll until the Lambda render completes
  const outputUrl = await pollUntilDone({ renderId, bucketName, functionName, region })

  // Download from S3 and re-host on Supabase so the URL stays consistent
  const videoUrl = await downloadAndUploadToSupabase(outputUrl, seriesId, videoId)

  // Persist the final video URL
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('videos')
    .update({ video_url: videoUrl })
    .eq('id', videoId)

  if (error) throw new Error(`Failed to save video_url: ${error.message}`)

  return videoUrl
}
