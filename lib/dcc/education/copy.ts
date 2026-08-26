/**
 * Public copy for the DCC MIA `/workshops` sessions band.
 * Lead with what the education layer is — not a negation of checkout.
 */

export const DCC_SESSIONS_EYEBROW = 'DCC MIA sessions'

export const DCC_SESSIONS_HEADING =
  'Public syllabi for artists working through technology'

export const DCC_SESSIONS_LEAD =
  'Each session below already has a page you can open — a lab, a handbook, or a taught syllabus. Walk into Saturday Lab, read a session, or register interest so DCC knows what to publish next.'

export const DCC_IN_DEVELOPMENT_HEADING = 'In development at DCC'

export const DCC_IN_DEVELOPMENT_LEAD =
  'These syllabi already exist in the workshop library. They are not live DCC pages yet. Registering interest helps DCC decide which one to publish next.'

export const DCC_WORKSHOP_TRACK_LABEL: Record<
  'presence' | 'ai-literacy' | 'practice-language' | 'archives',
  string
> = {
  presence: 'Presence',
  'ai-literacy': 'AI literacy',
  'practice-language': 'Practice language',
  archives: 'Archives',
}

export const DCC_WORKSHOP_INTEREST_CTA = 'Register interest'

export const DCC_WORKSHOP_INTEREST_SOURCE_PREFIX = 'workshop-'

export function workshopInterestHref(slug: string): string {
  return `/newsletter?source=${DCC_WORKSHOP_INTEREST_SOURCE_PREFIX}${encodeURIComponent(slug)}`
}
