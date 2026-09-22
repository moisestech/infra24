import type { Metadata } from 'next'
import { Suspense } from 'react'
import { hasFabricateProposalsAccess } from '@/lib/dcc/fabrication/proposal-auth'
import { ProposalUnlockScreen } from '@/components/dcc/fabrication/ProposalUnlockScreen'

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
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg px-4 py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
              DCC.miami · Fabricate
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Private proposal
            </h1>
          </div>
        }
      >
        <ProposalUnlockScreen />
      </Suspense>
    )
  }

  return children
}
