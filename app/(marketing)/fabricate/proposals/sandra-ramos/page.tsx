import type { Metadata } from 'next'
import { DiscoveryProposalPage } from '@/components/dcc/fabrication/proposal/DiscoveryProposalPage'
import { SANDRA_PROPOSAL } from '@/lib/dcc/fabrication/proposals/sandra-ramos'

export const metadata: Metadata = {
  title: 'Sandra Ramos — 3D Printing Scope Review · DCC Miami',
  description: 'Private scope-discovery brief. Object and process pending; no approved quotation.',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default function SandraRamosProposalPage() {
  return <DiscoveryProposalPage proposal={SANDRA_PROPOSAL} substatus="Object and digital source not yet confirmed" />
}
