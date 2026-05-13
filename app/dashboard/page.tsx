import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Tv2 } from 'lucide-react'
import { CreateSeriesButton } from '@/components/shared/create-series-button'
import { SeriesGrid } from '@/components/dashboard/series-grid'
import type { Series } from '@/lib/types/series'

export default async function DashboardPage() {
  const { userId } = await auth()
  const supabase = createAdminClient()

  const { data: series } = await supabase
    .from('series')
    .select('*')
    .eq('user_id', userId!)
    .order('created_at', { ascending: false })

  const items = (series ?? []) as Series[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Series</h1>
          <p className="text-muted-foreground mt-1">
            {items.length === 0
              ? 'No series yet — create your first one.'
              : `${items.length} series`}
          </p>
        </div>
        <CreateSeriesButton label="New Series" />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 py-24 text-center">
          <Tv2 className="w-12 h-12 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-semibold mb-1">No series yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first automated short-video series to get started.
          </p>
          <CreateSeriesButton label="Create Series" />
        </div>
      ) : (
        <SeriesGrid initialItems={items} />
      )}
    </div>
  )
}
