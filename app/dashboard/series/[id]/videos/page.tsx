import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/server'
import { VideosList } from '@/components/dashboard/videos-list'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SeriesVideosPage({ params }: Props) {
  const { id: seriesId } = await params
  const { userId } = await auth()
  const supabase = createAdminClient()

  // 1. Fetch series details to ensure ownership and get the name
  const { data: series, error: seriesError } = await supabase
    .from('series')
    .select('series_name')
    .eq('id', seriesId)
    .eq('user_id', userId!)
    .single()

  if (seriesError || !series) {
    return notFound()
  }

  // 2. Fetch all videos for this specific series
  const { data: videos } = await supabase
    .from('videos')
    .select('*, series(series_name)')
    .eq('series_id', seriesId)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 mb-8">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              {series.series_name} Videos
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h1>
            <p className="text-muted-foreground mt-1">
              Viewing all generated shorts for this series.
            </p>
          </div>
        </div>
      </div>

      <VideosList 
        initialVideos={videos ?? []} 
        userId={userId!} 
      />
    </div>
  )
}
