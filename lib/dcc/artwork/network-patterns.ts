/**
 * PUBLIC, REVIEWED, COARSE ARTWORK SNAPSHOT
 *
 * Source: DCC CRM, inspected 2026-11-21.
 * People: 45 Active/Joined rows; only 22 have any skill annotations.
 * Signals: 48 internally categorized rows.
 *
 * Nothing in this file contains names, record IDs, one-to-one profile nodes,
 * private messages, individual interests, or relationship records.
 *
 * This is NOT the unconnected community interest poll, and is NOT a measure
 * of every member's preferences. Empty responses are unknown, not "no".
 *
 * Each displayed category is supported by >= 5 source records.
 * Strengths are BANDS, not exact counts, to avoid publishing CRM microdata.
 * An inter-category overlap is used only with >= 5 separate records.
 * Category-to-commons spokes are an INDEX (classification), not social edges.
 *
 * Future updates must repeat privacy and representativeness review BEFORE
 * publishing or adding additional graph filters.
 */
export const PATTERN_SNAPSHOT = {
  date: '2026-11-21',
  title: 'A partial portrait of DCC',
  source: 'Reviewed DCC skill annotations and internal network signal categories',
  limitation: 'Incomplete internal annotations, not a poll or a public directory.',
  privacy: 'No personal profiles, individual responses, or interpersonal relationships.',
} as const

export type PatternLens = 'practices' | 'activity'
export type PatternGroup = {
  id: string
  label: string
  short: string
  tier: 1 | 2 | 3
  color: string
  description: string
}

export const PATTERN_GROUPS: Record<PatternLens, readonly PatternGroup[]> = {
  practices: [
    { id: 'fabrication', label: 'Fabrication', short: 'Matter', tier: 2, color: '#d0b4a0', description: 'Making, modeling, and physical production.' },
    { id: 'code', label: 'Creative code', short: 'Code', tier: 3, color: '#a3d3bd', description: 'Creative coding, AI, software, and computational tools.' },
    { id: 'image', label: 'Moving image', short: 'Image', tier: 3, color: '#c0c0dc', description: 'Film, video, imaging, projection, and motion.' },
    { id: 'performance', label: 'Performance + sound', short: 'Sound', tier: 2, color: '#dac9a3', description: 'Performative work, movement, music, and sound.' },
    { id: 'spatial', label: 'Spatial systems', short: 'Space', tier: 1, color: '#a8c5db', description: 'Interactive space, XR, electronics, and physical computing.' },
    { id: 'learning', label: 'Learning + culture', short: 'Culture', tier: 2, color: '#cbafbf', description: 'Teaching, research, curation, and community production.' },
  ],
  activity: [
    { id: 'opportunity', label: 'Opportunities', short: 'Openings', tier: 3, color: '#b9d5bc', description: 'Opportunities circulating through the network.' },
    { id: 'show', label: 'Shows', short: 'Showing', tier: 2, color: '#c8c6df', description: 'Work and projects shared in the network.' },
    { id: 'need', label: 'Needs', short: 'Asking', tier: 2, color: '#d9b4ac', description: 'Requests and questions brought into the network.' },
    { id: 'exchange', label: 'Offers + visits', short: 'Exchange', tier: 1, color: '#d9c9aa', description: 'Combined smaller activity categories for privacy.' },
  ],
}

/**
 * Only reviewed, group-level overlaps. In the sampled annotated People data,
 * Creative code + Moving image co-occur in at least five records.
 * Do not add any edge where support is < 5.
 */
export const REVIEWED_OVERLAPS = [
  { lens: 'practices' as const, from: 'code', to: 'image', label: 'Shared practice overlap' },
] as const
