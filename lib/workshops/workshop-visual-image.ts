import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

const VIBE_BANNER_WEBP =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1776612065/vibe-code-and-net-art_mx7emv.webp'

function isVibeCodingWorkshopSlug(slug: string | undefined): boolean {
  return slug === 'vibe-coding-and-net-art' || slug === 'vibe-coding-net-art'
}

/**
 * Wide workshop banner: catalog `headerImageUrl` wins, then canonical vibe asset, then DB `image_url`, then gallery.
 * Use this for `WorkshopHero` so marketing YAML controls the hero even when `image_url` is an older square crop.
 */
export function resolveWorkshopHeroBannerImageUrl(
  workshop: { image_url?: string | null },
  marketing: WorkshopMarketingMetadata
): string | undefined {
  const header =
    typeof marketing.headerImageUrl === 'string' ? marketing.headerImageUrl.trim() : ''
  if (header) return header
  if (isVibeCodingWorkshopSlug(marketing.slug)) return VIBE_BANNER_WEBP
  const row = typeof workshop.image_url === 'string' ? workshop.image_url.trim() : ''
  if (row) return row
  const first = marketing.galleryImageUrls?.find((u) => typeof u === 'string' && u.trim())
  return first?.trim()
}

/**
 * Cards / related rows: DB `image_url`, then `headerImageUrl`, then gallery.
 */
export function resolveWorkshopHeroImageUrl(
  workshop: { image_url?: string | null },
  marketing: WorkshopMarketingMetadata
): string | undefined {
  const row = typeof workshop.image_url === 'string' ? workshop.image_url.trim() : ''
  if (row) return row
  const header =
    typeof marketing.headerImageUrl === 'string' ? marketing.headerImageUrl.trim() : ''
  if (header) return header
  if (isVibeCodingWorkshopSlug(marketing.slug)) return VIBE_BANNER_WEBP
  const first = marketing.galleryImageUrls?.find((u) => typeof u === 'string' && u.trim())
  return first?.trim()
}

/** Gallery strip below the hero: omit URLs identical to the resolved hero to avoid duplicates. */
export function workshopGalleryThumbsExcludingHero(
  marketing: WorkshopMarketingMetadata,
  heroUrl?: string | null
): string[] {
  const urls = marketing.galleryImageUrls ?? []
  if (!heroUrl?.trim()) return urls
  const h = heroUrl.trim()
  return urls.filter((u) => typeof u === 'string' && u.trim() && u.trim() !== h)
}
