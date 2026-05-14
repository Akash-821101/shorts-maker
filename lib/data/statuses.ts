import { 
  Clock, 
  Play, 
  Pause, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Film, 
  Share2,
  Loader2,
  CheckCircle
} from 'lucide-react'

export const SERIES_STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'slate',
    icon: Clock,
    className: 'bg-slate-500/10 text-slate-500 border-slate-500/20'
  },
  scheduled: {
    label: 'Scheduled',
    color: 'indigo',
    icon: Clock,
    className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]'
  },
  active: {
    label: 'Active',
    color: 'violet',
    icon: Play,
    className: 'bg-violet-500/10 text-violet-500 border-violet-500/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]'
  },
  paused: {
    label: 'Paused',
    color: 'amber',
    icon: Pause,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  },
  failed: {
    label: 'Error',
    color: 'red',
    icon: AlertCircle,
    className: 'bg-red-500/10 text-red-500 border-red-500/20'
  },
} as const

export const VIDEO_STATUS_CONFIG = {
  queued: {
    label: 'Queued',
    color: 'slate',
    icon: Clock,
    className: 'bg-slate-500/10 text-slate-500 border-slate-500/20'
  },
  generating: {
    label: 'Generating',
    color: 'amber',
    icon: Zap,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse',
    showLoader: true
  },
  processing: {
    label: 'Processing',
    color: 'amber',
    icon: Loader2,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    showLoader: true
  },
  rendering: {
    label: 'Rendering',
    color: 'blue',
    icon: Film,
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    showLoader: true
  },
  ready: {
    label: 'Ready',
    color: 'emerald',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]'
  },
  publishing: {
    label: 'Publishing',
    color: 'violet',
    icon: Share2,
    className: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    showLoader: true
  },
  published: {
    label: 'Published',
    color: 'violet',
    icon: CheckCircle,
    className: 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 border-violet-500/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]'
  },
  failed: {
    label: 'Failed',
    color: 'red',
    icon: AlertCircle,
    className: 'bg-red-500/10 text-red-500 border-red-500/20'
  },
} as const
