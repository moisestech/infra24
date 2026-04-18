'use client'

import Link from 'next/link'
import { GraphExplorer } from '@/components/marketing/dcc-network/GraphExplorer'

export function HomeDccNetworkSection() {
  return (
    <section
      id="cultural-network"
      className="scroll-mt-14 border-b border-[var(--cdc-border)] bg-neutral-950 py-12 text-neutral-100 dark:border-neutral-800 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">Miami cultural field</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Explore the living network
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            People and institutions connected through DCC’s CRM pilot — edge strength reflects interactions, not a
            decorative chart.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/network"
              className="inline-flex rounded-full bg-[var(--cdc-teal)] px-4 py-2 text-sm font-semibold text-neutral-950 hover:opacity-90"
            >
              Explore Miami cultural network
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800/80"
            >
              Contact DCC
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6">
          <GraphExplorer surface="home" className="text-neutral-100" />
        </div>
      </div>
    </section>
  )
}
