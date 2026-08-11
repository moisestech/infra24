import type { BookletEdition } from '@/lib/workshop-engine/types'

/**
 * Canonical resin booklet for the pilot.
 * Jun10 Canva export is a 22-sheet PDF with printed page labels Cover=1 … Back=44 (spread booklet).
 * Exact section→page mapping remains pending until verified page-by-page.
 */
export const RESIN_BOOKLET_EDITION: BookletEdition = {
  id: 'oolite-resin-artist-guide',
  title: 'Oolite Arts Resin 3D Printing Artist Guide',
  editionNote:
    'Jun10 Canva booklet (ResinPrinter-Booklet-Version-Jun10th-TEST.pdf): 22 PDF sheets / 44 labeled booklet pages (Front Cover 1 … Back Cover 44). Exact module page ranges are not verified yet.',
  pageCount: 44,
  pagesVerified: false,
}

export const RESIN_BOOKLET_ID = RESIN_BOOKLET_EDITION.id
