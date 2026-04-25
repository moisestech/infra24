import { canonicalWorkshopMarketingSlug } from '@/lib/workshops/workshop-metadata-slug-aliases'

/** Catalog slugs with on-disk public chapters under `content/workshops/<slug>/chapters`. */
export const WORKSHOP_SLUGS_PUBLIC_MARKDOWN_CHAPTERS = ['vibe-coding-and-net-art'] as const

const FIRST_PUBLIC_CHAPTER_SLUG_BY_WORKSHOP: Record<string, string> = {
  'vibe-coding-and-net-art': 'net-art-primer',
}

/** On-disk folder slug (legacy `metadata.slug` values are canonicalized). */
export function workshopDiskChapterFolderSlug(marketingSlug: string): string {
  return canonicalWorkshopMarketingSlug(marketingSlug)
}

export function workshopSlugHasPublicMarkdownChapters(slug: string): boolean {
  const diskSlug = canonicalWorkshopMarketingSlug(slug)
  return (WORKSHOP_SLUGS_PUBLIC_MARKDOWN_CHAPTERS as readonly string[]).includes(diskSlug)
}

/** Landing chapter for “start here” / Enroll CTAs (defaults to `welcome`). */
export function publicWorkshopFirstChapterSlug(workshopSlug: string): string {
  const diskSlug = canonicalWorkshopMarketingSlug(workshopSlug)
  return FIRST_PUBLIC_CHAPTER_SLUG_BY_WORKSHOP[diskSlug] ?? 'welcome'
}
