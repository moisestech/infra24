/**
 * DCC / WHAT WOULD YOU MOST LIKE TO DISCOVER?
 *
 * Editorial aggregate snapshot transcribed from the organizer-provided
 * WhatsApp multi-select poll screenshot, shared 2026-11-21.
 *
 * Screenshot doesn't expose a complete voter-to-answer mapping or the exact
 * number of unique respondents. Do NOT attach these answers to particular
 * members, infer an individual interest from their skill annotations, or
 * treat a poll selection as evidence of expertise or actual collaboration.
 *
 * The screenshot's timestamp is unknown. "sharedOn" documents when the
 * screenshot was shared, not when the poll closed.
 */
export const DCC_DISCOVERY_POLL = {
  question: 'What would you most like to discover through DCC?',
  sharedOn: '2026-11-21',
  source: 'Organizer-provided screenshot of WhatsApp multi-select poll',
  totalSelections: 72,
  respondents: null as number | null,
  multiSelect: true,
  choices: [
    { id: 'art', label: 'Art, exhibitions & creative practice', short: 'Art & exhibitions', icon: '🎨', count: 21, tint: '#b4d9b9' },
    { id: 'fabrication', label: 'Fabrication, materials & objects', short: 'Fabrication', icon: '🛠', count: 16, tint: '#d9c2a8' },
    { id: 'film', label: 'Film, animation & sound', short: 'Film & sound', icon: '🎬', count: 11, tint: '#bfcae6' },
    { id: 'code', label: 'Creative coding, AI & automation', short: 'Code & AI', icon: '💻', count: 10, tint: '#a6d5d2' },
    { id: 'xr', label: 'Games, XR & interactive installations', short: 'Games & XR', icon: '🎮', count: 7, tint: '#d6bbdc' },
    { id: 'exploring', label: 'Still exploring / across disciplines', short: 'Exploring', icon: '🌱', count: 7, tint: '#d4d7ad' },
  ],
} as const

export type DiscoveryPollChoiceId = (typeof DCC_DISCOVERY_POLL.choices)[number]['id']

export function isDiscoveryChoice(id: string | null): id is DiscoveryPollChoiceId {
  return DCC_DISCOVERY_POLL.choices.some((choice) => choice.id === id)
}

export function discoveryChoice(id: DiscoveryPollChoiceId) {
  return DCC_DISCOVERY_POLL.choices.find((choice) => choice.id === id)!
}
