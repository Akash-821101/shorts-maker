'use client'

import { Languages, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LanguageSelector } from '@/components/create-series/language-selector'
import { VoiceCard } from '@/components/create-series/voice-card'
import { StepNavigation } from '@/components/create-series/step-navigation'
import { LANGUAGES } from '@/lib/data/voices'
import type { SeriesForm } from '@/lib/types/series-form'

interface Props {
  form: SeriesForm
}

export function StepLanguage({ form }: Props) {
  const {
    selectedLanguage, handleLanguageChange,
    selectedVoice, setSelectedVoice,
    availableVoices, handleNext, handleBack,
  } = form

  return (
    <div>
      <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 pt-8 px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Languages className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Language & Voice</CardTitle>
              <CardDescription className="text-base mt-1">Select the spoken language and voice for your shorts.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">1. Select Language</h3>
            <LanguageSelector
              languages={LANGUAGES}
              selectedCode={selectedLanguage}
              onSelect={handleLanguageChange}
            />
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">2. Select Voice</h3>
              <span className="text-sm text-muted-foreground bg-accent/50 px-3 py-1 rounded-full font-medium">
                {availableVoices.length} voices available
              </span>
            </div>
            <ScrollArea className="h-[360px] pr-5 rounded-2xl border border-border/30 bg-accent/5 p-4 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                {availableVoices.map(voice => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    isSelected={selectedVoice === voice.id}
                    onSelect={setSelectedVoice}
                  />
                ))}
                {availableVoices.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
                    <Zap className="w-12 h-12 mb-3 opacity-20" />
                    <p>No voices available for this language yet.</p>
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
        nextDisabled={!selectedVoice}
      />
    </div>
  )
}
