/** `chapter-1` … `chapter-99` (1-based index, case-insensitive). */
const CHAPTER_INDEX_RE = /^chapter-(\d+)$/i

export function parseChapterIndexFromParam(param: string): number | null {
  const m = param.trim().match(CHAPTER_INDEX_RE)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function slugForChapterIndex<T extends { slug: string; order: number }>(
  chaptersSorted: T[],
  oneBasedIndex: number
): string | null {
  if (oneBasedIndex < 1 || oneBasedIndex > chaptersSorted.length) return null
  return chaptersSorted[oneBasedIndex - 1]?.slug ?? null
}
