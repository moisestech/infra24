'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, FileText, GraduationCap, Star } from 'lucide-react'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { getDccMarketingWorkshopsLandingContent } from '@/lib/marketing/dcc-workshops-landing-content'
import { WorkshopHero } from '@/components/workshops/marketing/WorkshopHero'
import { WorkshopSkillsYoullLearn } from '@/components/workshops/marketing/WorkshopSkillsYoullLearn'
import { WorkshopOutcomeStrip } from '@/components/workshops/marketing/WorkshopOutcomeStrip'
import { WorkshopAudienceSplit } from '@/components/workshops/marketing/WorkshopAudienceSplit'
import { WorkshopCtaBand } from '@/components/workshops/marketing/WorkshopCtaBand'
import { InstitutionalInquiryCta } from '@/components/workshops/marketing/InstitutionalInquiryCta'
import { WorkshopLearnTab } from '@/components/workshops/marketing/WorkshopLearnTab'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { isLearnAiWorkshopSlug } from '@/lib/workshops/learn-ai-without-losing-yourself/constants'
import { LearnAiLanding } from '@/components/workshops/learn-ai/LearnAiLanding'
import { WorkshopDetailMainColumn } from '@/components/workshops/marketing/WorkshopDetailMainColumn'
import { WORKSHOP_CATALOG_ORG_SLUG } from '@/lib/marketing/workshops-catalog-org'
import { normalizeWorkshopForCatalog } from '@/lib/workshops/normalize-workshop-for-catalog'
import { isExcludedFromDccPublicCatalog } from '@/lib/workshops/workshop-filters'
import {
  workshopDiskChapterFolderSlug,
  workshopSlugHasPublicMarkdownChapters,
} from '@/lib/workshops/public-chapter-slugs'
import {
  resolveWorkshopHeroBannerImageUrl,
  workshopGalleryThumbsExcludingHero,
} from '@/lib/workshops/workshop-visual-image'
import { resolveWorkshopEnrollCta } from '@/lib/workshops/workshop-enroll-cta'
import { getWorkshopSkillsYoullLearn } from '@/lib/workshops/workshop-skills-list'

function signInRedirect(path: string) {
  return `/sign-in?redirect_url=${encodeURIComponent(path)}`
}

export function DccWorkshopPublicDetail({ workshopKey }: { workshopKey: string }) {
  const { isSignedIn } = useAuth()
  const slug = WORKSHOP_CATALOG_ORG_SLUG
  const [workshop, setWorkshop] = useState<WorkshopRow | null>(null)
  const [relatedList, setRelatedList] = useState<WorkshopRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const landing = getDccMarketingWorkshopsLandingContent()

  const fetchWorkshop = useCallback(async () => {
    if (!workshopKey) return
    try {
      setLoading(true)
      const res = await fetch(
        `/api/organizations/by-slug/${encodeURIComponent(slug)}/workshops/public/${encodeURIComponent(workshopKey)}`
      )
      if (!res.ok) throw new Error('Workshop not found')
      const data = await res.json()
      const row = data.data ?? data
      if (!row?.id) throw new Error('Workshop not found')
      const candidate = row as WorkshopRow
      if (
        isExcludedFromDccPublicCatalog({
          title: String(candidate.title ?? ''),
          category: candidate.category,
          metadata: candidate.metadata ?? null,
        })
      ) {
        throw new Error('Workshop not found')
      }
      setWorkshop(candidate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workshop')
      setWorkshop(null)
    } finally {
      setLoading(false)
    }
  }, [workshopKey, slug])

  useEffect(() => {
    void fetchWorkshop()
  }, [fetchWorkshop])

  useEffect(() => {
    if (!workshop?.organization_id) return
    ;(async () => {
      try {
        const res = await fetch(`/api/organizations/by-slug/${encodeURIComponent(slug)}/workshops/public`)
        if (!res.ok) return
        const pub = await res.json()
        const o = pub.organization as { id: string; name: string; slug: string } | null
        if (!o?.id) return
        const rawList = (pub.workshops || []) as Record<string, unknown>[]
        const all = rawList.map((w) =>
          normalizeWorkshopForCatalog(w, { id: o.id, name: o.name, slug: o.slug })
        ) as unknown as WorkshopRow[]
        const visible = all.filter(
          (w) =>
            !isExcludedFromDccPublicCatalog({
              title: String(w.title ?? ''),
              category: w.category,
              metadata: w.metadata ?? null,
            })
        )
        const m = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
          title: workshop.title,
          id: workshop.id,
        })
        const ids = m.relatedWorkshopIds
        if (ids?.length) {
          setRelatedList(visible.filter((w) => ids.includes(w.id)))
        } else {
          const cat = workshop.category
          setRelatedList(
            visible.filter((w) => w.id !== workshop.id && cat && w.category === cat).slice(0, 3)
          )
        }
      } catch {
        setRelatedList([])
      }
    })()
  }, [workshop, slug])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--cdc-teal)] border-t-transparent" />
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Workshop not found</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
        <Button asChild className="mt-8" variant="outline">
          <Link href="/workshops">Back to workshops</Link>
        </Button>
      </div>
    )
  }

  const marketing = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
    title: workshop.title,
    id: workshop.id,
  })
  const workshopUrlKey = marketing.slug || workshopKey

  const levelLabel = workshop.level || workshop.learn_difficulty || 'beginner'
  const outcomes =
    workshop.outcomes && workshop.outcomes.length > 0 ? workshop.outcomes : []

  const orgBookPath = `/o/${slug}/bookings?workshopId=${workshop.id}&type=workshop`
  const bookHref = signInRedirect(orgBookPath)

  const isLearnAi = isLearnAiWorkshopSlug(workshopKey) || isLearnAiWorkshopSlug(marketing.slug)
  const hasPublicMarkdownChapters = workshopSlugHasPublicMarkdownChapters(marketing.slug)
  const showLearnTabs =
    Boolean(workshop.has_learn_content) || isLearnAi || hasPublicMarkdownChapters

  const listPriceUsd =
    typeof marketing.publicListPriceUsd === 'number'
      ? marketing.publicListPriceUsd
      : workshop.price != null && workshop.price > 0
        ? workshop.price
        : null
  const ooliteRegistrationUsd = marketing.ooliteRegistrationUsd

  const bannerImageUrl = resolveWorkshopHeroBannerImageUrl(workshop, marketing)
  const galleryThumbs = workshopGalleryThumbsExcludingHero(marketing, bannerImageUrl)

  const enrollCta = resolveWorkshopEnrollCta(marketing, bookHref, {
    workshopId: workshop.id,
    isSignedIn: Boolean(isSignedIn),
    orgSlug: slug,
    workshopUrlKey,
  })
  const skillsList = getWorkshopSkillsYoullLearn(marketing, workshop)

  const segment = marketing.slug || workshopKey
  const packetMemberPath = `/o/${slug}/workshops/${encodeURIComponent(segment)}/packet`

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-lg border border-neutral-200 bg-white/90 px-4 py-3 text-sm text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200">
        You are viewing the public DCC.miami catalog.{' '}
        <Link
          href={signInRedirect(`/o/${slug}/workshops/${encodeURIComponent(segment)}`)}
          className="font-medium text-[var(--cdc-teal)] underline underline-offset-2"
        >
          Sign in
        </Link>{' '}
        for booking, drafts, learn materials, and member tools in your organization workspace.
      </div>

      <div className="mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/workshops">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to workshops
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="space-y-12 lg:col-span-2">
          {isLearnAi ? (
            <LearnAiLanding orgSlug={slug} workshopTitle={workshop.title} />
          ) : (
            <>
              <WorkshopHero
                workshop={workshop}
                marketing={marketing}
                levelLabel={levelLabel}
                enrollCta={enrollCta}
              />

              {skillsList.length > 0 ? (
                <WorkshopSkillsYoullLearn skills={skillsList} />
              ) : null}

              {galleryThumbs.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {galleryThumbs.map((url, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <WorkshopOutcomeStrip outcomes={outcomes} />

              <WorkshopAudienceSplit
                whoFor={marketing.whoFor ?? []}
                whoNotFor={marketing.whoNotFor ?? []}
              />
            </>
          )}

          {showLearnTabs ? (
            <Tabs defaultValue="workshop" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="workshop" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Workshop
                </TabsTrigger>
                <TabsTrigger value="learn" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Learn
                </TabsTrigger>
              </TabsList>
              <TabsContent value="workshop" className="mt-8 space-y-12">
                <WorkshopDetailMainColumn
                  workshop={workshop}
                  marketing={marketing}
                  relatedList={relatedList}
                  orgSlug={slug}
                  catalogSurface="dcc"
                />
              </TabsContent>
              <TabsContent value="learn" className="mt-8">
                <p className="mb-4 text-sm text-muted-foreground">
                  Learn content and progress sync when you sign in to your member account.
                </p>
                {hasPublicMarkdownChapters ? (
                  <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-neutral-800 dark:border-primary/25 dark:bg-primary/10 dark:text-neutral-100">
                    <span className="font-medium">Course handbook</span> — sequence, modules, tools, and glossary
                    in one place:{' '}
                    <Link
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                      href={`/workshop/${encodeURIComponent(workshopDiskChapterFolderSlug(marketing.slug))}/`}
                    >
                      open handbook
                    </Link>
                    {' · '}
                    <Link
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                      href={`/workshop/${encodeURIComponent(workshopDiskChapterFolderSlug(marketing.slug))}/glossary`}
                    >
                      glossary
                    </Link>
                  </div>
                ) : null}
                <WorkshopLearnTab workshop={workshop} orgSlug={slug} />
              </TabsContent>
            </Tabs>
          ) : (
            <WorkshopDetailMainColumn
              workshop={workshop}
              marketing={marketing}
              relatedList={relatedList}
              orgSlug={slug}
              catalogSurface="dcc"
            />
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Join</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary">{workshop.status ?? '—'}</Badge>
              </div>
              {listPriceUsd != null && listPriceUsd > 0 ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Public list</span>
                  <span className="font-medium">${listPriceUsd}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">
                    {workshop.price === 0 || workshop.price == null ? 'Free' : `$${workshop.price}`}
                  </span>
                </div>
              )}
              {ooliteRegistrationUsd != null && ooliteRegistrationUsd > 0 ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Oolite members</span>
                  <span className="font-medium">${ooliteRegistrationUsd}</span>
                </div>
              ) : null}
              {marketing.alumniCouponCode ? (
                <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Alumni coupon </span>
                  <span className="font-mono text-foreground">{marketing.alumniCouponCode}</span>
                  {marketing.alumniCouponShortNote ? (
                    <p className="mt-1">{marketing.alumniCouponShortNote}</p>
                  ) : (
                    <p className="mt-1">
                      Enter this code on the Oolite registration or ticketing page at checkout (50%
                      off member pricing).
                    </p>
                  )}
                </div>
              ) : null}
              {workshop.featured && (
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="h-4 w-4" />
                  <span>Featured</span>
                </div>
              )}
            </CardContent>
          </Card>

          <WorkshopCtaBand marketing={marketing} bookHref={bookHref} />

          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={signInRedirect(packetMemberPath)}>
              <FileText className="mr-2 h-4 w-4" />
              Packet page (sign in)
            </Link>
          </Button>

          <InstitutionalInquiryCta
            landing={landing.institutionalInquiry}
            workshopTitle={workshop.title}
            orgSlug={slug}
          />
        </aside>
      </div>
    </div>
  )
}
