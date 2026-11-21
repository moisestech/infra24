import type { Metadata } from 'next'
import { CollectiveNetworkArtwork } from '@/components/dcc/artwork/CollectiveNetworkArtwork'

export const metadata: Metadata = {
  title: 'The Network Makes Itself — Artwork Study',
  description: 'A fictional, interactive study in collective authorship, networked art, and materialized network editions, developed with DCC Miami.',
  robots: { index: false, follow: false },
}

export default function NetworkArtworkPage() {
  return <CollectiveNetworkArtwork />
}
