import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { resolveOrgChapterParam } from '@/lib/workshops/resolve-org-chapter-server'
import { OrgWorkshopChapterClient } from '@/components/workshops/OrgWorkshopChapterClient'
import { VcnVibeNetArtLesson } from '@/components/course/VcnVibeNetArtLesson'
import { VCN_COURSE_INDEX } from '@/lib/course/vibe-net-art/course-index'
import { loadPublicWorkshopChapter } from '@/lib/workshops/public-markdown-chapters'
import { adjacentDiskChapters, vibeNetArtSortedDiskChapters } from '@/lib/course/vibe-net-art/nav'
import { getChapterOverlay } from '@/lib/course/chapters'

export const dynamic = 'force-dynamic'

function courseMetaForSlug(chapterSlug: string) {
  return VCN_COURSE_INDEX.find((r) => r.chapterSlug === chapterSlug) ?? null
}

export default async function OrgWorkshopChapterCanonicalPage({
  params,
}: {
  params: Promise<{ slug: string; workshopKey: string; chapterParam: string }>
}) {
  const { slug, workshopKey, chapterParam } = await params
  const resolved = await resolveOrgChapterParam(slug, workshopKey, chapterParam)
  if (!resolved) notFound()
  if (resolved.redirectTo) redirect(resolved.redirectTo)

  if (resolved.publicMarkdownWorkshopSlug) {
    const ws = resolved.publicMarkdownWorkshopSlug
    const diskChapter = await loadPublicWorkshopChapter(ws, resolved.chapterSlug)
    if (!diskChapter) notFound()

    const glossaryHref = `/workshop/${encodeURIComponent(ws)}/glossary`
    const sorted = await vibeNetArtSortedDiskChapters()
    const { prev, next } = adjacentDiskChapters(sorted, resolved.chapterSlug)
    const overlay = getChapterOverlay(resolved.chapterSlug)
    const courseRow = courseMetaForSlug(resolved.chapterSlug)
    const encOrg = encodeURIComponent(slug)
    const encKey = encodeURIComponent(workshopKey)
    const chaptersHrefPrefix = `/o/${encOrg}/workshop/${encKey}/chapters/`
    const workshopListingHref = `/o/${encOrg}/workshop/${encKey}`

    const topLinks = (
      <div className="mb-6 flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400">
        <Link href={workshopListingHref} className="font-medium text-primary underline-offset-4 hover:underline">
          ← Workshop
        </Link>
        <span aria-hidden>·</span>
        <Link href={`/workshop/${encodeURIComponent(ws)}/`} className="font-medium text-primary underline-offset-4 hover:underline">
          Course handbook
        </Link>
        <span aria-hidden>·</span>
        <Link href={glossaryHref} className="font-medium text-primary underline-offset-4 hover:underline">
          Glossary
        </Link>
        <span aria-hidden>·</span>
        <Link
          href={`/workshop/${encodeURIComponent(ws)}/chapters/${encodeURIComponent(resolved.chapterSlug)}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Public lesson page
        </Link>
      </div>
    )

    return (
      <OrgWorkshopChapterClient
        orgSlug={slug}
        workshopKey={workshopKey}
        workshopId={resolved.workshopId}
        chapterSlug={resolved.chapterSlug}
      >
        <VcnVibeNetArtLesson
          chapterSlug={resolved.chapterSlug}
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
      </OrgWorkshopChapterClient>
    )
  }

  return (
    <OrgWorkshopChapterClient
      orgSlug={slug}
      workshopKey={workshopKey}
      workshopId={resolved.workshopId}
      chapterSlug={resolved.chapterSlug}
    />
  )
}
