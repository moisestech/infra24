import type { WorkshopTrackId } from '@/lib/workshops/track-labels'

/** Section headings and microcopy for the DCC `/workshops` catalog surface. */
export const dccWorkshopsCatalogUi = {
  programsSectionTitle: 'All Digital Art Programs',
  coursesHeading: 'Digital Art Courses',
  coursesSubcopy:
    'Short-form sessions for digital art careers — presence, literacy, creative tooling, and sustainable archives.',
  searchPlaceholder: 'Search workshops…',
  sortLabel: 'Sort by',
  sortOptions: [
    { value: 'popular', label: 'Most popular' },
    { value: 'rated', label: 'Highest rated' },
    { value: 'recent', label: 'Recently updated' },
    { value: 'featured', label: 'Featured picks' },
  ] as const,
  paginationSummary: (from: number, to: number, total: number) =>
    `Showing ${from}–${to} of ${total} workshop${total === 1 ? '' : 's'}`,
  accordion: {
    focusAreasTitle: 'Focus areas',
    priceTitle: 'Price',
    formatTitle: 'Format',
    skillsTitle: 'Skills',
    levelTitle: 'Level',
    durationTitle: 'Duration',
    clearFilters: 'Clear filters',
    noSkillsCopy: 'Add tags in workshop metadata to enable skill filters.',
  },
  durationBuckets: [
    { id: 'lt20' as const, label: 'Under 20 hours' },
    { id: '20to60' as const, label: '20 – 60 hours' },
    { id: 'gt60' as const, label: 'Over 60 hours' },
  ],
  priceOptions: [
    { id: 'free' as const, label: 'Free' },
    { id: 'paid' as const, label: 'Paid' },
  ],
  levelOptions: [
    { id: 'beginner' as const, label: 'Beginner' },
    { id: 'intermediate' as const, label: 'Intermediate' },
    { id: 'advanced' as const, label: 'Advanced' },
  ],
} as const

/** Digital-art-careers-friendly labels for roadmap tracks (metadata.track). */
export const dccCatalogTrackDisplay: Record<WorkshopTrackId, string> = {
  presence: 'Websites & discoverability',
  ai_literacy: 'AI literacy for creative practice',
  creative_coding: 'Creative coding & net art',
  systems_archive: 'Systems, docs & archives',
}

export const dccCatalogFormatDisplay: Record<
  'in_person' | 'online' | 'hybrid' | 'async_resources',
  string
> = {
  in_person: 'In person',
  online: 'Online',
  hybrid: 'Hybrid',
  async_resources: 'Async / resources',
}

export type DccPromotedProgramSlide = {
  title: string
  description: string
  imageUrl?: string
  learnMoreHref: string
  viewProgramHref: string
}

/** Curated carousel slides; swap hrefs for real workshop slugs when ready. */
export const dccWorkshopsPromotedProgramSlides: DccPromotedProgramSlide[] = [
  {
    title: 'Build a public-ready web presence',
    description:
      'Templates and language for artist sites, bios, and discoverability — designed for digital art careers in Miami.',
    learnMoreHref: '/workshops',
    viewProgramHref: '/programs/workshops',
  },
  {
    title: 'AI literacy without losing your voice',
    description:
      'Practical workflows for documentation, experimentation, and accountable use of creative tools.',
    learnMoreHref: '/programs/workshops/ai-literacy-for-artists',
    viewProgramHref: '/programs',
  },
  {
    title: 'Partner with DCC on cohorts',
    description:
      'Institutional pathways for residencies, teaching artists, and public programs.',
    learnMoreHref: '/contact',
    viewProgramHref: '/partners',
  },
]
