import type { Metadata } from 'next'
import { DiscoveryProposalPage } from '@/components/dcc/fabrication/proposal/DiscoveryProposalPage'
import { FRANKIE_PROPOSAL } from '@/lib/dcc/fabrication/proposals/frankie-hsu'

export const metadata: Metadata = {
  title: 'Frankie Hsu — Precision Mold + Coral Study · DCC Miami',
  description: 'Private two-track technical diagnostic brief. No production or price approval.',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default function FrankieHsuProposalPage() {
  return <DiscoveryProposalPage proposal={FRANKIE_PROPOSAL} substatus="Awaiting failed-mold files, tolerances and coral scale" />
}
