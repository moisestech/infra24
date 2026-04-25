'use client'

import { useParams } from 'next/navigation'
import { WorkshopChapterReader } from '@/components/workshops/marketing/WorkshopChapterReader'
import { WORKSHOP_CATALOG_ORG_SLUG } from '@/lib/marketing/workshops-catalog-org'
import { LearnRedirectToOrg } from './LearnRedirectToOrg'

export default function ChapterReaderPage() {
  const params = useParams()
  const workshopId = params.workshopId as string
  const chapterSlug = params.chapterSlug as string

  const org = encodeURIComponent(WORKSHOP_CATALOG_ORG_SLUG)
  const key = encodeURIComponent(workshopId)
  const backHref = `/o/${org}/workshop/${key}`

  return (
    <>
      <LearnRedirectToOrg workshopId={workshopId} chapterSlug={chapterSlug} />
      <WorkshopChapterReader
        workshopId={workshopId}
        chapterSlug={chapterSlug}
        shell="learn"
        backHref={backHref}
        chapterHref={(slug) =>
          `/o/${org}/workshop/${key}/chapters/${encodeURIComponent(slug)}`
        }
      />
    </>
  )
}
