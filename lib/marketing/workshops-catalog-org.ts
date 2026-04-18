/**
 * Supabase `organizations.slug` whose published workshops populate `/workshops` on DCC.miami.
 * Set `NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG` in production to the org that actually owns the catalog rows (`workshops.status = 'published'`).
 */
export const WORKSHOP_CATALOG_ORG_SLUG =
  process.env.NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG || 'oolite'
