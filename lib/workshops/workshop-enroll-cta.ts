import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import {
  publicWorkshopFirstChapterSlug,
  workshopDiskChapterFolderSlug,
  workshopSlugHasPublicMarkdownChapters,
} from '@/lib/workshops/public-chapter-slugs'

export type WorkshopHeroEnrollCta = {
  href: string
  label?: string
  external?: boolean
  disabled?: boolean
}

export type WorkshopEnrollCtaContext = {
  /** DB workshop id — used with `isSignedIn` for disk-backed chapter links. */
  workshopId?: string
  isSignedIn?: boolean
  /** Org segment, e.g. `oolite`, for `/o/{org}/workshop/.../chapters/...`. */
  orgSlug?: string
  /** Workshop URL segment (metadata slug or uuid) as shown under `/o/{org}/workshop/{key}/chapters/...`. */
  workshopUrlKey?: string
}

/**
 * For workshops with public on-disk chapters, **Enroll** opens the first chapter:
 * signed-in with org + URL key → `/o/{org}/workshop/{key}/chapters/{slug}`; signed-in without org context
 * → `/workshop/{diskSlug}/chapters/{slug}` (same public reader surface); anonymous → `/workshop/{diskSlug}/chapters/{slug}`.
 * Otherwise: external `primary.href` when https, else org booking `bookHref`.
 */
export function resolveWorkshopEnrollCta(
  marketing: WorkshopMarketingMetadata,
  bookHref: string,
  ctx?: WorkshopEnrollCtaContext
): WorkshopHeroEnrollCta {
  if (workshopSlugHasPublicMarkdownChapters(marketing.slug)) {
    const diskSlug = workshopDiskChapterFolderSlug(marketing.slug)
    const chapter = publicWorkshopFirstChapterSlug(marketing.slug)
    if (ctx?.workshopId && ctx.isSignedIn && ctx.orgSlug?.trim() && ctx.workshopUrlKey?.trim()) {
      const o = encodeURIComponent(ctx.orgSlug.trim())
      const k = encodeURIComponent(ctx.workshopUrlKey.trim())
      return {
        href: `/o/${o}/workshop/${k}/chapters/${encodeURIComponent(chapter)}`,
        label: 'Enroll Now',
        external: false,
      }
    }
    if (ctx?.workshopId && ctx.isSignedIn) {
      return {
        href: `/workshop/${encodeURIComponent(diskSlug)}/chapters/${encodeURIComponent(chapter)}`,
        label: 'Enroll Now',
        external: false,
      }
    }
    return {
      href: `/workshop/${encodeURIComponent(diskSlug)}/chapters/${encodeURIComponent(chapter)}`,
      label: 'Enroll Now',
      external: false,
    }
  }

  const p = marketing.ctas?.primary
  const raw = typeof p?.href === 'string' ? p.href.trim() : ''
  if (raw && /^https?:\/\//i.test(raw)) {
    return { href: raw, label: 'Enroll Now', external: true }
  }
  return { href: bookHref, label: 'Enroll Now', external: false }
}
