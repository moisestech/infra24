import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 'learn', label: 'Learn', detail: 'Workshop', href: '/workshops' },
  { id: 'test', label: 'Test', detail: 'Small object', href: '/fabricate/field-lab' },
  { id: 'make', label: 'Make', detail: 'Fabrication service', href: '/fabricate' },
  { id: 'finish', label: 'Finish', detail: 'Presentation-ready object', href: '/fabricate/finishes' },
  { id: 'return', label: 'Return', detail: 'Next project / advanced workshop', href: '/fabricate/quote' },
] as const

export function FabricationFlywheel({
  className,
  title = 'From workshop to fabrication',
}: {
  className?: string
  title?: string
}) {
  return (
    <section className={cn('rounded-2xl border border-[var(--cdc-border)] p-4 sm:p-5', className)}>
      <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Learn in a workshop, test a small object, fabricate, finish, then return with the next
        project.
      </p>
      <ol className="mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
        {STEPS.map((step, i) => (
          <li key={step.id} className="flex min-w-0 flex-1 items-stretch gap-3">
            <Link
              href={step.href}
              className="flex min-h-16 flex-1 flex-col justify-center rounded-xl border border-[var(--cdc-border)] bg-neutral-50 px-3 py-2 dark:bg-neutral-900/40"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {step.label}
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">{step.detail}</span>
            </Link>
            {i < STEPS.length - 1 ? (
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
