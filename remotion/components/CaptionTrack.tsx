import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import React from 'react'

interface Word {
  word: string
  start: number
  end: number
}

interface Props {
  words: Word[]
  fps: number
}

export const CaptionTrack: React.FC<Props> = ({ words, fps }) => {
  const frame = useCurrentFrame()
  const currentTime = frame / fps

  // Group words into phrases (2-4 words)
  const phrases = React.useMemo(() => {
    const result: Word[][] = []
    let currentPhrase: Word[] = []
    
    words.forEach((word) => {
      currentPhrase.push(word)
      // Grouping logic: 3 words per phrase, or if the gap is too large
      if (currentPhrase.length >= 3) {
        result.push(currentPhrase)
        currentPhrase = []
      }
    })
    
    if (currentPhrase.length > 0) {
      result.push(currentPhrase)
    }
    
    return result
  }, [words])

  // Find the current phrase
  const activePhrase = phrases.find((phrase) => {
    const start = phrase[0].start
    const end = phrase[phrase.length - 1].end
    return currentTime >= start && currentTime <= end
  })

  if (!activePhrase) return null

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 150,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          padding: '20px 40px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '20px',
          maxWidth: '80%',
        }}
      >
        {activePhrase.map((wordObj, i) => {
          const isWordActive = currentTime >= wordObj.start && currentTime <= wordObj.end
          
          return (
            <span
              key={`${wordObj.word}-${i}`}
              style={{
                color: isWordActive ? '#fbbf24' : 'white', // Gold for active word
                fontSize: '48px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                transform: isWordActive ? 'scale(1.1)' : 'scale(1.0)',
                transition: 'transform 0.1s ease-out',
              }}
            >
              {wordObj.word}
            </span>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
