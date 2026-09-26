import { Map, Lightbulb, Box, CheckCircle2 } from 'lucide-react'
import { getFabricationColor, type FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'
import {
  ARTIST_PRODUCTION_MADE_STEPS,
  ARTIST_PRODUCTION_MADE_TAGLINE,
  ARTIST_PRODUCTION_PROMISE,
} from '@/lib/marketing/artist-production-narrative'
import { cn } from '@/lib/utils'

const STEP_ICONS = [Map, Lightbulb, Box, CheckCircle2] as const
const STEP_COLORS: FabricationColorTokenId[] = ['cyan', 'indigo', 'amber', 'emerald']

/**
 * How a paid production job moves. Distinct from FabricationFlywheel
 * (Learn → Test → Make — how an artist moves through DCC).
 */
export function MadeProcessStrip({ className }: { className?: string }) {
  return (
    <section
      id="made"
      className={cn(
        'scroll-mt-40 rounded-2xl border border-[var(--cdc-border)] bg-gradient-to-br from-white via-teal-50/40 to-cyan-50/50 p-4 dark:from-neutral-950 dark:via-teal-950/30 dark:to-cyan-950/20 sm:p-5',
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
          const color = getFabricationColor(STEP_COLORS[i] ?? 'teal')
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-stretch">
              <div
                className={cn(
                  'flex min-h-16 flex-1 flex-col justify-center rounded-xl border px-3 py-2 transition duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md',
                  color.border,
                  color.surface
                )}
              >
                <span className={cn('inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]', color.heading)}>
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
