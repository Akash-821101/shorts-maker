'use client'

import { SERIES_STATUS_CONFIG, VIDEO_STATUS_CONFIG } from '@/lib/data/statuses'
import { SeriesStatus } from '@/lib/types/series'
import { VideoStatus } from '@/lib/types/video'
import { Loader2, Info, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

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
    <Badge
      variant="outline"
      className={cn(
        "rounded-full gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-sm transition-all duration-300",
        config.className,
        className,
        errorMessage && "cursor-help ring-1 ring-destructive/20 hover:ring-destructive/40"
      )}
    >
      {config.showLoader ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Icon className="w-3 h-3" />
      )}
      <span className="uppercase tracking-tighter">{config.label}</span>
      {errorMessage && <Info className="w-2.5 h-2.5 ml-0.5 opacity-70" />}
    </Badge>
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
          className="max-w-[220px] text-[11px] text-white border-none font-medium py-2 px-3 shadow-2xl rounded-xl backdrop-blur-lg"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
