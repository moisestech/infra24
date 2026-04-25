import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { resolveOrgChapterParam } from '@/lib/workshops/resolve-org-chapter-server'

export const dynamic = 'force-dynamic'

/** Plural `/o/.../workshops/.../chapters/...` kept for compatibility; canonical is `/o/.../workshop/...`. */
export default async function OrgWorkshopChapterPluralRedirectPage({
  params,
}: {
  params: Promise<{ slug: string; workshopKey: string; chapterParam: string }>
}) {
  const { slug, workshopKey, chapterParam } = await params
  const resolved = await resolveOrgChapterParam(slug, workshopKey, chapterParam)
  if (!resolved) notFound()
  if (resolved.redirectTo) redirect(resolved.redirectTo)

  permanentRedirect(
    `/o/${encodeURIComponent(slug)}/workshop/${encodeURIComponent(workshopKey)}/chapters/${encodeURIComponent(resolved.chapterSlug)}`
  )
}
