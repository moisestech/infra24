/**
 * Drop-in media convention for cultural records.
 *
 * Local (gitignored public/ — force-add when real):
 *   public/dcc/culture/artists/{slug}/portrait.webp
 *   public/dcc/culture/artists/{slug}/hero.webp
 *   public/dcc/culture/programs/{slug}/hero.webp
 *   public/dcc/culture/editorial/{slug}/hero.webp
 *   public/dcc/culture/projects/{slug}/hero.webp
 *
 * Cloudinary (when uploaded):
 *   dccmiami/artists/{slug}/
 *   dccmiami/programs/{slug}/
 *   dccmiami/journal/{slug}/
 *
 * Pages read portrait / heroImage on the record. Empty image → honest fallback.
 * Do not generate fake artist portraits or fair installation photos.
 * Hover / scale motion is gated: only when a src is present.
 */

export const CULTURE_MEDIA_DROP = '/dcc/culture'

/** Cards and frames stay still until a real image URL exists. */
export function cultureMediaMotionEnabled(src?: string): boolean {
  return Boolean(src?.trim())
}

export function cultureArtistPortraitSrc(slug: string): string {
  return `${CULTURE_MEDIA_DROP}/artists/${slug}/portrait.webp`
}

export function cultureArtistHeroSrc(slug: string): string {
  return `${CULTURE_MEDIA_DROP}/artists/${slug}/hero.webp`
}

export function cultureProgramHeroSrc(slug: string): string {
  return `${CULTURE_MEDIA_DROP}/programs/${slug}/hero.webp`
}

export function cultureEditorialHeroSrc(slug: string): string {
  return `${CULTURE_MEDIA_DROP}/editorial/${slug}/hero.webp`
}

export function cultureProjectHeroSrc(slug: string): string {
  return `${CULTURE_MEDIA_DROP}/projects/${slug}/hero.webp`
}
