/**
 * Canonical registry for /opportunities — cultural field + career/role pathways.
 * Drives the public index page and optional sitemap entries for indexable detail routes.
 */

export type OpportunitySection = 'cultural' | 'career'

export type OpportunityStatus = 'open' | 'coming_soon' | 'closed'

export type OpportunityEntry = {
  id: string
  section: OpportunitySection
  title: string
  description: string
  href: string
  external?: boolean
  status: OpportunityStatus
  /** When false: reachable but excluded from sitemap (detail pages may still set noindex). */
  indexable: boolean
  tags?: string[]
  deadline?: string
}

export const OPPORTUNITIES_INDEX_PATH = '/opportunities' as const

export const OPPORTUNITY_ENTRIES: OpportunityEntry[] = [
  {
    id: 'join_dcc_index',
    section: 'cultural',
    title: "Join Miami's Digital Culture Map",
    description:
      'Add your profile to the DCC Index — artists, creators, educators, and technologists shaping digital culture in Miami.',
    href: '/network/signup?pathway=index',
    status: 'open',
    indexable: false,
    tags: ['network', 'directory'],
  },
  {
    id: 'workshops',
    section: 'cultural',
    title: 'Workshops',
    description:
      'Hands-on public learning on websites, documentation, AI literacy, and creative digital practice.',
    href: '/workshops',
    status: 'open',
    indexable: true,
    tags: ['workshop', 'learning'],
  },
  {
    id: 'events',
    section: 'cultural',
    title: 'Events & public programs',
    description: 'Gatherings, open studios, screenings, and community moments across the DCC network.',
    href: '/events',
    status: 'open',
    indexable: true,
    tags: ['event', 'program'],
  },
  {
    id: 'era_channels',
    section: 'cultural',
    title: 'Born-Digital Era pathways',
    description:
      'Seven connected channels — network, workshops, clinics, open lab, public interfaces, and newsletter.',
    href: '/era',
    status: 'open',
    indexable: true,
    tags: ['era', 'program'],
  },
  {
    id: 'artist_support',
    section: 'cultural',
    title: 'Artist support programs',
    description:
      'Digital audits, documentation, portfolio readiness, and presentation support for public opportunities.',
    href: '/programs/artist-support/digital-audits',
    status: 'open',
    indexable: true,
    tags: ['artist', 'support'],
  },
  {
    id: 'open_lab',
    section: 'cultural',
    title: 'Open Lab',
    description: 'Drop-in studio days at Bakehouse — a low-friction physical entry point into the network.',
    href: '/programs/public-programs/open-lab',
    status: 'open',
    indexable: true,
    tags: ['studio', 'program'],
  },
  {
    id: 'newsletter',
    section: 'cultural',
    title: 'Newsletter',
    description:
      'A recurring digest of workshops, artists, opportunities, tools, and updates from the DCC network.',
    href: '/newsletter',
    status: 'open',
    indexable: true,
    tags: ['newsletter'],
  },
  {
    id: 'touching_grass',
    section: 'cultural',
    title: 'Touching Grass (working title)',
    description:
      'Jordan Horton curates a group exhibition at Edge Zones Gallery with DCC Miami — technology, AFK presence, and disconnecting. Dates TBD.',
    href: '/edgezones#exhibition',
    status: 'coming_soon',
    indexable: false,
    tags: ['exhibition', 'edge-zones'],
    deadline: 'Dates TBD',
  },
  {
    id: 'playwire',
    section: 'career',
    title: 'Playwire — publisher journey (concept)',
    description:
      'Concept demo for return conversations — publisher personas, PARMM-lite assessment, and mock RAMP dashboard. Full dossier on moises.tech.',
    href: '/opportunities/playwire',
    status: 'open',
    indexable: false,
    tags: ['role', 'demo'],
  },
]

export function opportunitiesBySection(section: OpportunitySection): OpportunityEntry[] {
  return OPPORTUNITY_ENTRIES.filter((entry) => entry.section === section)
}

/** Paths for sitemap — indexable detail routes only (not the hub itself). */
export function getIndexableOpportunityPaths(): string[] {
  const paths = new Set<string>()
  for (const entry of OPPORTUNITY_ENTRIES) {
    if (!entry.indexable || entry.external) continue
    if (entry.href.startsWith('/') && !entry.href.includes('#')) {
      paths.add(entry.href.split('?')[0] ?? entry.href)
    }
  }
  return [...paths].sort()
}

export function opportunityStatusLabel(status: OpportunityStatus): string {
  switch (status) {
    case 'open':
      return 'Open'
    case 'coming_soon':
      return 'Coming soon'
    case 'closed':
      return 'Closed'
  }
}
