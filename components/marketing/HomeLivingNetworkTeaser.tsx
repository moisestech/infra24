'use client'

import Link from 'next/link'
import ArtworkForceField from '@/components/dcc/artwork/ArtworkForceField'

/**
 * Entry from the DCC homepage into the network's institutional and artistic
 * expressions. The force field is fictional and never fetches private CRM data.
 */
export function HomeLivingNetworkTeaser() {
  return (
    <section id="cultural-network" className="scroll-mt-14 border-b border-[var(--cdc-border)] bg-[#091617] py-14 text-[#edf3ed] sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6d7bc]">Institutional infrastructure / artistic experiment</p>
            <h2 className="mt-4 max-w-lg text-3xl font-light leading-tight tracking-[-.055em] text-white sm:text-5xl">
              What if the network made itself?
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[#bacdc2]">
              DCC is experimenting with code as the architecture of a cultural institution.
              An independent artwork studies how people could author their own nodes, negotiate connections,
              and eventually turn one collective moment into a fabricated sculpture.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#8ba99b]">
              Orbit the force-directed study. Its nodes are fictional positions and categories—not private
              DCC members or verified relationships.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/network/artwork" className="inline-flex items-center rounded-full bg-[#d4e5d2] px-5 py-3 text-sm font-semibold text-[#10271e] transition hover:bg-white">
                Explore the artwork ↗
              </Link>
              <Link href="/network/artwork/proposal" className="inline-flex items-center rounded-full border border-[#98b3a5]/70 px-5 py-3 text-sm font-medium text-[#e1efe3] transition hover:bg-white/10">
                Read the proposal ↗
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-[#b2c9b6]">
              <Link href="/network/community" className="underline underline-offset-4 transition hover:text-white">Community Atlas</Link>
              <Link href="/network/immersive" className="underline underline-offset-4 transition hover:text-white">Network explorer</Link>
              <Link href="/network" className="underline underline-offset-4 transition hover:text-white">Network directory</Link>
            </div>
          </div>
          <div className="relative h-[380px] overflow-hidden rounded-2xl border border-[#7f9c8b]/30 bg-[#0a1719] shadow-[0_0_80px_-28px_rgba(96,156,113,.32)] sm:h-[460px]">
            <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-white/20 bg-[#091617]/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[.17em] text-[#c3dac8]">
              Three.js / fictional network study
            </div>
            <ArtworkForceField compact />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#091617]/95 to-transparent px-5 pb-5 pt-10 font-mono text-[10px] uppercase tracking-wider text-[#c6d9cc]">
              Nodes represent invented perspectives · No personal data
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
