'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  isLearnAiWorkshopSlug,
  learnAiWorkshopPaths,
} from '@/lib/workshops/learn-ai-without-losing-yourself/constants'
import {
  learnAiCurriculumChapters,
  learnAiCurriculumIntro,
} from '@/lib/workshops/learn-ai-without-losing-yourself/curriculum-chapters'
import { LearnAiSubpageShell } from '@/components/workshops/learn-ai/LearnAiSubpageShell'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function LearnAiCurriculumPage() {
  const params = useParams()
  const orgSlug = params.slug as string
  const workshopKey = params.workshopKey as string

  if (!isLearnAiWorkshopSlug(workshopKey)) {
    notFound()
  }

  const paths = learnAiWorkshopPaths(orgSlug)

  return (
    <LearnAiSubpageShell orgSlug={orgSlug} title="Curriculum" lead={learnAiCurriculumIntro}>
      <div className="mb-8 flex flex-wrap gap-4 text-sm">
        <Link
          href={paths.base}
          className="text-primary underline-offset-4 hover:underline"
        >
          ← Workshop overview
        </Link>
        <Link
          href={paths.lab}
          className="text-primary underline-offset-4 hover:underline"
        >
          Facilitator lab →
        </Link>
      </div>

      <Accordion type="multiple" className="w-full">
        {learnAiCurriculumChapters.map((ch) => (
          <AccordionItem key={ch.id} value={ch.id}>
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{ch.title}</span>
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {ch.durationHint}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm text-muted-foreground">
              <p className="leading-relaxed text-foreground/90">{ch.summary}</p>
              {ch.demoSummary ? (
                <p>
                  <span className="font-medium text-foreground">Demo: </span>
                  {ch.demoSummary}
                </p>
              ) : null}
              <div>
                <div className="mb-1 font-medium text-foreground">Objectives</div>
                <ul className="list-disc space-y-1 pl-5">
                  {ch.objectives.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 font-medium text-foreground">Key ideas</div>
                <ul className="list-disc space-y-1 pl-5">
                  {ch.keyIdeas.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </LearnAiSubpageShell>
  )
}
