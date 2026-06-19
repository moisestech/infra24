import {
  matchExhibitionShowcaseQuestion,
} from '@/lib/oolite/showcase-exhibitions'
import {
  edgeZonesExhibitionArtistProfiles,
  edgeZonesExhibitionCuratorProfile,
  matchEdgeZonesExhibitionQuestion,
} from '@/lib/marketing/edgezones-exhibition'
import type {
  MemoryAgentArtistCard,
  MemoryAgentAskResult,
  MemoryAgentEventCard,
} from '@/types/memory-agent'

function applyOoliteExhibitionShowcase(
  question: string,
  result: MemoryAgentAskResult
): MemoryAgentAskResult {
  const exhibition = matchExhibitionShowcaseQuestion(question)
  if (!exhibition) return result

  const event: MemoryAgentEventCard = {
    id: `showcase_exhibition_${exhibition.key}`,
    title: exhibition.title,
    summary: exhibition.spokenAnswer,
    location: exhibition.location,
    startsAt: exhibition.dates,
    ctaLabel: 'Learn more',
    ctaUrl: 'https://oolitearts.org',
    recordKind: 'exhibition',
    source: 'cms_story',
    sourceRecordId: exhibition.key,
    bookable: false,
    allowPublicActions: true,
    publicSafe: true,
  }

  const card: MemoryAgentArtistCard = {
    id: `showcase_exhibition_${exhibition.key}`,
    name: exhibition.title,
    program: 'Exhibition',
    reason: 'Youth Artist Residents at the Oolite Arts Vitrine.',
    confidence: 'high',
    photoUrl: exhibition.galleryImages[0]?.url,
    galleryImages: exhibition.galleryImages,
    galleryImageUrls: exhibition.galleryImages.map((g) => g.url),
    bioSnippet: exhibition.spokenAnswer,
  }

  return {
    ...result,
    answer: exhibition.displayAnswer,
    spokenAnswer: exhibition.spokenAnswer,
    artists: [card],
    events: [event],
    followUps: exhibition.followUps,
    dataGaps: [],
  }
}

function applyDccExhibitionShowcase(
  question: string,
  result: MemoryAgentAskResult
): MemoryAgentAskResult {
  const exhibition = matchEdgeZonesExhibitionQuestion(question)
  if (!exhibition) return result

  const event: MemoryAgentEventCard = {
    id: `showcase_exhibition_${exhibition.key}`,
    title: exhibition.title,
    recordKind: 'exhibition',
    summary: exhibition.spokenAnswer,
    location: exhibition.location,
    startsAt: exhibition.dates,
    ctaLabel: 'View exhibition',
    ctaUrl: exhibition.ctaUrl,
    publicUrl: exhibition.ctaUrl,
    imageUrl: exhibition.partnershipImages.host.url.startsWith('http')
      ? exhibition.partnershipImages.host.url
      : undefined,
    curator: exhibition.curator,
    featuredArtists: exhibition.artistNames.join('; '),
    source: 'cms_story',
    sourceRecordId: exhibition.key,
    bookable: false,
    allowPublicActions: true,
    publicSafe: true,
  }

  const curatorProfile = edgeZonesExhibitionCuratorProfile()
  const artistCards: MemoryAgentArtistCard[] = edgeZonesExhibitionArtistProfiles().map((profile) => ({
    id: profile.id,
    name: profile.name,
    program: 'Touching Grass',
    reason: `Participating artist in ${exhibition.workingTitle}, curated by ${exhibition.curator}.`,
    confidence: 'high' as const,
    photoUrl: profile.imageUrl,
    website: profile.website,
    bioSnippet: profile.bio,
  }))

  const curatorCard: MemoryAgentArtistCard | undefined = curatorProfile
    ? {
        id: curatorProfile.id,
        name: curatorProfile.name,
        program: 'Curator',
        reason: `Curator of ${exhibition.workingTitle} at Edge Zones Gallery.`,
        confidence: 'high',
        photoUrl: curatorProfile.imageUrl,
        bioSnippet: exhibition.curatorStatementQuote,
      }
    : undefined

  const artists: MemoryAgentArtistCard[] = curatorCard
    ? [curatorCard, ...artistCards]
    : artistCards

  return {
    ...result,
    answer: exhibition.displayAnswer,
    spokenAnswer: exhibition.spokenAnswer,
    artists,
    events: [event],
    followUps: [...exhibition.followUps],
    dataGaps: [],
  }
}

export function applyShowcaseExhibitionResponse(args: {
  orgSlug: string
  question: string
  result: MemoryAgentAskResult
}): MemoryAgentAskResult {
  const slug = args.orgSlug.trim().toLowerCase()
  if (slug === 'oolite') {
    return applyOoliteExhibitionShowcase(args.question, args.result)
  }
  if (slug === 'dcc') {
    return applyDccExhibitionShowcase(args.question, args.result)
  }
  return args.result
}
