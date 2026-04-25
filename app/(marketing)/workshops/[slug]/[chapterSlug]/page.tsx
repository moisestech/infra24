import { notFound, permanentRedirect } from 'next/navigation'
import {
  WORKSHOP_SLUGS_PUBLIC_MARKDOWN_CHAPTERS,
  workshopDiskChapterFolderSlug,
  workshopSlugHasPublicMarkdownChapters,
} from '@/lib/workshops/public-chapter-slugs'
import { listPublicWorkshopChapters } from '@/lib/workshops/public-markdown-chapters'

type Props = { params: Promise<{ slug: string; chapterSlug: string }> }

/** Plural `/workshops/...` kept for compatibility; canonical chapter URLs are `/workshop/...`. */
export async function generateStaticParams() {
  const pairs: { slug: string; chapterSlug: string }[] = []
  for (const slug of WORKSHOP_SLUGS_PUBLIC_MARKDOWN_CHAPTERS) {
    const chapters = await listPublicWorkshopChapters(slug)
    for (const c of chapters) {
      pairs.push({ slug, chapterSlug: c.slug })
    }
  }
  return pairs
}

export default async function WorkshopChapterPluralRedirectPage({ params }: Props) {
  const { slug, chapterSlug } = await params
  if (!workshopSlugHasPublicMarkdownChapters(slug)) {
    notFound()
  }
  const diskSlug = workshopDiskChapterFolderSlug(slug)
  permanentRedirect(`/workshop/${encodeURIComponent(diskSlug)}/${encodeURIComponent(chapterSlug)}`)
}
