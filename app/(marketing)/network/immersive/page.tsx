import type { Metadata } from 'next'
import { NetworkGraph3DExplorer } from '@/components/marketing/dcc-network/NetworkGraph3DExplorerClient'
import { cdcPageMetadata } from '@/lib/cdc/metadata'

const path = '/network/immersive'

export const metadata: Metadata = cdcPageMetadata(path)

export default function NetworkImmersivePage() {
  return <NetworkGraph3DExplorer />
}
