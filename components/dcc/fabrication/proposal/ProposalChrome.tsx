import Link from 'next/link'
import { ProposalNav } from '@/components/dcc/fabrication/proposal/ProposalNav'
import { publicOperatorName } from '@/lib/dcc/fabrication/operators'
import type { FabricationJob, ProposalNavItem } from '@/lib/dcc/fabrication/schema'

export function ProposalChrome({
  children,
  job,
  sections = [],
}: {
  children: React.ReactNode
  job?: FabricationJob
  sections?: ProposalNavItem[]
}) {
  const lead = publicOperatorName(job?.projectLeadId)
  const hasNav = sections.length > 0

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm">
        <Link
          href="/fabricate"
          className="font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline"
        >
          ← Fabricate
        </Link>
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        Private proposal · not indexed
      </p>
      {lead ? (
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Project lead: {lead}
        </p>
      ) : null}

      {hasNav ? (
        <div className="mt-6 lg:hidden">
          <ProposalNav sections={sections} layout="horizontal" />
        </div>
      ) : null}

      <div
        className={
          hasNav
            ? 'mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] xl:gap-12'
            : 'mt-8 max-w-3xl'
        }
      >
        {hasNav ? (
          <ProposalNav sections={sections} layout="sidebar" className="hidden lg:block" />
        ) : null}
        <div className={hasNav ? 'min-w-0 max-w-3xl' : undefined}>{children}</div>
      </div>
    </div>
  )
}
