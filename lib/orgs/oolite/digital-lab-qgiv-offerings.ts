/**
 * Canonical QGiv (Bloomerang) booking URLs for Oolite Arts Digital Lab.
 * Use for workshops, consulting, and studio visits — Infra24 promotes; QGiv converts.
 */

import { normalizeSuggestedQuestionKey } from '@/lib/memory-agent/normalize-suggested-question-key'

export const DIGITAL_LAB_QGIV_HUB_URL = 'https://secure.qgiv.com/for/digitallab/' as const

export type DigitalLabOfferingKind = 'workshop' | 'consulting' | 'visit'

export type DigitalLabOffering = {
  key: string
  title: string
  kind: DigitalLabOfferingKind
  bookUrl: string
  shortLabel?: string
  description?: string
  /** Workshop catalog slug(s) that map to this offering */
  workshopSlugs?: string[]
}

export const DIGITAL_LAB_QGIV_OFFERINGS: DigitalLabOffering[] = [
  {
    key: 'vibe-coding-workshop',
    title: 'Vibe Coding & Net Art: Code Art into HTML Workshop',
    shortLabel: 'Vibe Coding & Net Art',
    kind: 'workshop',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/may26/',
    description: 'One-day community workshop — creative coding and net art in HTML.',
    workshopSlugs: [
      'vibe-coding-and-net-art',
      'vibe-coding-net-art',
      'vibe-coding-net-art-spring-2026',
    ],
  },
  {
    key: 'artist-website-beginners',
    title: 'Artist Website for Beginners Workshop',
    shortLabel: 'Artist Website for Beginners',
    kind: 'workshop',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/beginners/',
    description: 'Foundational workshop for building a clear artist website.',
  },
  {
    key: 'inkjet-printer-consulting',
    title: 'Ink Jet Printer Consulting',
    kind: 'consulting',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/inkjet-printer-consulting/',
    description: 'Technical guidance for inkjet printing workflows and equipment.',
  },
  {
    key: 'website-audit-consulting',
    title: 'Website Audit Consulting',
    kind: 'consulting',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/website-audit-consulting/',
    description: 'Review your artist site structure, content, and publishing plan.',
  },
  {
    key: 'seo-audit-consulting',
    title: 'SEO Audit Consulting',
    kind: 'consulting',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/seo-audit-consulting/',
    description: 'Discoverability review for artists and small cultural organizations.',
  },
  {
    key: '3d-printing-consulting',
    title: '3D Printing Consulting',
    kind: 'consulting',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/3d-printing-consulting/',
    description: 'File prep, materials, and production guidance for 3D printing.',
  },
  {
    key: 'fabric-printer-consulting',
    title: 'Fabric Printer Consulting',
    kind: 'consulting',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/fabric-printer-consulting/',
    description: 'Consultation for textile and fabric printing workflows.',
  },
  {
    key: 'vibe-coding-consulting',
    title: 'Vibe Coding Consulting',
    kind: 'consulting',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/vibe-coding-consulting/',
    description: '1:1 creative coding and net art project support.',
  },
  {
    key: 'vr-consulting',
    title: 'VR Consulting',
    kind: 'consulting',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/vr-consulting/',
    description: 'Virtual reality production and prototyping guidance.',
  },
  {
    key: '360-capture',
    title: '360 Capture',
    kind: 'consulting',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/360-capture/',
    description: '360° capture and immersive documentation sessions.',
  },
  {
    key: 'studio-visit-in-person',
    title: '1:1 Studio Visit',
    shortLabel: 'In-Person Studio Visit',
    kind: 'visit',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/1-1-studio-visit/',
    description: 'In-person studio visit at 924 Lincoln Rd., Studio 105.',
  },
  {
    key: 'studio-visit-virtual',
    title: '1:1 Virtual Studio Visit',
    shortLabel: 'Virtual Studio Visit',
    kind: 'visit',
    bookUrl: 'https://secure.qgiv.com/for/digitallab/event/1-1-virtual-studio-visit/',
    description: 'Remote consultation with Digital Lab staff.',
  },
]

const byKey = new Map(DIGITAL_LAB_QGIV_OFFERINGS.map((o) => [o.key, o]))

const workshopSlugIndex = new Map<string, DigitalLabOffering>()
for (const offering of DIGITAL_LAB_QGIV_OFFERINGS) {
  for (const slug of offering.workshopSlugs ?? []) {
    workshopSlugIndex.set(slug.toLowerCase(), offering)
  }
}

export function getDigitalLabQgivOffering(
  key: string
): DigitalLabOffering | undefined {
  return byKey.get(key)
}

export function getDigitalLabQgivOfferingsByKind(
  kind: DigitalLabOfferingKind
): DigitalLabOffering[] {
  return DIGITAL_LAB_QGIV_OFFERINGS.filter((o) => o.kind === kind)
}

/** Workshop catalog slug → QGiv event URL, or hub fallback. */
export function resolveDigitalLabQgivUrlForWorkshopSlug(
  slug: string
): string {
  const normalized = slug.trim().toLowerCase()
  return workshopSlugIndex.get(normalized)?.bookUrl ?? DIGITAL_LAB_QGIV_HUB_URL
}

/** Loose title match for agent / search routing. */
export function findDigitalLabQgivOfferingByQuery(
  query: string
): DigitalLabOffering | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return undefined
  return DIGITAL_LAB_QGIV_OFFERINGS.find((o) => {
    const hay = [o.title, o.shortLabel, o.key, ...(o.workshopSlugs ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return hay.includes(q) || q.includes(o.key.replace(/-/g, ' '))
  })
}

export const DIGITAL_LAB_OFFERING_KIND_LABELS: Record<DigitalLabOfferingKind, string> = {
  workshop: 'Workshops',
  consulting: 'Consulting',
  visit: 'Studio Visits',
}

const DIGITAL_LAB_BOOKING_RE =
  /\b(digital\s+lab|book\s+(?:a\s+)?(?:workshop|consult|consulting|ticket|session)|qgiv|vibe\s+coding\s+workshop|seo\s+audit|website\s+audit|3d\s+print|studio\s+visit|360\s+capture|vr\s+consult)\b/i

export function isDigitalLabBookingQuestion(question: string): boolean {
  return DIGITAL_LAB_BOOKING_RE.test(question.trim())
}

export function matchDigitalLabBookingQuestion(
  question: string
): { matched: true } | undefined {
  const key = normalizeSuggestedQuestionKey(question)
  if (key === 'how do i book digital lab workshops or consulting') {
    return { matched: true }
  }
  if (findDigitalLabQgivOfferingByQuery(question)) {
    return { matched: true }
  }
  if (isDigitalLabBookingQuestion(question)) {
    return { matched: true }
  }
  return undefined
}

export function resolveDigitalLabBookingSpokenAnswer(question: string): string {
  const offering = findDigitalLabQgivOfferingByQuery(question)
  if (offering) {
    return `You can book ${offering.shortLabel ?? offering.title} through our Digital Lab portal at ${offering.bookUrl}.`
  }
  return `Digital Lab workshops, consulting, and studio visits can be booked at ${DIGITAL_LAB_QGIV_HUB_URL}.`
}
