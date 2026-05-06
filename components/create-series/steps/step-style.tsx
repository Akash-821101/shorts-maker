'use client'

import { useRef } from 'react'
import { Palette, ChevronLeft, ChevronRight } from 'lucide-react'
import { VISUAL_STYLES } from '@/lib/data/styles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StyleCard } from '@/components/create-series/style-card'
import { StepNavigation } from '@/components/create-series/step-navigation'
import type { SeriesForm } from '@/lib/types/series-form'

interface Props {
  form: SeriesForm
}

export function StepStyle({ form }: Props) {
  const { selectedStyle, setSelectedStyle, handleNext, handleBack } = form
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })

  return (
    <div>
      <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 pt-8 px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Visual Style</CardTitle>
              <CardDescription className="text-base mt-1">Select the visual aesthetic for your generated video.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="icon" onClick={scrollLeft} className="rounded-full shadow-lg border border-border bg-background/80 backdrop-blur-sm hover:bg-accent cursor-pointer h-10 w-10">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="icon" onClick={scrollRight} className="rounded-full shadow-lg border border-border bg-background/80 backdrop-blur-sm hover:bg-accent cursor-pointer h-10 w-10">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex w-full space-x-4 p-4 overflow-x-auto snap-x snap-mandatory rounded-2xl border border-border/30 bg-accent/5 shadow-inner scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {VISUAL_STYLES.map(style => (
              <div key={style.id} className="snap-center shrink-0 first:pl-2 last:pr-2">
                <StyleCard
                  style={style}
                  isSelected={selectedStyle === style.id}
                  onSelect={setSelectedStyle}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel="Continue to Captions"
        nextDisabled={!selectedStyle}
      />
    </div>
  )
}
