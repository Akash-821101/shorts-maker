import { Composition, type CalculateMetadataFunction } from 'remotion'
import { ShortVideo } from './ShortVideo'
import type { VideoCompositionProps, CaptionStyle } from './types'

const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  id: 'minimalist_fade',
  name: 'Minimalist Fade',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontWeight: '500',
  textColor: '#1f53c4',
  highlightColor: '#FFFFFF',
  animationType: 'fade',
}

const DEFAULT_PROPS: VideoCompositionProps = {
  audioUrl: '',
  scenes: [],
  words: [],
  captionStyle: DEFAULT_CAPTION_STYLE,
  durationInSeconds: 60,
}

const calculateMetadata: CalculateMetadataFunction<VideoCompositionProps & Record<string, unknown>> =
  ({ props }) => ({
    durationInFrames: Math.max(30, Math.round((props as VideoCompositionProps).durationInSeconds * 30)),
    fps: 30,
    width: 720,
    height: 1280,
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnyComposition = Composition as any

export function RemotionRoot() {
  return (
    <AnyComposition
      id="ShortVideo"
      component={ShortVideo}
      durationInFrames={1800}
      fps={30}
      width={720}
      height={1280}
      defaultProps={DEFAULT_PROPS}
      calculateMetadata={calculateMetadata}
    />
  )
}
