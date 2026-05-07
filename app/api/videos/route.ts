import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api/middleware'
import { apiError } from '@/lib/api/respond'

export async function GET(_req: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = createAdminClient()

  const { data: userSeries } = await supabase
    .from('series')
    .select('id')
    .eq('user_id', auth.userId)

  const seriesIds = userSeries?.map(s => s.id) ?? []

  if (seriesIds.length === 0) return NextResponse.json([])

  const { data: videos, error } = await supabase
    .from('videos')
    .select('*, series(series_name)')
    .in('series_id', seriesIds)
    .order('created_at', { ascending: false })

  if (error) return apiError(error.message, 500)

  return NextResponse.json(videos ?? [])
}
