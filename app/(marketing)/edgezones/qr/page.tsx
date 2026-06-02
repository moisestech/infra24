import type { Metadata } from 'next'
import { EdgeZonesQrDisplay } from '@/components/marketing/edgezones/EdgeZonesQrDisplay'

export const metadata: Metadata = {
  title: 'Edge Zones Portal QR',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams?: { tracked?: string }
}

export default function EdgeZonesQrPage({ searchParams }: Props) {
  const useTrackedUrl = searchParams?.tracked === '1' || searchParams?.tracked === 'true'
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-neutral-100 px-4 py-12 dark:bg-neutral-950">
      <EdgeZonesQrDisplay useTrackedUrl={useTrackedUrl} />
    </div>
  )
}
