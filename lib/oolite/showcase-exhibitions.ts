import { normalizeSuggestedQuestionKey } from '@/lib/memory-agent/normalize-suggested-question-key'
import type { MemoryAgentGalleryImage } from '@/types/memory-agent'

const CLOUDINARY = 'https://res.cloudinary.com/dkod1at3i/image/upload'

export type ExhibitionShowcaseConfig = {
  key: string
  title: string
  spokenAnswer: string
  displayAnswer: string
  followUps: string[]
  galleryImages: MemoryAgentGalleryImage[]
  location?: string
  dates?: string
}

export const FROM_WITHIN_EXHIBITION: ExhibitionShowcaseConfig = {
  key: 'from_within',
  title: 'From Within',
  location: 'Oolite Arts Vitrine, 924 Lincoln Rd., Miami Beach, FL 33139',
  dates: 'July 8 – Oct. 4, 2026',
  spokenAnswer:
    'From Within brings together work by Oolite Arts Teen Residents at the Vitrine, July 8 through October 4, 2026. Featuring Ana Blanco, Noa Garcia, Emely Yanji, Melina Walsh, and TJ Wright — a reflection on the experiences and environments that shape their creative lives.',
  displayAnswer: `From Within

On view · July 8 – Oct. 4, 2026

From Within brings together the work of the Oolite Arts Teen Residents, offering a reflection on the experiences, memories, and environments that shape their creative lives.

Developed throughout the residency, the exhibition marks a moment of both reflection and growth. Residents were encouraged to experiment, take creative risks, and examine the influences that inform their artistic practice.

Featuring works by Ana Blanco, Noa Garcia, Emely Yanji, Melina Walsh, and TJ Wright.

Location: Oolite Arts Vitrine · 924 Lincoln Rd., Miami Beach, 33139`,
  followUps: [
    'Tell me about the Youth Artist Residency.',
    'What are the 2027 open calls?',
    'What should visitors see at Oolite this week?',
    'Who are the 2026 Studio Residents?',
  ],
  galleryImages: [
    {
      url: `${CLOUDINARY}/v1780505821/teens-resident-TJ-PHOTO-scaled_diiopj.jpg`,
      title: 'From Within',
      subtitle: 'Youth Artist Residents · Oolite Arts Vitrine',
    },
  ],
}

export const OOLITE_EXHIBITION_SHOWCASES: ExhibitionShowcaseConfig[] = [FROM_WITHIN_EXHIBITION]

const FROM_WITHIN_RE = /\bfrom\s+within\b/i

export function matchExhibitionShowcaseQuestion(
  question: string
): ExhibitionShowcaseConfig | undefined {
  const key = normalizeSuggestedQuestionKey(question)
  if (
    key === 'tell me about the from within exhibition' ||
    key.includes('from within') ||
    FROM_WITHIN_RE.test(question)
  ) {
    return FROM_WITHIN_EXHIBITION
  }
  return undefined
}

export const EXHIBITION_SUGGESTED_QUESTIONS = [
  'Tell me about the From Within exhibition.',
] as const
