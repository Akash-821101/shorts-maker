import { createAdminClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api/middleware'
import { apiError, apiOk } from '@/lib/api/respond'
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import type { SeriesPayload } from '@/lib/types/series'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('user_id', auth.userId)
    .order('created_at', { ascending: false })

  if (error) return apiError(error.message, 500)
  return apiOk(data)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

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
  const { data, error } = await supabase
    .from('series')
    .insert({
      user_id: auth.userId,
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
      status: 'scheduled',
    })
    .select('id')
    .single()

  if (error) {
    console.error('[POST /api/series]', error)
    return apiError(error.message, 500)
  }

  revalidatePath('/dashboard')
  return apiOk({ id: data.id }, 201)
}
