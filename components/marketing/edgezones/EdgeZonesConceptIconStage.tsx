'use client'

import { EdgeZonesIcon } from '@/components/marketing/edgezones/EdgeZonesIcon'
import { useEdgeZonesConceptHover } from '@/components/marketing/edgezones/EdgeZonesConceptHoverContext'
import { cn } from '@/lib/utils'

export function EdgeZonesConceptIconStage() {
  const { hover } = useEdgeZonesConceptHover()
  const accent = hover?.accent ?? 'indigo'
  const icon = hover?.icon

  return (
    <div
      className={cn(
        'ez-concept-icon-stage ez-logo-watermark relative hidden shrink-0 lg:flex',
        `ez-theme-accent-${accent}`,
        icon && 'ez-concept-icon-stage-active'
      )}
      aria-hidden
    >
      <span className="ez-card-watermark pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div className="ez-concept-icon-stage-scanlines pointer-events-none absolute inset-0" />
      <div className="ez-concept-icon-stage-pixel-grid pointer-events-none absolute inset-0" />
      {icon ? (
        <EdgeZonesIcon name={icon} className="ez-concept-icon-stage-icon h-full w-full" strokeWidth={1.1} />
      ) : (
        <div className="ez-concept-icon-stage-placeholder" />
      )}
    </div>
  )
}
