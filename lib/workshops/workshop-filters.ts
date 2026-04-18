/** Shared catalog filters for org + DCC public workshop surfaces. */

export function isAdultStudioWorkshop(w: {
  category: string
  metadata?: Record<string, unknown> | null
}): boolean {
  if (w.category === 'adult_studio_classes') return true
  const meta = w.metadata as Record<string, unknown> | null | undefined
  return meta?.program === 'adult_art_classes'
}

function normalizeCatalogTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, ' ').trim()
}

/**
 * Oolite Arts in-studio / printshop offerings that share the same org catalog as
 * Digital Lab but must not appear on DCC.miami `/workshops` when category flags
 * are missing. Extend this list as needed.
 */
const OOLITE_STUDIO_ONLY_TITLE_SNIPPETS: readonly string[] = [
  'impressionist flower painting',
  'collage as symbol',
  'draw the line',
  'drawing: the creative process',
  'figure drawing studio',
  'human figure drawing',
  'painting with acrylic or oil',
  'painting with raul',
  'painting with water-based media',
  'printshop open hours',
  'stitched memories',
  'surrealist still life',
  'the art of portrait drawing',
  'watercolor techniques',
  'zunc plate lithography',
  'zinc plate lithography',
  'foundation of screen printing',
  'foundations of screen printing',
  'foundation sof screen printing',
]

function matchesOoliteStudioOnlyTitle(title: string): boolean {
  const t = normalizeCatalogTitle(title)
  for (const s of OOLITE_STUDIO_ONLY_TITLE_SNIPPETS) {
    if (t.includes(s)) return true
  }
  if (t === 'open studio') return true
  if (t.startsWith('open studio ') || t.startsWith('open studio:')) return true
  return false
}

/**
 * Workshops hidden from the public DCC marketing catalog (`/workshops`).
 * Uses org category/metadata when set, optional per-row metadata overrides, and
 * a title blocklist for legacy rows.
 */
export function isExcludedFromDccPublicCatalog(w: {
  title: string
  category?: string | null
  metadata?: Record<string, unknown> | null
}): boolean {
  const category = w.category ?? 'general'
  if (isAdultStudioWorkshop({ category, metadata: w.metadata })) return true

  const meta = w.metadata
  if (meta?.hide_from_dcc_public_catalog === true) return true
  if (meta?.hideFromDccPublicCatalog === true) return true
  if (meta?.dcc_public_catalog === false) return true
  if (meta?.dccPublicCatalog === false) return true

  /** Opt in on the row when the title would otherwise match the legacy studio blocklist. */
  if (meta?.dcc_public_catalog === true || meta?.dccPublicCatalog === true) return false

  if (matchesOoliteStudioOnlyTitle(w.title)) return true
  return false
}
