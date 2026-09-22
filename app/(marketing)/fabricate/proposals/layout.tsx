import type { Metadata } from 'next'
import {
  hasFabricateProposalsAccess,
  isFabricateProposalsPasswordConfigured,
} from '@/lib/dcc/fabrication/proposal-auth'
import { ProposalUnlockForm } from '@/components/dcc/fabrication/ProposalUnlockForm'

export const metadata: Metadata = {
  title: 'Private proposal',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function FabricateProposalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const unlocked = await hasFabricateProposalsAccess()

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          DCC.miami · Fabricate
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Private proposal
        </h1>
        <p className="mt-2 mb-8 text-sm text-neutral-600 dark:text-neutral-400">
          Shared password gate. Cookie is httpOnly.
          {!isFabricateProposalsPasswordConfigured()
            ? ' (Dev: set DCC_FABRICATE_PROPOSALS_PASSWORD for production.)'
            : null}
        </p>
        <ProposalUnlockForm />
      </div>
    )
  }

  return children
}
