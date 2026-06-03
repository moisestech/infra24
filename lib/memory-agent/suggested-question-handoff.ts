import type { MemoryAgentBranding } from '@/lib/memory-agent/org-branding'
import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'

export type SuggestedQuestionHandoffLines = {
  welcomeLine: string
  prefaceLine: string
}

/** Pause between staged intro lines (ms). */
export const SUGGESTED_QUESTION_HANDOFF_WELCOME_DELAY_MS = 900
export const SUGGESTED_QUESTION_HANDOFF_PREFACE_DELAY_MS = 750

/** Normalize question text for handoff lookup. */
export function normalizeSuggestedQuestionKey(question: string): string {
  return question
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.…]+$/u, '')
}

function welcomeForHandoff(branding: MemoryAgentBranding): string {
  return `Hello! Welcome to ${branding.orgName}. I'm ${branding.agentName}.`
}

/** Canned preface lines keyed by normalized suggested question (org-specific). */
const PREFACE_BY_ORG: Record<string, Record<string, string>> = {
  oolite: {
    "what's happening this week":
      "I'll pull together what's happening this week — give me a moment while I look through our programming.",
    'what exhibitions are coming up':
      "Let me scan upcoming exhibitions and what's on the calendar.",
    'which alumni are photographers':
      "I'll look through our alumni network for photographers and lens-based practices.",
    'who is connected to this exhibition':
      "I'll trace artists and alumni connected to this exhibition.",
    'what should go on the smart sign today':
      "I'll draft what belongs on the smart sign today based on current programming.",
  },
  sohohouse: {
    'what should members experience this week':
      "I'll map member routes and what's worth experiencing this week.",
    'what should a new member do first':
      "I'll outline a strong first visit for a new member.",
    'what is happening in the house tonight':
      "Let me see what's on in the House tonight.",
    'what should go on the smart sign':
      "I'll draft smart-sign copy from tonight's programming.",
    'what is bookable right now':
      "I'll check what's bookable for members right now.",
  },
}

function genericPreface(question: string): string {
  const trimmed = question.trim()
  if (!trimmed) return 'Let me look into that for you.'
  return `Good question — I'll dig into our records on “${trimmed}”.`
}

/**
 * Resolve canned welcome + preface for a suggested question.
 * Falls back to org welcome + generic preface when no exact match.
 */
export function resolveSuggestedQuestionHandoff(
  orgSlug: string,
  question: string
): SuggestedQuestionHandoffLines {
  const branding = getMemoryAgentBranding(orgSlug)
  const key = normalizeSuggestedQuestionKey(question)
  const orgPrefaces = PREFACE_BY_ORG[orgSlug.trim().toLowerCase()] ?? {}
  const prefaceLine = orgPrefaces[key] ?? genericPreface(question)

  return {
    welcomeLine: welcomeForHandoff(branding),
    prefaceLine,
  }
}

export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
