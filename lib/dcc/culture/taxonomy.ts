import type { DccEditorialType, DccProgramType, DccRelationRole } from '@/lib/dcc/culture/types'

/** CDC /programs/[category] segment for a cultural program type. */
export const PROGRAM_TYPE_CATEGORY: Record<DccProgramType, string> = {
  exhibition: 'public-programs',
  'art-fair': 'art-fairs',
  event: 'public-programs',
  talk: 'public-programs',
  workshop: 'workshops',
  activation: 'public-programs',
  screening: 'public-programs',
  'open-studio': 'public-programs',
  other: 'public-programs',
}

export const PROGRAM_TYPE_LABEL: Record<DccProgramType, string> = {
  exhibition: 'Exhibition',
  'art-fair': 'Art fair',
  event: 'Event',
  talk: 'Talk',
  workshop: 'Workshop',
  activation: 'Activation',
  screening: 'Screening',
  'open-studio': 'Open studio',
  other: 'Program',
}

/** CDC /journal/[category] segment for an editorial type. */
export const EDITORIAL_TYPE_CATEGORY: Record<DccEditorialType, string> = {
  conversation: 'conversations',
  interview: 'interviews',
  'studio-visit': 'field-notes',
  'field-note': 'field-notes',
  essay: 'essays',
  'program-recap': 'program-recaps',
  tool: 'workshop-notes',
  news: 'miami',
}

export const EDITORIAL_TYPE_LABEL: Record<DccEditorialType, string> = {
  conversation: 'Conversation',
  interview: 'Interview',
  'studio-visit': 'Studio visit',
  'field-note': 'Field note',
  essay: 'Essay',
  'program-recap': 'Program recap',
  tool: 'Tool',
  news: 'News',
}

export const RELATION_ROLE_LABEL: Record<DccRelationRole, string> = {
  host: 'Host',
  venue: 'Venue',
  'teaching-venue': 'Teaching venue',
  collaborator: 'Collaborator',
  client: 'Client',
  peer: 'Peer',
  'research-visit': 'Research visit',
  partner: 'Partner',
}

export function programCategoryForType(type: DccProgramType): string {
  return PROGRAM_TYPE_CATEGORY[type]
}

export function editorialJournalCategory(type: DccEditorialType): string {
  return EDITORIAL_TYPE_CATEGORY[type]
}

export function programHref(category: string, slug: string): string {
  return `/programs/${category}/${slug}`
}

export function editorialHref(category: string, slug: string): string {
  return `/journal/${category}/${slug}`
}

export function artistHref(slug: string): string {
  return `/artists/${slug}`
}

/** Slugs reserved by existing /artists/* routes. Culture records must not use these. */
export const RESERVED_ARTIST_SLUGS = ['claim', 'create'] as const

export function isReservedArtistSlug(slug: string): boolean {
  return (RESERVED_ARTIST_SLUGS as readonly string[]).includes(slug)
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function looksLikeUuid(value: string): boolean {
  return UUID_RE.test(value)
}
