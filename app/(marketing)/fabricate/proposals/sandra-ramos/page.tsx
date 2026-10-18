import type { Metadata } from 'next'
import { DiscoveryProposalPage } from '@/components/dcc/fabrication/proposal/DiscoveryProposalPage'
import { hasFabricateProposalsAccess, proposalPageMetadata } from '@/lib/dcc/fabrication/proposal-auth'
import { SANDRA_PROPOSAL } from '@/lib/dcc/fabrication/proposals/sandra-ramos'

export async function generateMetadata(): Promise<Metadata> {
  return proposalPageMetadata({
    title: 'Sandra Ramos — 3D Printing Scope Review · DCC Miami',
    description: 'Private scope-discovery brief. Object and process pending; no approved quotation.',
  })
}
export const dynamic = 'force-dynamic'

export default async function SandraRamosProposalPage() {
  if (!(await hasFabricateProposalsAccess())) return null
  return <DiscoveryProposalPage proposal={SANDRA_PROPOSAL} substatus="Object and digital source not yet confirmed" />
}
