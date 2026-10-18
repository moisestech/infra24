/** First names for the unlock screen. This file must not import proposal narratives. */
const PROPOSAL_GREETING_NAMES: Record<string, string> = {
  'heather-deitch': 'Heather',
  'carol-haggiag': 'Carol',
  'oscar-rieveling': 'Oscar',
  'frankie-hsu': 'Frankie',
  'sandra-ramos': 'Sandra',
}

/** First name for unlock greeting — from ?hello= or the slug map. */
export function proposalGreetingName(
  slug: string | undefined,
  helloParam?: string | null
): string | undefined {
  const fromQuery = helloParam?.trim()
  if (fromQuery) return fromQuery.split(/\s+/)[0]
  if (!slug) return undefined
  return PROPOSAL_GREETING_NAMES[slug]
}
