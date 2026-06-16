/** Static copy for `/o/oolite/workshops/digital-lab` (Digital Lab workshop catalog). */

import { DIGITAL_LAB_QGIV_HUB_URL } from '@/lib/orgs/oolite/digital-lab-qgiv-offerings'

export const digitalLabCatalogCopy = {
  heroEyebrow: 'Oolite Arts Digital Lab',
  heroHeadline: 'Digital Lab Workshops',
  heroParagraph:
    'Artist-centered workshops exploring websites, documentation, discoverability, AI literacy, creative coding, and sustainable digital practice. Built for artists, teaching artists, and cultural organizations navigating digital work in real time.',
  heroPrimaryCta: 'Browse Workshops',
  heroSecondaryCta: 'Book a Workshop',
  heroSupportingLine:
    'A growing catalog of workshops built for public programs, artist development, and institutional learning.',
  featuredLabel: 'Featured Workshop',
  featuredTitle: 'Own Your Digital Presence',
  featuredDescription:
    'Build the structure, language, and publishing plan for a website that clearly represents your practice.',
  featuredCta: 'Explore Workshop',
  sectionIntro: 'Browse workshops by track, level, format, and readiness.',
  resultsHeading: 'All Digital Lab Workshops',
  resultsSubcopyTemplate: (n: number, tracks: number) =>
    `${n} workshop${n === 1 ? '' : 's'} across ${tracks} track${tracks === 1 ? '' : 's'}`,
  sortLabel: 'Sort by',
  filterButton: 'Filter Workshops',
  drawerTitle: 'Filter Workshops',
  drawerDescription:
    'Refine the catalog by track, level, duration, format, and readiness.',
  clearAll: 'Clear All',
  applyFilters: 'Apply Filters',
  clearAllFilters: 'Clear All Filters',
  emptyHeading: 'No workshops match these filters',
  emptyBody:
    'Try removing a few filters or browsing all workshops to explore the full Digital Lab catalog.',
  ctaExplore: 'Explore Workshop',
  ctaPreview: 'Preview Workshop',
  ctaComingSoon: 'Coming Soon',
} as const

/** Primary public booking URL for Digital Lab workshops (QGiv / Bloomerang). */
export const digitalLabBookWorkshopUrl = DIGITAL_LAB_QGIV_HUB_URL

/** @deprecated Use digitalLabBookWorkshopUrl — kept for existing imports. */
export const digitalLabBookWorkshopMailto = DIGITAL_LAB_QGIV_HUB_URL
