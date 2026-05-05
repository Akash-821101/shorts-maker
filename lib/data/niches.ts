import { Ghost, Sparkles, BookOpen, Heart, Brain, Laugh, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Niche {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export const PREDEFINED_NICHES: Niche[] = [
  { id: 'scary_story',  title: 'Scary Story',       description: 'Spooky and thrilling short stories that keep viewers hooked.',       icon: Ghost },
  { id: 'motivation',   title: 'Motivation',         description: 'Inspiring quotes, discipline advice, and daily motivation.',         icon: Sparkles },
  { id: 'facts',        title: 'Interesting Facts',  description: 'Mind-blowing and rare facts about the world and history.',           icon: BookOpen },
  { id: 'romance',      title: 'Romance',            description: 'Heartwarming love stories and relationship advice.',                  icon: Heart },
  { id: 'philosophy',   title: 'Philosophy',         description: 'Deep thoughts, stoic wisdom, and life lessons.',                     icon: Brain },
  { id: 'comedy',       title: 'Comedy',             description: 'Funny scenarios, dad jokes, and relatable humor.',                   icon: Laugh },
  { id: 'technology',   title: 'Technology',         description: 'Latest tech news, AI updates, and futuristic concepts.',             icon: Zap },
]
