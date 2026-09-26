import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WorkflowStrip({
  steps,
  className,
}: {
  steps: { label: string; href?: string }[]
  className?: string
}) {
  return (
    <ol
      className={cn(
        'flex flex-col gap-2 md:flex-row md:flex-wrap md:items-stretch',
        className
      )}
    >
      {steps.map((step, i) => {
        const cardClass =
          'flex min-h-16 flex-1 flex-col justify-center rounded-xl border border-[var(--cdc-border)] bg-gradient-to-br from-teal-50 via-white to-violet-50 px-3 py-2 dark:from-teal-950/30 dark:via-neutral-900/40 dark:to-violet-950/20'
        return (
          <li key={`${step.label}-${i}`} className="flex min-w-0 flex-1 items-stretch gap-2">
            {step.href ? (
              <Link
                href={step.href}
                className={cn(
                  cardClass,
                  'transition duration-300 hover:border-teal-500 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md dark:hover:border-teal-400'
                )}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {step.label}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-teal-800 dark:text-teal-200">
                  Open session
                  <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                </span>
              </Link>
            ) : (
              <div className={cardClass}>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {step.label}
                </span>
              </div>
            )}
            {i < steps.length - 1 ? (
              <ArrowRight
                aria-hidden
                className="mt-6 hidden h-5 w-5 shrink-0 text-neutral-400 md:block"
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
