'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { VOICES } from '@/lib/data/voices'
import { MUSIC_TRACKS } from '@/lib/data/music'
import type { Series, SeriesPayload } from '@/lib/types/series'

export function useEditSeries(initial: Series) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 — pre-filled
  const [selectedNiche, setSelectedNiche] = useState<string | null>(initial.niche)
  const [customNiche, setCustomNiche] = useState(initial.custom_niche ?? '')

  // Step 2 — pre-filled
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(initial.language)
  const [selectedVoice, setSelectedVoice] = useState<string | null>(initial.voice_id)

  // Step 3 — pre-filled
  const [selectedMusic, setSelectedMusic] = useState<string[]>(initial.music_ids ?? [])
  const [musicGenreFilter, setMusicGenreFilter] = useState('All')

  // Step 4 — pre-filled
  const [selectedStyle, setSelectedStyle] = useState<string | null>(initial.style_id)

  // Step 5 — pre-filled
  const [selectedCaption, setSelectedCaption] = useState<string | null>(initial.caption_id)

  // Step 6 — pre-filled
  const [seriesName, setSeriesName] = useState(initial.series_name)
  const [videoDuration, setVideoDuration] = useState(initial.video_duration)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initial.target_platforms ?? [])
  // Convert stored ISO publish_time back to datetime-local format
  const [publishTime, setPublishTime] = useState(() => {
    try {
      const d = new Date(initial.publish_time)
      // Format: YYYY-MM-DDTHH:MM (what datetime-local expects)
      return d.toISOString().slice(0, 16)
    } catch {
      return ''
    }
  })

  // Derived
  const availableVoices = VOICES.filter(v => v.languageCode === selectedLanguage)
  const filteredMusic = MUSIC_TRACKS.filter(
    m => musicGenreFilter === 'All' || m.genre === musicGenreFilter,
  )

  // Navigation
  const handleNext = () => setCurrentStep(s => Math.min(s + 1, 5))
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
    setSelectedVoice(null)
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

  // Submit — sends PUT to update existing series
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

        const res = await fetch(`/api/series/${initial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Something went wrong.')
        toast.success('Series updated successfully!')
        router.push('/dashboard')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return {
    // mode flag — lets StepReview know it's editing
    isEditMode: true as const,
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

export type EditSeriesForm = ReturnType<typeof useEditSeries>
