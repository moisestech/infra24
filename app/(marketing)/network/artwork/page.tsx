import type { Metadata } from 'next'
import { CollectiveNetworkArtwork } from '@/components/dcc/artwork/CollectiveNetworkArtwork'

export const metadata: Metadata = {
  title: 'The Network Makes Itself — DCC Miami',
  description: 'An interactive 3D artwork: human positions become nodes, their hypothetical interpersonal connections become edges. No private DCC people or relationships are exposed.',
  robots: { index: true, follow: true },
}

export default function NetworkArtworkPage() {
  return <CollectiveNetworkArtwork />
}
