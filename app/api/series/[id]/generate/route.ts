import { NextRequest, NextResponse } from 'next/server'
import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api/middleware'
import { apiError } from '@/lib/api/respond'
import { revalidatePath } from 'next/cache'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  // Authenticate the user via Clerk
   
  const auth = await requireAuth()
 
  if (auth instanceof Response) return auth

  const { id: seriesId } = await params
  const supabase = createAdminClient()

  // Verify the series belongs to this user
  const { data, error } = await supabase
    .from('series')
    .select('id, status')
    .eq('id', seriesId)
    .eq('user_id', auth.userId)
    .single()

  if (error || !data) {
    return apiError('Series not found.', 404)
  }

  // 1. Mark series as generating
  await supabase
    .from('series')
    .update({ 
      status: 'generating',
      updated_at: new Date().toISOString() 
    })
    .eq('id', seriesId)

  // 2. Create the video record immediately so it shows up in the UI instantly
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .insert({
      series_id: seriesId,
      status: 'processing',
      script: {}, 
      audio_url: '', 
      captions: {}, 
      image_urls: [] 
    })
    .select('id')
    .single()

  if (videoError || !video) {
    return apiError('Failed to initialize video record.', 500)
  }

  // 3. Send event to Inngest
  await inngest.send({
    name: 'video/generate',
    data: { seriesId, videoId: video.id },
  })

  // Revalidate the videos page so it shows the new status immediately
  revalidatePath('/dashboard/videos')

  return NextResponse.json({ ok: true, videoId: video.id })
}
