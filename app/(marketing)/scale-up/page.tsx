import type { Metadata } from 'next'
import Link from 'next/link'
import { dccSiteMeta } from '@/lib/marketing/content'
import { hasScaleUpAccess, isScaleUpPasswordConfigured } from '@/lib/dcc/scale-up-auth'
import { ScaleUpUnlockForm } from '@/components/dcc/scale-up/ScaleUpUnlockForm'
import { SCALE_UP_FUNNEL, funnelStatusClass } from '@/lib/dcc/scale-up-funnel'
import { isDccOsConfigured } from '@/lib/dcc/os-config'
import { listActiveServices } from '@/lib/dcc/services'
import { formatTierPrice } from '@/lib/dcc/services'
import { CeoScorecard } from '@/components/dcc/ceo/CeoScorecard'
import { ScaleUpFabricationEvidence } from '@/components/dcc/scale-up/ScaleUpFabricationEvidence'

export const metadata: Metadata = {
  title: 'Scale Up',
  robots: { index: false, follow: false },
  description: 'DCC.MIAMI mentor / investor brief — password protected.',
  openGraph: {
    title: `Scale Up | ${dccSiteMeta.organizationName}`,
    url: '/scale-up',
  },
}

export const revalidate = 60

export default async function ScaleUpPage() {
  const unlocked = await hasScaleUpAccess()

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          DCC.miami · Scale Up
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Mentor access
        </h1>
        <p className="mt-2 mb-8 text-sm text-neutral-600 dark:text-neutral-400">
          Shared password gate. Cookie is httpOnly; rotated after the Scale Up program.
          {!isScaleUpPasswordConfigured()
            ? ' (Dev: set DCC_SCALE_UP_PASSWORD for production.)'
            : null}
        </p>
        <ScaleUpUnlockForm />
      </div>
    )
  }

  let tierRows: Awaited<ReturnType<typeof listActiveServices>> = []
  if (isDccOsConfigured()) {
    tierRows = await listActiveServices().catch(() => [])
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--cdc-teal)]">
        00 · Scale Up Miami C16
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
        DCC.MIAMI
      </h1>
      <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">
        The operating system for a creative-technology production node. The website is one view onto
        it.
      </p>

      <section className="mt-16 scroll-mt-8" id="thesis">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">01 · Thesis</h2>
        <p className="mt-4 text-xl leading-relaxed text-neutral-900 dark:text-neutral-100">
          Artists increasingly depend on sophisticated technology, but the infrastructure to use it
          is expensive, fragmented, and inaccessible. A machine can be purchased. Someone still has
          to install it, cool it, power it, maintain it, understand it, teach it, schedule it, and
          make it useful. That gap is DCC.
        </p>
      </section>

      <section className="mt-16" id="problem">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">02 · Problem</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          What Bakehouse artists lack today: space, equipment, technical staff, climate-controlled
          fabrication, maintenance capacity.
        </p>
      </section>

      <section className="mt-16" id="intervention">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          03 · Intervention
        </h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Commercial work pays market rates → public programming pays sustainable rates → Bakehouse
          Associates receive preferred access.
        </p>
        {tierRows.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="font-mono text-xs uppercase text-neutral-500">
                  <th className="py-2 pr-3">Service</th>
                  <th className="py-2 pr-3">Associate</th>
                  <th className="py-2 pr-3">Public</th>
                  <th className="py-2">Commercial</th>
                </tr>
              </thead>
              <tbody>
                {tierRows.slice(0, 8).map((s) => (
                  <tr key={s.id} className="border-t border-[var(--cdc-border)]">
                    <td className="py-2 pr-3">{s.name}</td>
                    <td className="py-2 pr-3 font-mono">{formatTierPrice(s.associatePrice)}</td>
                    <td className="py-2 pr-3 font-mono">{formatTierPrice(s.publicPrice)}</td>
                    <td className="py-2 font-mono">{formatTierPrice(s.commercialPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/pricing" className="mt-3 inline-block text-sm text-[var(--cdc-teal)] hover:underline">
              Full pricing →
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-neutral-500">
            Live tier table loads from DCC Services when configured. See{' '}
            <Link href="/pricing" className="text-[var(--cdc-teal)] hover:underline">
              /pricing
            </Link>
            .
          </p>
        )}
      </section>

      <section className="mt-16" id="physical">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          04 · Physical system
        </h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Production Pavilion / Finishing / Storage Spine / Studio 43 / Common Areas. Fleet status
          on{' '}
          <Link href="/machines" className="text-[var(--cdc-teal)] hover:underline">
            /machines
          </Link>
          .
        </p>
      </section>

      <section className="mt-16" id="digital">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          05 · Digital system
        </h2>
        <p className="mt-4 mb-6 text-sm text-neutral-600">
          Live CEO scorecard embed — not a screenshot.
        </p>
        <CeoScorecard embed />
      </section>

      <ScaleUpFabricationEvidence />

      <section className="mt-16" id="funnel">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          06 · Funnel status
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Naming friction openly is the move. Screenshot this board.
        </p>
        <ul className="mt-6 space-y-3">
          {SCALE_UP_FUNNEL.map((stage) => (
            <li
              key={stage.id}
              className="flex flex-col gap-2 border border-[var(--cdc-border)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {stage.label}
                </p>
                {stage.note ? (
                  <p className="mt-1 font-mono text-xs text-neutral-500">{stage.note}</p>
                ) : null}
              </div>
              <span
                className={`inline-flex w-fit shrink-0 px-2.5 py-1 font-mono text-xs font-bold tracking-wide ${funnelStatusClass(stage.status)}`}
              >
                {stage.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" id="unit-econ">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          07 · Unit economics
        </h2>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Conservative / Base / Growth scenario toggles — port formulas from the unit economics
          workbook (do not reinvent math in JS). Placeholder until workbook transcription lands.
        </p>
      </section>

      <section className="mt-16" id="capital">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">08 · Capital</h2>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Micah&apos;s $20,000: allocated / reserved / remaining — blocked on entity structure (see
          funnel).
        </p>
        <div className="mt-4 h-3 w-full bg-neutral-200 dark:bg-neutral-800">
          <div className="h-3 w-[8%] bg-[var(--cdc-coral)]" title="Placeholder progress" />
        </div>
      </section>

      <section className="mt-16 mb-24" id="ask">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">09 · The ask</h2>
        <p className="mt-4 text-lg text-neutral-800 dark:text-neutral-200">
          The next raise unlocks throughput and access — machines installed, queue live, paid jobs
          flowing — not a wish list.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/make" className="font-semibold text-[var(--cdc-teal)] hover:underline">
            /make
          </Link>
          <Link href="/machines" className="font-semibold text-[var(--cdc-teal)] hover:underline">
            /machines
          </Link>
          <Link
            href="/dashboard/ceo"
            className="font-semibold text-[var(--cdc-teal)] hover:underline"
          >
            /dashboard/ceo
          </Link>
        </div>

        <div className="mt-16 border-t border-[var(--cdc-border)] pt-10">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
            Phase 2 mockups
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>COO / Today — exceptions-only queue</li>
            <li>CTO / Infrastructure — telemetry</li>
            <li>Investor — Micah capital deployment</li>
            <li>Artist portal — credits &amp; training</li>
            <li>Donation funnel — tiered giving</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
