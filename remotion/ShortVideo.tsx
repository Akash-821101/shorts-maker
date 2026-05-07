import { AbsoluteFill, Audio } from 'remotion'
import { SceneSequence } from './components/SceneSequence'
import { CaptionTrack } from './components/CaptionTrack'
import type { VideoCompositionProps } from './types'

export function ShortVideo({
  audioUrl,
  scenes,
  words,
  captionStyle,
}: VideoCompositionProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Master audio — drives the entire timeline */}
      <Audio src={audioUrl} />

      {/* Scene images with Ken Burns motion and cross-fade transitions */}
      <SceneSequence scenes={scenes} />

      {/* Word-synced captions with per-style animation */}
      {words.length > 0 && (
        <CaptionTrack words={words} captionStyle={captionStyle} />
      )}
    </AbsoluteFill>
  )
}
