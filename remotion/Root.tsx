import { Composition, registerRoot } from 'remotion'
import { ShortVideo } from './ShortVideo'
import { CompositionPropsSchema } from './types'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShortVideo"
        component={ShortVideo}
        durationInFrames={900} // Default 30s @ 30fps
        fps={30}
        width={1080}
        height={1920}
        schema={CompositionPropsSchema}
        defaultProps={{
          audioUrl: '',
          imageUrls: [],
          captions: { words: [] },
          script: { scenes: [] },
          fps: 30,
          durationInFrames: 900
        }}
      />
    </>
  )
}

registerRoot(RemotionRoot)
