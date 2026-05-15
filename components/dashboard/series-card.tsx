'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  MoreVertical,
  Pencil,
  Pause,
  Play,
  Trash2,
  Video,
  Zap,
  Loader2,
} from 'lucide-react'
import { VISUAL_STYLES } from '@/lib/data/styles'
import { formatDate, formatNiche } from '@/lib/utils'
import type { Series, SeriesStatus } from '@/lib/types/series'
import { useSeriesActions } from '@/hooks/use-series-actions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { StatusBadge } from '@/components/shared/status-badge'
import { SERIES_STATUS_CONFIG } from '@/lib/data/statuses'
import { UpgradeDialog } from '@/components/shared/upgrade-dialog'

interface Props {
  series: Series
  onDelete?: (series: Series) => void
}

export function SeriesCard({ series, onDelete }: Props) {
  const { loading, currentStatus, isUpgradeOpen, setIsUpgradeOpen, togglePause, generateVideo, testScheduleWorkflow } = useSeriesActions(series.id, series.status)

  const style = VISUAL_STYLES.find(s => s.id === series.style_id) ?? VISUAL_STYLES[0]
  const isPaused = currentStatus === 'paused' || currentStatus === 'draft'


  return (
    <>
      <UpgradeDialog isOpen={isUpgradeOpen} onOpenChange={setIsUpgradeOpen} />
      <div className="group flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative w-full aspect-[9/16] overflow-hidden bg-muted">
          <Image
            src={style.imagePath}
            alt={style.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          <div className="absolute top-3 left-3">
            <StatusBadge type="series" status={currentStatus} errorMessage={series.last_error} />
          </div>

          {/* Hover action overlay — slides up from bottom */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-gradient-to-t from-black/95 via-black/75 to-transparent px-3 pt-14 pb-3 flex flex-col gap-2">
              <button
                onClick={generateVideo}
                disabled={loading === 'generate'}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold py-2.5 hover:bg-primary/90 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {loading === 'generate'
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Zap className="w-3.5 h-3.5" />}
                Generate Video
              </button>
              {/* <button
                onClick={testScheduleWorkflow}
                disabled={loading === 'test'}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold py-2.5 hover:bg-white/20 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {loading === 'test'
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Play className="w-3.5 h-3.5" />}
                Test Workflow
              </button> */}
              <Link
                href={`/dashboard/series/${series.id}/videos`}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold py-2.5 hover:bg-white/20 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                View Videos
              </Link>
            </div>
          </div>
        </div>

        {/* Info row */}
        <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-4">
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-snug truncate">{series.series_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {formatNiche(series.niche, series.custom_niche)} · {series.video_duration}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatDate(series.created_at)}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mr-1 mt-0.5 rounded-lg cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link href={`/dashboard/create?id=${series.id}`}>
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={togglePause}
                disabled={loading === 'pause'}
                className="rounded-lg cursor-pointer"
              >
                {loading === 'pause' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isPaused ? (
                  <Play className="w-4 h-4 mr-2" />
                ) : (
                  <Pause className="w-4 h-4 mr-2" />
                )}
                {isPaused ? 'Resume' : 'Pause'}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => onDelete?.(series)}
                className="rounded-lg text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </>
  )
}
