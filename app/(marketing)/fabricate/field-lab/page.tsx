import type { Metadata } from 'next'
import Link from 'next/link'
import { FlaskConical, Layers } from 'lucide-react'
import { FabricateChrome } from '@/components/dcc/fabrication/FabricateChrome'
import {
  CapabilityMaturityStrip,
  CapabilityStageChip,
} from '@/components/dcc/fabrication/CapabilityMaturityStrip'
import {
  FabricateSectionHeading,
  FabricateSectionMedia,
} from '@/components/dcc/fabrication/FabricateSectionMedia'
import { FabricationFlywheel } from '@/components/dcc/fabrication/FabricationFlywheel'
import {
  getPublicCapability,
  listPublicCapabilities,
  listPublicFieldTests,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Fabrication Field Lab',
  description:
    'We test processes before we sell them. Each experiment improves DCC’s pricing, documentation, finishing and production workflows.',
  openGraph: {
    title: `Fabrication Field Lab | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/field-lab',
  },
}

const STATUS_LABEL: Record<string, string> = {
  observed: 'Observed',
  testing: 'Testing',
  complete: 'Complete',
}

export default function FabricateFieldLabPage() {
  const tests = listPublicFieldTests()
  const capabilities = listPublicCapabilities()

  return (
    <FabricateChrome current="field-lab">
      <header className="mb-8 grid min-w-0 items-center gap-6 md:mb-10 md:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
            Capability development
          </p>
          <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Fabrication Field Lab
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
            We test processes before we sell them. Each experiment improves DCC’s pricing,
            documentation, finishing and production workflows.
          </p>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Public notes are DCC’s own tests. Private peer-shop observations stay unpublished until
            DCC independently reproduces them.
          </p>
        </div>
        <FabricateSectionMedia mediaId="fieldLab" colorTokenId="amber" priority />
      </header>

      <section className="mb-10 md:mb-12">
        <FabricateSectionHeading
          title="Field tests"
          description="What DCC can fabricate today is whatever we have actually tested — not what we have only seen."
          Icon={FlaskConical}
          colorTokenId="amber"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test) => {
            const capability = getPublicCapability(test.capabilityId)
            return (
              <article
                key={test.id}
                className="flex flex-col rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-4 dark:bg-neutral-900/40 sm:p-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  {test.id}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {test.title}
                </h2>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-amber-800 dark:text-amber-200">
                  Status: {STATUS_LABEL[test.status] ?? test.status}
                </p>
                {capability ? (
                  <p className="mt-2">
                    <CapabilityStageChip stage={capability.stage} />
                  </p>
                ) : null}
                <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium">Question: </span>
                  {test.question}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
                  {test.publicLearning.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mb-10 md:mb-12">
        <FabricateSectionHeading
          title="Capability maturity"
          description="Observed is not the same as sellable. This is how DCC tells those apart."
          Icon={Layers}
          colorTokenId="violet"
        />
        <CapabilityMaturityStrip className="mt-2" />
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {capabilities.map((cap) => (
            <li
              key={cap.id}
              className="rounded-xl border border-[var(--cdc-border)] px-4 py-3"
            >
              <CapabilityStageChip stage={cap.stage} />
              <p className="mt-2 font-medium text-neutral-900 dark:text-neutral-100">
                {cap.title}
              </p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {cap.summary}
              </p>
              {cap.nextExperiment ? (
                <p className="mt-2 text-xs text-neutral-500">
                  Next: {cap.nextExperiment}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/fabricate/projects" className="text-[var(--cdc-teal)] underline">
            See DCC test projects
          </Link>
        </p>
      </section>

      <FabricationFlywheel />
    </FabricateChrome>
  )
}
