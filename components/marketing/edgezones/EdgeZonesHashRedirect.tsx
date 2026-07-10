'use client'

import { useEffect } from 'react'
import type { EdgeZonesSectionPath } from '@/lib/marketing/edgezones-sections'
import { edgeZonesSectionHref } from '@/lib/marketing/edgezones-sections'

type Props = {
  section: EdgeZonesSectionPath
}

/** Reliable hash navigation for printed PDF sub-paths (e.g. /edgezones/artists). */
export function EdgeZonesHashRedirect({ section }: Props) {
  useEffect(() => {
    const target = edgeZonesSectionHref(section)
    const query = window.location.search
    window.location.replace(`${target}${query}`)
  }, [section])

  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-[var(--ez-paper,#f4f1ea)] px-4">
      <p className="font-mono text-sm text-[var(--ez-muted,#4a4a4a)]">Opening Edge Zones…</p>
    </div>
  )
}
