import type { Metadata } from 'next'
import { CollectiveNetworkArtwork } from '@/components/dcc/artwork/CollectiveNetworkArtwork'

export const metadata: Metadata = {
  title: 'The Network Makes Itself — DCC Miami',
  description: 'A minimal Three.js portrait of the reported 100+ DCC Commons members as anonymous marks, with a separate hypothetical connection study. No private identities or relationships are published.',
  robots: { index: true, follow: true },
}

export default function NetworkArtworkPage() {
  return <CollectiveNetworkArtwork />
}
