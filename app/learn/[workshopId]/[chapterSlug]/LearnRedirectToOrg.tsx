'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { workshopSlugHasPublicMarkdownChapters } from '@/lib/workshops/public-chapter-slugs'
import { isWorkshopUuid } from '@/lib/workshops/workshop-routing'
import { WORKSHOP_CATALOG_ORG_SLUG } from '@/lib/marketing/workshops-catalog-org'

/**
 * When opening legacy `/learn/{uuid}/…`, bounce once to org-scoped chapter URL
 * for catalog workshops (canonical reader surface).
 */
export function LearnRedirectToOrg({
  workshopId,
  chapterSlug,
}: {
  workshopId: string
  chapterSlug: string
}) {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const did = useRef(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || did.current) return
    if (!isWorkshopUuid(workshopId)) return

    const ac = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(`/api/workshops/${encodeURIComponent(workshopId)}`, {
          signal: ac.signal,
        })
        if (!res.ok) return
        const json = (await res.json()) as {
          data?: { metadata?: Record<string, unknown> | null; id: string; title?: string }
        }
        const row = json.data
        if (!row?.metadata) return
        const m = mergeWorkshopMetadata(row.metadata, {
          title: typeof row.title === 'string' ? row.title : 'Workshop',
          id: row.id,
        })
        if (!workshopSlugHasPublicMarkdownChapters(m.slug)) return
        did.current = true
        const key = encodeURIComponent(m.slug)
        const ch = encodeURIComponent(chapterSlug)
        const org = encodeURIComponent(WORKSHOP_CATALOG_ORG_SLUG)
        router.replace(`/o/${org}/workshop/${key}/chapters/${ch}`)
      } catch {
        /* ignore */
      }
    })()

    return () => ac.abort()
  }, [isLoaded, isSignedIn, workshopId, chapterSlug, router])

  return null
}
