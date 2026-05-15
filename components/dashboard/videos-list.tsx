"use client"

import { useEffect, useRef, useState } from 'react'
import { VideoCard, GeneratingVideoCard } from './video-card'
import { Video as VideoIcon } from 'lucide-react'

const POLL_INTERVAL = 80000 // 8 seconds: Good balance between speed and server load

interface Props {
  initialVideos: any[]
  userId: string
}

export function VideosList({ initialVideos, userId: _userId }: Props) {
  const [videos, setVideos] = useState(initialVideos)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sync state when server re-renders
  useEffect(() => {
    setVideos(initialVideos)
  }, [initialVideos])

  // 🔄 Optimized Polling Heartbeat
  useEffect(() => {
    const IN_PROGRESS_STATUSES = ['generating', 'processing', 'rendering', 'publishing']
    const hasActiveGeneration = videos.some(v => IN_PROGRESS_STATUSES.includes(v.status))

    if (!hasActiveGeneration) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    if (intervalRef.current) return // Already polling

    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/videos')
        if (!res.ok) return
        const data = await res.json()
        setVideos(data)
      } catch (err) {
        console.error('[Polling] Error:', err)
      }
    }

    fetchLatest() // Initial fetch
    intervalRef.current = setInterval(fetchLatest, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [videos])

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 py-32 text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <VideoIcon className="w-12 h-12 text-primary/40" />
        </div>
        <p className="text-lg font-semibold mb-1">Your video library is empty</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Generate a video from one of your series to see it appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {videos.map((v) => {
        // Show the real video card if it's finished OR if we already have the script/assets
        const hasContent = v.script?.title && (v.image_urls?.length > 0 || v.video_url)
        const isTerminal = v.status === 'ready' || v.status === 'published' || v.status === 'failed'

        const shouldShowFullCard = isTerminal || hasContent

        return shouldShowFullCard ? (
          <VideoCard key={v.id} video={v} />
        ) : (
          <GeneratingVideoCard
            key={v.id}
            seriesName={v.series?.series_name || 'Generating...'}
            status={v.status}
          />
        )
      })}
    </div>
  )
}
