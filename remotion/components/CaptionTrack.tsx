import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { computeCaptionEntrance } from '../animations/presets'
import type { CaptionStyle, WordInput, CaptionGroup } from '../types'

// ─── Word grouping ────────────────────────────────────────────────────────────

const WORDS_PER_GROUP = 3

function buildCaptionGroups(words: WordInput[], fps: number): CaptionGroup[] {
  if (!words.length) return []

  const groups: CaptionGroup[] = []
  for (let i = 0; i < words.length; i += WORDS_PER_GROUP) {
    const chunk = words.slice(i, Math.min(i + WORDS_PER_GROUP, words.length))
    groups.push({
      words: chunk,
      startTime: chunk[0].start,
      endTime: chunk[chunk.length - 1].end,
      startFrame: Math.floor(chunk[0].start * fps),
      endFrame: Math.ceil(chunk[chunk.length - 1].end * fps),
    })
  }
  return groups
}

// ─── Single caption group renderer ───────────────────────────────────────────

interface GroupRendererProps {
  group: CaptionGroup
  captionStyle: CaptionStyle
  currentTime: number
  globalFrame: number
  fps: number
}

function GroupRenderer({ group, captionStyle, currentTime, globalFrame, fps }: GroupRendererProps) {
  const frameWithinGroup = globalFrame - group.startFrame
  const groupDuration = group.endFrame - group.startFrame

  const { opacity, scale, translateY } = computeCaptionEntrance(
    frameWithinGroup,
    groupDuration,
    captionStyle.animationType,
    fps,
  )

  const isTypewriter = captionStyle.animationType === 'typewriter'

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0 10px',
        rowGap: 6,
      }}
    >
      {group.words.map((word, i) => {
        const isActive = currentTime >= word.start && currentTime <= word.end
        const isPast = currentTime > word.end

        const displayWord = (() => {
          const raw = word.punctuated_word || word.word
          if (captionStyle.textTransform === 'uppercase') return raw.toUpperCase()
          if (captionStyle.textTransform === 'lowercase') return raw.toLowerCase()
          return raw
        })()

        // Typewriter: fade in each word as it starts being spoken
        const wordOpacity = isTypewriter
          ? currentTime >= word.start
            ? 1
            : 0.12
          : 1

        // Karaoke: highlight current + past words, dim upcoming
        const wordColor =
          isActive || isPast ? captionStyle.highlightColor : captionStyle.textColor

        return (
          <span
            key={i}
            style={{
              fontFamily: captionStyle.fontFamily,
              fontWeight: captionStyle.fontWeight ?? 'bold',
              fontSize: 54,
              lineHeight: 1.25,
              color: wordColor,
              opacity: wordOpacity,
              WebkitTextStroke:
                captionStyle.strokeWidth && captionStyle.strokeColor
                  ? `${captionStyle.strokeWidth}px ${captionStyle.strokeColor}`
                  : undefined,
              textShadow: captionStyle.dropShadow ?? '2px 3px 6px rgba(0,0,0,0.85)',
              whiteSpace: 'nowrap',
            }}
          >
            {displayWord}
          </span>
        )
      })}
    </div>
  )
}

// ─── Main caption track ───────────────────────────────────────────────────────

interface CaptionTrackProps {
  words: WordInput[]
  captionStyle: CaptionStyle
}

export function CaptionTrack({ words, captionStyle }: CaptionTrackProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  const groups = buildCaptionGroups(words, fps)
  const activeGroup = groups.find(
    (g) => currentTime >= g.startTime && currentTime <= g.endTime,
  )

  if (!activeGroup) return null

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 190,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 40px',
        }}
      >
        <div
          style={{
            backgroundColor:
              captionStyle.backgroundColor ?? 'rgba(0, 0, 0, 0.52)',
            borderRadius: 14,
            padding: '10px 22px',
            maxWidth: '88%',
          }}
        >
          <GroupRenderer
            group={activeGroup}
            captionStyle={captionStyle}
            currentTime={currentTime}
            globalFrame={frame}
            fps={fps}
          />
        </div>
      </div>
    </AbsoluteFill>
  )
}
