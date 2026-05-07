import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { inngest } from '@/lib/inngest/client'

/**
 * Webhook handler for Remotion Lambda completions
 * URL: /api/webhooks/remotion?videoId=...
 */
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const videoId = searchParams.get('videoId')
    
    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 })
    }

    const body = await req.json()
    console.log(`[Webhook] Received Remotion callback for video ${videoId}:`, body)

    const supabase = createAdminClient()

    // Remotion payload types: 'success' | 'failure'
    if (body.type === 'success') {
      const region = process.env.REMOTION_AWS_REGION || 'us-east-1'
      const videoUrl = `https://${body.bucketName}.s3.${region}.amazonaws.com/${body.outKey}`

      // 1. Update database
      const { error: dbError } = await supabase
        .from('videos')
        .update({ 
          video_url: videoUrl,
          status: 'ready' 
        })
        .eq('id', videoId)

      if (dbError) throw dbError

      // 2. Notify Inngest that the render is complete
      await inngest.send({
        name: 'video/render.completed',
        data: { videoId, videoUrl, status: 'success' },
      })

      return NextResponse.json({ ok: true })
    } else if (body.type === 'failure') {
      // Handle failure
      await supabase
        .from('videos')
        .update({ status: 'failed' })
        .eq('id', videoId)

      await inngest.send({
        name: 'video/render.completed',
        data: { videoId, status: 'failed', error: body.errors },
      })

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown event type' }, { status: 400 })
  } catch (error: any) {
    console.error('[Webhook Error]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
