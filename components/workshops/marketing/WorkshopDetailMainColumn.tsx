import { BookOpen, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { WorkshopAgenda } from '@/components/workshops/marketing/WorkshopAgenda'
import { WorkshopMaterialsSplit } from '@/components/workshops/marketing/WorkshopMaterialsSplit'
import { WorkshopInstructors } from '@/components/workshops/marketing/WorkshopInstructors'
import { WorkshopDeliveryHistory } from '@/components/workshops/marketing/WorkshopDeliveryHistory'
import { WorkshopTestimonials } from '@/components/workshops/marketing/WorkshopTestimonials'
import { WorkshopResourceLinks } from '@/components/workshops/marketing/WorkshopResourceLinks'
import { WorkshopFAQ } from '@/components/workshops/marketing/WorkshopFAQ'
import { WorkshopRelated } from '@/components/workshops/marketing/WorkshopRelated'
import type { WorkshopRow } from '@/components/workshops/marketing/types'

export function WorkshopDetailMainColumn({
  workshop,
  marketing,
  relatedList,
  orgSlug,
  catalogSurface = 'org',
}: {
  workshop: WorkshopRow
  marketing: ReturnType<typeof mergeWorkshopMetadata>
  relatedList: WorkshopRow[]
  orgSlug: string
  catalogSurface?: 'org' | 'dcc'
}) {
  return (
    <>
      {workshop.content && (
        <section className="prose prose-neutral max-w-none dark:prose-invert">
          <h2 className="text-2xl font-semibold tracking-tight not-prose">About this session</h2>
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
        catalogSurface={catalogSurface}
      />
    </>
  )
}
