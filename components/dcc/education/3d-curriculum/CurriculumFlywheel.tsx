import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  THREE_D_FLYWHEEL_LEAD,
  THREE_D_FLYWHEEL_STEPS,
} from '@/lib/dcc/education/3d-curriculum'

export function CurriculumFlywheel({ className }: { className?: string }) {
  return (
    <section
      id="flywheel"
      className={cn('scroll-mt-24', className)}
      aria-labelledby="flywheel-heading"
    >
      <h2
        id="flywheel-heading"
        className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl"
      >
        Why DCC teaches fabrication
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
        {THREE_D_FLYWHEEL_LEAD}
      </p>
      <ol className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
        {THREE_D_FLYWHEEL_STEPS.map((step, i) => (
          <li key={step.id} className="flex min-w-0 flex-1 items-stretch gap-3">
            <div className="flex min-h-16 flex-1 flex-col justify-center rounded-xl border border-[var(--cdc-border)] bg-neutral-50 px-3 py-2 dark:bg-neutral-900/40">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {step.label}
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {step.detail}
              </span>
            </div>
            {i < THREE_D_FLYWHEEL_STEPS.length - 1 ? (
              <ArrowRight
                aria-hidden
                className="mt-6 hidden h-4 w-4 shrink-0 text-neutral-400 md:block"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
