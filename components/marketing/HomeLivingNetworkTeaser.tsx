'use client'

import { useState } from 'react'
import Link from 'next/link'
import PeopleNetworkField from '@/components/dcc/artwork/PeopleNetworkField'
import { NetworkGraphBoundary } from '@/components/dcc/artwork/NetworkGraphBoundary'

/** Shared public people, reported anonymous presence, and practice-category nodes. */
export function HomeLivingNetworkTeaser() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <section id="cultural-network" className="dcc-network-theme scroll-mt-12 border-b border-[var(--cdc-border)] bg-[var(--dn-bg)] py-12 text-[color:var(--dn-ink)] sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[.86fr_1.14fr] lg:gap-16 lg:px-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[color:var(--dn-subtle)]">DCC / Network artwork</p>
          <h2 className="mt-5 max-w-md text-4xl font-light leading-[1.02] tracking-[-.065em] sm:text-6xl">
            The network<br /><em className="text-[color:var(--dn-title-accent)]">makes itself.</em>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[color:var(--dn-muted)]">
            Dots are people. Rings are practice areas. Explore Moises, Fabiola and Angelo, and the places where their public work overlaps.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/network/artwork" className="rounded-full bg-[var(--dn-accent)] px-5 py-3 font-semibold text-[color:var(--dn-accent-ink)] hover:bg-[var(--dn-accent-hover)]">Explore the artwork ↗</Link>
            <Link href="/network/community" className="rounded-full border border-[color:var(--dn-line-strong)] px-5 py-3 text-[color:var(--dn-muted)] hover:border-[color:var(--dn-line-strong)]">Community Atlas ↗</Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[color:var(--dn-line)] bg-[var(--dn-graph-bg)]">
          <div className="h-[430px] sm:h-[490px]">
            <NetworkGraphBoundary><PeopleNetworkField selected={selected} onSelect={setSelected} /></NetworkGraphBoundary>
          </div>
          <p className="border-t border-[color:var(--dn-line)] px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-[color:var(--dn-graph-muted)]">
            100+ reported · 3 featured artists · 6 practices
          </p>
        </div>
      </div>
    </section>
  )
}
