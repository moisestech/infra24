'use client'

import { useState } from 'react'
import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DEFAULT_VISIBLE = 8

export function IpAgeOfAiSkillsYoullLearn({
  skills,
  visibleCount = DEFAULT_VISIBLE,
  className,
  headingId,
}: {
  skills: string[]
  visibleCount?: number
  className?: string
  headingId?: string
}) {
  const [showAll, setShowAll] = useState(false)
  if (!skills.length) return null

  const cap = Math.max(1, visibleCount)
  const shown = showAll ? skills : skills.slice(0, cap)
  const more = skills.length - Math.min(skills.length, cap)

  return (
    <section
      id="workshop-section-skills"
      className={cn(
        'scroll-mt-28 rounded-2xl border border-border bg-card px-5 py-6 shadow-sm sm:px-8 sm:py-8 dark:bg-card/80',
        className
      )}
      aria-labelledby={headingId ?? 'ip-age-of-ai-skills-heading'}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-1">
        <h2
          id={headingId ?? 'ip-age-of-ai-skills-heading'}
          className="text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Skills you&apos;ll learn
        </h2>
        <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Brain className="h-4 w-4 shrink-0" aria-hidden />
          <span className="tabular-nums">{skills.length}</span>
          <span>{skills.length === 1 ? 'skill' : 'skills'}</span>
        </p>
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {shown.map((skill, i) => (
          <li
            key={`${skill}-${i}`}
            className="rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm dark:bg-muted/25"
          >
            {skill}
          </li>
        ))}
      </ul>

      {!showAll && more > 0 ? (
        <div className="mt-5">
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-base font-semibold text-primary"
            onClick={() => setShowAll(true)}
          >
            +{more} more
          </Button>
        </div>
      ) : showAll && skills.length > cap ? (
        <div className="mt-5">
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm font-semibold text-muted-foreground"
            onClick={() => setShowAll(false)}
          >
            Show fewer
          </Button>
        </div>
      ) : null}
    </section>
  )
}
