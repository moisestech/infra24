'use client'

import { useState } from 'react'
import Link from 'next/link'
import PeopleNetworkField from '@/components/dcc/artwork/PeopleNetworkField'

/** Illustration of anonymous human positions, not private CRM relationships. */
export function HomeLivingNetworkTeaser() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <section id="cultural-network" className="scroll-mt-12 border-b border-[var(--cdc-border)] bg-[#091313] py-12 text-[#f0f3ed] sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[.86fr_1.14fr] lg:gap-16 lg:px-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#9cc5ad]">DCC / Network artwork</p>
          <h2 className="mt-5 max-w-md text-4xl font-light leading-[1.02] tracking-[-.065em] sm:text-6xl">
            The network<br /><em className="text-[#c3dcc9]">makes itself.</em>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">
            100+ members reported. Two public cofounders. One documented connection. The first community poll reveals what people want to discover—without revealing individual votes.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/network/artwork" className="rounded-full bg-[#d3e7d6] px-5 py-3 font-semibold text-[#15362b] hover:bg-white">Explore the artwork ↗</Link>
            <Link href="/network/community" className="rounded-full border border-[#d3e7d6]/45 px-5 py-3 text-[#e3eee5] hover:border-white">Community Atlas ↗</Link>
          </div>
        </div>
        <div className="relative h-[350px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a1719] sm:h-[490px]">
          <PeopleNetworkField selected={selected} onSelect={setSelected} />
          <div className="pointer-events-none absolute bottom-4 left-5 rounded-full border border-white/10 bg-[#091313]/75 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[#c5d8c8]">
            100+ reported · public founders · one documented edge
          </div>
        </div>
      </div>
    </section>
  )
}
