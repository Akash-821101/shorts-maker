import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { generateVideo, seriesScheduler, seriesWorkflow } from '@/lib/inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateVideo],
})
