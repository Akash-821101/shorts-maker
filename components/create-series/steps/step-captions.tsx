'use client'

import { Type } from 'lucide-react'
import { CAPTION_STYLES } from '@/lib/data/captions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CaptionCard } from '@/components/create-series/caption-card'
import { StepNavigation } from '@/components/create-series/step-navigation'
import type { SeriesForm } from '@/lib/types/series-form'

interface Props {
  form: SeriesForm
}

export function StepCaptions({ form }: Props) {
  const { selectedCaption, setSelectedCaption, handleNext, handleBack } = form

  return (
    <div>
      <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 pt-8 px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Type className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Animated Captions</CardTitle>
              <CardDescription className="text-base mt-1">Select the subtitle animation style for your video.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPTION_STYLES.map(style => (
              <CaptionCard
                key={style.id}
                styleConfig={style}
                isSelected={selectedCaption === style.id}
                onSelect={setSelectedCaption}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel="Review & Finish"
        nextDisabled={!selectedCaption}
      />
    </div>
  )
}
