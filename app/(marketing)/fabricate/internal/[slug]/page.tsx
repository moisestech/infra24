import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InternalQuoteEstimator } from '@/components/dcc/fabrication/internal/InternalQuoteEstimator'
import { SprintEstimatePanel } from '@/components/dcc/fabrication/internal/SprintEstimatePanel'
import { getClientProposal } from '@/lib/dcc/fabrication'
import { getQuoteSprintEntry } from '@/lib/dcc/fabrication/sprint/quote-sprint'
import { hasFabricationInternalAccess } from '@/lib/dcc/scale-up-auth'

type PageProps = {
  params: Promise<{ slug: string }>
}

const PRIVATE_METADATA: Metadata = {
  title: 'Internal quote',
  robots: { index: false, follow: false },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!(await hasFabricationInternalAccess())) return PRIVATE_METADATA
  const { slug } = await params
  const proposal = getClientProposal(slug)
  const sprint = proposal ? getQuoteSprintEntry(proposal.slug) : undefined
  if (!proposal || (!sprint && !proposal.quoteLineItems?.length)) return PRIVATE_METADATA
  return {
    title: `${proposal.job.jobNumber} · Internal economics`,
    robots: { index: false, follow: false },
  }
}

export default async function FabricateInternalQuotePage({ params }: PageProps) {
  if (!(await hasFabricationInternalAccess())) notFound()

  const { slug } = await params
  const proposal = getClientProposal(slug)
  const sprint = proposal ? getQuoteSprintEntry(proposal.slug) : undefined
  const hasFirmCostStack = Boolean(
    proposal?.quoteLineItems?.length && proposal.costLineItems?.length
  )

  if (!proposal || (!sprint && !hasFirmCostStack)) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
        Staff only · Internal economics
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {proposal.job.jobNumber} · {proposal.job.projectTitle}
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {proposal.job.clientName} · {proposal.job.serviceType.replace(/_/g, ' ')}
      </p>
      <div className="mt-8">
        {sprint ? <SprintEstimatePanel entry={sprint} /> : <InternalQuoteEstimator proposal={proposal} />}
      </div>
    </div>
  )
}
