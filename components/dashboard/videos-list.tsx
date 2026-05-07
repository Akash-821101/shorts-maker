"use client"

import { useEffect, useState } from 'react'
import { VideoCard, GeneratingVideoCard } from './video-card'
import { Video as VideoIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  initialVideos: any[]
  userId: string
}

export function VideosList({ initialVideos, userId: _userId }: Props) {
  const [videos, setVideos] = useState(initialVideos)

  // Sync state when server re-renders with fresh initialVideos
  useEffect(() => {
    setVideos(initialVideos)
  }, [initialVideos])

  // Real-time subscription to video updates
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel('video-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE)
          schema: 'public',
          table: 'videos'
        },
        (payload) => {
          console.log('[Real-time] Video update received:', payload)
          
          // Refresh the list when a change happens
          fetch('/api/videos')
            .then(res => res.json())
            .then(data => setVideos(data))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

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
