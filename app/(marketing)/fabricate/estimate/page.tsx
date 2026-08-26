import type { Metadata } from 'next'
import { Calculator } from 'lucide-react'
import { FabricateChrome } from '@/components/dcc/fabrication/FabricateChrome'
import { FabricateEstimateCalculator } from '@/components/dcc/fabrication/FabricateEstimateCalculator'
import { FabricateSectionHeading } from '@/components/dcc/fabrication/FabricateSectionMedia'
import { FABRICATION_PROMISE } from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Fabrication estimate',
  description:
    'Plan a fabrication estimate from setup, machine time, material, and labor. DCC reviews the file before approving any job.',
  openGraph: {
    title: `Fabrication estimate | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/estimate',
  },
}

export default function FabricateEstimatePage() {
  return (
    <FabricateChrome current="estimate">
      <header className="mb-8 max-w-3xl md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          Transparent planning
        </p>
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Planning estimate
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
          {FABRICATION_PROMISE} This calculator uses the published rate cards. It is a
          planning estimate, not an invoice or an approved quote. DCC reviews the file
          before any job.
        </p>
      </header>

      <section>
        <FabricateSectionHeading
          title="Inputs"
          description="Seeded with the medium-sculpture Full-Service example. Change the numbers to explore other jobs."
          Icon={Calculator}
          colorTokenId="indigo"
        />
        <FabricateEstimateCalculator />
      </section>
    </FabricateChrome>
  )
}
