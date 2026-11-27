'use client'

import dynamic from 'next/dynamic'

export const NetworkGraph = dynamic(
  () => import('@/components/marketing/dcc-network/NetworkGraphClient'),
  {
    ssr: false,
    loading: () => <div className="min-h-[480px] animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />,
  }
)

