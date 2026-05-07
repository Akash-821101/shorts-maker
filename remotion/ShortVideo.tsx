import { AbsoluteFill, Audio, Sequence, useVideoConfig } from 'remotion'
import { Scene } from './components/Scene'
import { CaptionTrack } from './components/CaptionTrack'
import type { VideoCompositionProps } from './types'

export const ShortVideo: React.FC<VideoCompositionProps> = ({
  audioUrl,
  imageUrls,
  captions,
  fps,
}) => {
  const { durationInFrames } = useVideoConfig()
  
  // Calculate duration per scene
  // We divide total duration by number of images
  const framesPerScene = Math.floor(durationInFrames / imageUrls.length)

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background Music / Voiceover */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* Scenes Sequence */}
      {imageUrls.map((img, index) => (
        <Sequence
          key={img.sceneId}
          from={index * framesPerScene}
          durationInFrames={framesPerScene}
        >
          <Scene 
            imageUrl={img.url} 
            durationInFrames={framesPerScene} 
            sceneId={img.sceneId} 
          />
        </Sequence>
      ))}

      {/* Overlays: Captions */}
      <CaptionTrack words={captions.words} fps={fps} />
    </AbsoluteFill>
  )
}
