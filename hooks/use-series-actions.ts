'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { SeriesStatus } from '@/lib/types/series'

type LoadingState = 'pause' | 'delete' | 'generate' | null

export function useSeriesActions(id: string, status: SeriesStatus) {
  const router = useRouter()
  const [loading, setLoading] = useState<LoadingState>(null)
  const [currentStatus, setCurrentStatus] = useState<SeriesStatus>(status)

  async function togglePause() {
    const nextStatus: SeriesStatus = currentStatus === 'draft' ? 'scheduled' : 'draft'
    setCurrentStatus(nextStatus)
    setLoading('pause')
    try {
      const res = await fetch(`/api/series/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success(nextStatus === 'draft' ? 'Series paused.' : 'Series resumed.')
      router.refresh()
    } catch (e) {
      setCurrentStatus(currentStatus)
      toast.error(e instanceof Error ? e.message : 'Failed.')
    } finally {
      setLoading(null)
    }
  }

  async function deleteSeries() {
    setLoading('delete')
    try {
      const res = await fetch(`/api/series/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Series deleted.')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed.')
    } finally {
      setLoading(null)
    }
  }

  async function generateVideo() {
    console.log(id, "id")
    setLoading('generate')
    try {
      const res = await fetch(`/api/series/${id}/generate`, { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Video generation triggered!')
      router.push('/dashboard/videos')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to trigger generation.')
    } finally {
      setLoading(null)
    }
  }

  return { loading, togglePause, deleteSeries, generateVideo }
}
