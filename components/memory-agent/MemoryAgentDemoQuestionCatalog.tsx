'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Loader2, Play, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DEMO_QUESTION_GROUP_LABELS,
  DEMO_QUESTION_GROUP_ORDER,
  type DemoQuestionGroup,
  type MemoryAgentDemoQuestion,
} from '@/lib/oolite/airtable-question-catalog-shared'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

type DemoQuestionsResponse = {
  ok: boolean
  grouped?: Record<DemoQuestionGroup, MemoryAgentDemoQuestion[]>
  count?: number
  error?: string
}

type MemoryAgentDemoQuestionCatalogProps = {
  orgSlug: string
  staffMode: boolean
  onAskQuestion: (question: string) => void
  className?: string
}

export function MemoryAgentDemoQuestionCatalog({
  orgSlug,
  staffMode,
  onAskQuestion,
  className,
}: MemoryAgentDemoQuestionCatalogProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [grouped, setGrouped] = useState<Record<DemoQuestionGroup, MemoryAgentDemoQuestion[]> | null>(
    null
  )
  const [openGroups, setOpenGroups] = useState<Set<DemoQuestionGroup>>(
    () => new Set(['working_now'] as DemoQuestionGroup[])
  )

  const load = useCallback(async () => {
    if (orgSlug !== 'oolite') {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/oolite/memory-agent/demo-questions')
      const data = (await res.json()) as DemoQuestionsResponse
      if (!data.ok || !data.grouped) {
        setError(data.error || 'Could not load demo questions.')
        setGrouped(null)
      } else {
        setGrouped(data.grouped)
      }
    } catch {
      setError('Could not load demo questions.')
      setGrouped(null)
    } finally {
      setLoading(false)
    }
  }, [orgSlug])

  useEffect(() => {
    void load()
  }, [load])

  if (orgSlug !== 'oolite') return null

  const toggleGroup = (g: DemoQuestionGroup) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(g)) next.delete(g)
      else next.add(g)
      return next
    })
  }

  return (
    <section
      className={cn(
        'rounded-xl border border-[var(--ma-border)] bg-[var(--ma-surface-muted)] p-4',
        className
      )}
    >
      <div className="mb-3 flex items-start gap-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--ma-primary)]" aria-hidden />
        <div>
          <h2 className="text-sm font-semibold text-[var(--ma-text)]">
            Questions the Oolite Memory Agent Can Answer
          </h2>
          <p className={cn('mt-0.5 text-xs', ma.caption)}>
            Leadership demo catalog from Airtable — grouped by capability phase.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-[var(--ma-text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading question catalog…
        </div>
      ) : error ? (
        <p className="text-sm text-amber-700 dark:text-amber-300">{error}</p>
      ) : grouped ? (
        <div className="space-y-2">
          {DEMO_QUESTION_GROUP_ORDER.map((groupKey) => {
            const items = grouped[groupKey]
            if (!items?.length) return null
            const open = openGroups.has(groupKey)
            return (
              <div
                key={groupKey}
                className="overflow-hidden rounded-lg border border-[var(--ma-border)] bg-[var(--ma-surface)]"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-[var(--ma-text)] hover:bg-[color:color-mix(in_srgb,var(--ma-primary)_6%,var(--ma-surface))]"
                  onClick={() => toggleGroup(groupKey)}
                >
                  <span className="flex items-center gap-2">
                    {open ? (
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
                    )}
                    {DEMO_QUESTION_GROUP_LABELS[groupKey]}
                  </span>
                  <span className="text-xs font-normal text-[var(--ma-text-muted)]">
                    {items.length}
                  </span>
                </button>
                {open ? (
                  <ul className="divide-y divide-[var(--ma-border)] border-t border-[var(--ma-border)]">
                    {items.map((item) => (
                      <li key={item.id} className="px-3 py-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 space-y-1.5">
                            <p className="text-sm font-medium leading-snug text-[var(--ma-text)]">
                              {item.question}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.capabilityPhase ? (
                                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', ma.chip)}>
                                  {item.capabilityPhase}
                                </span>
                              ) : null}
                              {item.supportStatus ? (
                                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', ma.chip)}>
                                  {item.supportStatus}
                                </span>
                              ) : null}
                              {item.publicSafe ? (
                                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-800 dark:text-green-200">
                                  Public safe
                                </span>
                              ) : staffMode ? (
                                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-900 dark:text-amber-100">
                                  Staff / pending
                                </span>
                              ) : null}
                              {item.testStatus ? (
                                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', ma.chip)}>
                                  {item.testStatus}
                                </span>
                              ) : null}
                            </div>
                            {staffMode && item.expectedAnswerPattern ? (
                              <p className={cn('line-clamp-2 text-xs', ma.caption)}>
                                Expected: {item.expectedAnswerPattern}
                              </p>
                            ) : null}
                            {staffMode && item.sourceTables ? (
                              <p className={cn('text-[11px]', ma.caption)}>Sources: {item.sourceTables}</p>
                            ) : null}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className={cn('shrink-0 gap-1.5', ma.btnOutline)}
                            onClick={() => onAskQuestion(item.question)}
                          >
                            <Play className="h-3.5 w-3.5" aria-hidden />
                            Ask
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
