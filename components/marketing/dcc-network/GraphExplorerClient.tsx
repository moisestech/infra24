'use client'

import dynamic from 'next/dynamic'

export const GraphExplorer = dynamic(
  () => import('@/components/marketing/dcc-network/GraphExplorer').then((m) => m.GraphExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[min(85dvh,720px)] w-full animate-pulse rounded-xl bg-neutral-900/60" aria-hidden />
    ),
  }
)

