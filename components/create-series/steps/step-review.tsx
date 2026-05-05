'use client'

import { Rocket, PlaySquare, Smartphone, Camera, Mail, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StepNavigation } from '@/components/create-series/step-navigation'
import type { SeriesForm } from '@/lib/types/series-form'

const PLATFORMS = [
  { id: 'youtube',   name: 'YouTube Shorts',   icon: PlaySquare },
  { id: 'tiktok',    name: 'TikTok',            icon: Smartphone },
  { id: 'instagram', name: 'Instagram Reels',   icon: Camera },
  { id: 'email',     name: 'Email',             icon: Mail },
]

const DURATIONS = ['30s', '60s', '90s']

interface Props {
  form: SeriesForm
}

export function StepReview({ form }: Props) {
  const {
    isEditMode,
    seriesName, setSeriesName,
    videoDuration, setVideoDuration,
    selectedPlatforms, togglePlatform,
    publishTime, setPublishTime,
    isPending, handleSchedule, handleBack,
  } = form

  const canSubmit = !!seriesName && selectedPlatforms.length > 0 && !!publishTime

  return (
    <div>
      <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 pt-8 px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{isEditMode ? 'Edit Series' : 'Review & Schedule'}</CardTitle>
              <CardDescription className="text-base mt-1">
                {isEditMode
                  ? 'Update your series configuration.'
                  : 'Configure your series details and schedule the first video.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-8">
          <div className="space-y-3">
            <Label htmlFor="seriesName" className="text-sm font-semibold text-foreground">Series Name</Label>
            <Input
              id="seriesName"
              placeholder="e.g. Daily Tech Facts"
              value={seriesName}
              onChange={e => setSeriesName(e.target.value)}
              className="h-14 text-lg rounded-xl bg-card border-border/50 focus-visible:ring-primary/20"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Video Duration</Label>
            <div className="flex gap-3">
              {DURATIONS.map(duration => (
                <button
                  key={duration}
                  onClick={() => setVideoDuration(duration)}
                  className={cn(
                    'flex-1 h-12 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer',
                    videoDuration === duration
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/40 hover:border-primary/40 bg-card text-muted-foreground',
                  )}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Target Platforms</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PLATFORMS.map(platform => {
                const isSelected = selectedPlatforms.includes(platform.id)
                const Icon = platform.icon
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left',
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                        : 'border-border/40 hover:border-primary/40 bg-card hover:bg-accent/10',
                    )}
                  >
                    <div className={cn('p-2 rounded-lg transition-colors', isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn('font-medium transition-colors', isSelected ? 'text-foreground' : 'text-muted-foreground')}>
                      {platform.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Time to Publish First Video</Label>
            <div className="relative">
              <Input
                type="datetime-local"
                value={publishTime}
                onChange={e => setPublishTime(e.target.value)}
                className="h-14 w-full pl-12 rounded-xl bg-card border-border/50 text-foreground cursor-pointer focus-visible:ring-primary/20 appearance-none"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              Note: Video will be generated 3-6 hours before video publish.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-10">
        <StepNavigation onBack={handleBack} />
        <button
          onClick={handleSchedule}
          disabled={!canSubmit || isPending}
          className="inline-flex items-center rounded-xl px-12 h-14 text-lg font-bold shadow-xl shadow-primary/25 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {isPending ? (
            <>
              <span className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEditMode ? 'Saving...' : 'Scheduling...'}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {isEditMode ? 'Save Changes' : 'Schedule Series'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
