'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { SeriesStatus } from '@/lib/types/series'
import { getUserCredits } from '@/app/actions/credits'

type LoadingState = 'pause' | 'generate' | 'test' | null

export function useSeriesActions(id: string, status: SeriesStatus) {
  const router = useRouter()
  const [loading, setLoading] = useState<LoadingState>(null)
  const [currentStatus, setCurrentStatus] = useState<SeriesStatus>(status)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)

  async function togglePause() {
    const isPaused = currentStatus === 'draft' || currentStatus === 'paused'
    const nextStatus: SeriesStatus = isPaused ? 'scheduled' : 'paused'
    
    const prevStatus = currentStatus
    setCurrentStatus(nextStatus)
    setLoading('pause')

    try {
      const res = await fetch(`/api/series/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success(nextStatus === 'paused' ? 'Series paused.' : 'Series resumed.')
    } catch (e) {
      setCurrentStatus(prevStatus)
      toast.error(e instanceof Error ? e.message : 'Failed.')
    } finally {
      setLoading(null)
    }
  }


  async function generateVideo() {
    setLoading('generate')
    try {
      const credits = await getUserCredits()
      if (credits <= 0) {
        setIsUpgradeOpen(true)
        return
      }

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

  async function testScheduleWorkflow() {
    setLoading('test')
    try {
      const res = await fetch(`/api/series/${id}/test-schedule`, { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Test workflow triggered! Video will generate and email will be sent shortly.')
      router.push('/dashboard/videos')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to trigger test workflow.')
    } finally {
      setLoading(null)
    }
  }

  return { loading, currentStatus, isUpgradeOpen, setIsUpgradeOpen, togglePause, generateVideo, testScheduleWorkflow }
}
