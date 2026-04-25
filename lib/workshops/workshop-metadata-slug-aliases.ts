/**
 * Legacy `metadata.slug` values that still appear in bookmarks or older DB rows.
 * Lookup APIs should try the requested slug and its canonical form.
 */
export const WORKSHOP_METADATA_SLUG_TO_CANONICAL: Record<string, string> = {
  'vibe-coding-net-art': 'vibe-coding-and-net-art',
}

export function canonicalWorkshopMarketingSlug(slug: string): string {
  return WORKSHOP_METADATA_SLUG_TO_CANONICAL[slug] ?? slug
}

/** All metadata slug values that should resolve the same workshop row. */
export function workshopMarketingSlugLookupKeys(slug: string): string[] {
  const canonical = canonicalWorkshopMarketingSlug(slug)
  const legacy = Object.entries(WORKSHOP_METADATA_SLUG_TO_CANONICAL)
    .filter(([, c]) => c === canonical)
    .map(([k]) => k)
  return [...new Set([slug, canonical, ...legacy])]
}
