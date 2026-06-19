/**
 * Canonical suggested chips for Oolite Institutional Memory.
 * Merged into the agent status API so chips survive Airtable catalog overrides.
 */

import { mergeAppSuggestedQuestions } from '@/lib/memory-agent/suggested-questions'
import { CAPITAL_CAMPAIGN_SUGGESTED_QUESTIONS } from '@/lib/oolite/capital-campaign-showcase'
import { EXHIBITION_SUGGESTED_QUESTIONS } from '@/lib/oolite/showcase-exhibitions'
import { OPEN_CALLS_SUGGESTED_QUESTIONS } from '@/lib/oolite/open-calls-showcase'
import { showcaseArtistSuggestedQuestions } from '@/lib/oolite/showcase-artists'

/** Programming & on-view (hero first). */
export const OOLITE_VISITOR_SUGGESTED_QUESTIONS = [
  'What should visitors see at Oolite this week?',
  ...EXHIBITION_SUGGESTED_QUESTIONS,
] as const

/** Apply, book, give — promotion CTAs. */
export const OOLITE_PROMOTION_SUGGESTED_QUESTIONS = [
  ...OPEN_CALLS_SUGGESTED_QUESTIONS,
  'How do I apply for the Cinematic Residency?',
  'How do I book Digital Lab workshops or consulting?',
  ...CAPITAL_CAMPAIGN_SUGGESTED_QUESTIONS,
] as const

/** Programs, residents, operations. */
export const OOLITE_PROGRAM_SUGGESTED_QUESTIONS = [
  'Tell me about the Youth Artist Residency.',
  'Who are the 2026 Studio Residents?',
  'Who are Oolite artists working with digital media, software, film, or interactive installation?',
  'What should go on the smart sign today?',
] as const

/** Full chip list for org branding (showcase artist chips merged at runtime). */
export function ooliteInstitutionalMemorySuggestedQuestions(): string[] {
  return [
    ...OOLITE_VISITOR_SUGGESTED_QUESTIONS,
    ...OOLITE_PROMOTION_SUGGESTED_QUESTIONS,
    ...OOLITE_PROGRAM_SUGGESTED_QUESTIONS,
  ]
}

/** Merge catalog/branding base with promotion + showcase artist chips. */
export function mergeOoliteMemoryAgentSuggestedQuestions(base: string[]): string[] {
  const withPromotion = mergeAppSuggestedQuestions(base, [
    ...ooliteInstitutionalMemorySuggestedQuestions(),
  ])
  return mergeAppSuggestedQuestions(withPromotion, showcaseArtistSuggestedQuestions())
}
