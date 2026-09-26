import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  THREE_D_FLYWHEEL_LEAD,
  THREE_D_FLYWHEEL_STEPS,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { curriculumCardInteractive } from '@/components/dcc/education/3d-curriculum/interactive'

const FLYWHEEL_COLORS = [
  'teal',
  'cyan',
  'indigo',
  'violet',
  'emerald',
  'amber',
  'orange',
  'rose',
] as const

export function CurriculumFlywheel({
  className,
  embedded = false,
}: {
  className?: string
  embedded?: boolean
}) {
  const body = (
    <ol
      className={cn(
        !embedded && 'mt-8',
        'flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch'
      )}
    >
      {THREE_D_FLYWHEEL_STEPS.map((step, i) => {
        const color = getFabricationColor(FLYWHEEL_COLORS[i] ?? 'slate')
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-stretch gap-3">
            <div
              className={cn(
                'flex min-h-20 flex-1 flex-col justify-center rounded-xl border px-3 py-3',
                curriculumCardInteractive(color)
              )}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
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
                className="mt-7 hidden h-5 w-5 shrink-0 text-neutral-400 md:block"
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )

  if (embedded) return body

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
      {body}
    </section>
  )
}
