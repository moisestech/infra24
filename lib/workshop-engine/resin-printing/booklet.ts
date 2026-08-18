import type {
  BookletEdition,
  BookletReference,
  BookletReferenceStatus,
} from '@/lib/workshop-engine/types'

/** Logical pages that are absent from the uploaded Aug 10 export. */
export const RESIN_BOOKLET_MISSING_LOGICAL_PAGES = [10, 35] as const

/** Cover page — do not feature until independent-use wording is corrected. */
export const RESIN_BOOKLET_COVER_PAGE = 1

export const RESIN_BOOKLET_PREVIEW_BASE =
  '/workshops/resin-printing/guide-pages'

export const RESIN_BOOKLET_DOWNLOAD_HREF =
  '/workshops/resin-printing/Oolite-Arts-Resin-Printing-Guide.pdf'

/**
 * August 10, 2026 Canva export — printer-imposed spreads.
 * Keep room for a future reading-order edition without replacing this id.
 */
export const RESIN_BOOKLET_EDITION: BookletEdition = {
  id: 'oolite-resin-artist-guide',
  title: 'Oolite Arts Resin 3D Printing Artist Guide',
  editionNote:
    'August 10, 2026 Canva export: 21 physical PDF sheets with printed logical page labels 1–44 (printer-imposed spreads, not browser reading order). Logical pages 10 and 35 are missing from this upload. A reading-order PDF for the website is forthcoming. Do not confuse sheet numbers with printed logical page numbers.',
  logicalPageCount: 44,
  pdfSheetCount: 21,
  missingLogicalPages: [...RESIN_BOOKLET_MISSING_LOGICAL_PAGES],
  format: 'printer-spreads',
  pagesVerified: true,
  previewBaseHref: RESIN_BOOKLET_PREVIEW_BASE,
  downloadHref: RESIN_BOOKLET_DOWNLOAD_HREF,
}

/** Reserved id slot for a future browser reading-order edition. */
export const RESIN_BOOKLET_READING_ORDER_EDITION_ID =
  'oolite-resin-artist-guide-reading-order'

export const RESIN_BOOKLET_ID = RESIN_BOOKLET_EDITION.id

/** Verified logical-page titles from the Aug 10 handoff inventory. */
export const RESIN_BOOKLET_PAGE_TITLES: Record<number, string> = {
  1: 'Cover',
  2: 'Index',
  3: 'From 3D Model to Resin Print',
  4: 'Understanding the Slicer',
  5: 'What a Slicer Does',
  6: 'File Types Demystified',
  7: 'Core Slicer Tools',
  8: 'From Model File to Printer File',
  9: 'Two Workflows at Oolite',
  11: 'Slicer Trade-Offs',
  12: 'FAQ, Videos & Communities — slicers',
  13: 'Is Your Model Ready to Print?',
  14: 'What Watertight Means',
  15: 'Know the Mono M7 Build Volume',
  16: 'File Readiness',
  17: 'Estimate Resin Before You Print',
  18: 'Scale and Units',
  19: 'Oolite Cost-Recovery Policy',
  20: 'Orientation, Supports, and Hollowing',
  21: 'Orientation: The Angle Matters',
  22: 'Supports: What They Actually Do',
  23: 'Light, Medium, and Heavy Supports',
  24: 'Too Few vs Too Many Supports',
  25: 'Large Flat Surfaces Can Fail',
  26: 'Hollowing: Save Resin Carefully',
  27: 'Drain Holes Are Not Optional',
  28: 'FAQ, Videos & Communities — modeling/supports',
  29: 'Resin, Color, Safety, and Cleanup',
  30: 'How Resin Color Works',
  31: 'Oolite Standard Gray Resin',
  32: 'Bringing Your Own Resin',
  33: 'Print → Wash → Cure',
  34: 'Cured vs Uncured',
  36: 'Waste Streams and Storage',
  37: 'FAQ, Videos & Communities — resin/cleanup',
  38: 'Access, Scheduling, and Documentation',
  39: "Oolite's Resin 3D Printing Workflow",
  40: 'Appointments',
  41: 'File Organization',
  42: 'Final Preflight Checklist',
  43: 'Ready to Print? Start Here.',
  44: 'Back cover / contacts / inside-guide recap',
}

export function isMissingLogicalPage(page: number): boolean {
  return (RESIN_BOOKLET_MISSING_LOGICAL_PAGES as readonly number[]).includes(
    page
  )
}

export function formatLogicalPageLabel(
  startPage?: number,
  endPage?: number
): string | null {
  if (typeof startPage !== 'number') return null
  if (typeof endPage === 'number' && endPage !== startPage) {
    return `pp. ${startPage}–${endPage}`
  }
  return `p. ${startPage}`
}

export function guidePagePreviewHref(page: number): string | undefined {
  if (isMissingLogicalPage(page)) return undefined
  if (page < 1 || page > RESIN_BOOKLET_EDITION.logicalPageCount) return undefined
  const nn = String(page).padStart(2, '0')
  return `${RESIN_BOOKLET_PREVIEW_BASE}/page-${nn}.jpg`
}

/**
 * Build a booklet reference. Never emits preview hrefs for missing pages 10/35.
 * Cover (p.1) may be referenced as related/note but is not featured for participants.
 */
export function resinBookletRef(input: {
  sectionTitle: string
  startPage?: number
  endPage?: number
  status: BookletReferenceStatus
  note?: string
}): BookletReference {
  const { sectionTitle, startPage, endPage, status, note } = input
  const pages = [startPage, endPage].filter(
    (p): p is number => typeof p === 'number'
  )
  if (pages.some(isMissingLogicalPage)) {
    return {
      bookletId: RESIN_BOOKLET_ID,
      sectionTitle,
      startPage,
      endPage,
      status: 'missing',
      note:
        note ??
        'This logical page is missing from the uploaded print-spread export.',
    }
  }

  const previewPage = startPage
  return {
    bookletId: RESIN_BOOKLET_ID,
    sectionTitle,
    startPage,
    endPage,
    status,
    note,
    pagePreviewHref:
      typeof previewPage === 'number'
        ? guidePagePreviewHref(previewPage)
        : undefined,
  }
}

/** Accessible open-link label for a booklet reference. */
export function bookletReferenceAriaLabel(ref: BookletReference): string {
  const pages = formatLogicalPageLabel(ref.startPage, ref.endPage)
  if (pages) return `Open ${ref.sectionTitle}, booklet ${pages}`
  return `Open ${ref.sectionTitle}`
}

/**
 * Participant download for the print-spread edition.
 * Spreads are not reliable `#page=` targets for logical labels.
 */
export function bookletDownloadHref(): string {
  return RESIN_BOOKLET_EDITION.downloadHref ?? RESIN_BOOKLET_DOWNLOAD_HREF
}
