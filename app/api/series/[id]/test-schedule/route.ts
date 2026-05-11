import { inngest } from '@/lib/inngest/client'
import { requireAuth } from '@/lib/api/middleware'
import { apiError, apiOk } from '@/lib/api/respond'
import { createAdminClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = createAdminClient()
  const { data: series, error } = await supabase
    .from('series')
    .select('id, user_id')
    .eq('id', id)
    .eq('user_id', auth.userId)
    .single()

  if (error || !series) {
    return apiError('Series not found', 404)
  }

  // Trigger the Inngest workflow in test mode
  await inngest.send({
    name: 'series/schedule.workflow',
    data: {
      seriesId: id,
      isTest: true,
    },
  })

  return apiOk({ message: 'Test workflow triggered!' })
}
