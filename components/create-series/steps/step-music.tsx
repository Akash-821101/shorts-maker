'use client'

import { Music } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MUSIC_GENRES } from '@/lib/data/music'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MusicCard } from '@/components/create-series/music-card'
import { StepNavigation } from '@/components/create-series/step-navigation'
import type { SeriesForm } from '@/lib/types/series-form'

interface Props {
  form: SeriesForm
}

export function StepMusic({ form }: Props) {
  const {
    selectedMusic, musicGenreFilter, setMusicGenreFilter,
    filteredMusic, toggleMusicSelection, handleNext, handleBack,
  } = form

  return (
    <div>
      <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 pt-8 px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Background Score</CardTitle>
              <CardDescription className="text-base mt-1">Select one or more background tracks. They will cycle through your shorts.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">1. Filter by Mood / Genre</h3>
            <div className="flex flex-wrap gap-2">
              {MUSIC_GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => setMusicGenreFilter(genre)}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer',
                    musicGenreFilter === genre
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-background border-border hover:border-primary/40 hover:bg-accent/30 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                2. Select Tracks <span className="text-sm font-normal text-muted-foreground">(Multiple allowed)</span>
              </h3>
              <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-bold">
                {selectedMusic.length} selected
              </span>
            </div>
            <ScrollArea className="h-[360px] pr-5 rounded-2xl border border-border/30 bg-accent/5 p-4 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                {filteredMusic.map(track => (
                  <MusicCard
                    key={track.id}
                    track={track}
                    isSelected={selectedMusic.includes(track.id)}
                    onToggle={toggleMusicSelection}
                  />
                ))}
                {filteredMusic.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
                    <Music className="w-12 h-12 mb-3 opacity-20" />
                    <p>No tracks available for this genre.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel="Continue to Style"
        nextDisabled={selectedMusic.length === 0}
      />
    </div>
  )
}
