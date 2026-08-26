import {
  CAPABILITY_STAGE_META,
  getCapabilityStageMeta,
  type CapabilityStage,
} from '@/lib/dcc/fabrication/capabilities'
import { cn } from '@/lib/utils'

export function CapabilityMaturityStrip({
  activeStage,
  className,
}: {
  activeStage?: CapabilityStage
  className?: string
}) {
  return (
    <ol
      className={cn(
        'grid gap-2 sm:grid-cols-2 xl:grid-cols-6',
        className
      )}
    >
      {CAPABILITY_STAGE_META.map((stage) => {
        const active = activeStage === stage.id
        return (
          <li
            key={stage.id}
            className={cn(
              'rounded-xl border px-3 py-3',
              active
                ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/30'
                : 'border-[var(--cdc-border)] bg-white dark:bg-neutral-950'
            )}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              Level {stage.level}
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {stage.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              {stage.meaning}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

export function CapabilityStageChip({ stage }: { stage: CapabilityStage }) {
  const meta = getCapabilityStageMeta(stage)
  return (
    <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
      {meta.label}
    </span>
  )
}
