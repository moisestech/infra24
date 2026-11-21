import type { Metadata } from 'next'
import { CollectiveNetworkArtwork } from '@/components/dcc/artwork/CollectiveNetworkArtwork'

export const metadata: Metadata = {
  title: 'The Network Makes Itself — DCC Miami',
  description: 'A living, interactive network of people and practices. Three public artists, six real community-interest categories, documented public connections, and no individual poll voter attribution.',
  robots: { index: true, follow: true },
}

export default function NetworkArtworkPage() {
  return <CollectiveNetworkArtwork />
}
