'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ipAgeOfAiLeadParagraphs,
  KNIGHT_FOUNDATION_LOGO_SRC,
} from '@/lib/workshops/ip-age-of-ai-program'
import { IpAgeOfAiProgramInstructors } from '@/components/workshops/marketing/IpAgeOfAiProgramInstructors'
import { IpAgeOfAiProgramOutline } from '@/components/workshops/marketing/IpAgeOfAiProgramOutline'
import { ipAgeOfAiModules } from '@/data/ipAgeOfAiWorkshop'

export function IpAgeOfAiProgramIntro({
  orgSlug,
  showWorkshopNavLink = true,
  className,
}: {
  orgSlug: string
  /** Hide redundant “details” button when this block already sits on the workshop page */
  showWorkshopNavLink?: boolean
  className?: string
}) {
  return (
    <section
      id="workshop-section-program"
      className={cn(
        'scroll-mt-28 space-y-12 rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm md:p-10 dark:bg-card/60',
        className
      )}
      aria-labelledby="ip-age-of-ai-program-heading"
    >
      <h2 id="ip-age-of-ai-program-heading" className="sr-only">
        Program outline, materials, and instructors
      </h2>

      <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 dark:bg-muted/15">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Supported by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={KNIGHT_FOUNDATION_LOGO_SRC}
            alt="Knight Foundation"
            className="h-10 w-auto max-h-12 max-w-[min(100%,220px)] object-contain object-left"
            loading="lazy"
          />
        </div>
        {showWorkshopNavLink ? (
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href={`/o/${encodeURIComponent(orgSlug)}/workshop/ip-age-of-ai`}>
              Workshop details &amp; enroll flow
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:text-muted-foreground">
        {ipAgeOfAiLeadParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <IpAgeOfAiProgramOutline modules={ipAgeOfAiModules} basePath="/workshops/ip-age-of-ai" />

      <IpAgeOfAiProgramInstructors sectionId="workshop-section-speakers" />
    </section>
  )
}
