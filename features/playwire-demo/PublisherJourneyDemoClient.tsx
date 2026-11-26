'use client'

import dynamic from 'next/dynamic'

export const PublisherJourneyDemo = dynamic(
  () => import('@/features/playwire-demo/PublisherJourneyDemo').then((m) => m.PublisherJourneyDemo),
  { ssr: false }
)

