import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFabricationColor, type FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'
import { cn } from '@/lib/utils'

const STEPS: {
  id: string
  label: string
  detail: string
  href: string
  color: FabricationColorTokenId
}[] = [
  { id: 'learn', label: 'Learn', detail: 'Workshop', href: '/workshops', color: 'teal' },
  { id: 'test', label: 'Test', detail: 'Small object', href: '/fabricate/field-lab', color: 'amber' },
  { id: 'make', label: 'Make', detail: 'Fabrication service', href: '/fabricate', color: 'indigo' },
  { id: 'finish', label: 'Finish', detail: 'Presentation-ready object', href: '/fabricate/finishes', color: 'violet' },
  { id: 'return', label: 'Return', detail: 'Next project / advanced workshop', href: '/fabricate/quote', color: 'sky' },
]

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
        {STEPS.map((step, i) => {
          const color = getFabricationColor(step.color)
          return (
          <li key={step.id} className="flex min-w-0 flex-1 items-stretch gap-3">
            <Link
              href={step.href}
              className={cn(
                'flex min-h-16 flex-1 flex-col justify-center rounded-xl border bg-gradient-to-br px-3 py-2 transition duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md',
                color.border,
                color.gradient
              )}
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
          )
        })}
      </ol>
    </section>
  )
}
