import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import {
  canonicalWorkshopMarketingSlug,
  workshopMarketingSlugLookupKeys,
} from '@/lib/workshops/workshop-metadata-slug-aliases'
import { isWorkshopUuid } from '@/lib/workshops/workshop-routing'
import { listDiskChapters } from '@/lib/workshops/workshop-disk-chapters'
import {
  workshopDiskChapterFolderSlug,
  workshopSlugHasPublicMarkdownChapters,
} from '@/lib/workshops/public-chapter-slugs'
import { parseChapterIndexFromParam, slugForChapterIndex } from '@/lib/workshops/chapter-param-from-index'

export type ResolvedOrgChapter = {
  workshopId: string
  chapterSlug: string
  /** When input was `chapter-N`, redirect to semantic slug URL. */
  redirectTo?: string
  /** Set when this workshop uses on-disk public markdown (e.g. Vibe Coding & Net Art). */
  publicMarkdownWorkshopSlug?: string
}

/**
 * Resolve org workshop chapter URL segment: `chapter-N` → canonical slug, or validate slug.
 * Returns null when workshop/chapter cannot be resolved.
 */
export async function resolveOrgChapterParam(
  orgSlug: string,
  workshopKey: string,
  chapterParam: string
): Promise<ResolvedOrgChapter | null> {
  const org = orgSlug?.trim()
  const key = workshopKey?.trim()
  const param = chapterParam?.trim()
  if (!org || !key || !param) return null

  const supabase = createClient()
  const { data: orgRow, error: orgErr } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', org)
    .maybeSingle()

  if (orgErr || !orgRow) return null

  let workshop: { id: string; title: string; metadata?: Record<string, unknown> | null } | null =
    null

  if (isWorkshopUuid(key)) {
    const { data, error } = await supabase
      .from('workshops')
      .select('id, title, metadata')
      .eq('id', key)
      .eq('organization_id', orgRow.id)
      .maybeSingle()
    if (error || !data) return null
    workshop = data
  } else {
    const slugKeys = workshopMarketingSlugLookupKeys(key)
    const orFilter = slugKeys.map((k) => `metadata->>slug.eq.${k}`).join(',')
    const { data: rows, error } = await supabase
      .from('workshops')
      .select('id, title, metadata')
      .eq('organization_id', orgRow.id)
      .or(orFilter)
      .limit(1)
    if (error || !rows?.[0]) return null
    workshop = rows[0]
  }

  const merged = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
    title: workshop.title,
    id: workshop.id,
  })

  if (!workshopSlugHasPublicMarkdownChapters(merged.slug)) return null

  const diskFolder = workshopDiskChapterFolderSlug(merged.slug)
  const rows = await listDiskChapters(diskFolder)
  const sorted = [...rows].sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))

  const publicSlug = workshopSlugHasPublicMarkdownChapters(merged.slug)
    ? canonicalWorkshopMarketingSlug(merged.slug)
    : undefined

  const idx = parseChapterIndexFromParam(param)
  if (idx != null) {
    const slug = slugForChapterIndex(sorted, idx)
    if (!slug) return null
    const encKey = encodeURIComponent(key)
    return {
      workshopId: workshop.id,
      chapterSlug: slug,
      redirectTo: `/o/${encodeURIComponent(org)}/workshop/${encKey}/chapters/${encodeURIComponent(slug)}`,
      ...(publicSlug ? { publicMarkdownWorkshopSlug: publicSlug } : {}),
    }
  }

  if (!sorted.some((c) => c.slug === param)) return null

  return {
    workshopId: workshop.id,
    chapterSlug: param,
    ...(publicSlug ? { publicMarkdownWorkshopSlug: publicSlug } : {}),
  }
}
