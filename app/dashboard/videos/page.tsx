import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/server'
import { VideosList } from '@/components/dashboard/videos-list'
import { Sparkles } from 'lucide-react'

export default async function VideosPage() {
  const { userId } = await auth()
  const supabase = createAdminClient()

  // 1. Get all series IDs for this user
  const { data: userSeries } = await supabase
    .from('series')
    .select('id')
    .eq('user_id', userId!)

  const seriesIds = userSeries?.map(s => s.id) || []
  
  // 2. Fetch all videos for these series (including processing ones)
  const { data: videos } = seriesIds.length > 0 
    ? await supabase
        .from('videos')
        .select('*, series(series_name)')
        .in('series_id', seriesIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            My Videos
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your generated shorts. Updates automatically.
          </p>
        </div>
      </div>

      <VideosList 
        initialVideos={videos ?? []} 
        userId={userId!} 
      />
    </div>
  )
}
