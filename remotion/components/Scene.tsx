import { AbsoluteFill, interpolate, useCurrentFrame, Img } from 'remotion'
import React from 'react'

interface Props {
  imageUrl: string
  durationInFrames: number
  sceneId: number
}

export const Scene: React.FC<Props> = ({ imageUrl, durationInFrames, sceneId }) => {
  const frame = useCurrentFrame()

  // Cycle through different animation styles based on sceneId
  const animationType = sceneId % 4

  // 1. Zoom In
  const zoomIn = interpolate(frame, [0, durationInFrames], [1, 1.2], {
    extrapolateRight: 'clamp',
  })

  // 2. Slide Up
  const slideUp = interpolate(frame, [0, durationInFrames], [0, -50], {
    extrapolateRight: 'clamp',
  })

  // 3. Slide Down
  const slideDown = interpolate(frame, [0, durationInFrames], [0, 50], {
    extrapolateRight: 'clamp',
  })

  // Fade in at the start of each scene
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const getStyle = () => {
    switch (animationType) {
      case 0: // Zoom In
        return { transform: `scale(${zoomIn})` }
      case 1: // Slide Up
        return { transform: `translateY(${slideUp}px) scale(1.1)` }
      case 2: // Slide Down
        return { transform: `translateY(${slideDown}px) scale(1.1)` }
      case 3: // Zoom Out (implied by starting scale 1.2 to 1)
        const zoomOut = interpolate(frame, [0, durationInFrames], [1.2, 1], {
          extrapolateRight: 'clamp',
        })
        return { transform: `scale(${zoomOut})` }
      default:
        return {}
    }
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'black' }}>
      <Img
        src={imageUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity,
          ...getStyle(),
        }}
      />
    </AbsoluteFill>
  )
}
