'use client'

import { KnightPacketNav } from '@/components/marketing/knight/KnightPacketNav'
import { edgeZonesNavAnchors } from '@/lib/marketing/edgezones-content'

const items = edgeZonesNavAnchors.map((anchor) => ({
  href: `#${anchor.id}`,
  label: anchor.label,
}))

/** Scroll-spy section nav for the Edge Zones partnership portal. */
export function EdgeZonesPacketNav() {
  return <KnightPacketNav items={items} />
}
