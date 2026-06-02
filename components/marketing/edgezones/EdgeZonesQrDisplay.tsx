'use client'

import { useEffect, useState } from 'react'
import QRCode from '@/components/ui/QRCode'
import { DCC_CAMPAIGN_URLS } from '@/lib/dcc/signup/attribution'

type Props = {
  /** Bare portal URL for print PDFs; tracked URL available via useTrackedUrl */
  portalPath?: string
  useTrackedUrl?: boolean
}

export function EdgeZonesQrDisplay({
  portalPath = '/edgezones',
  useTrackedUrl = false,
}: Props) {
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const path = useTrackedUrl ? DCC_CAMPAIGN_URLS.edgezonesPortal : portalPath
  const fullUrl = `${origin}${path}`

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          DCC Miami × Edge Zones
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {useTrackedUrl
            ? 'Scan for full proposal attribution (UTM + QR).'
            : 'Scan to open the partnership portal (matches printed PDF QR).'}
        </p>
      </div>
      {origin ? (
        <>
          <div className="flex justify-center">
            <QRCode value={fullUrl} size={240} />
          </div>
          <p className="break-all font-mono text-xs text-neutral-500">{fullUrl}</p>
        </>
      ) : (
        <div className="h-[240px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
      )}
      <p className="text-xs text-neutral-500">Staff / print use — not linked in public navigation.</p>
    </div>
  )
}
