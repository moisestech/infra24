/**
 * Canonical suggested chips for DCC Institutional Memory.
 * Merged into the agent status API so chips survive catalog overrides.
 */

import { mergeAppSuggestedQuestions } from '@/lib/memory-agent/suggested-questions'
import { EDGE_ZONES_EXHIBITION_SUGGESTED_QUESTIONS } from '@/lib/marketing/edgezones-exhibition'

/** Partnership exhibition & network (hero first). */
export const DCC_VISITOR_SUGGESTED_QUESTIONS = [
  ...EDGE_ZONES_EXHIBITION_SUGGESTED_QUESTIONS,
  'Which artists in the pilot work with born-digital or networked practice?',
] as const

/** Full chip list for org branding. */
export function dccInstitutionalMemorySuggestedQuestions(): string[] {
  return [...DCC_VISITOR_SUGGESTED_QUESTIONS]
}

/** Merge catalog/branding base with institutional chips. */
export function mergeDccMemoryAgentSuggestedQuestions(base: string[]): string[] {
  return mergeAppSuggestedQuestions(base, dccInstitutionalMemorySuggestedQuestions())
}
