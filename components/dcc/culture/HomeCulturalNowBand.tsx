import Link from 'next/link'
import { HomePathwaysGrid } from '@/components/dcc/culture/HomePathwaysGrid'
import { DCC_CULTURAL_POSITION } from '@/lib/dcc/culture/copy'
import { listHomePathways } from '@/lib/dcc/culture/home-pathways'

export function HomeCulturalNowBand() {
  const pathways = listHomePathways()

  return (
    <section
      id="now"
      className="scroll-mt-14 border-b border-[var(--cdc-border)] bg-[#fafafa] py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16 lg:py-20"
    >
      <div id="era-band" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
          DCC MIA
        </p>
        <h2
          id="now-pathways-heading"
          className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl"
        >
          Pathways into DCC Miami
        </h2>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-snug text-neutral-900 dark:text-neutral-50 sm:text-xl">
          {DCC_CULTURAL_POSITION}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Each pathway is a way in — a program, a person, a workshop, a fabrication
          request, a text, a list, a map, a room. Together they are one cultural
          network, not nine separate products.
        </p>
        <p className="mt-4">
          <Link
            href="/now"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            Full snapshot
          </Link>
        </p>
        <div className="mt-10">
          <HomePathwaysGrid pathways={pathways} />
        </div>
        <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
          <Link
            href="/era"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            Born-Digital Era — seven-channel frame
          </Link>
        </p>
      </div>
    </section>
  )
}
