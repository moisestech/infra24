'use client'

import QRCode from '@/components/ui/QRCode'

export function SessionJoinCard({
  code,
  joinUrl,
  presentUrl,
  facilitateUrl,
  size = 180,
}: {
  code: string
  joinUrl: string
  presentUrl?: string
  facilitateUrl?: string
  size?: number
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Join session</p>
      <p className="mt-2 font-mono text-4xl font-semibold tracking-[0.2em] text-neutral-950">{code}</p>
      <div className="mt-4 flex flex-wrap items-start gap-6">
        <div className="rounded border border-neutral-200 bg-white p-2">
          <QRCode value={joinUrl} size={size} />
        </div>
        <div className="space-y-2 text-sm text-neutral-700">
          <p>
            Participant join:{' '}
            <a className="underline break-all" href={joinUrl}>
              {joinUrl}
            </a>
          </p>
          {presentUrl ? (
            <p>
              TV present:{' '}
              <a className="underline break-all" href={presentUrl}>
                {presentUrl}
              </a>
            </p>
          ) : null}
          {facilitateUrl ? (
            <p>
              Facilitator:{' '}
              <a className="underline break-all" href={facilitateUrl}>
                {facilitateUrl}
              </a>
            </p>
          ) : null}
          <p className="text-xs text-neutral-500">No account required for the pilot.</p>
        </div>
      </div>
    </div>
  )
}

export function WorkshopModuleCard({
  href,
  order,
  title,
  minutes,
  promise,
}: {
  href: string
  order: number
  title: string
  minutes: number
  promise: string
}) {
  return (
    <a
      href={href}
      className="block rounded-md border border-neutral-200 bg-white px-4 py-4 transition hover:border-neutral-500"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {String(order).padStart(2, '0')} · {minutes} min
        </p>
      </div>
      <h3 className="mt-1 text-lg font-semibold text-neutral-950">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{promise}</p>
    </a>
  )
}
