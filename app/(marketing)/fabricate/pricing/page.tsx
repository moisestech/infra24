import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FabricateChrome,
  FabricateCtaRow,
} from '@/components/dcc/fabrication/FabricateChrome'
import {
  FABRICATION_POLICIES,
  FABRICATION_PROMISE,
  FABRICATION_QUEUE_TIERS,
  FABRICATION_QUOTE_EXAMPLES,
  FABRICATION_RATE_CARDS,
  RESIN_QUOTE_FORMULA_NOTE,
  formatUsd,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Fabrication pricing',
  description: FABRICATION_PROMISE,
  openGraph: {
    title: `Fabrication pricing | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/pricing',
  },
}

export default function FabricatePricingPage() {
  return (
    <FabricateChrome current="pricing">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          Transparent rates
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Fabrication pricing
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {FABRICATION_PROMISE}
        </p>
        <FabricateCtaRow className="mt-6" />
      </header>

      <section className="mb-12 space-y-8">
        {FABRICATION_RATE_CARDS.map((card) => (
          <article
            key={card.id}
            className="rounded-2xl border border-[var(--cdc-border)] p-5 sm:p-6"
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {card.label}
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {card.summary}
            </p>
            {card.membershipNote ? (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {card.membershipNote}
              </p>
            ) : null}
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Job setup', formatUsd(card.setup)],
                ['Machine time', `${formatUsd(card.machineHour)} / print hour`],
                ['Material', `${formatUsd(card.materialGram)} / gram`],
                ['Human labor', `${formatUsd(card.laborHour)} / hour`],
                ['Minimum order', formatUsd(card.minimum)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-neutral-50 px-3 py-2.5 dark:bg-neutral-900/50">
                  <dt className="font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                    {label}
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-neutral-900 dark:text-neutral-100">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>

      <p className="mb-12 text-sm text-neutral-600 dark:text-neutral-400">
        {RESIN_QUOTE_FORMULA_NOTE} See also the DCC OS catalog at{' '}
        <Link href="/pricing" className="underline">
          /pricing
        </Link>
        .
      </p>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Worked examples
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Estimates use setup + machine + material + labor, then the tier minimum.
        </p>
        <div className="mt-5 space-y-4">
          {FABRICATION_QUOTE_EXAMPLES.map((ex) => (
            <article
              key={ex.id}
              className="rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-5 dark:bg-neutral-900/40"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {ex.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{ex.specs}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {ex.lines.map((line) => (
                  <li
                    key={`${ex.id}-${line.label}`}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--cdc-border)] pt-2 first:border-t-0 first:pt-0"
                  >
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {line.label}
                      {line.note ? (
                        <span className="mt-0.5 block text-xs text-neutral-500">{line.note}</span>
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

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Queue / turnaround
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--cdc-border)] font-mono text-xs uppercase tracking-wide text-neutral-500">
                <th className="py-2 pr-3 font-medium">Queue</th>
                <th className="py-2 pr-3 font-medium">Turnaround</th>
                <th className="py-2 font-medium">Pricing</th>
              </tr>
            </thead>
            <tbody>
              {FABRICATION_QUEUE_TIERS.map((q) => (
                <tr key={q.id} className="border-b border-[var(--cdc-border)]">
                  <td className="py-3 pr-3 font-medium">{q.label}</td>
                  <td className="py-3 pr-3 text-neutral-600 dark:text-neutral-400">
                    {q.turnaround}
                  </td>
                  <td className="py-3 font-mono">{q.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Failure / reprint policy
        </h2>
        <dl className="mt-4 space-y-4">
          {FABRICATION_POLICIES.map((p) => (
            <div key={p.id}>
              <dt className="font-medium text-neutral-900 dark:text-neutral-100">{p.title}</dt>
              <dd className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{p.body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </FabricateChrome>
  )
}
