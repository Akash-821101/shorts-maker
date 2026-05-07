import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import {
  computeKenBurns,
  computeCrossFade,
  getKenBurnsDirection,
} from '../animations/presets'

interface SceneImageProps {
  imageUrl: string
  sceneIndex: number
}

export function SceneImage({ imageUrl, sceneIndex }: SceneImageProps) {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  const direction = getKenBurnsDirection(sceneIndex)
  const progress = interpolate(frame, [0, durationInFrames], [0, 1])
  const { scale, translateX, translateY } = computeKenBurns(progress, direction)
  const opacity = computeCrossFade(frame, durationInFrames)

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: '#000',
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <Img
          src={imageUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
