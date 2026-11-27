'use client'

import dynamic from 'next/dynamic'

export const NetworkGraph3DExplorer = dynamic(
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

