import type { Metadata } from 'next'
import { CollectiveNetworkArtwork } from '@/components/dcc/artwork/CollectiveNetworkArtwork'

export const metadata: Metadata = {
  title: 'The Network Makes Itself — DCC Miami',
  description: 'Explore a sculptural 3D view of anonymous creative-practice and activity patterns drawn from reviewed DCC Miami aggregates.',
  robots: { index: true, follow: true },
}

export default function NetworkArtworkPage() {
  return <CollectiveNetworkArtwork />
}
