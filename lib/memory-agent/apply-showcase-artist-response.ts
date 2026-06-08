import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { alumniDisplayName } from '@/lib/airtable/alumni-service'
import { alumniRowFromPublicProfile } from '@/lib/oolite/enrich-alumni-public-directory'
import { alumniImageForContext } from '@/lib/airtable/alumni-images'
import { normalizeDirectoryPersonName } from '@/lib/organization/artist-alumni-bridge'
import {
  buildShowcaseDisplayAnswer,
  galleryImagesForShowcase,
  matchShowcaseArtistQuestion,
  type ShowcaseArtistConfig,
} from '@/lib/oolite/showcase-artists'
import type { OolitePublicDirectoryProfile } from '@/lib/oolite/public-directory-profiles'
import type { MemoryAgentArtistCard, MemoryAgentAskResult } from '@/types/memory-agent'

function findAlumniRowForShowcase(
  rows: AlumniAirtableRow[],
  showcase: ShowcaseArtistConfig
): AlumniAirtableRow | undefined {
  const target = normalizeDirectoryPersonName(showcase.displayName)
  return rows.find((row) => normalizeDirectoryPersonName(alumniDisplayName(row)) === target)
}

function findPublicProfileForShowcase(
  profiles: OolitePublicDirectoryProfile[],
  showcase: ShowcaseArtistConfig
): OolitePublicDirectoryProfile | undefined {
  return (
    profiles.find((p) => p.recordId === showcase.publicDirectoryRecordId) ??
    profiles.find(
      (p) => normalizeDirectoryPersonName(p.displayName) === normalizeDirectoryPersonName(showcase.displayName)
    )
  )
}

function buildShowcaseArtistCard(
  row: AlumniAirtableRow,
  profile: OolitePublicDirectoryProfile,
  showcase: ShowcaseArtistConfig
): MemoryAgentArtistCard {
  const galleryImages = galleryImagesForShowcase(profile, showcase)
  const topics = [...new Set([...row.topics, ...profile.topics])].slice(0, 8)
  const themes = [...new Set([...row.themes, ...profile.themes])].slice(0, 8)
  const bio =
    profile.publicBio?.trim() ||
    profile.shortAiSummary?.trim() ||
    row.publicBio?.trim() ||
    row.artifacts?.trim()

  return {
    id: row.id,
    name: profile.displayName,
    reason: 'Showcase artist profile from the Oolite public directory.',
    confidence: 'high',
    photoUrl: alumniImageForContext(
      {
        featuredImageUrl: profile.featuredImageUrl ?? row.featuredImageUrl,
        portraitVerticalUrl: profile.portraitVerticalUrl ?? row.portraitVerticalUrl,
        portraitLandscapeUrl: profile.portraitLandscapeUrl ?? row.portraitLandscapeUrl,
        photoUrl: row.photoUrl,
        imageReviewStatus: row.imageReviewStatus,
      },
      'default'
    ),
    galleryImages,
    galleryImageUrls: galleryImages.map((g) => g.url),
    medium: profile.primaryMedium ?? row.medium,
    program: profile.residencyCategory ?? row.program,
    year: profile.residencyCategory?.match(/\d{4}/)?.[0] ?? row.residencyYear ?? row.year,
    studioNumber: profile.studioNumber ?? row.studioNumber,
    topics: [...topics, ...themes].slice(0, 8),
    bioSnippet: bio ? bio.slice(0, 900) : undefined,
    website: profile.websiteUrl ?? row.website,
  }
}

export function applyShowcaseArtistResponse(args: {
  orgSlug: string
  question: string
  result: MemoryAgentAskResult
  contextRows: AlumniAirtableRow[]
  publicProfiles: OolitePublicDirectoryProfile[]
}): MemoryAgentAskResult {
  if (args.orgSlug.trim().toLowerCase() !== 'oolite') return args.result

  const showcase = matchShowcaseArtistQuestion(args.question)
  if (!showcase) return args.result

  const profile = findPublicProfileForShowcase(args.publicProfiles, showcase)
  if (!profile) return args.result

  const row =
    findAlumniRowForShowcase(args.contextRows, showcase) ??
    alumniRowFromPublicProfile(profile)

  const displayAnswer = buildShowcaseDisplayAnswer(profile, showcase)
  const showcaseCard = buildShowcaseArtistCard(row, profile, showcase)

  const existingIdx = args.result.artists.findIndex((a) => a.id === row.id)
  const artists =
    existingIdx >= 0
      ? args.result.artists.map((a, i) => (i === existingIdx ? { ...a, ...showcaseCard } : a))
      : [showcaseCard, ...args.result.artists.filter((a) => a.id !== row.id)]

  return {
    ...args.result,
    answer: displayAnswer || args.result.answer,
    spokenAnswer: showcase.spokenAnswer,
    artists: artists.slice(0, 4),
    followUps: showcase.followUps,
  }
}
