"use client"

import Image from 'next/image'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Play, Calendar, Film, X } from 'lucide-react'
import { VideoPlayerModal } from '@/components/dashboard/video-player-modal'

interface Props {
  video: {
    id: string
    created_at: string
    status: string
    image_urls: { sceneId: number; url: string }[]
    audio_url: string
    captions: any
    script: {
      title: string
      narration: string
      scenes: any[]
    }
    series?: {
      series_name: string
    }
  }
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  processing: { label: 'PROCESSING', className: 'bg-amber-500/90 text-white border-amber-400' },
  ready: { label: 'READY', className: 'bg-emerald-500/90 text-white border-emerald-400' },
  failed: { label: 'FAILED', className: 'bg-destructive/90 text-white border-destructive' },
}

export function VideoCard({ video }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const thumbnail = video.image_urls?.[0]?.url || '/placeholder-video.jpg'
  const title = video.script?.title || 'Untitled Video'
  const seriesName = video.series?.series_name || 'Individual Video'
  const status = STATUS_CONFIG[video.status || 'ready'] || STATUS_CONFIG.ready

  return (
    <>
      <div 
        onClick={() => video.status === 'ready' && setIsPlaying(true)}
        className={`group flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${video.status === 'ready' ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-[9/16] overflow-hidden bg-muted">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Status Badge (Top Right) */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider border shadow-sm ${status.className}`}>
              {status.label}
            </span>
          </div>

          {/* Play Overlay */}
          {video.status === 'ready' && (
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
               <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
               </div>
            </div>
          )}

          {/* Series Badge (Bottom Left) */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md bg-black/40 text-white">
              <Film className="w-3 h-3" />
              {seriesName}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-sm leading-tight truncate mb-1.5" title={title}>
            {video.status === 'processing' ? 'Generating Content...' : title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(video.created_at)}
          </div>
        </div>
      </div>

      {video.status === 'ready' && (
        <VideoPlayerModal 
          isOpen={isPlaying} 
          onClose={() => setIsPlaying(false)} 
          video={video} 
        />
      )}
    </>
  )
}

export function GeneratingVideoCard({ seriesName, status = 'processing' }: { seriesName: string; status?: string }) {
  const isFailed = status === 'failed'

  return (
    <div className={`flex flex-col rounded-2xl border border-dashed overflow-hidden ${isFailed ? 'border-destructive/30 bg-destructive/5' : 'border-primary/30 bg-primary/5 animate-pulse'}`}>
      <div className={`relative w-full aspect-[9/16] flex flex-col items-center justify-center gap-3 ${isFailed ? 'bg-destructive/10' : 'bg-primary/10'}`}>
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider border shadow-sm ${isFailed ? 'bg-destructive text-white border-destructive' : 'bg-amber-500/90 text-white border-amber-400'}`}>
            {isFailed ? 'FAILED' : 'PROCESSING'}
          </span>
        </div>

        <div className="relative">
            {isFailed ? (
               <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <X className="w-6 h-6 text-destructive" />
               </div>
            ) : (
               <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            )}
            {!isFailed && <Film className="w-6 h-6 text-primary absolute inset-0 m-auto" />}
        </div>
        <p className={`text-xs font-bold tracking-widest uppercase ${isFailed ? 'text-destructive' : 'text-primary'}`}>
          {isFailed ? 'Failed' : 'Generating'}
        </p>
      </div>
      <div className="p-4">
        <div className={`h-4 rounded w-3/4 mb-2 ${isFailed ? 'bg-destructive/10' : 'bg-primary/10'}`} />
        <div className={`h-3 rounded w-1/2 ${isFailed ? 'bg-destructive/5' : 'bg-primary/5'}`} />
      </div>
    </div>
  )
}
