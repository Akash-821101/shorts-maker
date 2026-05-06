'use client'

import { useCreateSeries } from '@/hooks/use-create-series'
import { SeriesWizard } from '@/components/create-series/series-wizard'
import type { SeriesForm } from '@/lib/types/series-form'

export function CreateSeriesForm() {
  const form = useCreateSeries()
  return (
    <SeriesWizard
      form={form as unknown as SeriesForm}
      title="Create New Series"
      subtitle="Follow the steps to configure your automated video series."
    />
  )
}
