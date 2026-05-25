import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { cdcPageMetadata } from '@/lib/cdc/metadata'

const NetworkGraph3DExplorer = dynamic(
  () =>
    import('@/components/marketing/dcc-network/NetworkGraph3DExplorer').then(
      (m) => m.NetworkGraph3DExplorer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[100dvh] items-center justify-center bg-[#050508]">
        <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" aria-hidden />
      </div>
    ),
  }
)

const path = '/network/immersive'

export const metadata: Metadata = cdcPageMetadata(path)

export default function NetworkImmersivePage() {
  return <NetworkGraph3DExplorer />
}
