import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { alumniDisplayName } from '@/lib/airtable/alumni-service'
import { alumniResidencyYearLabel } from '@/lib/airtable/alumni-filters'
import { alumniYearLabel } from '@/lib/airtable/alumni-service'
import type { MemoryAgentArtistCard } from '@/types/memory-agent'

export type InstitutionalArtistBadge = 'digital' | 'collection' | 'video'

/** Shared display shape for catalogue grid and Memory Agent result cards. */
export type InstitutionalArtistCardData = {
  id: string
  name: string
  photoUrl?: string
  medium?: string
  program?: string
  year?: string
  cohort?: string
  location?: string
  pronoun?: string
  ethnicity?: string
  nationality?: string
  topics: string[]
  badges: InstitutionalArtistBadge[]
  bioSnippet?: string
  website?: string
  /** Memory Agent: why this person matched */
  matchReason?: string
  confidence?: 'high' | 'medium' | 'low'
}

export function isVideoAlumniRow(row: AlumniAirtableRow): boolean {
  if (row.videoArt === true) return true
  const m = row.medium?.toLowerCase() ?? ''
  return m.includes('video') || m.includes('film') || m.includes('moving image')
}

export function badgesFromAlumniRow(row: AlumniAirtableRow): InstitutionalArtistBadge[] {
  const badges: InstitutionalArtistBadge[] = []
  if (row.digitalArtist === true) badges.push('digital')
  if (row.inCollection === true) badges.push('collection')
  if (isVideoAlumniRow(row)) badges.push('video')
  return badges
}

export function institutionalArtistFromAlumni(
  row: AlumniAirtableRow
): InstitutionalArtistCardData {
  const bio = row.publicBio?.trim() || row.artifacts?.trim()
  return {
    id: row.id,
    name: alumniDisplayName(row),
    photoUrl: row.photoUrl,
    medium: row.medium?.trim(),
    program: row.program?.trim(),
    year: alumniResidencyYearLabel(row) || undefined,
    cohort: row.cohort?.trim(),
    location: row.location?.trim(),
    pronoun: row.pronoun?.trim(),
    ethnicity: row.ethnicity?.trim(),
    nationality: row.nationality?.trim(),
    topics: [...row.topics, ...row.themes].slice(0, 6),
    badges: badgesFromAlumniRow(row),
    bioSnippet: bio ? bio.slice(0, 220) : undefined,
    website: row.website,
  }
}

export function institutionalArtistFromMemoryAgent(
  card: MemoryAgentArtistCard
): InstitutionalArtistCardData {
  const topics = card.topics ?? []
  const badges: InstitutionalArtistBadge[] = [...(card.badges ?? [])]
  const program = card.program?.trim()
  const year =
    card.year?.trim() ||
    (card.programYear?.trim() && !program ? card.programYear.trim() : undefined)
  return {
    id: card.id,
    name: card.name,
    photoUrl: card.photoUrl,
    medium: (card.medium ?? card.discipline)?.trim(),
    program: program || undefined,
    year: year || alumniYearLabel(card.programYear) || undefined,
    cohort: card.cohort?.trim(),
    location: card.location?.trim(),
    pronoun: card.pronoun?.trim(),
    ethnicity: card.ethnicity?.trim(),
    nationality: card.nationality?.trim(),
    topics,
    badges,
    bioSnippet: card.bioSnippet?.trim(),
    website: card.website,
    matchReason: card.reason?.trim(),
    confidence: card.confidence,
  }
}
