import { createAdminClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api/middleware'
import { apiError, apiOk } from '@/lib/api/respond'
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import type { SeriesPayload } from '@/lib/types/series'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const { id } = await params
  const payload: SeriesPayload = await request.json()

  const {
    seriesName, niche, language, voiceId, styleId,
    captionId, videoDuration, targetPlatforms, publishTime,
  } = payload

  if (!seriesName?.trim())      return apiError('Series name is required.')
  if (!niche)                   return apiError('Niche is required.')
  if (!language)                return apiError('Language is required.')
  if (!voiceId)                 return apiError('Voice is required.')
  if (!styleId)                 return apiError('Visual style is required.')
  if (!captionId)               return apiError('Caption style is required.')
  if (!videoDuration)           return apiError('Video duration is required.')
  if (!targetPlatforms?.length) return apiError('At least one target platform is required.')
  if (!publishTime)             return apiError('Publish time is required.')

  const supabase = createAdminClient()

  // Ownership check
  const { data: owned } = await supabase
    .from('series')
    .select('id')
    .eq('id', id)
    .eq('user_id', auth.userId)
    .single()

  if (!owned) return apiError('Not found', 404)

  const { error } = await supabase
    .from('series')
    .update({
      series_name: seriesName.trim(),
      niche,
      custom_niche: payload.customNiche || null,
      language,
      voice_id: voiceId,
      music_ids: payload.musicIds ?? [],
      style_id: styleId,
      caption_id: captionId,
      video_duration: videoDuration,
      target_platforms: targetPlatforms,
      publish_time: new Date(publishTime).toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[PUT /api/series/[id]]', error)
    return apiError(error.message, 500)
  }

  revalidatePath('/dashboard')
  return apiOk({ id })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const { id } = await params
  const body = await request.json()
  const supabase = createAdminClient()

  const { data: owned } = await supabase
    .from('series')
    .select('id')
    .eq('id', id)
    .eq('user_id', auth.userId)
    .single()

  if (!owned) return apiError('Not found', 404)

  const { error } = await supabase.from('series').update(body).eq('id', id)
  if (error) return apiError(error.message, 500)

  revalidatePath('/dashboard')
  return apiOk({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const { id } = await params
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('series')
    .delete()
    .eq('id', id)
    .eq('user_id', auth.userId)

  if (error) return apiError(error.message, 500)

  revalidatePath('/dashboard')
  return apiOk({ success: true })
}
