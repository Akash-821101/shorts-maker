import { z } from 'zod'

export const CompositionPropsSchema = z.object({
  audioUrl: z.string(),
  imageUrls: z.array(z.object({
    sceneId: z.number(),
    url: z.string()
  })),
  captions: z.object({
    words: z.array(z.object({
      word: z.string(),
      start: z.number(),
      end: z.number()
    }))
  }),
  script: z.object({
    scenes: z.array(z.object({
      sceneId: z.number(),
      narration: z.string(),
      imagePrompt: z.string()
    }))
  }),
  fps: z.number().default(30),
  durationInFrames: z.number().default(900), // 30 seconds default
})

export type VideoCompositionProps = z.infer<typeof CompositionPropsSchema>
