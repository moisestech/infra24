'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, FileText, GraduationCap, Star } from 'lucide-react'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { getWorkshopsLandingContent } from '@/lib/orgs/oolite/workshops-landing-content'
import { WorkshopHero } from '@/components/workshops/marketing/WorkshopHero'
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

function signInRedirect(path: string) {
  return `/sign-in?redirect_url=${encodeURIComponent(path)}`
}

export function DccWorkshopPublicDetail({ workshopKey }: { workshopKey: string }) {
  const slug = WORKSHOP_CATALOG_ORG_SLUG
  const [workshop, setWorkshop] = useState<WorkshopRow | null>(null)
  const [relatedList, setRelatedList] = useState<WorkshopRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const landing = getWorkshopsLandingContent(slug)

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
      setWorkshop(row as WorkshopRow)
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
        const m = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
          title: workshop.title,
          id: workshop.id,
        })
        const ids = m.relatedWorkshopIds
        if (ids?.length) {
          setRelatedList(all.filter((w) => ids.includes(w.id)))
        } else {
          const cat = workshop.category
          setRelatedList(
            all.filter((w) => w.id !== workshop.id && cat && w.category === cat).slice(0, 3)
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

  const levelLabel = workshop.level || workshop.learn_difficulty || 'beginner'
  const outcomes =
    workshop.outcomes && workshop.outcomes.length > 0 ? workshop.outcomes : []

  const orgBookPath = `/o/${slug}/bookings?workshopId=${workshop.id}&type=workshop`
  const bookHref = signInRedirect(orgBookPath)

  const isLearnAi = isLearnAiWorkshopSlug(workshopKey) || isLearnAiWorkshopSlug(marketing.slug)
  const showLearnTabs = Boolean(workshop.has_learn_content) || isLearnAi

  const segment = marketing.slug || workshopKey
  const packetMemberPath = `/o/${slug}/workshops/${encodeURIComponent(segment)}/packet`

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-lg border border-neutral-200 bg-white/90 px-4 py-3 text-sm text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200">
        You are viewing the public DCC catalog.{' '}
        <Link href={signInRedirect(`/o/${slug}/workshops/${encodeURIComponent(segment)}`)} className="font-medium text-[var(--cdc-teal)] underline underline-offset-2">
          Sign in to Oolite
        </Link>{' '}
        for booking, drafts, learn materials, and member tools.
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
              <WorkshopHero workshop={workshop} marketing={marketing} levelLabel={levelLabel} />

              {marketing.galleryImageUrls && marketing.galleryImageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {marketing.galleryImageUrls.map((url, i) => (
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
                  Learn content and progress sync when you sign in to your Oolite account.
                </p>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {workshop.price === 0 || workshop.price == null ? 'Free' : `$${workshop.price}`}
                </span>
              </div>
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
