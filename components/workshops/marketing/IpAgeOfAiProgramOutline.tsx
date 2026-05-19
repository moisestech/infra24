'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { WorkshopModule } from '@/data/ipAgeOfAiWorkshop'

export function IpAgeOfAiProgramOutline({
  modules,
  basePath,
  className,
  headingId,
}: {
  modules: WorkshopModule[]
  basePath: string
  className?: string
  headingId?: string
}) {
  const moduleCount = modules.length
  const lessonLikeCount = modules.reduce((n, m) => n + (m.keyLessonPoints?.length ?? 0), 0)

  return (
    <section
      id="workshop-section-outline"
      className={cn('scroll-mt-28 space-y-6', className)}
      aria-labelledby={headingId ?? 'ip-age-of-ai-program-outline-heading'}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id={headingId ?? 'ip-age-of-ai-program-outline-heading'}
          className="text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Program outline
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{moduleCount}</span> modules
          </span>
          <span className="text-border">·</span>
          <span>
            <span className="font-semibold text-foreground">{lessonLikeCount}</span> focus areas
          </span>
          <span className="text-border">·</span>
          <span>Panel recording + reader</span>
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue={modules[0]?.id}
        className="space-y-3"
      >
        {modules.map((mod) => (
          <AccordionItem
            key={mod.id}
            value={mod.id}
            className="rounded-xl border border-border border-b-0 bg-card px-4 shadow-sm last:border-b-0 data-[state=open]:border-primary/50 data-[state=open]:shadow-md dark:data-[state=open]:border-primary/40"
          >
            <AccordionTrigger className="py-4 text-left hover:no-underline [&[data-state=open]]:text-foreground">
              <span className="flex flex-1 flex-col gap-1 pr-2 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="font-mono text-sm font-semibold text-muted-foreground tabular-nums">
                  {String(mod.moduleNumber).padStart(2, '0')}
                </span>
                <span className="text-base font-semibold text-foreground sm:text-lg">{mod.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 border-t border-border/60 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{mod.summary}</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    Segment {mod.video.startTime}–{mod.video.endTime} · {mod.video.duration}
                  </span>
                </div>
                {mod.keyLessonPoints?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Focus areas
                    </p>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-foreground">
                      {mod.keyLessonPoints.slice(0, 4).map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href={`${basePath}/${mod.id}`}>Open module reader</Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
