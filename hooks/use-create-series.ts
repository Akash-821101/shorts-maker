'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { VOICES } from '@/lib/data/voices'
import { MUSIC_TRACKS } from '@/lib/data/music'
import type { SeriesPayload } from '@/lib/types/series'

export function useCreateSeries() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [currentStep, setCurrentStep] = useState(1)

  // Step 1
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [customNiche, setCustomNiche] = useState('')

  // Step 2
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>('en-US')
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)

  // Step 3
  const [selectedMusic, setSelectedMusic] = useState<string[]>([])
  const [musicGenreFilter, setMusicGenreFilter] = useState('All')

  // Step 4
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  // Step 5
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null)

  // Step 6
  const [seriesName, setSeriesName] = useState('')
  const [videoDuration, setVideoDuration] = useState('60s')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [publishTime, setPublishTime] = useState('')

  // Derived
  const availableVoices = VOICES.filter(v => v.languageCode === selectedLanguage)
  const filteredMusic = MUSIC_TRACKS.filter(
    m => musicGenreFilter === 'All' || m.genre === musicGenreFilter,
  )

  // Navigation
  const handleNext = () => setCurrentStep(s => Math.min(s + 1, 6))
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1))

  // Step 1 handlers
  const handleCustomNicheChange = (value: string) => {
    setCustomNiche(value)
    if (value) setSelectedNiche('custom')
    else if (selectedNiche === 'custom') setSelectedNiche(null)
  }

  // Step 2 handlers
  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code)
    setSelectedVoice(null) // reset voice when language changes
  }

  // Step 3 handlers
  const toggleMusicSelection = (id: string) => {
    setSelectedMusic(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id],
    )
  }

  // Step 6 handlers
  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
    )
  }

  const handleSchedule = () => {
    startTransition(async () => {
      try {
        const payload: SeriesPayload = {
          seriesName,
          niche: selectedNiche || '',
          customNiche: customNiche || undefined,
          language: selectedLanguage || '',
          voiceId: selectedVoice || '',
          musicIds: selectedMusic,
          styleId: selectedStyle || '',
          captionId: selectedCaption || '',
          videoDuration,
          targetPlatforms: selectedPlatforms,
          publishTime,
        }

        const res = await fetch('/api/series', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Something went wrong.')
        toast.success('Series scheduled successfully!')
        router.push('/dashboard')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return {
    // mode flag
    isEditMode: false as const,
    currentStep,
    handleNext,
    handleBack,
    // Step 1
    selectedNiche,
    setSelectedNiche,
    customNiche,
    handleCustomNicheChange,
    // Step 2
    selectedLanguage,
    handleLanguageChange,
    selectedVoice,
    setSelectedVoice,
    availableVoices,
    // Step 3
    selectedMusic,
    musicGenreFilter,
    setMusicGenreFilter,
    filteredMusic,
    toggleMusicSelection,
    // Step 4
    selectedStyle,
    setSelectedStyle,
    // Step 5
    selectedCaption,
    setSelectedCaption,
    // Step 6
    seriesName,
    setSeriesName,
    videoDuration,
    setVideoDuration,
    selectedPlatforms,
    togglePlatform,
    publishTime,
    setPublishTime,
    isPending,
    handleSchedule,
  }
}

export type CreateSeriesForm = ReturnType<typeof useCreateSeries>
