'use client'

import { KnightPacketNav } from '@/components/marketing/knight/KnightPacketNav'
import { edgeZonesNavAnchors } from '@/lib/marketing/edgezones-content'

const items = edgeZonesNavAnchors.map((anchor) => ({
  href: `#${anchor.id}`,
  label: anchor.label,
}))

/** Scroll-spy section nav for the Edge Zones proposal microsite. */
export function EdgeZonesSectionNav() {
  return <KnightPacketNav items={items} className="!bg-[var(--ez-paper)]/95 dark:!bg-[var(--ez-paper)]/95" />
}
