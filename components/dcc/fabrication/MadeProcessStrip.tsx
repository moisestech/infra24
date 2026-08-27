import { Map, Lightbulb, Box, CheckCircle2 } from 'lucide-react'
import {
  ARTIST_PRODUCTION_MADE_STEPS,
  ARTIST_PRODUCTION_MADE_TAGLINE,
  ARTIST_PRODUCTION_PROMISE,
} from '@/lib/marketing/artist-production-narrative'
import { cn } from '@/lib/utils'

const STEP_ICONS = [Map, Lightbulb, Box, CheckCircle2] as const

/**
 * How a paid production job moves. Distinct from FabricationFlywheel
 * (Learn → Test → Make — how an artist moves through DCC).
 */
export function MadeProcessStrip({ className }: { className?: string }) {
  return (
    <section
      id="made"
      className={cn(
        'scroll-mt-24 rounded-2xl border border-[var(--cdc-border)] p-4 sm:p-5',
        className
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
        How a project moves
      </p>
      <h2 className="mt-1 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {ARTIST_PRODUCTION_MADE_TAGLINE}
      </h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {ARTIST_PRODUCTION_PROMISE} Every job can be different; the path around it stays the same.
      </p>
      <ol className="mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
        {ARTIST_PRODUCTION_MADE_STEPS.map((step, i) => {
          const Icon = STEP_ICONS[i]
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-stretch">
              <div className="flex min-h-16 flex-1 flex-col justify-center rounded-xl border border-[var(--cdc-border)] bg-neutral-50 px-3 py-2 dark:bg-neutral-900/40">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                  {step.letter}
                </span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {step.label}
                </span>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">{step.detail}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
