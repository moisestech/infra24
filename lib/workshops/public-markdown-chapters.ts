import 'server-only'

import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { rehypeExternalLessonLinks } from '@/lib/workshops/rehype-external-lesson-links'
import {
  workshopDiskChapterFolderSlug,
  workshopSlugHasPublicMarkdownChapters,
} from '@/lib/workshops/public-chapter-slugs'
import {
  listDiskChapters,
  loadDiskChapterMarkdown,
} from '@/lib/workshops/workshop-disk-chapters'

export { workshopSlugHasPublicMarkdownChapters } from '@/lib/workshops/public-chapter-slugs'

export type PublicWorkshopChapterSummary = {
  slug: string
  title: string
  description: string
  order: number
  estimatedTime: number
}

export async function listPublicWorkshopChapters(
  workshopSlug: string
): Promise<PublicWorkshopChapterSummary[]> {
  if (!workshopSlugHasPublicMarkdownChapters(workshopSlug)) return []
  const rows = await listDiskChapters(workshopDiskChapterFolderSlug(workshopSlug))
  return rows.map(({ slug, title, description, order, estimatedTime }) => ({
    slug,
    title,
    description,
    order,
    estimatedTime,
  }))
}

export async function loadPublicWorkshopChapter(
  workshopSlug: string,
  chapterSlug: string
): Promise<{ title: string; description: string; html: string } | null> {
  if (!workshopSlugHasPublicMarkdownChapters(workshopSlug)) return null
  const entry = await loadDiskChapterMarkdown(
    workshopDiskChapterFolderSlug(workshopSlug),
    chapterSlug
  )
  if (!entry) return null
  const fileResult = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeExternalLessonLinks)
    .use(rehypeStringify)
    .process(entry.body)
  const html = String(fileResult)
  return { title: entry.title, description: entry.description, html }
}
