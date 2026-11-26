import type { Metadata } from 'next'
import { DccTvFunnelPlayer } from '@/components/marketing/display/DccTvFunnelPlayer'

export const metadata: Metadata = {
  title: 'DCC TV Funnel',
  description: 'Landscape TV loop — DCC Miami intake funnel.',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams?: Promise<{ controls?: string }>
}

export default async function DccTvFunnelPage({ searchParams: pendingSearchParams }: Props) {
  const searchParams = await pendingSearchParams
  const showControls = searchParams?.controls === '1'
  return <DccTvFunnelPlayer showControls={showControls} />
}
