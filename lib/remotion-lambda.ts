import { renderVideoOnLambda, getRenderProgress } from '@remotion/lambda/client'
import { createAdminClient } from './supabase/server'



/**
 * Triggers a video render on AWS Lambda
 */
export async function triggerVideoRender({
  videoId,
  inputProps,
}: {
  videoId: string
  inputProps: any
}) {
  const supabase = createAdminClient()

  // Retrieve env variables inside the function to ensure they are loaded
  const region = process.env.REMOTION_AWS_REGION || 'us-east-1'
  const functionName = process.env.REMOTION_FUNCTION_NAME || 'remotion-render-4-0-457'
  const serveUrl = process.env.REMOTION_SERVE_URL || 'shorts-maker-site'

  console.log('[Remotion] Triggering render with:', {
    region,
    functionName,
    serveUrl,
    videoId
  })

  try {
    const { renderId, bucketName } = await renderVideoOnLambda({
      region: region as any,
      functionName: functionName,
      serveUrl: serveUrl,
      composition: 'ShortVideo',
      inputProps,
      codec: 'h264',
      privacy: 'public',
      framesPerLambda: 100,      // More frames per Lambda instance to reduce total concurrency
    })

    console.log('[Remotion] Render triggered successfully:', renderId)

    // Store renderId in database to track progress
    await supabase
      .from('videos')
      .update({ 
        status: 'rendering',
        render_id: renderId,
        bucket_name: bucketName
      })
      .eq('id', videoId)

    return { renderId, bucketName }
  } catch (error: any) {
    console.error('Failed to trigger Remotion render:', error)
    throw error
  }
}

/**
 * Polls for render completion and updates Supabase
 * In a real app, you might use a webhook, but for simplicity we'll poll in Inngest
 */
export async function checkRenderStatus(renderId: string, bucketName: string) {
  const region = (process.env.REMOTION_AWS_REGION as any) || 'us-east-1'
  const functionName = process.env.REMOTION_FUNCTION_NAME || 'remotion-render-4-0-457'
  
  const { done, fatalErrorEncountered, outKey, errors } = await getRenderProgress({
    renderId,
    bucketName,
    region: region,
    functionName: functionName,
  })

  if (fatalErrorEncountered) {
    console.error('[Remotion] Fatal error during render:', errors)
    throw new Error(`Remotion render failed: ${errors[0]?.message || 'Unknown fatal error'}`)
  }

  if (done && outKey) {
    const videoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${outKey}`
    return { done: true, videoUrl }
  }

  return { done: false }
}
