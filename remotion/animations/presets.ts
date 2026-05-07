import { interpolate, spring } from 'remotion'

export type KenBurnsDirection = 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right'

const KEN_BURNS_CYCLE: KenBurnsDirection[] = ['zoom-in', 'pan-left', 'zoom-out', 'pan-right']

export function getKenBurnsDirection(sceneIndex: number): KenBurnsDirection {
  return KEN_BURNS_CYCLE[sceneIndex % KEN_BURNS_CYCLE.length]
}

export function computeKenBurns(
  progress: number,
  direction: KenBurnsDirection,
): { scale: number; translateX: number; translateY: number } {
  switch (direction) {
    case 'zoom-in':
      return { scale: interpolate(progress, [0, 1], [1.0, 1.08]), translateX: 0, translateY: 0 }
    case 'zoom-out':
      return { scale: interpolate(progress, [0, 1], [1.08, 1.0]), translateX: 0, translateY: 0 }
    case 'pan-left':
      return {
        scale: 1.06,
        translateX: interpolate(progress, [0, 1], [20, -20]),
        translateY: 0,
      }
    case 'pan-right':
      return {
        scale: 1.06,
        translateX: interpolate(progress, [0, 1], [-20, 20]),
        translateY: 0,
      }
  }
}

export function computeCrossFade(
  frame: number,
  sceneDuration: number,
  fadeFrames = 12,
): number {
  if (frame < fadeFrames) {
    return interpolate(frame, [0, fadeFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }
  if (frame > sceneDuration - fadeFrames) {
    return interpolate(frame, [sceneDuration - fadeFrames, sceneDuration], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }
  return 1
}

interface CaptionAnimation {
  opacity: number
  scale: number
  translateY: number
}

export function computeCaptionEntrance(
  frameWithinGroup: number,
  groupDuration: number,
  animationType: string,
  fps: number,
): CaptionAnimation {
  const ANIM_FRAMES = 8

  switch (animationType) {
    case 'fade': {
      let opacity = interpolate(frameWithinGroup, [0, ANIM_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
      if (frameWithinGroup > groupDuration - ANIM_FRAMES) {
        opacity = interpolate(
          frameWithinGroup,
          [groupDuration - ANIM_FRAMES, groupDuration],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
      }
      return { opacity, scale: 1, translateY: 0 }
    }

    case 'pop': {
      const s = spring({ frame: frameWithinGroup, fps, config: { damping: 12, stiffness: 300 } })
      const scale = interpolate(s, [0, 1], [0.6, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
      const opacity = interpolate(frameWithinGroup, [0, ANIM_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
      return { opacity, scale, translateY: 0 }
    }

    case 'slide-up': {
      const translateY = interpolate(frameWithinGroup, [0, ANIM_FRAMES], [24, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
      const opacity = interpolate(frameWithinGroup, [0, ANIM_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
      return { opacity, scale: 1, translateY }
    }

    case 'bounce': {
      const s = spring({
        frame: frameWithinGroup,
        fps,
        config: { damping: 5, stiffness: 400, mass: 0.6 },
      })
      const scale = interpolate(s, [0, 1], [0.4, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
      const opacity = Math.min(1, frameWithinGroup / ANIM_FRAMES)
      return { opacity, scale, translateY: 0 }
    }

    case 'typewriter':
    default:
      return { opacity: 1, scale: 1, translateY: 0 }
  }
}
