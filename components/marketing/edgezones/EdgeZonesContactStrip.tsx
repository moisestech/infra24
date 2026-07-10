'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { EDGE_ZONES_CONTACT, edgeZonesPartnershipMailto } from '@/lib/marketing/edgezones-media'
import { EDGE_ZONES_GALLERY_WEBSITE } from '@/lib/marketing/edgezones-network-index'

type Props = {
  className?: string
}

/** Partnership contact — Charo Oquet liaison via hello@dcc.miami. */
export function EdgeZonesContactStrip({ className }: Props) {
  const mailto = edgeZonesPartnershipMailto()

  return (
    <div
      className={`rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 via-white to-cyan-50/50 p-6 shadow-sm dark:border-teal-800/40 dark:from-teal-950/30 dark:via-neutral-900 dark:to-cyan-950/20 ${className ?? ''}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 ring-1 ring-teal-200/80 shadow-[0_0_20px_rgba(45,212,191,0.25)] dark:bg-teal-950/60 dark:text-teal-200 dark:ring-teal-500/30"
            aria-hidden
          >
            <Mail className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Partnership contact
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              Questions about Edge Zones programming or the Touching Grass exhibition? Reach{' '}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {EDGE_ZONES_CONTACT.liaisonName}
              </span>{' '}
              ({EDGE_ZONES_CONTACT.liaisonRole}) via the DCC team.
            </p>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {EDGE_ZONES_CONTACT.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <ShimmerButton
            type="button"
            background="rgb(13 148 136)"
            shimmerColor="rgba(255,255,255,0.45)"
            className="min-h-11 px-5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(13,148,136,0.35)]"
            onClick={() => {
              window.location.href = mailto
            }}
          >
            Email the DCC team
          </ShimmerButton>
          <Link
            href={EDGE_ZONES_GALLERY_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-xs font-medium text-teal-800 hover:underline dark:text-teal-300 sm:text-right"
          >
            edgezones.gallery →
          </Link>
        </div>
      </div>
    </div>
  )
}
