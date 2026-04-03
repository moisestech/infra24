'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import { ArrowLeft, BookOpen, FileText, GraduationCap, Star } from 'lucide-react'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { isWorkshopUuid } from '@/lib/workshops/workshop-routing'
import { getWorkshopsLandingContent } from '@/lib/orgs/oolite/workshops-landing-content'
import { WorkshopHero } from '@/components/workshops/marketing/WorkshopHero'
import { WorkshopOutcomeStrip } from '@/components/workshops/marketing/WorkshopOutcomeStrip'
import { WorkshopAudienceSplit } from '@/components/workshops/marketing/WorkshopAudienceSplit'
import { WorkshopAgenda } from '@/components/workshops/marketing/WorkshopAgenda'
import { WorkshopMaterialsSplit } from '@/components/workshops/marketing/WorkshopMaterialsSplit'
import { WorkshopInstructors } from '@/components/workshops/marketing/WorkshopInstructors'
import { WorkshopDeliveryHistory } from '@/components/workshops/marketing/WorkshopDeliveryHistory'
import { WorkshopTestimonials } from '@/components/workshops/marketing/WorkshopTestimonials'
import { WorkshopFAQ } from '@/components/workshops/marketing/WorkshopFAQ'
import { WorkshopRelated } from '@/components/workshops/marketing/WorkshopRelated'
import { WorkshopCtaBand } from '@/components/workshops/marketing/WorkshopCtaBand'
import { WorkshopResourceLinks } from '@/components/workshops/marketing/WorkshopResourceLinks'
import { InstitutionalInquiryCta } from '@/components/workshops/marketing/InstitutionalInquiryCta'
import { WorkshopLearnTab } from '@/components/workshops/marketing/WorkshopLearnTab'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { CheckCircle } from 'lucide-react'

interface WorkshopInterest {
  interest_count: number
  user_interested: boolean
}

export default function WorkshopDetailPage() {
  const params = useParams()
  const router = useRouter()
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
              <WorkshopHero
                workshop={workshop}
                marketing={marketing}
                levelLabel={levelLabel}
              />

              {marketing.galleryImageUrls && marketing.galleryImageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {marketing.galleryImageUrls.map((url, i) => (
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

              {workshop.has_learn_content ? (
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
                    <WorkshopDetailMain
                      workshop={workshop}
                      marketing={marketing}
                      relatedList={relatedList}
                      orgSlug={slug}
                    />
                  </TabsContent>
                  <TabsContent value="learn" className="mt-8">
                    <WorkshopLearnTab workshop={workshop} />
                  </TabsContent>
                </Tabs>
              ) : (
                <WorkshopDetailMain
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

function WorkshopDetailMain({
  workshop,
  marketing,
  relatedList,
  orgSlug,
}: {
  workshop: WorkshopRow
  marketing: ReturnType<typeof mergeWorkshopMetadata>
  relatedList: WorkshopRow[]
  orgSlug: string
}) {
  return (
    <>
      {workshop.content && (
        <section className="prose prose-neutral max-w-none dark:prose-invert">
          <h2 className="text-2xl font-semibold tracking-tight not-prose">
            About this session
          </h2>
          <div className="whitespace-pre-wrap text-muted-foreground">{workshop.content}</div>
        </section>
      )}

      <WorkshopAgenda
        agenda={marketing.agenda ?? []}
        modulesPreview={marketing.modulesPreview}
      />

      <WorkshopMaterialsSplit
        required={marketing.materialsRequired ?? []}
        provided={marketing.materialsProvided ?? []}
        legacyMaterials={workshop.materials}
      />

      {marketing.packetConcept && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">Packet / async concept</h2>
          <Card>
            <CardContent className="pt-6 text-sm leading-relaxed text-muted-foreground">
              <p className="whitespace-pre-wrap">{marketing.packetConcept}</p>
            </CardContent>
          </Card>
        </section>
      )}

      {workshop.workshop_outline && workshop.workshop_outline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Outline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workshop.workshop_outline.map((section, index) => (
              <div key={index} className="border-l-4 border-primary/30 pl-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{section.section}</h3>
                  <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {section.duration}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {section.topics.map((topic, topicIndex) => (
                    <li key={topicIndex}>• {topic}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {(workshop.learning_objectives?.length || workshop.what_youll_learn?.length) ? (
        <Card>
          <CardHeader>
            <CardTitle>Learning focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workshop.learning_objectives && workshop.learning_objectives.length > 0 && (
              <ul className="space-y-2">
                {workshop.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {objective}
                  </li>
                ))}
              </ul>
            )}
            {workshop.what_youll_learn && workshop.what_youll_learn.length > 0 && (
              <ul className="space-y-2">
                {workshop.what_youll_learn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : null}

      {workshop.prerequisites && workshop.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {workshop.prerequisites.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {workshop.materials_needed && workshop.materials_needed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Materials (legacy)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {workshop.materials_needed.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <WorkshopInstructors
        instructors={marketing.instructors}
        fallbackName={workshop.instructor}
      />

      <WorkshopDeliveryHistory deliveryHistory={marketing.deliveryHistory} />

      <WorkshopTestimonials testimonials={marketing.testimonials} />

      {marketing.resourceLinks && marketing.resourceLinks.length > 0 && (
        <WorkshopResourceLinks links={marketing.resourceLinks} />
      )}

      <WorkshopFAQ items={marketing.faq ?? []} />

      <WorkshopRelated
        currentId={workshop.id}
        related={relatedList}
        orgSlug={orgSlug}
      />
    </>
  )
}
