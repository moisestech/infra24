import type { Metadata } from 'next'
import { DiscoveryProposalPage } from '@/components/dcc/fabrication/proposal/DiscoveryProposalPage'
import { hasFabricateProposalsAccess, proposalPageMetadata } from '@/lib/dcc/fabrication/proposal-auth'
import { FRANKIE_PROPOSAL } from '@/lib/dcc/fabrication/proposals/frankie-hsu'

export async function generateMetadata(): Promise<Metadata> {
  return proposalPageMetadata({
    title: 'Frankie Hsu — Precision Mold + Coral Study · DCC Miami',
    description: 'Private two-track technical diagnostic brief. No production or price approval.',
  })
}
export const dynamic = 'force-dynamic'

export default async function FrankieHsuProposalPage() {
  if (!(await hasFabricateProposalsAccess())) return null
  return <DiscoveryProposalPage proposal={FRANKIE_PROPOSAL} substatus="Awaiting failed-mold files, tolerances and coral scale" />
}
