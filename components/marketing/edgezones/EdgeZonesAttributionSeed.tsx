'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  mergeAttribution,
  readStoredAttribution,
  storeAttribution,
} from '@/lib/dcc/signup/attribution'
import { edgeZonesProposalAttribution } from '@/lib/marketing/edgezones-content'

/** Seeds proposal attribution on /edgezones when URL params are absent (bare PDF QR). */
export function EdgeZonesAttributionSeed() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/edgezones') return

    const existing = readStoredAttribution()
    const merged = mergeAttribution(existing, {
      signupSource: existing.signupSource ?? edgeZonesProposalAttribution.signupSource,
      utmSource: existing.utmSource ?? edgeZonesProposalAttribution.utmSource,
      utmMedium: existing.utmMedium ?? edgeZonesProposalAttribution.utmMedium,
      utmCampaign: existing.utmCampaign ?? edgeZonesProposalAttribution.utmCampaign,
      utmContent: existing.utmContent ?? edgeZonesProposalAttribution.utmContent,
      qrCodeId: existing.qrCodeId ?? edgeZonesProposalAttribution.qrCodeId,
      landingPage: existing.landingPage ?? '/edgezones',
      referrer: existing.referrer || document.referrer || undefined,
      capturedAt: existing.capturedAt ?? new Date().toISOString(),
    })
    storeAttribution(merged)
  }, [pathname])

  return null
}
