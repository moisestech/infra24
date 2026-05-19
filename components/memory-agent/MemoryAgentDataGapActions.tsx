'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DATA_GAP_SOURCE_LABEL,
} from '@/lib/memory-agent/data-gap-actions'
import { ma } from '@/lib/memory-agent/ui-tokens'
import type { MemoryAgentDataGap, MemoryAgentMode } from '@/types/memory-agent'
import { cn } from '@/lib/utils'

const GAP_TYPE_LABEL: Record<MemoryAgentDataGap['gapType'], string> = {
  missing_person_data: 'Person data',
  missing_programming_data: 'Programming data',
  missing_date: 'Missing date',
  missing_cta: 'Missing RSVP',
  missing_visibility: 'Visibility',
  missing_public_approval: 'Public approval',
  empty_time_window: 'Empty schedule',
  ambiguous_event_type: 'Event type',
}

type MemoryAgentDataGapActionsProps = {
  gaps: MemoryAgentDataGap[]
  mode: MemoryAgentMode
  /** Plain string gaps when no structured gaps exist. */
  fallbackStrings?: string[]
  className?: string
}

export function MemoryAgentDataGapActions({
  gaps,
  mode,
  fallbackStrings = [],
  className,
}: MemoryAgentDataGapActionsProps) {
  const hasStructured = gaps.length > 0
  const hasFallback = fallbackStrings.length > 0
  if (!hasStructured && !hasFallback) return null

  const isStaff = mode === 'staff_operator'

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">
        Data readiness
      </p>
      {hasStructured ? (
        <ul className="grid min-w-0 gap-2">
          {gaps.map((gap) => {
            const showAction = isStaff && Boolean(gap.actionHref && gap.actionLabel)
            return (
              <li key={gap.id}>
                <Card
                  className={cn(
                    ma.card,
                    'overflow-hidden border-dashed border-amber-200 bg-amber-50/50'
                  )}
                >
                  <CardContent className="space-y-2 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900">
                        {GAP_TYPE_LABEL[gap.gapType]}
                      </span>
                      <span className="text-[10px] uppercase tracking-wide text-amber-800/70">
                        {DATA_GAP_SOURCE_LABEL[gap.source]}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-950">{gap.message}</p>
                    {showAction ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className={cn('h-8 w-full gap-1.5 sm:w-auto', ma.btnOutline)}
                        asChild
                      >
                        {gap.actionHref!.startsWith('http') ? (
                          <a href={gap.actionHref} target="_blank" rel="noopener noreferrer">
                            {gap.actionLabel}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                          </a>
                        ) : (
                          <Link href={gap.actionHref!}>
                            {gap.actionLabel}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                          </Link>
                        )}
                      </Button>
                    ) : gap.actionLabel && isStaff ? (
                      <p className="text-[11px] font-medium text-amber-900/80">
                        Action: {gap.actionLabel}
                      </p>
                    ) : null}
                    {!isStaff && gap.actionLabel ? (
                      <p className="text-[11px] text-amber-900/70">
                        Staff can update the source record to improve future answers.
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="rounded-md border border-dashed border-amber-200 bg-amber-50/50 p-2 text-xs text-amber-900">
          {fallbackStrings.join(' · ')}
        </div>
      )}
    </div>
  )
}
