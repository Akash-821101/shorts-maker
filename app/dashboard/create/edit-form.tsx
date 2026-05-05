'use client'

import { useEditSeries } from '@/hooks/use-edit-series'
import { SeriesWizard } from '@/components/create-series/series-wizard'
import type { Series } from '@/lib/types/series'
import type { SeriesForm } from '@/lib/types/series-form'

export function EditSeriesForm({ series }: { series: Series }) {
  const form = useEditSeries(series)
  return (
    <SeriesWizard
      form={form as unknown as SeriesForm}
      title="Edit Series"
      subtitle={`Update the configuration for ${series.series_name}.`}
    />
  )
}
