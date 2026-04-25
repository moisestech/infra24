import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { dccSiteMeta } from '@/lib/marketing/content'
import { canonicalWorkshopMarketingSlug } from '@/lib/workshops/workshop-metadata-slug-aliases'
import {
  WORKSHOP_SLUGS_PUBLIC_MARKDOWN_CHAPTERS,
  workshopDiskChapterFolderSlug,
  workshopSlugHasPublicMarkdownChapters,
} from '@/lib/workshops/public-chapter-slugs'
import {
  listPublicWorkshopChapters,
  loadPublicWorkshopChapter,
} from '@/lib/workshops/public-markdown-chapters'
import { parseChapterIndexFromParam, slugForChapterIndex } from '@/lib/workshops/chapter-param-from-index'
import { VIBE_NET_ART_WORKSHOP_SLUG } from '@/lib/course/vibe-net-art/constants'
import { VCN_COURSE_INDEX } from '@/lib/course/vibe-net-art/course-index'
import { adjacentDiskChapters, vibeNetArtSortedDiskChapters } from '@/lib/course/vibe-net-art/nav'
import { getChapterOverlay } from '@/lib/course/chapters'
import { VcnVibeNetArtLesson } from '@/components/course/VcnVibeNetArtLesson'

type Props = { params: Promise<{ slug: string; chapterParam: string }> }

function courseMetaForSlug(chapterSlug: string) {
  return VCN_COURSE_INDEX.find((r) => r.chapterSlug === chapterSlug) ?? null
}

export async function generateStaticParams() {
  const pairs: { slug: string; chapterParam: string }[] = []
  for (const slug of WORKSHOP_SLUGS_PUBLIC_MARKDOWN_CHAPTERS) {
    const diskSlug = workshopDiskChapterFolderSlug(slug)
    const chapters = await listPublicWorkshopChapters(slug)
    for (const c of chapters) {
      pairs.push({ slug: diskSlug, chapterParam: c.slug })
    }
  }
  return pairs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug, chapterParam: rawChapter } = await params
  const slug = canonicalWorkshopMarketingSlug(decodeURIComponent(rawSlug))
  const chapterParam = decodeURIComponent(rawChapter)
  const diskSlug = workshopDiskChapterFolderSlug(slug)
  const chapter = await loadPublicWorkshopChapter(slug, chapterParam)
  if (!chapter) {
    return { title: 'Chapter' }
  }
  const workshopDisplayTitle =
    diskSlug === 'vibe-coding-and-net-art' ? 'Vibe Coding & Net Art' : diskSlug.replace(/-/g, ' ')
  const title = `${chapter.title} | ${workshopDisplayTitle}`
  return {
    title,
    description:
      chapter.description || `${chapter.title} — ${dccSiteMeta.organizationName} workshop chapter.`,
    alternates: { canonical: `/workshop/${diskSlug}/${chapterParam}` },
  }
}

export default async function MarketingWorkshopChapterCanonicalPage({ params }: Props) {
  const { slug: rawSlug, chapterParam: rawChapter } = await params
  const slug = canonicalWorkshopMarketingSlug(decodeURIComponent(rawSlug))
  const chapterParam = decodeURIComponent(rawChapter)
  if (!workshopSlugHasPublicMarkdownChapters(slug)) {
    notFound()
  }

  const diskSlug = workshopDiskChapterFolderSlug(slug)
  const chapters = await listPublicWorkshopChapters(slug)
  const sorted = [...chapters].sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))

  const idx = parseChapterIndexFromParam(chapterParam)
  let chapterSlug = chapterParam
  if (idx != null) {
    const s = slugForChapterIndex(sorted, idx)
    if (!s) notFound()
    permanentRedirect(`/workshop/${encodeURIComponent(diskSlug)}/${encodeURIComponent(s)}`)
  }

  const chapter = await loadPublicWorkshopChapter(slug, chapterSlug)
  if (!chapter) {
    notFound()
  }

  if (slug === VIBE_NET_ART_WORKSHOP_SLUG) {
    const basePath = `/workshop/${encodeURIComponent(VIBE_NET_ART_WORKSHOP_SLUG)}/`
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
          href={`/workshop/${encodeURIComponent(VIBE_NET_ART_WORKSHOP_SLUG)}/${encodeURIComponent(chapterSlug)}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Plain reader view
        </Link>
      </div>
    )

    return (
      <VcnVibeNetArtLesson
        chapterSlug={chapterSlug}
        diskChapter={chapter}
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href={`/workshops/${encodeURIComponent(diskSlug)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to workshop
        </Link>
      </div>
      <article className="max-w-none space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{chapter.title}</h1>
        {chapter.description ? (
          <p className="text-lg leading-relaxed text-muted-foreground">{chapter.description}</p>
        ) : null}
        <div className="manuscript-prose">
          <div dangerouslySetInnerHTML={{ __html: chapter.html }} />
        </div>
      </article>
    </div>
  )
}
