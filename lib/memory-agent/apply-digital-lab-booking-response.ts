import {
  DIGITAL_LAB_QGIV_HUB_URL,
  findDigitalLabQgivOfferingByQuery,
  getDigitalLabQgivOfferingsByKind,
  matchDigitalLabBookingQuestion,
  resolveDigitalLabBookingSpokenAnswer,
} from '@/lib/orgs/oolite/digital-lab-qgiv-offerings'
import type { MemoryAgentAskResult } from '@/types/memory-agent'

function buildDigitalLabDisplayAnswer(question: string): string {
  const offering = findDigitalLabQgivOfferingByQuery(question)
  if (offering) {
    return `${offering.title}\n\n${offering.description ?? ''}\n\nBook: ${offering.bookUrl}\n\nBrowse all Digital Lab offerings: ${DIGITAL_LAB_QGIV_HUB_URL}`
  }

  const sections = ['Digital Lab — book workshops, consulting, and studio visits', '', `Hub: ${DIGITAL_LAB_QGIV_HUB_URL}`, '']

  for (const kind of ['workshop', 'consulting', 'visit'] as const) {
    const items = getDigitalLabQgivOfferingsByKind(kind)
    sections.push(kind === 'workshop' ? 'Workshops' : kind === 'consulting' ? 'Consulting' : 'Studio visits')
    for (const item of items) {
      sections.push(`• ${item.shortLabel ?? item.title} — ${item.bookUrl}`)
    }
    sections.push('')
  }

  return sections.join('\n').trim()
}

export function applyDigitalLabBookingResponse(args: {
  orgSlug: string
  question: string
  result: MemoryAgentAskResult
}): MemoryAgentAskResult {
  if (args.orgSlug.trim().toLowerCase() !== 'oolite') return args.result

  const match = matchDigitalLabBookingQuestion(args.question)
  if (!match) return args.result

  const hubCard = {
    id: 'showcase_digital_lab_booking',
    name: 'Digital Lab @ 924',
    program: 'Digital Lab',
    reason: 'Workshops, consulting, and studio visits at Oolite Arts Digital Lab.',
    confidence: 'high' as const,
    website: DIGITAL_LAB_QGIV_HUB_URL,
    bioSnippet:
      'Book Vibe Coding workshops, SEO and website audits, 3D printing consulting, VR sessions, and 1:1 studio visits.',
  }

  const events = getDigitalLabQgivOfferingsByKind('workshop')
    .concat(getDigitalLabQgivOfferingsByKind('consulting').slice(0, 4))
    .map((o) => ({
      id: `digital_lab_${o.key}`,
      title: o.shortLabel ?? o.title,
      summary: o.description,
      ctaLabel: 'Book',
      ctaUrl: o.bookUrl,
    }))

  return {
    ...args.result,
    answer: buildDigitalLabDisplayAnswer(args.question),
    spokenAnswer: resolveDigitalLabBookingSpokenAnswer(args.question),
    artists: [hubCard],
    events,
    followUps: [
      'How do I book the Vibe Coding workshop?',
      'How do I book SEO or website audit consulting?',
      'What are the 2027 open calls?',
      "Tell me about Oolite's new campus in Little River.",
    ],
    dataGaps: [],
  }
}
