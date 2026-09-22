import type { Metadata } from 'next'
import { ProposalChrome } from '@/components/dcc/fabrication/proposal/ProposalChrome'

export const metadata: Metadata = {
  title: 'Private proposal',
  robots: { index: false, follow: false },
}

export default function FabricateProposalsIndexPage() {
  return (
    <ProposalChrome>
      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Open the proposal URL you were sent.
      </h1>
    </ProposalChrome>
  )
}
