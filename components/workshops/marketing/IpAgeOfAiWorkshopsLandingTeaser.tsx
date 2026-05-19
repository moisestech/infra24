'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ipAgeOfAiCollaboratorsLine,
  ipAgeOfAiLeadParagraphs,
} from '@/lib/workshops/ip-age-of-ai-program'

export function IpAgeOfAiWorkshopsLandingTeaser({
  orgSlug,
  isDark,
  className,
}: {
  orgSlug: string
  isDark: boolean
  className?: string
}) {
  const blurb = ipAgeOfAiLeadParagraphs[0]

  return (
    <div
      className={cn(
        'mb-12 rounded-2xl border px-5 py-6 md:px-8 md:py-8',
        isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-stone-200 bg-white shadow-sm',
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Featured · Skills series
      </p>
      <p
        className={`mt-3 text-base font-semibold leading-snug md:text-lg ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}
      >
        Intellectual property, contracts &amp; AI — studio-ready literacy
      </p>
      <p className={`mt-2 text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
        {ipAgeOfAiCollaboratorsLine}
      </p>
      <p className={`mt-4 text-sm leading-relaxed md:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
        {blurb}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="sm" className="rounded-full">
          <Link href={`/o/${encodeURIComponent(orgSlug)}/workshop/ip-age-of-ai`}>Program details &amp; speakers</Link>
        </Button>
      </div>
    </div>
  )
}
