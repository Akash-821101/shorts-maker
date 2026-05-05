import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { CreateSeriesForm } from './create-form'
import { EditSeriesForm } from './edit-form'
import type { Series } from '@/lib/types/series'

interface Props {
  searchParams: Promise<{ id?: string }>
}

async function getSeries(id: string, userId: string): Promise<Series | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('series')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  return data as Series | null
}

export default async function CreateSeriesPage({ searchParams }: Props) {
  const { id } = await searchParams

  if (!id) return <CreateSeriesForm />

  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const series = await getSeries(id, userId)
  if (!series) notFound()

  return <EditSeriesForm series={series} />
}
