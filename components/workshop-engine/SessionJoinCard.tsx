'use client'

import QRCode from '@/components/ui/QRCode'
import type { SafetyLevel } from '@/lib/workshop-engine/types'
import {
  getModuleIdentity,
  ModuleIcon,
  ModulePhaseChip,
} from '@/components/workshop-engine/WorkshopVisuals'
import {
  weIconBox,
  weSpace,
  weType,
} from '@/components/workshop-engine/responsive'
import { cn } from '@/lib/utils'
import { QrCode, ShieldAlert } from 'lucide-react'

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
    <div
      className={cn(
        'rounded-2xl border border-cyan-200 bg-white shadow-sm',
        weSpace.cardPad
      )}
    >
      <p className={cn(weType.meta, 'inline-flex items-center gap-1.5 text-cyan-800')}>
        <QrCode aria-hidden className="h-3.5 w-3.5" />
        Join session
      </p>
      <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.18em] text-slate-950 sm:text-4xl md:text-5xl 2xl:text-6xl">
        {code}
      </p>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6">
        <div className="mx-auto w-fit rounded-xl border border-slate-200 bg-white p-2 sm:mx-0">
          <QRCode value={joinUrl} size={size} />
        </div>
        <div className={cn('min-w-0 flex-1 space-y-2', weType.body)}>
          <p>
            Participant join:{' '}
            <a className="break-all underline" href={joinUrl}>
              {joinUrl}
            </a>
          </p>
          {presentUrl ? (
            <p>
              TV present:{' '}
              <a className="break-all underline" href={presentUrl}>
                {presentUrl}
              </a>
            </p>
          ) : null}
          {facilitateUrl ? (
            <p>
              Facilitator:{' '}
              <a className="break-all underline" href={facilitateUrl}>
                {facilitateUrl}
              </a>
            </p>
          ) : null}
          <p className="text-xs text-slate-500 md:text-sm">
            No account required for the pilot.
          </p>
        </div>
      </div>
    </div>
  )
}

export function WorkshopModuleCard({
  href,
  moduleId,
  order,
  title,
  minutes,
  promise,
  safetyLevel,
}: {
  href: string
  moduleId: string
  order: number
  title: string
  minutes: number
  promise: string
  safetyLevel?: SafetyLevel
}) {
  const identity = getModuleIdentity(moduleId)
  return (
    <a
      href={href}
      className={cn(
        'group relative block overflow-hidden rounded-2xl border bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2',
        weSpace.cardPad,
        identity.border
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r',
          identity.gradient
        )}
      />
      <div className="flex items-start gap-3 md:gap-4">
        <ModuleIcon moduleId={moduleId} className={weIconBox.md} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ModulePhaseChip moduleId={moduleId} />
            <p className={weType.meta}>
              {String(order).padStart(2, '0')} · {minutes} min
            </p>
          </div>
          <h3 className={cn('mt-2 md:mt-3', weType.cardTitle, 'group-hover:underline group-hover:underline-offset-4')}>
            {title}
          </h3>
          <p className={cn('mt-1', weType.body, 'text-slate-600')}>{promise}</p>
          {safetyLevel === 'required' ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-900 md:text-sm">
              <ShieldAlert aria-hidden className="h-3.5 w-3.5" />
              Safety gate required
            </p>
          ) : null}
        </div>
      </div>
    </a>
  )
}
