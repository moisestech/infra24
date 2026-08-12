import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FabricateChrome,
  FabricateCtaRow,
} from '@/components/dcc/fabrication/FabricateChrome'
import { FinishLevelPicker } from '@/components/dcc/fabrication/FinishLevelPicker'
import {
  FABRICATION_PROMISE,
  FABRICATION_WORKSHOP_BOUNDARY,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Finish levels',
  description: 'Raw print through finished object — what DCC Fabrication offers in-house vs custom quote.',
  openGraph: {
    title: `Finish levels | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/finishes',
  },
}

export default function FabricateFinishesPage() {
  return (
    <FabricateChrome current="finishes">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          Post-processing
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Finish levels
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Choose how far past the printer you want DCC to take the object. Labor for finishing uses
          the human-labor line on{' '}
          <Link href="/fabricate/pricing" className="underline">
            transparent pricing
          </Link>
          .
        </p>
        <FabricateCtaRow className="mt-6" />
      </header>

      <section className="mb-10 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-white to-white dark:border-indigo-900 dark:from-indigo-950/30 dark:via-neutral-950 dark:to-neutral-950">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-indigo-900 dark:text-indigo-200">
          Conceptual illustration
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/workshops/resin-printing/instructional-concepts/113-post-processing-states.webp"
          alt="The same artifact appears supported, clean with supports removed, and fully finished under violet-cyan light."
          width={1672}
          height={941}
          className="h-auto w-full object-cover"
        />
        <p className="border-t border-indigo-100 px-4 py-3 text-sm text-neutral-700 dark:border-indigo-900 dark:text-neutral-300">
          Conceptual post-processing states — not a documentary equipment or finish photograph.
          Participants observe supervised demos; finishing labor is quoted separately.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="sr-only">Select a finish level</h2>
        <FinishLevelPicker />
      </section>

      <section className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
        <p>{FABRICATION_WORKSHOP_BOUNDARY}</p>
        <p className="mt-2 text-amber-900/90 dark:text-amber-100/90">{FABRICATION_PROMISE}</p>
      </section>
    </FabricateChrome>
  )
}
