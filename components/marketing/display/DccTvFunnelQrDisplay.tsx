'use client'

import { useEffect, useState } from 'react'
import QRCode from '@/components/ui/QRCode'
import { dccTvSignupUrl } from '@/lib/marketing/dcc-tv-slides'

export function DccTvFunnelQrDisplay() {
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const signupUrl = origin ? dccTvSignupUrl(origin) : ''
  const tvUrl = `${origin}/display/dcc/funnel`

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-neutral-700 bg-neutral-900 p-8 text-center text-white">
      <div>
        <h1 className="text-lg font-semibold">DCC TV — Intake QR</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Persistent QR for the landscape TV loop. Source:{' '}
          <span className="font-mono text-teal-400">dcc-tv</span>
        </p>
      </div>
      {origin ? (
        <>
          <div className="flex justify-center rounded-2xl bg-white p-4">
            <QRCode value={signupUrl} size={240} />
          </div>
          <div className="space-y-2 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">QR target (signup)</p>
            <p className="break-all font-mono text-xs text-neutral-300">{signupUrl}</p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-500">TV loop URL</p>
            <p className="break-all font-mono text-xs text-neutral-300">{tvUrl}</p>
          </div>
        </>
      ) : (
        <div className="h-[240px] animate-pulse rounded-lg bg-neutral-800" />
      )}
      <p className="text-xs text-neutral-500">Staff / print use — not linked in public navigation.</p>
    </div>
  )
}
