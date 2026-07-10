'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import { EDGE_ZONES_CONTACT, edgeZonesPartnershipMailto } from '@/lib/marketing/edgezones-media'
import { EDGE_ZONES_GALLERY_WEBSITE } from '@/lib/marketing/edgezones-network-index'

type Props = {
  className?: string
}

/** Partnership contact — Charo Oquet liaison via hello@dcc.miami. */
export function EdgeZonesContactStrip({ className }: Props) {
  const { portal } = useEdgeZonesLocale()
  const { ui } = portal
  const mailto = edgeZonesPartnershipMailto()

  return (
    <div className={`ez-card p-6 ${className ?? ''}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--ez-border)] bg-[var(--ez-paper-alt)] text-[var(--ez-blue)]"
            aria-hidden
          >
            <Mail className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <h3 className="ez-subsection-title font-semibold">{ui.partnershipContactTitle}</h3>
            <p className="ez-body mt-2 text-[var(--ez-muted)]">{ui.partnershipContactBody}</p>
            <p className="ez-caption mt-2 text-[var(--ez-muted)]">{EDGE_ZONES_CONTACT.email}</p>
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
            {ui.emailDccTeam}
          </ShimmerButton>
          <Link
            href={EDGE_ZONES_GALLERY_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="ez-caption text-center font-medium text-[var(--ez-blue)] hover:underline sm:text-right"
          >
            edgezones.org →
          </Link>
        </div>
      </div>
    </div>
  )
}
