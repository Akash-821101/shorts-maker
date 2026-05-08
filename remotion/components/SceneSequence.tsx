import { Sequence, useVideoConfig } from 'remotion'
import { SceneImage } from './SceneImage'
import type { SceneInput } from '../types'

interface SceneSequenceProps {
  scenes: SceneInput[]
}

export function SceneSequence({ scenes }: SceneSequenceProps) {
  const { durationInFrames } = useVideoConfig()

  if (scenes.length === 0) return null

  const framesPerScene = Math.floor(durationInFrames / scenes.length)

  return (
    <>
      {scenes.map((scene, index) => {
        const from = index * framesPerScene
        // Last scene absorbs any rounding remainder
        const duration =
          index === scenes.length - 1 ? durationInFrames - from : framesPerScene

        return (
          <Sequence key={scene.sceneId} from={from} durationInFrames={duration}>
            <SceneImage imageUrl={scene.imageUrl} sceneIndex={index} />
          </Sequence>
        )
      })}
    </>
  )
}
