"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VideoCard, GeneratingVideoCard } from './video-card'
import { createClient } from '@/lib/supabase/client'
import { Video as VideoIcon } from 'lucide-react'

interface Props {
  initialVideos: any[]
  userId: string
}

export function VideosList({ initialVideos, userId }: Props) {
  const router = useRouter()
  const [videos, setVideos] = useState(initialVideos)
  const supabase = createClient()

  // Sync state if initialVideos changes (e.g. via router.refresh)
  useEffect(() => {
    setVideos(initialVideos)
  }, [initialVideos])

  // Polling for updates
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // 1. Fetch latest videos for the user
        const { data: userSeries } = await supabase
          .from('series')
          .select('id')
          .eq('user_id', userId)
        
        const seriesIds = userSeries?.map(s => s.id) || []
        
        if (seriesIds.length > 0) {
          const { data: latestVideos, error } = await supabase
            .from('videos')
            .select('*, series(series_name)')
            .in('series_id', seriesIds)
            .order('created_at', { ascending: false })
            // Cache busting: ensure we get fresh data from DB
            .gt('created_at', '2024-01-01') 
          
          if (error) {
            console.error('[Polling] Error fetching videos:', error)
            return
          }

          if (latestVideos) {
            console.log(`[Polling] Fetched ${latestVideos.length} videos. Statuses:`, latestVideos.map(v => v.status))
            setVideos(latestVideos)
          }
        }
      } catch (err) {
        console.error('[Polling] Unexpected error:', err)
      }
    }

    // Call immediately on mount
    fetchLatest()

    const interval = setInterval(fetchLatest, 3000) 

    return () => clearInterval(interval)
  }, [userId, supabase])

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('videos-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'videos' 
      }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

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
