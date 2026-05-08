export type AnimationType = 'pop' | 'fade' | 'slide-up' | 'typewriter' | 'bounce'

export interface CaptionStyle {
  id: string
  name: string
  fontFamily: string
  textColor: string
  highlightColor: string
  backgroundColor?: string
  strokeColor?: string
  strokeWidth?: number
  dropShadow?: string
  textTransform?: 'uppercase' | 'lowercase' | 'none'
  animationType: AnimationType
  fontWeight?: string
}

export interface SceneInput {
  sceneId: number
  imageUrl: string
}

export interface WordInput {
  word: string
  start: number
  end: number
  punctuated_word?: string
}

export interface CaptionGroup {
  words: WordInput[]
  startTime: number
  endTime: number
  startFrame: number
  endFrame: number
}

export interface VideoCompositionProps {
  audioUrl: string
  scenes: SceneInput[]
  words: WordInput[]
  captionStyle: CaptionStyle
  durationInSeconds: number
}
