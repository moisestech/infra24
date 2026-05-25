import type { Metadata } from 'next'
import { DccTvFunnelPlayer } from '@/components/marketing/display/DccTvFunnelPlayer'

export const metadata: Metadata = {
  title: 'DCC TV Funnel',
  description: 'Landscape TV loop — DCC Miami intake funnel.',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams?: { controls?: string }
}

export default function DccTvFunnelPage({ searchParams }: Props) {
  const showControls = searchParams?.controls === '1'
  return <DccTvFunnelPlayer showControls={showControls} />
}
