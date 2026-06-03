import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { alumniDisplayName } from '@/lib/airtable/alumni-service'
import {
  alumniGalleryImageUrls,
  alumniImageForContext,
  isUsableImageUrl,
} from '@/lib/airtable/alumni-images'
import { rowResidencyYearTokens } from '@/lib/airtable/alumni-residency-years'

/** Minimal artist_profiles shape for directory ↔ alumni sync. */
export type DirectoryArtistProfile = {
  id: string
  name: string
  profile_image?: string | null
  avatar_url?: string | null
  studio_type?: string | null
  studio_location?: string | null
  bio?: string | null
  metadata?: Record<string, unknown> | null
  mediums?: string[] | null
}

export type AlumniArtistLink = {
  artistId: string
  artistProfileUrl: string
}

export type EnrichedAlumniRow = AlumniAirtableRow & {
  /** Matched in-app artist_profiles record (by normalized name). */
  linkedArtist?: AlumniArtistLink
}

/** Normalize names for fuzzy directory matching. */
export function normalizeDirectoryPersonName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function artistDisplayName(a: DirectoryArtistProfile): string {
  return a.name?.trim() || ''
}

function artistPhotoUrl(a: DirectoryArtistProfile): string | undefined {
  const url = a.profile_image || a.avatar_url
  return isUsableImageUrl(url ?? undefined) ? url!.trim() : undefined
}

function artistResidencyType(a: DirectoryArtistProfile): string | undefined {
  const meta = a.metadata
  if (meta && typeof meta.residency_type === 'string' && meta.residency_type.trim()) {
    return meta.residency_type.trim()
  }
  return a.studio_type?.trim() || undefined
}

function artistResidencyCohort(a: DirectoryArtistProfile): string | undefined {
  const meta = a.metadata
  if (meta && typeof meta.residency_cohort === 'string' && meta.residency_cohort.trim()) {
    return meta.residency_cohort.trim()
  }
  if (meta && typeof meta.year === 'string' && meta.year.trim()) {
    return meta.year.trim()
  }
  return undefined
}

function artistMedium(a: DirectoryArtistProfile): string | undefined {
  if (Array.isArray(a.mediums) && a.mediums.length > 0) {
    return a.mediums.filter(Boolean).join(', ')
  }
  const meta = a.metadata
  if (meta && typeof meta.medium === 'string' && meta.medium.trim()) {
    return meta.medium.trim()
  }
  return undefined
}

/** Flatten portrait frame map + artwork_urls from seed metadata. */
export function galleryUrlsFromArtistMetadata(
  meta: Record<string, unknown> | null | undefined
): string[] {
  if (!meta) return []
  const seen = new Set<string>()
  const out: string[] = []
  const add = (url: string | undefined) => {
    if (!isUsableImageUrl(url)) return
    const key = url.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push(url)
  }

  const artworkUrls = meta.artwork_urls
  if (Array.isArray(artworkUrls)) {
    for (const u of artworkUrls) {
      if (typeof u === 'string') add(u)
    }
  }

  const portraits = meta.portraits
  if (portraits && typeof portraits === 'object' && !Array.isArray(portraits)) {
    for (const frameUrls of Object.values(portraits)) {
      if (!Array.isArray(frameUrls)) continue
      for (const u of frameUrls) {
        if (typeof u === 'string') add(u)
      }
    }
  } else if (Array.isArray(portraits)) {
    for (const u of portraits) {
      if (typeof u === 'string') add(u)
    }
  }

  const single = meta.artwork_url
  if (typeof single === 'string') add(single)

  return out
}

function artistStudioNumber(a: DirectoryArtistProfile): string | undefined {
  const meta = a.metadata
  if (meta && typeof meta.studio === 'string' && meta.studio.trim()) {
    return meta.studio.trim()
  }
  return a.studio_location?.trim() || undefined
}

function completenessScore(a: DirectoryArtistProfile): number {
  let score = 0
  if (artistPhotoUrl(a)) score += 12
  if (a.bio?.trim()) score += 4
  const meta = a.metadata
  if (meta?.source === 'seed_oolite_studio_residents_2026') score += 6
  if (meta?.residency_cohort) score += 2
  if (meta?.residency_type) score += 2
  return score
}

/** Collapse duplicate artist_profiles rows that share the same display name. */
export function dedupeDirectoryArtists(
  artists: DirectoryArtistProfile[]
): DirectoryArtistProfile[] {
  const byName = new Map<string, DirectoryArtistProfile>()
  for (const artist of artists) {
    const key = normalizeDirectoryPersonName(artistDisplayName(artist))
    if (!key) continue
    const existing = byName.get(key)
    if (!existing || completenessScore(artist) > completenessScore(existing)) {
      byName.set(key, artist)
    }
  }
  return [...byName.values()].sort((a, b) =>
    artistDisplayName(a).localeCompare(artistDisplayName(b))
  )
}

function buildArtistIndex(
  artists: DirectoryArtistProfile[]
): Map<string, DirectoryArtistProfile> {
  const deduped = dedupeDirectoryArtists(artists)
  const index = new Map<string, DirectoryArtistProfile>()
  for (const artist of deduped) {
    const key = normalizeDirectoryPersonName(artistDisplayName(artist))
    if (key) index.set(key, artist)
  }
  return index
}

function inferResidencyYear(row: AlumniAirtableRow): string | undefined {
  const direct = row.residencyYear?.trim() || row.year?.trim()
  if (direct) return direct
  const tokens = rowResidencyYearTokens(row)
  return tokens[0]
}

function inferMedium(row: AlumniAirtableRow): string | undefined {
  if (row.medium?.trim()) return row.medium.trim()
  if (row.program?.trim() && !/resident|fellow|cohort/i.test(row.program)) {
    return row.program.trim()
  }
  return undefined
}

/**
 * Merge Airtable alumni with in-app artist_profiles (photos, medium, year, studio).
 * Airtable remains source of truth for topics/bio; Supabase fills gaps.
 */
export function enrichAlumniWithDirectoryArtists(
  alumni: AlumniAirtableRow[],
  artists: DirectoryArtistProfile[],
  orgSlug: string
): EnrichedAlumniRow[] {
  const index = buildArtistIndex(artists)

  return alumni.map((row) => {
    const key = normalizeDirectoryPersonName(alumniDisplayName(row))
    const match = key ? index.get(key) : undefined

    const merged: EnrichedAlumniRow = { ...row }

    const residencyYear = inferResidencyYear(row)
    if (residencyYear) {
      merged.residencyYear = residencyYear
      merged.year = residencyYear
    }

    const medium = inferMedium(row)
    if (medium) merged.medium = medium

    if (!alumniImageForContext(merged, 'card') && match) {
      const photo = artistPhotoUrl(match)
      if (photo) {
        merged.photoUrl = photo
        merged.featuredImageUrl = photo
      }
      const extras = galleryUrlsFromArtistMetadata(
        (match.metadata as Record<string, unknown> | null) ?? null
      )
      if (extras.length) {
        merged.additionalImageUrls = [
          ...(merged.additionalImageUrls ?? []),
          ...extras.filter(
            (u) =>
              !merged.additionalImageUrls?.some(
                (existing) => existing.toLowerCase() === u.toLowerCase()
              )
          ),
        ]
      }
    }

    if (match) {
      if (!merged.medium?.trim()) {
        const fromArtist = artistMedium(match)
        if (fromArtist) merged.medium = fromArtist
      }
      if (!merged.residencyYear?.trim() && !merged.year?.trim()) {
        const cohort = artistResidencyCohort(match)
        if (cohort) {
          merged.residencyYear = cohort
          merged.year = cohort
        }
      }
      if (!merged.studioNumber?.trim()) {
        const studio = artistStudioNumber(match)
        if (studio) merged.studioNumber = studio
      }
      if (!merged.program?.trim()) {
        const type = artistResidencyType(match)
        if (type) merged.program = type
      }
      merged.linkedArtist = {
        artistId: match.id,
        artistProfileUrl: `/o/${orgSlug}/artists/${match.id}`,
      }
    }

    return merged
  })
}

export function residencyLabelForDirectoryArtist(artist: DirectoryArtistProfile): string {
  const meta = artist.metadata
  if (meta && typeof meta.residency_type === 'string' && meta.residency_type.trim()) {
    return meta.residency_type.trim()
  }
  const label = meta && typeof meta.constituent_label === 'string' ? meta.constituent_label : ''
  if (label.trim()) return label.trim()
  return artist.studio_type?.trim() || ''
}

export function residencyCohortForDirectoryArtist(artist: DirectoryArtistProfile): string {
  return artistResidencyCohort(artist) || ''
}

export function matchesStudioResidents2026(artist: DirectoryArtistProfile): boolean {
  const type = residencyLabelForDirectoryArtist(artist)
  const cohort = residencyCohortForDirectoryArtist(artist)
  return type === 'Studio Resident' && cohort === '2026'
}

export function galleryUrlsForEnrichedAlumni(row: EnrichedAlumniRow): string[] {
  return alumniGalleryImageUrls(row)
}
