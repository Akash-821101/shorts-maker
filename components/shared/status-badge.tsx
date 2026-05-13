'use client'

import { SERIES_STATUS_CONFIG, VIDEO_STATUS_CONFIG } from '@/lib/data/statuses'
import { SeriesStatus } from '@/lib/types/series'
import { VideoStatus } from '@/lib/types/video'
import { Loader2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  type: 'series' | 'video'
  status: string
  className?: string
  errorMessage?: string | null
}

export function StatusBadge({ type, status, className, errorMessage }: Props) {
  const config = (type === 'series' 
    ? SERIES_STATUS_CONFIG[status as SeriesStatus] 
    : VIDEO_STATUS_CONFIG[status as VideoStatus]) as any

  if (!config) return null

  const Icon = config.icon

  const badgeContent = (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border backdrop-blur-md shadow-sm transition-all duration-300",
      config.className,
      className,
      errorMessage && "cursor-help"
    )}>
      {config.showLoader ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Icon className="w-3 h-3" />
      )}
      <span className="uppercase tracking-tighter">{config.label}</span>
      {errorMessage && <Info className="w-2.5 h-2.5 ml-0.5 opacity-70" />}
    </span>
  )

  if (!errorMessage) return badgeContent

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-[200px] text-[10px] bg-destructive text-destructive-foreground border-destructive/20 font-medium py-1.5 px-2.5 shadow-xl"
        >
          <p className="leading-relaxed">{errorMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
