'use client'

import { MEMORY_AGENT_ROADMAP_PHASES } from '@/lib/memory-agent/roadmap'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  done: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-800',
  current:
    'bg-cyan-100 text-cyan-900 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-100 dark:border-cyan-800',
  planned:
    'bg-[var(--ma-surface-muted)] text-[var(--ma-text-muted)] border-[var(--ma-border)]',
}

const statusLabel: Record<string, string> = {
  done: 'Shipped',
  current: 'In progress',
  planned: 'Planned',
}

export function MemoryAgentRoadmap() {
  return (
    <section className={cn('rounded-xl p-4 shadow-sm', ma.card)}>
      <h2 className={cn('text-sm font-semibold uppercase tracking-wide', ma.caption)}>
        Roadmap
      </h2>
      <p className={cn('mt-1', ma.caption)}>
        Where we are building toward a full institutional memory product. This page is safe to
        share internally even when API keys are still being wired.
      </p>
      <ol className="mt-4 space-y-3">
        {MEMORY_AGENT_ROADMAP_PHASES.map((phase) => (
          <li
            key={phase.id}
            className={cn(
              'rounded-lg border px-3 py-2 text-sm',
              statusStyles[phase.status] ?? statusStyles.planned
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium">{phase.title}</span>
              <span className="text-[10px] font-semibold uppercase opacity-80">
                {statusLabel[phase.status] ?? phase.status}
              </span>
            </div>
            <p className="mt-1 text-xs leading-snug opacity-90">{phase.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
