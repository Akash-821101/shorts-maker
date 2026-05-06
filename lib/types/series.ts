export type SeriesStatus = 'scheduled' | 'active' | 'paused'

export interface Series {
  id: string
  user_id: string
  series_name: string
  niche: string
  custom_niche: string | null
  language: string
  voice_id: string
  music_ids: string[]
  style_id: string
  caption_id: string
  video_duration: string
  target_platforms: string[]
  publish_time: string
  status: SeriesStatus
  created_at: string
}

export interface SeriesPayload {
  seriesName: string
  niche: string
  customNiche?: string
  language: string
  voiceId: string
  musicIds: string[]
  styleId: string
  captionId: string
  videoDuration: string
  targetPlatforms: string[]
  publishTime: string
}
