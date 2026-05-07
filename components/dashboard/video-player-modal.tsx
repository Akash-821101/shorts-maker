"use client"

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Play, Pause, X, Volume2, VolumeX } from 'lucide-react'
import Image from 'next/image'

interface Props {
  isOpen: boolean
  onClose: () => void
  video: {
    video_url?: string
    audio_url: string
    image_urls: { sceneId: number; url: string }[]
    captions: {
      words: { word: string; start: number; end: number }[]
    }
    script: {
      title: string
    }
  }
}

export function VideoPlayerModal({ isOpen, onClose, video }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)

  const hasVideo = Boolean(video.video_url)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        mediaRef.current?.play().catch(console.error)
        setIsPlaying(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      mediaRef.current?.pause()
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [isOpen])

  const handleTimeUpdate = () => {
    if (mediaRef.current) setCurrentTime(mediaRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (mediaRef.current) setDuration(mediaRef.current.duration)
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPlaying) {
      mediaRef.current?.pause()
    } else {
      mediaRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Fallback preview: cycle through scene images using audio progress
  const imageIndex = duration > 0
    ? Math.min(Math.floor((currentTime / duration) * video.image_urls.length), video.image_urls.length - 1)
    : 0
  const currentImage = video.image_urls[imageIndex]?.url || video.image_urls[0]?.url

  const currentWords = video.captions?.words?.filter(
    (w: any) => currentTime >= w.start && currentTime <= w.end,
  ) || []

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[400px] w-[90vw] p-0 overflow-hidden bg-black border-none rounded-[32px] aspect-[9/16] sm:max-h-[85vh]">
        <DialogTitle className="sr-only">{video.script.title}</DialogTitle>
        <div className="relative w-full h-full group/player" onClick={togglePlay}>

          {hasVideo ? (
            /* ── Rendered MP4 player ── */
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={video.video_url}
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* ── Preview fallback: audio + cycling images + captions ── */
            <>
              {currentImage && (
                <Image
                  src={currentImage}
                  alt="Video frame"
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority
                />
              )}

              <div className="absolute inset-x-0 bottom-32 flex flex-col items-center justify-center px-8 text-center pointer-events-none z-20">
                <div className="flex flex-wrap justify-center gap-x-1.5">
                  {currentWords.map((w: any, i: number) => (
                    <span
                      key={i}
                      className="text-3xl font-black text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase tracking-tight italic scale-110 animate-in fade-in zoom-in duration-100"
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>

              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={video.audio_url}
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </>
          )}

          {/* Controls overlay — same for both modes */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 opacity-100 sm:opacity-0 sm:group-hover/player:opacity-100 transition-opacity duration-300">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-lg drop-shadow-md leading-tight">{video.script.title}</h3>
                {!hasVideo && <span className="text-white/60 text-xs mt-1">Preview Mode</span>}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onClose() }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-100 ease-linear"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted) }}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-2xl transform active:scale-90 transition-transform">
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </div>

                <div className="w-10" />
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
