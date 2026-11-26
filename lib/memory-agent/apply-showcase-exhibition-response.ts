import {
  matchExhibitionShowcaseQuestion,
} from '@/lib/oolite/showcase-exhibitions'
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

export function applyShowcaseExhibitionResponse(args: {
  orgSlug: string
  question: string
  result: MemoryAgentAskResult
}): MemoryAgentAskResult {
  const slug = args.orgSlug.trim().toLowerCase()
  if (slug === 'oolite') {
    return applyOoliteExhibitionShowcase(args.question, args.result)
  }
  return args.result
}
