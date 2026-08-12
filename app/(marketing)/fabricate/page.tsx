import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FabricateChrome,
  FabricateCtaRow,
} from '@/components/dcc/fabrication/FabricateChrome'
import {
  FABRICATION_CRAFTCLOUD_NOTE,
  FABRICATION_FINISH_LEVELS,
  FABRICATION_PROMISE,
  FABRICATION_RATE_CARDS,
  FABRICATION_SERVICE_LANES,
  FABRICATION_WORKSHOP_BOUNDARY,
  RESIN_QUOTE_FORMULA_NOTE,
  formatUsd,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Fabricate',
  description: FABRICATION_PROMISE,
  openGraph: {
    title: `Fabricate | ${dccSiteMeta.organizationName}`,
    url: '/fabricate',
  },
}

export default function FabricateLandingPage() {
  return (
    <FabricateChrome current="home">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          DCC Fabrication
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          Transparent fabrication for artists
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {FABRICATION_PROMISE}
        </p>
        <FabricateCtaRow className="mt-6" />
      </header>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Service lanes
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Pick the lane that matches how finished your file already is.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {FABRICATION_SERVICE_LANES.map((lane) => (
            <article
              key={lane.id}
              className="rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-5 dark:bg-neutral-900/40"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {lane.label}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {lane.summary}
              </p>
              <p className="mt-3 font-mono text-xs text-neutral-500">{lane.typicalTicket}</p>
              <Link
                href={`/fabricate/quote?lane=${lane.id}`}
                className="mt-4 inline-flex text-sm font-medium text-[var(--cdc-teal)] underline"
              >
                Start this lane
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-2xl border border-[var(--cdc-border)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Pricing at a glance
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Artists see setup, machine time, material, and labor before we print.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--cdc-border)] font-mono text-xs uppercase tracking-wide text-neutral-500">
                <th className="py-2 pr-3 font-medium">Tier</th>
                <th className="py-2 pr-3 font-medium">Setup</th>
                <th className="py-2 pr-3 font-medium">Machine</th>
                <th className="py-2 pr-3 font-medium">Material</th>
                <th className="py-2 font-medium">Min</th>
              </tr>
            </thead>
            <tbody>
              {FABRICATION_RATE_CARDS.map((card) => (
                <tr key={card.id} className="border-b border-[var(--cdc-border)]">
                  <td className="py-3 pr-3 font-medium text-neutral-900 dark:text-neutral-100">
                    {card.label}
                  </td>
                  <td className="py-3 pr-3 font-mono">{formatUsd(card.setup)}</td>
                  <td className="py-3 pr-3 font-mono">{formatUsd(card.machineHour)}/hr</td>
                  <td className="py-3 pr-3 font-mono">{formatUsd(card.materialGram)}/g</td>
                  <td className="py-3 font-mono">{formatUsd(card.minimum)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          {RESIN_QUOTE_FORMULA_NOTE}
        </p>
        <Link
          href="/fabricate/pricing"
          className="mt-3 inline-flex text-sm font-medium text-[var(--cdc-teal)] underline"
        >
          Full rates, examples, and failure policy
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Finish levels
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Levels 0–2 start in-house. Levels 3–4 are custom quote until finishing capacity grows.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {FABRICATION_FINISH_LEVELS.map((f) => (
            <li
              key={f.id}
              className="rounded-xl border border-[var(--cdc-border)] px-4 py-3 text-sm"
            >
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                L{f.level} — {f.label}
              </span>
              <span className="mt-1 block text-neutral-600 dark:text-neutral-400">
                {f.summary}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/fabricate/finishes"
          className="mt-4 inline-flex text-sm font-medium text-[var(--cdc-teal)] underline"
        >
          Finish details and labor notes
        </Link>
      </section>

      <section className="mb-12 rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-5 dark:bg-neutral-900/40">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Artist Access
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          $25 / month, or included for 60 days after a paid workshop. Access pricing applies when
          you know how to prepare and run a job within DCC-approved procedures.
        </p>
        <p className="mt-3 text-sm text-amber-900 dark:text-amber-200">
          {FABRICATION_WORKSHOP_BOUNDARY}
        </p>
        <Link
          href="/workshop/resin-printing"
          className="mt-3 inline-flex text-sm font-medium text-[var(--cdc-teal)] underline"
        >
          Resin printing workshop
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Compared with online print farms
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {FABRICATION_CRAFTCLOUD_NOTE}
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">FAQ</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-neutral-900 dark:text-neutral-100">
              Can I set my own price?
            </dt>
            <dd className="mt-1 text-neutral-600 dark:text-neutral-400">
              No. Staff send a transparent estimate after review. You approve before we print.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-900 dark:text-neutral-100">
              Does the workshop certify me to run machines alone?
            </dt>
            <dd className="mt-1 text-neutral-600 dark:text-neutral-400">
              No. Workshops prepare you for supervised appointments and Artist Access pathways.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-900 dark:text-neutral-100">
              Who pays for machine failures?
            </dt>
            <dd className="mt-1 text-neutral-600 dark:text-neutral-400">
              DCC machine failures are on us. Risky artist files are flagged before printing.
            </dd>
          </div>
        </dl>
      </section>
    </FabricateChrome>
  )
}
