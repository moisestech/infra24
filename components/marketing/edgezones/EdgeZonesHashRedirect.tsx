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
    window.location.replace(target)
  }, [section])

  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">Opening Edge Zones…</p>
    </div>
  )
}
