'use client'

import { KnightPacketNav } from '@/components/marketing/knight/KnightPacketNav'
import { EdgeZonesLanguageToggle } from '@/components/marketing/edgezones/EdgeZonesLanguageToggle'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'

/** Scroll-spy section nav for the Edge Zones proposal microsite. */
export function EdgeZonesSectionNav() {
  const { portal } = useEdgeZonesLocale()
  const items = portal.navAnchors.map((anchor) => ({
    href: `#${anchor.id}`,
    label: anchor.label,
  }))

  return (
    <KnightPacketNav
      items={items}
      variant="edgezones"
      trailing={<EdgeZonesLanguageToggle />}
    />
  )
}
