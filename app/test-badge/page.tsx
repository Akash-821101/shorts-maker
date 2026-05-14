'use client'

import { StatusBadge } from '@/components/shared/status-badge'

export default function TestBadgePage() {
  return (
    <div className="p-20 flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Status Badge Verification</h1>
      
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Series Error Badge</h2>
        <div className="p-4 border rounded-xl w-fit">
          <StatusBadge 
            type="series" 
            status="failed" 
            errorMessage="Youtube disconnected. Please reconnect your account in settings." 
          />
        </div>
        <p className="text-sm text-muted-foreground">Hover over the badge above to see the tooltip.</p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Video Error Badge</h2>
        <div className="p-4 border rounded-xl w-fit">
          <StatusBadge 
            type="video" 
            status="failed" 
            errorMessage="TikTok disconnected. Failed to publish video." 
          />
        </div>
      </div>
    </div>
  )
}
