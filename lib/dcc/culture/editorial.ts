import { editorialHref, editorialJournalCategory } from '@/lib/dcc/culture/taxonomy'
import type { EraAccentKey, EraChannelEffect } from '@/lib/era/tokens'
import type { DccEditorial } from '@/lib/dcc/culture/types'

/**
 * Journal records. Medium-agnostic: written, video, audio, or a combination.
 * Do not invent conversations, quotations, or guests.
 *
 * Longform essays use `bodyPath` MDX under `content/journal/`. Short records may
 * still use inline `body` (`\n\n` paragraphs; `## Heading` lines render as h2).
 * `bodyPath` takes precedence when present.
 * Do not invent guests for conversations; a podcast feed is not launching in this phase.
 */
export const DCC_EDITORIAL: DccEditorial[] = [
  {
    id: 'a-digital-lab-is-not-a-room-full-of-equipment',
    slug: 'a-digital-lab-is-not-a-room-full-of-equipment',
    title: 'A Digital Lab Is Not a Room Full of Equipment',
    dek: 'Buying technology is easy to see. Building access around it is much harder.',
    type: 'essay',
    publishedAt: '2026-09-11',
    author: 'Moises Sanabria',
    featured: true,
    status: 'published',
    heroImage:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1789319099/dccmiami/journal/a-digital-lab-is-not-a-room-full-of-equipment_rqhmks.png',
    heroImageAlt: 'Graphic cover for A Digital Lab Is Not a Room Full of Equipment',
    seoTitle: 'A Digital Lab Is Not a Room Full of Equipment | DCC Miami',
    seoDescription:
      'Digital access requires more than buying technology. It requires maintenance, knowledge, people, documentation, and continuity.',
    excerpt: 'Buying technology is easy to see. Building access around it is much harder.',
    topics: ['Infrastructure', 'Fabrication', 'Digital Literacy'],
    bodyPath: 'content/journal/a-digital-lab-is-not-a-room-full-of-equipment.mdx',
  },
  {
    id: 'the-artist-doesnt-need-to-learn-everything',
    slug: 'the-artist-doesnt-need-to-learn-everything',
    title: "The Artist Doesn't Need to Learn Everything",
    dek: 'Digital culture has taught artists to become their own technicians, producers, fabricators, installers, and troubleshooters. Sometimes learning the tool is the answer. Sometimes the better answer is finding the person who already knows it.',
    type: 'essay',
    publishedAt: '2026-09-12',
    author: 'Moises Sanabria',
    featured: false,
    status: 'published',
    seoTitle: "The Artist Doesn't Need to Learn Everything | DCC Miami",
    seoDescription:
      'Artists do not need to master every technical tool themselves. DCC Miami explores expertise, collaboration, technical literacy, and why access to the right person can matter as much as access to equipment.',
    excerpt:
      'Digital culture has taught artists to become their own technicians, producers, fabricators, installers, and troubleshooters. Sometimes learning the tool is the answer. Sometimes the better answer is finding the person who already knows it.',
    pullQuote:
      'Does the artist need to learn this skill, or does the project need access to this skill?',
    topics: ['Art & Technology', 'Digital Literacy', 'Fabrication'],
    bodyPath: 'content/journal/the-artist-doesnt-need-to-learn-everything.mdx',
    heroImage:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1789319100/dccmiami/journal/artist-doesnt-need-to-learn-everything_oz7ipo.png',
    heroImageAlt: "Graphic cover for The Artist Doesn't Need to Learn Everything",
    heroSlot: {
      id: '02-hero',
      ratio: '16:9',
      role: 'hero',
      title: 'An unfinished idea meets specialized knowledge',
      brief:
        'A grounded DCC-scale workspace. An artist and technical collaborator reviewing an unfinished prototype, model, sketch, or fabrication problem together — work that exists between people, not between a lone artist and a machine.',
    },
  },
  {
    id: 'miami-doesnt-have-a-digital-art-problem',
    slug: 'miami-doesnt-have-a-digital-art-problem',
    title: "Miami Doesn't Have a Digital-Art Problem. It Has an Infrastructure Problem.",
    dek: 'Miami already has artists working with software, 3D tools, AI, immersive media, fabrication, moving image, and networked culture. What often feels missing is not talent or technology, but the connective infrastructure that helps those ideas move from experiment to production, exhibition, and sustained public life.',
    type: 'essay',
    publishedAt: '2026-09-12',
    author: 'Moises Sanabria',
    featured: false,
    status: 'published',
    seoTitle:
      "Miami Doesn't Have a Digital-Art Problem. It Has an Infrastructure Problem. | DCC Miami",
    seoDescription:
      'DCC Miami explores why the future of digital culture in Miami depends less on acquiring more technology and more on connecting artists, expertise, fabrication, education, institutions, and opportunity.',
    excerpt:
      'Miami already has artists working with software, 3D tools, AI, immersive media, fabrication, moving image, and networked culture. What often feels missing is not talent or technology, but the connective infrastructure that helps those ideas move from experiment to production, exhibition, and sustained public life.',
    pullQuote: 'Uncoordinated capacity can feel a lot like scarcity.',
    topics: ['Infrastructure', 'Institutions', 'Public Space'],
    bodyPath: 'content/journal/miami-doesnt-have-a-digital-art-problem.mdx',
    heroImage:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1789319098/dccmiami/journal/miami-doesnt-have-a-digital-art-problem-it-has-an-infrastructure-problem_kz4qjt.png',
    heroImageAlt:
      "Graphic cover for Miami Doesn't Have a Digital-Art Problem. It Has an Infrastructure Problem.",
    heroSlot: {
      id: '03-hero',
      ratio: '16:9',
      role: 'hero',
      title: 'The pieces already exist',
      brief:
        'A grounded collage of real cultural capacity: an artist workstation, fabrication equipment, workshop or education, installation or exhibition, and a small Miami-specific environmental fragment. Artists, equipment, expertise, education, and institutions exist. The connections are the problem.',
    },
  },
  {
    id: 'what-does-it-cost-to-run-digital-culture',
    slug: 'what-does-it-cost-to-run-digital-culture',
    title: 'What Does It Cost to Run Digital Culture?',
    dek: 'What capacity should a cultural organization be expected to create with the resources it already has?',
    type: 'essay',
    publishedAt: '2026-09-21',
    updatedAt: '2026-09-21',
    author: 'Moises Sanabria',
    topics: ['Institutions', 'Digital Literacy', 'Infrastructure'],
    version: '0.1',
    living: true,
    featured: false,
    status: 'published',
    seoTitle: 'What Does It Cost to Run Digital Culture? | DCC Miami',
    seoDescription:
      'DCC Miami argues that digital literacy is becoming an executive competency, and that cultural organizations should own their technical decisions before they rent more tools. A living essay: methodology first, no invented operating numbers.',
    excerpt:
      'Digital literacy is becoming an executive competency. Cultural organizations that own their technical decisions can build more operational capacity than organizations that remain passive clients of enterprise technology.',
    relatedEditorialIds: [
      'a-digital-lab-is-not-a-room-full-of-equipment',
      'the-artist-doesnt-need-to-learn-everything',
      'miami-doesnt-have-a-digital-art-problem',
      'when-public-art-becomes-infrastructure',
    ],
    bodyPath: 'content/journal/what-does-it-cost-to-run-digital-culture.mdx',
    heroSlot: {
      id: 'cost-hero',
      ratio: '16:9',
      role: 'hero',
      title: 'The receipt before the dashboard',
      brief:
        'A DCC-scale working surface: notes, a laptop, a quote, a tool, no fake metrics on screen. The image should feel like accounting for capacity, not a SaaS dashboard.',
    },
    sources: [
      {
        id: 'mcn',
        title: 'Museum Computer Network',
        publisher: 'MCN',
        href: 'https://mcn.edu/',
        note: 'Cited as field context for museum technology practice, not as an endorsement of DCC’s proposals.',
      },
      {
        id: 'museweb',
        title: 'Museums and the Web',
        publisher: 'MuseWeb',
        href: 'https://museweb.net/',
        note: 'Cited as field context for museums and networked culture. Individual papers are not quoted here.',
      },
      {
        id: 'humanizing-the-digital',
        title: 'Humanizing the Digital',
        note: 'Phrase used in museum-technology discourse, including MCN convenings. The specific proceedings or publication DCC should cite has not been verified in this pass.',
        needsResearch: true,
      },
      {
        id: 'cultural-org-enterprise-tech',
        title: 'Cultural organizations as clients of enterprise technology',
        note: 'A DCC observation from practice. A systematic, citable study of cultural-sector software dependency is still needed before treating this as an external fact.',
        needsResearch: true,
      },
    ],
  },
  {
    id: 'when-public-art-becomes-infrastructure',
    slug: 'when-public-art-becomes-infrastructure',
    title: 'When Public Art Becomes Infrastructure',
    dek: 'Digital art can make a city feel alive. It can also leave the city responsible for a computer nobody remembers how to operate.',
    type: 'essay',
    publishedAt: '2026-09-21',
    author: 'Moises Sanabria',
    topics: ['Public Space', 'Infrastructure', 'Institutions'],
    featured: false,
    status: 'published',
    seoTitle: 'When Public Art Becomes Infrastructure | DCC Miami',
    seoDescription:
      'When a city commissions digital public art, it may inherit hardware, software, networks, and years of maintenance. DCC Miami argues that ambitious technological artwork requires corresponding civic technical capacity.',
    excerpt:
      'Public digital art exposes a gap between cultural commissioning and civic infrastructure. Ambitious work requires a city that can own, operate, maintain, and eventually migrate a technological system.',
    relatedEditorialIds: [
      'what-does-it-cost-to-run-digital-culture',
      'miami-doesnt-have-a-digital-art-problem',
      'a-digital-lab-is-not-a-room-full-of-equipment',
    ],
    bodyPath: 'content/journal/when-public-art-becomes-infrastructure.mdx',
    heroSlot: {
      id: 'public-art-hero',
      ratio: '16:9',
      role: 'hero',
      title: 'A public artwork that is also a small technical system',
      brief:
        'Civic scale, not a render of a glowing mega-screen. An outdoor work with visible enclosure, power, or access panel — maintenance as part of the image, not spectacle.',
    },
    sources: [
      {
        id: 'afta-percent',
        title: 'Percent for Art Ordinances',
        publisher: 'Americans for the Arts',
        href: 'https://www.americansforthearts.org/by-program/reports-and-data/legislation-policy/naappd/percent-for-art-ordinances',
        note: 'Compilation of municipal ordinance samples. Dates individual cities from that compilation, not from a reading of each city’s original ordinance text.',
      },
      {
        id: 'nasaa-percent',
        title: 'Percent for Art: A Special Type of Public Art',
        publisher: 'National Assembly of State Arts Agencies',
        href: 'https://nasaa-arts.org/wp-content/uploads/2017/09/NASAAPercentforArtPolicyBrief.pdf',
        published: '2017',
        note: 'State-level policy brief. Typical set-aside described as about 1% of construction or renovation costs; programs are not identical.',
      },
      {
        id: 'gsa-aia',
        title: 'Art in Architecture Program',
        publisher: 'U.S. General Services Administration',
        href: 'https://www.gsa.gov/real-estate/fine-arts/art-in-architecture-program',
        note: 'Federal program page: GSA reserves 0.5% of estimated construction cost for Art in Architecture commissions on qualifying federal buildings.',
      },
      {
        id: 'mdc-app',
        title: 'Art in Public Places',
        publisher: 'Miami-Dade County Department of Cultural Affairs',
        href: 'https://www.miamidadearts.com/artists/art-public-places',
        note: 'County program page: established 1973; ordinance allocating 1.5% of construction cost of new county buildings for purchase or commission of artworks.',
      },
      {
        id: 'mdc-trust',
        title: 'Art in Public Places Trust',
        publisher: 'Miami-Dade County Art in Public Places',
        href: 'https://miamidadepublicart.org/app/about/trust.page',
        note: 'Trust responsibilities include selection, maintenance, planning, public education, and curating of works acquired by the program.',
      },
      {
        id: 'paf-messages',
        title: 'Messages to the Public',
        publisher: 'Public Art Fund',
        href: 'https://www.publicartfund.org/exhibitions/view/messages-to-the-public/',
        published: '1982–1990',
        note: 'Institutional exhibition page for artist projects made for the Spectacolor board at Times Square.',
      },
      {
        id: 'tsq-midnight',
        title: 'Midnight Moment',
        publisher: 'Times Square Arts',
        href: 'https://www.timessquarenyc.org/arts/midnight-moment',
        note: 'Program page. Superlative claims (“largest,” “longest-running”) are the presenter’s language, not independently verified here.',
      },
      {
        id: 'si-tbma',
        title: 'Time-based Media & Digital Art',
        publisher: 'Smithsonian Institution',
        href: 'https://tbma.si.edu/',
        note: 'Pan-institutional working group on preservation strategies for time-based media and digital art.',
      },
      {
        id: 'guggenheim-vmi',
        title: 'The Variable Media Initiative',
        publisher: 'Solomon R. Guggenheim Museum',
        href: 'https://www.guggenheim.org/conservation/the-variable-media-initiative',
      },
      {
        id: 'variablemedia-net',
        title: 'Variable Media Network',
        publisher: 'Variable Media Network',
        href: 'https://www.variablemedia.net/e/index.html',
        note: 'Preservation strategy of identifying how works might outlast their original medium; associated with Guggenheim conservation work.',
      },
      {
        id: 'illuminate-bay',
        title: 'The Bay Lights',
        author: 'Leo Villareal',
        publisher: 'Illuminate',
        href: 'https://illuminate.org/projects/thebaylights/',
        note: 'Producer page for the Bay Bridge installation: debut 5 March 2013; original 25,000 LEDs; paused and later rebuilt.',
      },
      {
        id: 'illuminate-rebuild',
        title: 'The Bay Lights to Return Friday, March 20, 2026',
        publisher: 'Illuminate',
        href: 'https://illuminate.org/2026/02/19/the-bay-lights-to-return-friday-march-20-2026/',
        published: '2026-02-19',
        note: 'Producer announcement: complete rebuild, not a repair; engineered for wind, salt, vibration; 48,000 LEDs.',
      },
      {
        id: 'mdc-digital-maintenance',
        title: 'Miami-Dade digital public-art maintenance procedures',
        note: 'County sources confirm the Trust’s maintenance responsibility for the collection. A digital-specific operating protocol, ten-year cost model, or credential policy has not been verified in this pass.',
        needsResearch: true,
      },
    ],
  },
]

export function isPublishedEditorial(entry: DccEditorial): boolean {
  return (entry.status ?? 'published') === 'published'
}

function compareEditorialDateDesc(a: DccEditorial, b: DccEditorial): number {
  const da = a.publishedAt ?? ''
  const db = b.publishedAt ?? ''
  if (da === db) return 0
  return db.localeCompare(da)
}

export function listEditorial(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return editorial.filter(isPublishedEditorial).slice().sort(compareEditorialDateDesc)
}

export function listFeaturedEditorial(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return listEditorial(editorial).filter((entry) => entry.featured)
}

export function listEditorialByType(
  type: DccEditorial['type'],
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return listEditorial(editorial).filter((entry) => entry.type === type)
}

export function getEditorialById(
  id: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  return editorial.find((entry) => entry.id === id)
}

export function getEditorialBySlug(
  slug: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  return editorial.find((entry) => entry.slug === slug)
}

export function getPublishedEditorialBySlug(
  slug: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  const entry = getEditorialBySlug(slug, editorial)
  if (!entry || !isPublishedEditorial(entry)) return undefined
  return entry
}

export function getEditorialPublicPath(entry: DccEditorial): string {
  return editorialHref(editorialJournalCategory(entry.type), entry.slug)
}

export function getRelatedEditorial(
  entry: DccEditorial,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return (entry.relatedEditorialIds ?? [])
    .map((id) => getEditorialById(id, editorial))
    .filter((related): related is DccEditorial =>
      Boolean(related && isPublishedEditorial(related))
    )
}

/**
 * Opening editorial sequence on `/journal`.
 * Artist → institution → city. Cost is the current lead because it states the
 * institutional thesis most directly. Studio and network remain scales of inquiry,
 * not empty sections.
 */
export const JOURNAL_OPENING_SEQUENCE = [
  {
    id: 'a-digital-lab-is-not-a-room-full-of-equipment',
    n: '01',
    scale: 'Artist',
    question:
      'What artists need is not simply access to machines, but access to capability.',
  },
  {
    id: 'what-does-it-cost-to-run-digital-culture',
    n: '02',
    scale: 'Institution',
    lead: true,
    question:
      'What happens when technical literacy becomes part of cultural leadership and institutional capacity?',
  },
  {
    id: 'when-public-art-becomes-infrastructure',
    n: '03',
    scale: 'City',
    question:
      'What does a city inherit when an artwork is also a technological system?',
  },
] as const

export type JournalOpeningSequenceItem = (typeof JOURNAL_OPENING_SEQUENCE)[number]

/**
 * Publication reading order for essay prev/next — not `publishedAt`.
 * Opening sequence first (artist → institution → city), then the archive.
 */
export const JOURNAL_READING_ORDER = [
  'a-digital-lab-is-not-a-room-full-of-equipment',
  'what-does-it-cost-to-run-digital-culture',
  'when-public-art-becomes-infrastructure',
  'the-artist-doesnt-need-to-learn-everything',
  'miami-doesnt-have-a-digital-art-problem',
] as const

export type JournalHeroEffectName = Extract<
  EraChannelEffect,
  'mesh-field' | 'particle-dispatch' | 'city-scan'
>

const JOURNAL_HERO_EFFECT_BY_SCALE: Record<
  JournalOpeningSequenceItem['scale'],
  JournalHeroEffectName
> = {
  Artist: 'mesh-field',
  Institution: 'particle-dispatch',
  City: 'city-scan',
}

const JOURNAL_HERO_ACCENT_BY_SCALE: Record<
  JournalOpeningSequenceItem['scale'],
  EraAccentKey
> = {
  Artist: 'network',
  Institution: 'workshops',
  City: 'publicCorridor',
}

export function journalSequenceItemFor(
  id: string
): JournalOpeningSequenceItem | undefined {
  return JOURNAL_OPENING_SEQUENCE.find((item) => item.id === id)
}

/** One WebGL/SVG effect per empty hero. Covers are never overlaid. */
export function journalHeroEffectForEntry(
  entry: DccEditorial
): JournalHeroEffectName | null {
  if (entry.heroImage) return null
  const sequence = journalSequenceItemFor(entry.id)
  if (!sequence) return null
  return JOURNAL_HERO_EFFECT_BY_SCALE[sequence.scale]
}

export function journalHeroAccentForEntry(entry: DccEditorial): EraAccentKey {
  const sequence = journalSequenceItemFor(entry.id)
  if (!sequence) return 'workshops'
  return JOURNAL_HERO_ACCENT_BY_SCALE[sequence.scale]
}

export type JournalAdjacent = {
  prev: DccEditorial | null
  next: DccEditorial | null
  sequenceItem: JournalOpeningSequenceItem | null
}

export function listJournalReadingOrder(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return JOURNAL_READING_ORDER.flatMap((id) => {
    const entry = getEditorialById(id, editorial)
    if (!entry || !isPublishedEditorial(entry)) return []
    return [entry]
  })
}

export function listJournalAdjacent(
  entry: DccEditorial,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): JournalAdjacent {
  const ordered = listJournalReadingOrder(editorial)
  const index = ordered.findIndex((item) => item.id === entry.id)
  return {
    prev: index > 0 ? ordered[index - 1]! : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1]! : null,
    sequenceItem: journalSequenceItemFor(entry.id) ?? null,
  }
}

/** Public index only lists rooms that have records, plus Conversations (empty on purpose). */
export const JOURNAL_INDEX_SECTION_ORDER = ['essays', 'conversations'] as const

export function listJournalOpeningSequence(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): Array<JournalOpeningSequenceItem & { entry: DccEditorial }> {
  return JOURNAL_OPENING_SEQUENCE.flatMap((item) => {
    const entry = getEditorialById(item.id, editorial)
    if (!entry || !isPublishedEditorial(entry)) return []
    return [{ ...item, entry }]
  })
}

export function listJournalArchive(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  const opening = new Set<string>(JOURNAL_OPENING_SEQUENCE.map((item) => item.id))
  return listEditorial(editorial).filter(
    (entry) => entry.type === 'essay' && !opening.has(entry.id)
  )
}

export function listEditorialForJournalCategory(
  category: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return listEditorial(editorial).filter(
    (entry) => editorialJournalCategory(entry.type) === category
  )
}

export function listJournalIndexSectionSlugs(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): string[] {
  const occupied = new Set(
    listEditorial(editorial).map((entry) => editorialJournalCategory(entry.type))
  )
  return JOURNAL_INDEX_SECTION_ORDER.filter(
    (slug) => slug === 'conversations' || occupied.has(slug)
  )
}

export function assertEditorialSlugsValid(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const entry of editorial) {
    if (!entry.id) errors.push('editorial missing id')
    if (!entry.slug) errors.push(`editorial ${entry.id} missing slug`)
    if (ids.has(entry.id)) errors.push(`duplicate editorial id ${entry.id}`)
    if (slugs.has(entry.slug)) errors.push(`duplicate editorial slug ${entry.slug}`)
    ids.add(entry.id)
    slugs.add(entry.slug)
  }
  return errors
}
