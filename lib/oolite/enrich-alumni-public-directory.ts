import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { alumniDisplayName } from '@/lib/airtable/alumni-service'
import type { EnrichedAlumniRow } from '@/lib/organization/artist-alumni-bridge'
import { normalizeDirectoryPersonName } from '@/lib/organization/artist-alumni-bridge'
import type { MemoryAgentMode } from '@/types/memory-agent'
import {
  type OolitePublicDirectoryProfile,
  publicDirectoryProfilePassesGovernance,
} from '@/lib/oolite/public-directory-profiles'

function mergeProfileIntoAlumni(
  row: AlumniAirtableRow,
  profile: OolitePublicDirectoryProfile
): AlumniAirtableRow {
  const topics = [...new Set([...row.topics, ...profile.topics])]
  const themes = [...new Set([...row.themes, ...profile.themes])]
  const additionalImageUrls = [
    ...new Set([
      ...(row.additionalImageUrls ?? []),
      ...profile.additionalImageUrls,
    ]),
  ]

  return {
    ...row,
    ...(profile.publicBio ? { publicBio: profile.publicBio } : {}),
    ...(profile.shortAiSummary ? { shortAiSummary: profile.shortAiSummary } : {}),
    ...(profile.featuredImageUrl
      ? { featuredImageUrl: profile.featuredImageUrl, photoUrl: profile.featuredImageUrl }
      : {}),
    ...(profile.portraitVerticalUrl
      ? { portraitVerticalUrl: profile.portraitVerticalUrl }
      : {}),
    ...(profile.portraitLandscapeUrl
      ? { portraitLandscapeUrl: profile.portraitLandscapeUrl }
      : {}),
    ...(additionalImageUrls.length ? { additionalImageUrls } : {}),
    ...(profile.primaryMedium ? { medium: profile.primaryMedium } : {}),
    ...(profile.studioNumber ? { studioNumber: profile.studioNumber } : {}),
    ...(profile.residencyCategory ? { program: profile.residencyCategory } : {}),
    ...(profile.residencyProgram && !profile.residencyCategory
      ? { program: profile.residencyProgram }
      : {}),
    ...(profile.websiteUrl ? { website: profile.websiteUrl } : {}),
    ...(profile.imageAltText ? { imageAltText: profile.imageAltText } : {}),
    topics,
    themes,
    publicDirectoryRecordId: profile.recordId,
  }
}

export function enrichAlumniWithPublicDirectory(
  alumni: EnrichedAlumniRow[],
  profiles: OolitePublicDirectoryProfile[],
  mode: MemoryAgentMode
): EnrichedAlumniRow[] {
  const byName = new Map<string, OolitePublicDirectoryProfile>()
  const byKey = new Map<string, OolitePublicDirectoryProfile>()
  for (const profile of profiles) {
    byName.set(normalizeDirectoryPersonName(profile.displayName), profile)
    byKey.set(profile.nameKey.trim().toLowerCase(), profile)
  }

  return alumni.map((row) => {
    const key = normalizeDirectoryPersonName(alumniDisplayName(row))
    const profile = byName.get(key) || byKey.get(key)
    if (!profile || !publicDirectoryProfilePassesGovernance(profile, mode)) {
      return row
    }
    return mergeProfileIntoAlumni(row, profile)
  })
}

export function alumniRowFromPublicProfile(
  profile: OolitePublicDirectoryProfile
): AlumniAirtableRow {
  return {
    id: profile.recordId,
    name: profile.displayName,
    photoUrl: profile.featuredImageUrl,
    featuredImageUrl: profile.featuredImageUrl,
    portraitVerticalUrl: profile.portraitVerticalUrl,
    portraitLandscapeUrl: profile.portraitLandscapeUrl,
    additionalImageUrls: profile.additionalImageUrls,
    publicBio: profile.publicBio,
    shortAiSummary: profile.shortAiSummary,
    medium: profile.primaryMedium,
    studioNumber: profile.studioNumber,
    program: profile.residencyCategory ?? profile.residencyProgram,
    residencyYear: profile.residencyCategory?.match(/\d{4}/)?.[0],
    year: profile.residencyCategory?.match(/\d{4}/)?.[0],
    website: profile.websiteUrl,
    imageAltText: profile.imageAltText,
    topics: profile.topics,
    themes: profile.themes,
    publicDirectoryRecordId: profile.recordId,
    approvedForPublicAi: profile.publiclyApproved,
    doNotUseInAi: profile.doNotUseInAi,
  }
}

/** Add approved public-directory profiles missing from the staging People table. */
export function mergePublicDirectoryOnlyProfiles(
  alumni: EnrichedAlumniRow[],
  profiles: OolitePublicDirectoryProfile[],
  mode: MemoryAgentMode
): EnrichedAlumniRow[] {
  const existingNames = new Set(
    alumni.map((row) => normalizeDirectoryPersonName(alumniDisplayName(row)))
  )
  const extra: EnrichedAlumniRow[] = []
  for (const profile of profiles) {
    if (!publicDirectoryProfilePassesGovernance(profile, mode)) continue
    const key = normalizeDirectoryPersonName(profile.displayName)
    if (existingNames.has(key)) continue
    extra.push(alumniRowFromPublicProfile(profile))
  }
  return extra.length ? [...alumni, ...extra] : alumni
}
