export type VideoStatus = 
  | 'queued' 
  | 'generating' 
  | 'processing'
  | 'rendering' 
  | 'ready' 
  | 'publishing' 
  | 'published' 
  | 'failed'

export interface Video {
  id: string
  series_id: string
  created_at: string
  status: VideoStatus
  last_error: string | null
  video_url?: string
  image_urls: { sceneId: number; url: string }[]
  audio_url: string
  captions: any
  script: {
    title: string
    narration: string
    scenes: any[]
  }
}
