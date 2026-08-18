import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BadgeCheck,
  Building2,
  HeartHandshake,
  ShieldAlert,
  Timer,
} from 'lucide-react'
import {
  FabricateChrome,
  FabricateCtaRow,
} from '@/components/dcc/fabrication/FabricateChrome'
import {
  FabricateSectionHeading,
  FabricateSectionMedia,
} from '@/components/dcc/fabrication/FabricateSectionMedia'
import {
  FABRICATION_POLICIES,
  FABRICATION_PROMISE,
  FABRICATION_QUEUE_TIERS,
  FABRICATION_QUOTE_EXAMPLES,
  FABRICATION_RATE_CARDS,
  RESIN_QUOTE_FORMULA_NOTE,
  formatUsd,
  getFabricationColor,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Fabrication pricing',
  description: FABRICATION_PROMISE,
  openGraph: {
    title: `Fabrication pricing | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/pricing',
  },
}

const RATE_ICONS = {
  handshake: HeartHandshake,
  'badge-check': BadgeCheck,
  building: Building2,
} as const

export default function FabricatePricingPage() {
  return (
    <FabricateChrome current="pricing">
      <header className="mb-8 grid min-w-0 items-center gap-6 md:mb-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
            Transparent rates
          </p>
          <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Fabrication pricing
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
            {FABRICATION_PROMISE}
          </p>
          <FabricateCtaRow className="mt-6" />
        </div>
        <FabricateSectionMedia mediaId="pricing" colorTokenId="teal" priority />
      </header>

      <section className="mb-10 space-y-5 md:mb-12 md:space-y-6 xl:mb-14">
        <FabricateSectionHeading
          title="Rate cards"
          Icon={BadgeCheck}
          colorTokenId="teal"
        />
        <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-3 xl:gap-5">
          {FABRICATION_RATE_CARDS.map((card) => {
            const Icon = RATE_ICONS[card.iconKey]
            const color = getFabricationColor(card.colorTokenId)
            return (
              <article
                key={card.id}
                className={cn(
                  'rounded-2xl border p-4 sm:p-5',
                  color.border,
                  color.surface
                )}
              >
                <h2
                  className={cn(
                    'inline-flex items-center gap-2 text-base font-semibold md:text-lg',
                    color.heading
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-full',
                      color.icon
                    )}
                  >
                    <Icon aria-hidden className="h-4 w-4" />
                  </span>
                  {card.label}
                </h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {card.summary}
                </p>
                {card.membershipNote ? (
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {card.membershipNote}
                  </p>
                ) : null}
                <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    ['Job setup', formatUsd(card.setup)],
                    ['Machine time', `${formatUsd(card.machineHour)} / hr`],
                    ['Material', `${formatUsd(card.materialGram)} / g`],
                    ['Human labor', `${formatUsd(card.laborHour)} / hr`],
                    ['Minimum', formatUsd(card.minimum)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-white/80 px-3 py-2 dark:bg-neutral-950/50"
                    >
                      <dt className="font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                        {label}
                      </dt>
                      <dd className="mt-0.5 font-mono text-sm text-neutral-900 dark:text-neutral-100">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            )
          })}
        </div>
      </section>

      <p className="mb-10 text-sm text-neutral-600 dark:text-neutral-400 md:mb-12">
        {RESIN_QUOTE_FORMULA_NOTE} See also the DCC OS catalog at{' '}
        <Link href="/pricing" className="underline">
          /pricing
        </Link>
        .
      </p>

      <section className="mb-10 md:mb-12 xl:mb-14">
        <FabricateSectionHeading
          title="Worked examples"
          description="Estimates use setup + machine + material + labor, then the tier minimum."
          Icon={Handshake}
          colorTokenId="cyan"
        />
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {FABRICATION_QUOTE_EXAMPLES.map((ex) => (
            <article
              key={ex.id}
              className="rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-4 sm:p-5 dark:bg-neutral-900/40"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {ex.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {ex.specs}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {ex.lines.map((line) => (
                  <li
                    key={`${ex.id}-${line.label}`}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--cdc-border)] pt-2 first:border-t-0 first:pt-0"
                  >
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {line.label}
                      {line.note ? (
                        <span className="mt-0.5 block text-xs text-neutral-500">
                          {line.note}
                        </span>
                      ) : null}
                    </span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                      {line.totalLabel}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10 md:mb-12">
        <FabricateSectionHeading
          title="Queue / turnaround"
          Icon={Timer}
          colorTokenId="sky"
        />
        <div className="mt-2 overflow-x-auto rounded-2xl border border-[var(--cdc-border)]">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--cdc-border)] bg-neutral-50 font-mono text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900/50">
                <th className="px-3 py-2.5 font-medium sm:px-4">Queue</th>
                <th className="px-3 py-2.5 font-medium sm:px-4">Turnaround</th>
                <th className="px-3 py-2.5 font-medium sm:px-4">Pricing</th>
              </tr>
            </thead>
            <tbody>
              {FABRICATION_QUEUE_TIERS.map((q) => (
                <tr key={q.id} className="border-b border-[var(--cdc-border)]">
                  <td className="px-3 py-3 font-medium sm:px-4">{q.label}</td>
                  <td className="px-3 py-3 text-neutral-600 dark:text-neutral-400 sm:px-4">
                    {q.turnaround}
                  </td>
                  <td className="px-3 py-3 font-mono sm:px-4">{q.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-4">
        <FabricateSectionHeading
          title="Failure / reprint policy"
          Icon={ShieldAlert}
          colorTokenId="amber"
        />
        <dl className="mt-2 grid gap-4 md:grid-cols-2">
          {FABRICATION_POLICIES.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/20"
            >
              <dt className="font-medium text-amber-950 dark:text-amber-100">
                {p.title}
              </dt>
              <dd className="mt-1 text-sm text-amber-950/80 dark:text-amber-100/80">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </FabricateChrome>
  )
}
