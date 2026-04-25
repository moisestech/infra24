import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dccSiteMeta } from '@/lib/marketing/content'
import { canonicalWorkshopMarketingSlug } from '@/lib/workshops/workshop-metadata-slug-aliases'
import { workshopSlugHasPublicMarkdownChapters } from '@/lib/workshops/public-chapter-slugs'
import { VIBE_NET_ART_WORKSHOP_SLUG } from '@/lib/course/vibe-net-art/constants'
import { VCN_COURSE_INDEX } from '@/lib/course/vibe-net-art/course-index'
import { listDiskChapters } from '@/lib/workshops/workshop-disk-chapters'
import { loadPublicWorkshopChapter } from '@/lib/workshops/public-markdown-chapters'
import { adjacentDiskChapters, vibeNetArtSortedDiskChapters } from '@/lib/course/vibe-net-art/nav'
import { getChapterOverlay } from '@/lib/course/chapters'
import { VcnVibeNetArtLesson } from '@/components/course/VcnVibeNetArtLesson'

type Props = { params: Promise<{ slug: string; chapterSlug: string }> }

export async function generateStaticParams() {
  const rows = await listDiskChapters(VIBE_NET_ART_WORKSHOP_SLUG)
  return rows.map((c) => ({
    slug: VIBE_NET_ART_WORKSHOP_SLUG,
    chapterSlug: c.slug,
  }))
}

function courseMetaForSlug(chapterSlug: string) {
  return VCN_COURSE_INDEX.find((r) => r.chapterSlug === chapterSlug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw, chapterSlug: rawChapter } = await params
  const slug = canonicalWorkshopMarketingSlug(decodeURIComponent(raw))
  const chapterSlug = decodeURIComponent(rawChapter)
  if (!workshopSlugHasPublicMarkdownChapters(slug) || slug !== VIBE_NET_ART_WORKSHOP_SLUG) {
    return { title: 'Chapter' }
  }
  const ch = await loadPublicWorkshopChapter(slug, chapterSlug)
  if (!ch) return { title: 'Chapter' }
  return {
    title: `${ch.title} | Vibe Coding & Net Art`,
    description: ch.description || `${ch.title} — ${dccSiteMeta.organizationName}`,
    alternates: { canonical: `/workshop/${slug}/chapters/${chapterSlug}` },
  }
}

export default async function VcnLessonPage({ params }: Props) {
  const { slug: raw, chapterSlug: rawChapter } = await params
  const slug = canonicalWorkshopMarketingSlug(decodeURIComponent(raw))
  const chapterSlug = decodeURIComponent(rawChapter)

  if (!workshopSlugHasPublicMarkdownChapters(slug) || slug !== VIBE_NET_ART_WORKSHOP_SLUG) {
    notFound()
  }

  const diskChapter = await loadPublicWorkshopChapter(slug, chapterSlug)
  if (!diskChapter) {
    notFound()
  }

  const basePath = `/workshop/${encodeURIComponent(slug)}/`
  const glossaryHref = `${basePath}glossary`
  const sorted = await vibeNetArtSortedDiskChapters()
  const { prev, next } = adjacentDiskChapters(sorted, chapterSlug)
  const courseRow = courseMetaForSlug(chapterSlug)
  const overlay = getChapterOverlay(chapterSlug)
  const chaptersHrefPrefix = `${basePath}chapters/`

  const topLinks = (
    <div className="mb-6 flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400">
      <Link href={basePath} className="font-medium text-primary underline-offset-4 hover:underline">
        ← Course handbook
      </Link>
      <span aria-hidden>·</span>
      <Link href={glossaryHref} className="font-medium text-primary underline-offset-4 hover:underline">
        Glossary
      </Link>
      <span aria-hidden>·</span>
      <Link
        href={`/workshop/${encodeURIComponent(slug)}/${encodeURIComponent(chapterSlug)}`}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        Plain reader view
      </Link>
    </div>
  )

  return (
    <VcnVibeNetArtLesson
      chapterSlug={chapterSlug}
      diskChapter={diskChapter}
      overlay={overlay}
      courseRow={courseRow}
      sorted={sorted}
      prev={prev}
      next={next}
      glossaryHref={glossaryHref}
      chaptersHrefPrefix={chaptersHrefPrefix}
      topLinks={topLinks}
    />
  )
}
