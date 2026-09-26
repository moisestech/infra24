import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WorkflowStrip({
  steps,
  className,
}: {
  steps: string[]
  className?: string
}) {
  return (
    <ol
      className={cn(
        'flex flex-col gap-2 md:flex-row md:flex-wrap md:items-stretch',
        className
      )}
    >
      {steps.map((step, i) => (
        <li key={`${step}-${i}`} className="flex min-w-0 flex-1 items-stretch gap-2">
          <div className="flex min-h-16 flex-1 flex-col justify-center rounded-xl border border-[var(--cdc-border)] bg-gradient-to-br from-teal-50 via-white to-violet-50 px-3 py-2 transition-all duration-300 motion-safe:hover:-translate-y-0.5 dark:from-teal-950/30 dark:via-neutral-900/40 dark:to-violet-950/20">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {step}
            </span>
          </div>
          {i < steps.length - 1 ? (
            <ArrowRight
              aria-hidden
              className="mt-6 hidden h-5 w-5 shrink-0 text-neutral-400 md:block"
            />
          ) : null}
        </li>
      ))}
    </ol>
  )
}
