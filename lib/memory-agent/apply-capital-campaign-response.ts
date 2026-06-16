import {
  CAPITAL_CAMPAIGN_SHOWCASE,
  matchCapitalCampaignQuestion,
  resolveCapitalCampaignSpokenAnswer,
} from '@/lib/oolite/capital-campaign-showcase'
import type { MemoryAgentAskResult, MemoryAgentEventCard } from '@/types/memory-agent'

function buildCapitalCampaignEventCard(): MemoryAgentEventCard {
  return {
    id: `showcase_${CAPITAL_CAMPAIGN_SHOWCASE.key}`,
    title: CAPITAL_CAMPAIGN_SHOWCASE.title,
    summary:
      '26,850 sq ft Little River campus by Barozzi Veiga — studios, fabrication, classrooms, and public exhibition spaces.',
    location: CAPITAL_CAMPAIGN_SHOWCASE.location,
    ctaLabel: 'Learn more & support',
    ctaUrl: CAPITAL_CAMPAIGN_SHOWCASE.campaignUrl,
  }
}

export function applyCapitalCampaignResponse(args: {
  orgSlug: string
  question: string
  result: MemoryAgentAskResult
}): MemoryAgentAskResult {
  if (args.orgSlug.trim().toLowerCase() !== 'oolite') return args.result

  const match = matchCapitalCampaignQuestion(args.question)
  if (!match) return args.result

  const campusCard = {
    id: `showcase_${CAPITAL_CAMPAIGN_SHOWCASE.key}`,
    name: CAPITAL_CAMPAIGN_SHOWCASE.title,
    program: 'Capital Project',
    reason: 'Oolite Arts Our New Home · Little River campus.',
    confidence: 'high' as const,
    photoUrl: CAPITAL_CAMPAIGN_SHOWCASE.galleryImages[0]?.url,
    galleryImages: CAPITAL_CAMPAIGN_SHOWCASE.galleryImages,
    galleryImageUrls: CAPITAL_CAMPAIGN_SHOWCASE.galleryImages.map((g) => g.url),
    website: CAPITAL_CAMPAIGN_SHOWCASE.campaignUrl,
    bioSnippet:
      'A 26,850-square-foot artist village in Little River designed by Barozzi Veiga — LEED-targeted, with 24 studios, fabrication, and classrooms for 400+ annual classes.',
  }

  return {
    ...args.result,
    answer: CAPITAL_CAMPAIGN_SHOWCASE.displayAnswer,
    spokenAnswer: resolveCapitalCampaignSpokenAnswer(args.question),
    artists: [campusCard],
    events: [buildCapitalCampaignEventCard()],
    followUps: CAPITAL_CAMPAIGN_SHOWCASE.followUps,
    dataGaps: [],
  }
}
