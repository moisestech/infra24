'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { useTenant } from '@/components/tenant/TenantProvider'
import { TenantLayout } from '@/components/tenant/TenantLayout'
import {
  UnifiedNavigation,
  ooliteConfig,
  bakehouseConfig,
  madartsConfig,
} from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, FileText, GraduationCap, Star } from 'lucide-react'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { isWorkshopUuid } from '@/lib/workshops/workshop-routing'
import { getWorkshopsLandingContent } from '@/lib/orgs/oolite/workshops-landing-content'
import { WorkshopHero } from '@/components/workshops/marketing/WorkshopHero'
import { WorkshopSkillsYoullLearn } from '@/components/workshops/marketing/WorkshopSkillsYoullLearn'
import { WorkshopOutcomeStrip } from '@/components/workshops/marketing/WorkshopOutcomeStrip'
import { WorkshopAudienceSplit } from '@/components/workshops/marketing/WorkshopAudienceSplit'
import { WorkshopCtaBand } from '@/components/workshops/marketing/WorkshopCtaBand'
import { InstitutionalInquiryCta } from '@/components/workshops/marketing/InstitutionalInquiryCta'
import { WorkshopLearnTab } from '@/components/workshops/marketing/WorkshopLearnTab'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { isLearnAiWorkshopSlug } from '@/lib/workshops/learn-ai-without-losing-yourself/constants'
import { LearnAiWorkshopNav } from '@/components/workshops/learn-ai/LearnAiWorkshopNav'
import { LearnAiLanding } from '@/components/workshops/learn-ai/LearnAiLanding'
import { WorkshopDetailMainColumn } from '@/components/workshops/marketing/WorkshopDetailMainColumn'
import { workshopSlugHasPublicMarkdownChapters } from '@/lib/workshops/public-chapter-slugs'
import {
  resolveWorkshopHeroBannerImageUrl,
  workshopGalleryThumbsExcludingHero,
} from '@/lib/workshops/workshop-visual-image'
import { resolveWorkshopEnrollCta } from '@/lib/workshops/workshop-enroll-cta'
import { getWorkshopSkillsYoullLearn } from '@/lib/workshops/workshop-skills-list'

interface WorkshopInterest {
  interest_count: number
  user_interested: boolean
}

export default function WorkshopDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const slug = params.slug as string
  const workshopKey = params.workshopKey as string
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant()

  const [workshop, setWorkshop] = useState<WorkshopRow | null>(null)
  const [relatedList, setRelatedList] = useState<WorkshopRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [interest, setInterest] = useState<WorkshopInterest | null>(null)
  const [interestLoading, setInterestLoading] = useState(false)

  const landing = getWorkshopsLandingContent(slug)

  const fetchWorkshop = useCallback(async () => {
    if (!workshopKey) return
    try {
      setLoading(true)
      let res: Response
      if (isWorkshopUuid(workshopKey)) {
        res = await fetch(`/api/workshops/${workshopKey}`)
      } else {
        res = await fetch(
          `/api/organizations/by-slug/${slug}/workshops/by-slug/${encodeURIComponent(workshopKey)}`
        )
      }
      if (!res.ok) throw new Error('Failed to fetch workshop')
      const data = await res.json()
      const row = data.data ?? data
      if (!row?.id) throw new Error('Workshop not found')
      setWorkshop(row as WorkshopRow)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workshop')
      setWorkshop(null)
    } finally {
      setLoading(false)
    }
  }, [workshopKey, slug])

  useEffect(() => {
    fetchWorkshop()
  }, [fetchWorkshop])

  useEffect(() => {
    if (!workshop || !slug) return
    const m = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
      title: workshop.title,
      id: workshop.id,
    })
    if (isWorkshopUuid(workshopKey) && m.slug) {
      router.replace(`/o/${slug}/workshops/${m.slug}`)
    }
  }, [workshop, workshopKey, slug, router])

  useEffect(() => {
    if (!workshop?.organization_id) return
    const m = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
      title: workshop.title,
      id: workshop.id,
    })
    ;(async () => {
      try {
        const res = await fetch(`/api/organizations/${workshop.organization_id}/workshops`)
        if (!res.ok) return
        const json = await res.json()
        const all: WorkshopRow[] = json.workshops || []
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
  }, [workshop])

  const fetchInterest = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/workshops/${id}/interest`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) setInterest(data.data)
        }
      } catch {
        /* ignore */
      }
    },
    []
  )

  useEffect(() => {
    if (workshop?.id) fetchInterest(workshop.id)
  }, [workshop?.id, fetchInterest])

  const handleInterestClick = async () => {
    if (!workshop?.id || interestLoading) return
    try {
      setInterestLoading(true)
      const response = await fetch(`/api/workshops/${workshop.id}/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const interestResponse = await fetch(`/api/workshops/${workshop.id}/interest`)
          if (interestResponse.ok) {
            const interestData = await interestResponse.json()
            if (interestData.success) setInterest(interestData.data)
          }
        }
      }
    } catch {
      /* ignore */
    } finally {
      setInterestLoading(false)
    }
  }

  const getNavigationConfig = () => {
    if (tenantId === 'oolite') return ooliteConfig
    if (tenantId === 'bakehouse') return bakehouseConfig
    if (tenantId === 'madarts') return madartsConfig
    return ooliteConfig
  }

  if (tenantLoading || loading) {
    return (
      <TenantLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </TenantLayout>
    )
  }

  if (tenantError || error) {
    return (
      <TenantLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-destructive">Error</h1>
            <p className="text-muted-foreground">{tenantError || error}</p>
          </div>
        </div>
      </TenantLayout>
    )
  }

  if (!workshop) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-background">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <h1 className="mb-4 text-3xl font-bold">Workshop not found</h1>
            <Link href={`/o/${slug}/workshops`}>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to workshops
              </Button>
            </Link>
          </div>
        </div>
      </TenantLayout>
    )
  }

  const marketing = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
    title: workshop.title,
    id: workshop.id,
  })

  const levelLabel =
    workshop.level ||
    workshop.learn_difficulty ||
    'beginner'

  const outcomes =
    workshop.outcomes && workshop.outcomes.length > 0
      ? workshop.outcomes
      : []

  const bookHref = `/o/${slug}/bookings?workshopId=${workshop.id}&type=workshop`

  const isLearnAi =
    isLearnAiWorkshopSlug(workshopKey) || isLearnAiWorkshopSlug(marketing.slug)
  const hasPublicMarkdownChapters = workshopSlugHasPublicMarkdownChapters(marketing.slug)
  const showLearnTabs =
    Boolean(workshop.has_learn_content) || isLearnAi || hasPublicMarkdownChapters

  const bannerImageUrl = resolveWorkshopHeroBannerImageUrl(workshop, marketing)
  const galleryThumbs = workshopGalleryThumbsExcludingHero(marketing, bannerImageUrl)

  const enrollCta = resolveWorkshopEnrollCta(marketing, bookHref, {
    workshopId: workshop.id,
    isSignedIn: Boolean(isSignedIn),
    orgSlug: slug,
    workshopUrlKey: workshopKey,
  })
  const skillsList = getWorkshopSkillsYoullLearn(marketing, workshop)

  return (
    <TenantLayout>
      <div className="min-h-screen bg-background">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8">
            <Link href={`/o/${slug}/workshops`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to workshops
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-12 lg:col-span-2">
              {isLearnAi ? (
                <>
                  <LearnAiWorkshopNav orgSlug={slug} />
                  <LearnAiLanding orgSlug={slug} workshopTitle={workshop.title} />
                </>
              ) : (
                <>
                  <WorkshopHero
                    workshop={workshop}
                    marketing={marketing}
                    levelLabel={levelLabel}
                    enrollCta={enrollCta}
                    enrollSurface="tenant"
                  />

                  {skillsList.length > 0 ? (
                    <WorkshopSkillsYoullLearn skills={skillsList} />
                  ) : null}

                  {galleryThumbs.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {galleryThumbs.map((url, i) => (
                        <div
                          key={i}
                          className="aspect-square overflow-hidden rounded-lg bg-muted"
                        >
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
                  <TabsList className="inline-flex h-11 gap-1 p-1">
                    <TabsTrigger
                      value="workshop"
                      className="size-9 shrink-0 p-0 sm:size-10"
                      title="Workshop"
                    >
                      <FileText className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="sr-only">Workshop</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="learn"
                      className="size-9 shrink-0 p-0 sm:size-10"
                      title="Learn"
                    >
                      <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="sr-only">Learn</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="workshop" className="mt-8 space-y-12">
                    <WorkshopDetailMainColumn
                      workshop={workshop}
                      marketing={marketing}
                      relatedList={relatedList}
                      orgSlug={slug}
                    />
                  </TabsContent>
                  <TabsContent value="learn" className="mt-8">
                    <WorkshopLearnTab workshop={workshop} orgSlug={slug} />
                  </TabsContent>
                </Tabs>
              ) : (
                <WorkshopDetailMainColumn
                  workshop={workshop}
                  marketing={marketing}
                  relatedList={relatedList}
                  orgSlug={slug}
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
                      {workshop.price === 0 || workshop.price == null
                        ? 'Free'
                        : `$${workshop.price}`}
                    </span>
                  </div>
                  {interest && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest</span>
                      <span className="font-medium text-primary">
                        {interest.interest_count} people
                      </span>
                    </div>
                  )}
                  {workshop.featured && (
                    <div className="flex items-center gap-1 text-amber-600">
                      <Star className="h-4 w-4" />
                      <span>Featured</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <WorkshopCtaBand
                marketing={marketing}
                bookHref={bookHref}
                onInterest={handleInterestClick}
                interestDisabled={interestLoading || interest?.user_interested}
                interestLabel={
                  interest?.user_interested ? 'Interest recorded' : undefined
                }
              />

              <Button asChild variant="outline" size="sm" className="w-full">
                <Link
                  href={`/o/${slug}/workshops/${encodeURIComponent(marketing.slug || workshopKey)}/packet`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Packet page
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
      </div>
    </TenantLayout>
  )
}
