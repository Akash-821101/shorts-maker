'use client'

import { Stepper } from '@/components/create-series/stepper'
import { StepNiche } from '@/components/create-series/steps/step-niche'
import { StepLanguage } from '@/components/create-series/steps/step-language'
import { StepMusic } from '@/components/create-series/steps/step-music'
import { StepStyle } from '@/components/create-series/steps/step-style'
import { StepCaptions } from '@/components/create-series/steps/step-captions'
import { StepReview } from '@/components/create-series/steps/step-review'
import { STEPS } from '@/lib/data/steps'
import type { SeriesForm } from '@/lib/types/series-form'

interface Props {
  form: SeriesForm
  title: string
  subtitle: string
}

export function SeriesWizard({ form, title, subtitle }: Props) {
  return (
    <div className="max-w-4xl mx-auto w-full pb-12 pt-4">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      </div>

      <Stepper steps={STEPS} currentStep={form.currentStep} />

      {form.currentStep === 1 && <StepNiche form={form} />}
      {form.currentStep === 2 && <StepLanguage form={form} />}
      {form.currentStep === 3 && <StepMusic form={form} />}
      {form.currentStep === 4 && <StepStyle form={form} />}
      {form.currentStep === 5 && <StepCaptions form={form} />}
      {form.currentStep === 6 && <StepReview form={form} />}
    </div>
  )
}
