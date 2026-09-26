import type { Metadata } from 'next'
import Link from 'next/link'
import { UserRound } from 'lucide-react'
import { publicOperatorNames } from '@/lib/dcc/fabrication/operators'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Fabricators',
  description: 'Names of people who fabricate with DCC. Profiles do not include rates or contact details.',
}

export default function FabricatorsPage() {
  const color = getFabricationColor('teal')
  const people = publicOperatorNames()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className={cn('inline-flex h-14 w-14 items-center justify-center rounded-2xl', color.icon)}>
        <UserRound aria-hidden className="h-7 w-7" />
      </span>
      <p className="cdc-font-mono-accent mt-6 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
        DCC fabrication
      </p>
      <h1 className="cdc-font-display mt-2 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-5xl">
        Fabricators
      </h1>
      <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
        Names only. Rates, contact details, and machine access stay off this page.
      </p>
      <ul className="mt-8 space-y-3">
        {people.map((person) => (
          <li key={person.id}>
            <Link
              href={`/fabricators/${person.id}`}
              className="block rounded-2xl border border-[var(--cdc-border)] px-4 py-4 text-base font-semibold text-neutral-950 hover:bg-neutral-50 dark:text-neutral-50 dark:hover:bg-neutral-900"
            >
              {person.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
