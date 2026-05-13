'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Series } from '@/lib/types/series'
import { SeriesCard } from '@/components/dashboard/series-card'
import { DeleteConfirmDialog } from '@/components/shared/delete-confirm-dialog'

interface SeriesGridProps {
  initialItems: Series[]
}

export function SeriesGrid({ initialItems }: SeriesGridProps) {
  const router = useRouter()
  const [items, setItems] = useState<Series[]>(initialItems)
  const [deletingSeries, setDeletingSeries] = useState<Series | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!deletingSeries) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/series/${deletingSeries.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete series')
      }

      // Optimistic update
      setItems(prev => prev.filter(item => item.id !== deletingSeries.id))
      toast.success('Series deleted successfully.')
      setDeletingSeries(null)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete series')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(s => (
          <SeriesCard 
            key={s.id} 
            series={s} 
            onDelete={(series) => setDeletingSeries(series)}
          />
        ))}
      </div>

      <DeleteConfirmDialog
        isOpen={!!deletingSeries}
        onOpenChange={(open) => !open && setDeletingSeries(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete series?"
        description={
          deletingSeries ? (
            <>
              <strong>{deletingSeries.series_name}</strong> and all its scheduled jobs will be permanently removed. This cannot be undone.
            </>
          ) : null
        }
      />
    </>
  )
}
