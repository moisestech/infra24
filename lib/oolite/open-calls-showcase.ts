import { normalizeSuggestedQuestionKey } from '@/lib/memory-agent/normalize-suggested-question-key'
import type { MemoryAgentEventCard } from '@/types/memory-agent'

/** Public overview of 2027 Ellies & residency open calls */
export const OOLITE_ELLIES_OPEN_CALLS_URL =
  'https://oolitearts.org/ellies-open-calls/' as const

/** Submittable portal — all applications */
export const OOLITE_SUBMITTABLE_PORTAL_URL =
  'https://oolitearts.submittable.com/submit' as const

export type OpenCallKind = 'ellies_award' | 'residency' | 'grantee_admin'

export type OoliteOpenCallOffering = {
  key: string
  title: string
  shortLabel: string
  kind: OpenCallKind
  applyUrl: string
  description: string
  /** When false, listed under grantee resources — not part of public open-call window */
  publicOpenCall?: boolean
}

/** Direct Submittable apply URLs (login redirects to same path when signed in). */
export const OOLITE_OPEN_CALL_OFFERINGS: OoliteOpenCallOffering[] = [
  {
    key: 'ellies_creator_award_2027',
    title: '2027 The Ellies — Oolite Arts Awards Creator Award',
    shortLabel: 'Ellies Creator Award',
    kind: 'ellies_award',
    applyUrl:
      'https://oolitearts.submittable.com/submit/348632/2027-the-ellies-oolite-arts-awards-creator-award',
    description:
      'Creator Award for Miami-Dade artists — project support across visual arts disciplines.',
    publicOpenCall: true,
  },
  {
    key: 'ellies_art_teacher_travel_2027',
    title: '2027 The Ellies — Art Teacher Travel Award',
    shortLabel: 'Ellies Art Teacher Travel Award',
    kind: 'ellies_award',
    applyUrl:
      'https://oolitearts.submittable.com/submit/348633/2027-the-ellies-oolite-arts-awards-art-teacher-travel-award',
    description: 'Travel award supporting Miami-Dade art teachers.',
    publicOpenCall: true,
  },
  {
    key: 'ellies_curatorial_writing_2027',
    title: '2027 The Ellies — Curatorial Practice and Critical Writing Award',
    shortLabel: 'Ellies Curatorial & Critical Writing',
    kind: 'ellies_award',
    applyUrl:
      'https://oolitearts.submittable.com/submit/353674/2027-the-ellies-oolite-arts-awards-curatorial-practice-and-critical-writing-awa',
    description: 'Award for curatorial practice and critical writing in Miami-Dade.',
    publicOpenCall: true,
  },
  {
    key: 'studio_residency_2027',
    title: '2027 Oolite Arts Studio Residency Program',
    shortLabel: 'Studio Residency',
    kind: 'residency',
    applyUrl:
      'https://oolitearts.submittable.com/submit/355147/2027-oolite-arts-studio-residency-program',
    description: 'Studio residency at Oolite Arts for Miami-Dade artists.',
    publicOpenCall: true,
  },
  {
    key: 'home_away_residency_2027',
    title: '2027 Oolite Arts Home + Away Residency Program',
    shortLabel: 'Home + Away Residency',
    kind: 'residency',
    applyUrl:
      'https://oolitearts.submittable.com/submit/355720/2027-oolite-arts-home-away-residency-program',
    description: 'Home + Away residency connecting Miami artists with partner sites.',
    publicOpenCall: true,
  },
  {
    key: 'cinematic_residency_2027',
    title: '2027 Oolite Arts Cinematic Residency Program',
    shortLabel: 'Cinematic Residency',
    kind: 'residency',
    applyUrl:
      'https://oolitearts.submittable.com/submit/356110/2027-oolite-arts-cinematic-residency-program',
    description: 'Film and cinematic arts residency at Oolite Arts for Miami-Dade filmmakers.',
    publicOpenCall: true,
  },
  {
    key: 'grant_report_form',
    title: 'Grant Report Form',
    shortLabel: 'Grant Report',
    kind: 'grantee_admin',
    applyUrl:
      'https://oolitearts.submittable.com/submit/125550/grant-report-form',
    description: 'For Ellies and grant recipients submitting required reports.',
    publicOpenCall: false,
  },
  {
    key: 'grant_agreement_payment',
    title: 'Submit Your Grant Agreement and Payment Information',
    shortLabel: 'Grant Agreement & Payment',
    kind: 'grantee_admin',
    applyUrl:
      'https://oolitearts.submittable.com/submit/125549/submit-your-grant-agreement-and-payment-information',
    description: 'For awardees submitting grant agreements and payment details.',
    publicOpenCall: false,
  },
]

export const OOLITE_OPEN_CALLS_WINDOW = {
  label: 'Applications open for 2027 opportunities',
  startDate: '2026-06-01',
  endDate: '2026-07-31',
  display: 'June 1 – July 31, 2026',
} as const

const ELLIES_IMAGE =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968673/january-ellies-2026_xtllmg.gif'

export type OpenCallsShowcase = {
  key: string
  title: string
  spokenAnswer: string
  displayAnswer: string
  followUps: string[]
  hubUrl: string
  portalUrl: string
  heroImageUrl: string
}

const DISPLAY_ANSWER = `2027 Open Calls — Apply Now

Applications open for 2027 opportunities: ${OOLITE_OPEN_CALLS_WINDOW.display}

Overview: ${OOLITE_ELLIES_OPEN_CALLS_URL}
Apply portal: ${OOLITE_SUBMITTABLE_PORTAL_URL}

The Ellies — Oolite Arts Awards
• Creator Award — https://oolitearts.submittable.com/submit/348632/2027-the-ellies-oolite-arts-awards-creator-award
• Art Teacher Travel Award — https://oolitearts.submittable.com/submit/348633/2027-the-ellies-oolite-arts-awards-art-teacher-travel-award
• Curatorial Practice and Critical Writing Award — https://oolitearts.submittable.com/submit/353674/2027-the-ellies-oolite-arts-awards-curatorial-practice-and-critical-writing-awa

Residency programs
• Studio Residency — https://oolitearts.submittable.com/submit/355147/2027-oolite-arts-studio-residency-program
• Home + Away Residency — https://oolitearts.submittable.com/submit/355720/2027-oolite-arts-home-away-residency-program
• Cinematic Residency — https://oolitearts.submittable.com/submit/356110/2027-oolite-arts-cinematic-residency-program

Grantee resources (current awardees)
• Grant report form — https://oolitearts.submittable.com/submit/125550/grant-report-form
• Grant agreement & payment information — https://oolitearts.submittable.com/submit/125549/submit-your-grant-agreement-and-payment-information`

export const OPEN_CALLS_SHOWCASE: OpenCallsShowcase = {
  key: 'open_calls_2027',
  title: '2027 Open Calls — The Ellies & Residencies',
  spokenAnswer: `Applications for 2027 Oolite opportunities are open ${OOLITE_OPEN_CALLS_WINDOW.display}. Apply through Submittable for The Ellies awards, Studio, Home + Away, and Cinematic residencies. Visit ellies-open-calls on oolitearts.org for details.`,
  displayAnswer: DISPLAY_ANSWER,
  followUps: [
    'How do I apply for The Ellies Creator Award?',
    'How do I apply for the Cinematic Residency?',
    'How do I apply for the Studio Residency?',
    'What is the Home + Away Residency?',
    'When is the application deadline for 2027 open calls?',
    "Tell me about Oolite's new campus in Little River.",
  ],
  hubUrl: OOLITE_ELLIES_OPEN_CALLS_URL,
  portalUrl: OOLITE_SUBMITTABLE_PORTAL_URL,
  heroImageUrl: ELLIES_IMAGE,
}

const byKey = new Map(OOLITE_OPEN_CALL_OFFERINGS.map((o) => [o.key, o]))

export function getOpenCallOffering(key: string): OoliteOpenCallOffering | undefined {
  return byKey.get(key)
}

export function getPublicOpenCallOfferings(): OoliteOpenCallOffering[] {
  return OOLITE_OPEN_CALL_OFFERINGS.filter((o) => o.publicOpenCall !== false)
}

export function getGranteeAdminOfferings(): OoliteOpenCallOffering[] {
  return OOLITE_OPEN_CALL_OFFERINGS.filter((o) => o.kind === 'grantee_admin')
}

export function findOpenCallOfferingByQuery(
  question: string
): OoliteOpenCallOffering | undefined {
  const q = normalizeSuggestedQuestionKey(question)
  if (!q) return undefined

  const direct = OOLITE_OPEN_CALL_OFFERINGS.find((o) => {
    const hay = [o.title, o.shortLabel, o.key].join(' ').toLowerCase()
    return (
      q.includes(o.key.replace(/_/g, ' ')) ||
      q.includes(o.shortLabel.toLowerCase()) ||
      (q.includes('creator') && o.key.includes('creator')) ||
      (q.includes('art teacher') && o.key.includes('art_teacher')) ||
      (q.includes('curatorial') && o.key.includes('curatorial')) ||
      (q.includes('studio residency') && o.key === 'studio_residency_2027') ||
      (q.includes('home') && q.includes('away') && o.key === 'home_away_residency_2027') ||
      (q.includes('cinematic') && o.key === 'cinematic_residency_2027') ||
      (q.includes('grant report') && o.key === 'grant_report_form') ||
      (q.includes('grant agreement') && o.key === 'grant_agreement_payment')
    )
  })
  if (direct) return direct

  return OOLITE_OPEN_CALL_OFFERINGS.find((o) => {
    const hay = [o.title, o.shortLabel, o.key].join(' ').toLowerCase()
    return hay.split(/\s+/).some((word) => word.length > 4 && q.includes(word))
  })
}

const OPEN_CALLS_QUESTION_RE =
  /\b(open\s+calls?|apply\s+now|submittable|ellies|2027\s+(?:studio|home|cinematic|residency|opportunities)|creator\s+award|art\s+teacher\s+travel|curatorial\s+practice|critical\s+writing|home\s*\+\s*away|cinematic\s+residency|grant\s+report|grant\s+agreement)\b/i

export function isOpenCallsQuestion(question: string): boolean {
  return OPEN_CALLS_QUESTION_RE.test(question.trim())
}

export function matchOpenCallsQuestion(
  question: string
): { showcase: OpenCallsShowcase; offering?: OoliteOpenCallOffering } | undefined {
  const key = normalizeSuggestedQuestionKey(question)

  const chips = [
    'what are the 2027 open calls',
    'how do i apply for the ellies',
    'how do i apply for the studio residency',
    'how do i apply for the home + away residency',
    'how do i apply for the cinematic residency',
    'when is the application deadline for 2027 open calls',
    'where do i submit my grant report',
  ]
  if (chips.includes(key) || isOpenCallsQuestion(question)) {
    return {
      showcase: OPEN_CALLS_SHOWCASE,
      offering: findOpenCallOfferingByQuery(question),
    }
  }

  if (
    key.includes('apply') &&
    (key.includes('ellies') || key.includes('residency') || key.includes('2027'))
  ) {
    return {
      showcase: OPEN_CALLS_SHOWCASE,
      offering: findOpenCallOfferingByQuery(question),
    }
  }

  return undefined
}

export function resolveOpenCallsSpokenAnswer(question: string): string {
  const match = matchOpenCallsQuestion(question)
  if (!match) return OPEN_CALLS_SHOWCASE.spokenAnswer

  const { offering } = match
  if (offering) {
    return `${offering.shortLabel}: apply at ${offering.applyUrl}. Applications for 2027 opportunities are open ${OOLITE_OPEN_CALLS_WINDOW.display}.`
  }

  if (/deadline|when.*apply|window/i.test(question)) {
    return `2027 Oolite open calls are open ${OOLITE_OPEN_CALLS_WINDOW.display}. Apply through Submittable or visit ${OOLITE_ELLIES_OPEN_CALLS_URL}.`
  }

  return OPEN_CALLS_SHOWCASE.spokenAnswer
}

export function buildOpenCallEventCards(
  offerings: OoliteOpenCallOffering[] = getPublicOpenCallOfferings()
): MemoryAgentEventCard[] {
  return offerings.map((o) => ({
    id: `open_call_${o.key}`,
    title: o.shortLabel,
    summary: o.description,
    ctaLabel: 'Apply',
    ctaUrl: o.applyUrl,
  }))
}

export const OPEN_CALLS_SUGGESTED_QUESTIONS = [
  'What are the 2027 open calls?',
  'How do I apply for The Ellies?',
  'How do I apply for the Studio Residency?',
  'When is the application deadline for 2027 open calls?',
] as const
