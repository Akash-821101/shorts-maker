"use client"

import { useEffect, useRef, useState } from 'react'
import { VideoCard, GeneratingVideoCard } from './video-card'
import { Video as VideoIcon } from 'lucide-react'

const POLL_INTERVAL = 4000

interface Props {
  initialVideos: any[]
  userId: string
}

export function VideosList({ initialVideos, userId: _userId }: Props) {
  const [videos, setVideos] = useState(initialVideos)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sync state when server re-renders with fresh initialVideos
  useEffect(() => {
    setVideos(initialVideos)
  }, [initialVideos])

  // Poll only while at least one video is still processing
  useEffect(() => {
    const hasProcessing = videos.some(v => v.status === 'processing')

    if (!hasProcessing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    if (intervalRef.current) return // already polling

    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/videos')
        if (!res.ok) return
        setVideos(await res.json())
      } catch (err) {
        console.error('[Polling] Error:', err)
      }
    }

    fetchLatest()
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
      {videos.map((v) => (
        v.status === 'processing' || v.status === 'failed' ? (
          <GeneratingVideoCard
            key={v.id}
            seriesName={v.series?.series_name || 'Generating...'}
            status={v.status}
          />
        ) : (
          <VideoCard key={v.id} video={v} />
        )
      ))}
    </div>
  )
}
