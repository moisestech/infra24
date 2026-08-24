import type { Metadata } from 'next'
import Link from 'next/link'
import { Layers, Map } from 'lucide-react'
import {
  FabricateChrome,
  FabricateCtaRow,
} from '@/components/dcc/fabrication/FabricateChrome'
import {
  FabricateSectionHeading,
  FabricateSectionMedia,
} from '@/components/dcc/fabrication/FabricateSectionMedia'
import { FinishLevelPicker } from '@/components/dcc/fabrication/FinishLevelPicker'
import {
  FABRICATION_PLANNING_STANDIN_SRC,
  FABRICATION_PROMISE,
  FABRICATION_WORKSHOP_BOUNDARY,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Finish levels',
  description:
    'Raw print through finished object — what DCC Fabrication offers in-house vs custom quote.',
  openGraph: {
    title: `Finish levels | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/finishes',
  },
}

export default function FabricateFinishesPage() {
  return (
    <FabricateChrome current="finishes">
      <header className="mb-8 grid min-w-0 items-start gap-6 md:mb-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
            Post-processing
          </p>
          <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Finish levels
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
            Choose how far past the printer you want DCC to take the object. Labor for finishing uses
            the human-labor line on{' '}
            <Link href="/fabricate/pricing" className="underline">
              transparent pricing
            </Link>
            .
          </p>
          <FabricateCtaRow className="mt-6" />
        </div>
        <FabricateSectionMedia mediaId="finishesHero" colorTokenId="violet" priority />
      </header>

      <section className="mb-10 md:mb-12">
        <FabricateSectionHeading
          title="Pick a finish level"
          description="Each level has its own color, icon, and conceptual image — L0–L2 start in-house; L3–L4 stay custom quote."
          Icon={Layers}
          colorTokenId="violet"
        />
        <FinishLevelPicker />
      </section>

      <section className="mb-10 md:mb-12">
        <FabricateSectionHeading
          title="Plan the finish with the quote"
          description="Conceptual illustration — not a documentary photo of a finished commission."
          Icon={Map}
          colorTokenId="indigo"
        />
        <figure className="overflow-hidden rounded-2xl border border-indigo-200 dark:border-indigo-800">
          <div className="relative aspect-video w-full bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FABRICATION_PLANNING_STANDIN_SRC}
              alt="Conceptual illustration of project planning drivers for fabrication and finish scope."
              width={1672}
              height={941}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <figcaption className="border-t border-[var(--cdc-border)] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
            Conceptual illustration · instructional concept 112
          </figcaption>
        </figure>
      </section>

      <section className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 sm:p-5 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
        <p>{FABRICATION_WORKSHOP_BOUNDARY}</p>
        <p className="mt-2 text-amber-900/90 dark:text-amber-100/90">{FABRICATION_PROMISE}</p>
      </section>
    </FabricateChrome>
  )
}
