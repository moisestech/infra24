import type { Metadata } from 'next'
import { CollectiveNetworkArtwork } from '@/components/dcc/artwork/CollectiveNetworkArtwork'

export const metadata: Metadata = {
  title: 'The Network Makes Itself — DCC Miami',
  description: 'A minimal interactive network artwork: 100+ reported DCC members, public cofounders, one documented relationship, and six verified WhatsApp poll totals—without identifying voters or private ties.',
  robots: { index: true, follow: true },
}

export default function NetworkArtworkPage() {
  return <CollectiveNetworkArtwork />
}
