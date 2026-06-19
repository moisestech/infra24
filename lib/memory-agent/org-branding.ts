import { getTenantConfig } from '@/lib/tenant'
import { mergeAppSuggestedQuestions } from '@/lib/memory-agent/suggested-questions'
import { dccInstitutionalMemorySuggestedQuestions } from '@/lib/dcc/dcc-institutional-memory-chips'
import { ooliteInstitutionalMemorySuggestedQuestions } from '@/lib/oolite/oolite-institutional-memory-chips'
import { showcaseArtistSuggestedQuestions } from '@/lib/oolite/showcase-artists'
import { SOHO_HOUSE_SUGGESTED_QUESTIONS } from '@/lib/sohohouse/suggested-questions'
import type { AgentState } from '@/types/memory-agent'

export type MemoryAgentBranding = {
  orgName: string
  /** Kiosk product title (page H1) */
  productTitle: string
  /** Short agent persona name — used in greetings and prompts */
  agentName: string
  /** Legacy / status label */
  agentDisplayName: string
  /** One-line voice for UI and system prompt tone */
  personality: string
  tagline: string
  suggestedQuestions: string[]
  /** Ask field placeholder — org-specific retrieval domains */
  inputPlaceholder: string
  /** Optional status copy overrides for MemoryPulse */
  pulseCopy?: Partial<Record<AgentState, { title: string; subtitle: string }>>
}

const DEFAULT_SUGGESTED = [
  'Who are alumni working with digital media, video, or installation?',
  'Which artists connect to Miami and public art themes?',
  'Recommend artists for a curator interested in ecology.',
  'Who could help lead a workshop on AI and the arts?',
]

const DEFAULT_PERSONALITY =
  'Warm, clear, and professional—like a knowledgeable host who never invents facts.'

const DEFAULT_INPUT_PLACEHOLDER = 'Ask about artists, themes, programs…'

const BY_SLUG: Record<string, Partial<MemoryAgentBranding>> = {
  oolite: {
    orgName: 'Oolite Arts',
    productTitle: 'Institutional Memory',
    agentName: 'Oolite',
    agentDisplayName: 'Oolite',
    personality:
      'Warm, curious, and rooted in Miami’s contemporary art community—concise, never stiff, and always grounded in real records.',
    tagline: 'A conversational guide to our network and programs.',
    pulseCopy: {
      searching: {
        title: 'Searching…',
        subtitle: 'Looking through programs, exhibitions, and alumni records.',
      },
      thinking: {
        title: 'Preparing your answer…',
        subtitle: 'Grounding in Oolite announcements and approved directory data.',
      },
    },
  },
  bakehouse: {
    orgName: 'Bakehouse Art Complex',
    productTitle: 'Institutional Memory',
    agentName: 'Bakehouse',
    agentDisplayName: 'Bakehouse',
    personality:
      'Practical and community-minded—helpful for artists, staff, and partners navigating Bakehouse history.',
    tagline: 'Explore Bakehouse artists, alumni, and program history through conversation.',
    suggestedQuestions: DEFAULT_SUGGESTED,
  },
  locust: {
    orgName: 'Locust Projects',
    productTitle: 'Institutional Memory',
    agentName: 'Locust',
    agentDisplayName: 'Locust',
    personality: 'Contemporary, direct, and exhibition-aware—focused on artists and program connections.',
    tagline: 'Discover Locust-affiliated artists and program connections.',
    suggestedQuestions: DEFAULT_SUGGESTED,
  },
  madarts: {
    orgName: 'MadArts',
    productTitle: 'Institutional Memory',
    agentName: 'MadArts',
    agentDisplayName: 'MadArts',
    personality: 'Energetic and craft-focused—speaks the language of performance, media, and education.',
    tagline: 'Navigate MadArts community knowledge and artist practices.',
    suggestedQuestions: DEFAULT_SUGGESTED,
  },
  dcc: {
    orgName: 'Digital Culture Center Miami',
    productTitle: 'Institutional Memory',
    agentName: 'DCC',
    agentDisplayName: 'DCC',
    personality: 'Forward-looking and network-savvy—comfortable with digital practice and pilot programs.',
    tagline: 'Conversational access to DCC network and artist data (when connected to Airtable).',
    suggestedQuestions: dccInstitutionalMemorySuggestedQuestions(),
  },
  sohohouse: {
    orgName: 'Soho House',
    productTitle: 'Member Signal Agent',
    agentName: 'House',
    agentDisplayName: 'House',
    personality:
      'Refined, welcoming, and member-aware—like a well-informed host who knows House programming, spaces, and member routes. Demo uses approved House knowledge, not private member data.',
    tagline:
      'What should members experience this week? Demo programming for Soho Beach House Miami — routes, screenings, wellness, and dining.',
    suggestedQuestions: [...SOHO_HOUSE_SUGGESTED_QUESTIONS],
    inputPlaceholder:
      'Ask about member routes, House programming, smart signs, or bookable experiences…',
    pulseCopy: {
      searching: {
        title: 'Searching House programming…',
        subtitle: 'Matching member routes, bookable experiences, and spaces.',
      },
      thinking: {
        title: 'Preparing your answer…',
        subtitle: 'Grounding in approved House knowledge — no private member data.',
      },
    },
  },
}

export function getMemoryAgentBranding(orgSlug: string): MemoryAgentBranding {
  const slug = orgSlug.trim().toLowerCase()
  const tenant = getTenantConfig(slug)
  const partial = BY_SLUG[slug] ?? {}
  const orgName = partial.orgName ?? tenant?.name ?? slug
  const agentName =
    partial.agentName ?? orgName.split(' ')[0] ?? orgName
  const suggestedQuestions =
    slug === 'oolite'
      ? mergeAppSuggestedQuestions(
          ooliteInstitutionalMemorySuggestedQuestions(),
          showcaseArtistSuggestedQuestions()
        )
      : slug === 'dcc'
        ? dccInstitutionalMemorySuggestedQuestions()
        : (partial.suggestedQuestions ?? DEFAULT_SUGGESTED)
  return {
    orgName,
    productTitle: partial.productTitle ?? 'Institutional Memory',
    agentName,
    agentDisplayName: partial.agentDisplayName ?? agentName,
    personality: partial.personality ?? DEFAULT_PERSONALITY,
    tagline:
      partial.tagline ??
      'A conversational guide to our network and programs.',
    suggestedQuestions,
    inputPlaceholder: partial.inputPlaceholder ?? DEFAULT_INPUT_PLACEHOLDER,
    pulseCopy: partial.pulseCopy,
  }
}
