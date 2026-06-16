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
    'what should visitors see at oolite this week':
      "I'll pull together what visitors should see at Oolite this week — give me a moment while I look through our programming.",
    'what exhibitions are coming up':
      "Let me scan upcoming exhibitions and what's on the calendar.",
    'tell me about mark delmont':
      "I'll pull up Mark Delmont's profile — studio context, artworks, and alumni history.",
    'tell me about shayla marshall':
      "I'll pull up Shayla Marshall's profile — her studio, themes, and artwork gallery.",
    'tell me about ricardo e zulueta':
      "I'll pull up Ricardo E. Zulueta's profile — his studio, digital practice, and artwork gallery.",
    'tell me about ricardo zulueta':
      "I'll pull up Ricardo E. Zulueta's profile — his studio, digital practice, and artwork gallery.",
    'tell me about leo castaneda':
      "I'll pull up Leo Castaneda's profile — his game-based work, 2018/2019 residency, and artwork gallery.",
    'tell me about the youth artist residency':
      "I'll pull up the Youth Artist Residency — the inaugural cohort, mentor, and exhibition details.",
    'which alumni are photographers':
      "I'll look through our alumni network for photographers and lens-based practices.",
    'who is connected to this exhibition':
      "I'll trace artists and alumni connected to this exhibition.",
    'what should go on the smart sign today':
      "I'll draft what belongs on the smart sign today based on current programming.",
    'how do i book digital lab workshops or consulting':
      "I'll point you to Digital Lab workshops, consulting sessions, and studio visits — including direct booking links.",
    'what are the 2027 open calls':
      "I'll pull up 2027 open calls — The Ellies awards, Studio and Home + Away residencies, and Submittable apply links.",
    'how do i apply for the ellies':
      "I'll share The Ellies award applications — Creator, Art Teacher Travel, and Curatorial & Critical Writing.",
    'how do i apply for the studio residency':
      "I'll link you to the 2027 Studio Residency application on Submittable.",
    'how do i apply for the cinematic residency':
      "I'll link you to the 2027 Cinematic Residency application on Submittable.",
    'when is the application deadline for 2027 open calls':
      "I'll confirm the 2027 application window and where to apply.",
    "tell me about oolite's new campus in little river":
      "I'll share the Our New Home capital project — the Little River campus, Barozzi Veiga design, and what's included.",
    'who designed the new oolite arts campus':
      "I'll cover the architects — Barozzi Veiga, Charles Benson, and how the design process unfolded.",
    'what will the little river campus include':
      "I'll walk through the campus program — studios, exhibitions, fabrication, classrooms, and public spaces.",
    'what is the timeline for the capital project':
      "I'll pull up the latest on permitting, contractor bids, and groundbreaking timing.",
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
