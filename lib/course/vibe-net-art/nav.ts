import { listDiskChapters } from '@/lib/workshops/workshop-disk-chapters'
import { VIBE_NET_ART_WORKSHOP_SLUG } from './constants'

export type DiskNavChapter = {
  slug: string
  title: string
}

export async function vibeNetArtSortedDiskChapters(): Promise<DiskNavChapter[]> {
  const rows = await listDiskChapters(VIBE_NET_ART_WORKSHOP_SLUG)
  return [...rows]
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
    .map((r) => ({ slug: r.slug, title: r.title }))
}

export function adjacentDiskChapters(
  sorted: DiskNavChapter[],
  chapterSlug: string
): { prev: DiskNavChapter | null; next: DiskNavChapter | null } {
  const idx = sorted.findIndex((c) => c.slug === chapterSlug)
  if (idx < 0) return { prev: null, next: null }
  return {
    prev: idx > 0 ? sorted[idx - 1]! : null,
    next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1]! : null,
  }
}
