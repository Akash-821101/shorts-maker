/**
 * Shared form type accepted by all wizard step components.
 * Both useCreateSeries and useEditSeries conform to this shape.
 */
export type SeriesForm = {
  isEditMode: boolean
  currentStep: number
  handleNext: () => void
  handleBack: () => void
  // Step 1
  selectedNiche: string | null
  setSelectedNiche: (v: string | null) => void
  customNiche: string
  handleCustomNicheChange: (v: string) => void
  // Step 2
  selectedLanguage: string | null
  handleLanguageChange: (code: string) => void
  selectedVoice: string | null
  setSelectedVoice: (v: string | null) => void
  availableVoices: import('@/lib/data/voices').Voice[]
  // Step 3
  selectedMusic: string[]
  musicGenreFilter: string
  setMusicGenreFilter: (v: string) => void
  filteredMusic: import('@/lib/data/music').MusicTrack[]
  toggleMusicSelection: (id: string) => void
  // Step 4
  selectedStyle: string | null
  setSelectedStyle: (v: string | null) => void
  // Step 5
  selectedCaption: string | null
  setSelectedCaption: (v: string | null) => void
  // Step 6
  seriesName: string
  setSeriesName: (v: string) => void
  videoDuration: string
  setVideoDuration: (v: string) => void
  selectedPlatforms: string[]
  togglePlatform: (id: string) => void
  publishTime: string
  setPublishTime: (v: string) => void
  isPending: boolean
  handleSchedule: () => void
}
