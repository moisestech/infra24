import type { Metadata } from 'next'
import { DccTvFunnelQrDisplay } from '@/components/marketing/display/DccTvFunnelQrDisplay'

export const metadata: Metadata = {
  title: 'DCC TV QR',
  robots: { index: false, follow: false },
}

export default function DccTvFunnelQrPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <DccTvFunnelQrDisplay />
    </div>
  )
}
