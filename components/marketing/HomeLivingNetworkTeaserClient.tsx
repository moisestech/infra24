'use client'

import dynamic from 'next/dynamic'

export const HomeLivingNetworkTeaser = dynamic(
  () => import('@/components/marketing/HomeLivingNetworkTeaser').then((m) => m.HomeLivingNetworkTeaser),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[280px] border-b border-[var(--cdc-border)] bg-neutral-950"
        aria-hidden
      />
    ),
  }
);

