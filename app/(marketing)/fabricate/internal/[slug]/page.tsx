import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InternalQuoteEstimator } from '@/components/dcc/fabrication/internal/InternalQuoteEstimator'
import { getClientProposal } from '@/lib/dcc/fabrication'
import { hasScaleUpAccess } from '@/lib/dcc/scale-up-auth'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const proposal = getClientProposal(slug)
  if (!proposal?.quoteLineItems?.length) {
    return { title: 'Internal quote', robots: { index: false, follow: false } }
  }
  return {
    title: `${proposal.job.jobNumber} · Internal economics`,
    robots: { index: false, follow: false },
  }
}

export default async function FabricateInternalQuotePage({ params }: PageProps) {
  const { slug } = await params
  const proposal = getClientProposal(slug)

  if (!proposal?.quoteLineItems?.length || !proposal.costLineItems?.length) {
    notFound()
  }

  const scaleUpOk = await hasScaleUpAccess()
  const flag = process.env.DCC_CEO_DASHBOARD_ENABLED === 'true'
  if (!scaleUpOk && !flag && process.env.NODE_ENV === 'production') {
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
        <InternalQuoteEstimator proposal={proposal} />
      </div>
    </div>
  )
}
