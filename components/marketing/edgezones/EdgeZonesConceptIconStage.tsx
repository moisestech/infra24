'use client'

import { EdgeZonesIcon } from '@/components/marketing/edgezones/EdgeZonesIcon'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { useEdgeZonesConceptHover } from '@/components/marketing/edgezones/EdgeZonesConceptHoverContext'
import type { EdgeZonesIconAccent, EdgeZonesThemeAccent } from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

const STAGE_BADGE_ACCENT: Record<EdgeZonesThemeAccent, EdgeZonesIconAccent> = {
  blue: 'indigo',
  indigo: 'indigo',
  teal: 'teal',
  green: 'teal',
  orange: 'coral',
  magenta: 'magenta',
}

export function EdgeZonesConceptIconStage() {
  const { hover } = useEdgeZonesConceptHover()
  const accent = hover?.accent ?? 'indigo'
  const icon = hover?.icon
  const isActive = Boolean(icon)
  const badgeAccent = STAGE_BADGE_ACCENT[accent]

  return (
    <div
      className={cn(
        'ez-concept-icon-stage ez-logo-watermark relative hidden shrink-0 lg:flex',
        `ez-theme-accent-${accent}`,
        isActive && 'ez-concept-icon-stage-active'
      )}
      aria-live="polite"
    >
      <span className="ez-card-watermark pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div className="ez-concept-icon-stage-scanlines pointer-events-none absolute inset-0" />
      <div className="ez-concept-icon-stage-pixel-grid pointer-events-none absolute inset-0" />
      <div className="ez-concept-icon-stage-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-[2] flex w-full flex-col items-center justify-center gap-3 px-4 py-5 text-center">
        {icon ? (
          <>
            <EdgeZonesIconBadge icon={icon} accent={badgeAccent} size="compact" className="ez-concept-icon-stage-badge" />
            <div className="ez-concept-icon-stage-icon-wrap">
              <EdgeZonesIcon name={icon} className="ez-concept-icon-stage-icon h-16 w-16 sm:h-20 sm:w-20" strokeWidth={1.1} />
            </div>
            {hover?.label ? (
              <p className="ez-concept-icon-stage-label ez-heading ez-caption text-[var(--ez-blue)]">{hover.label}</p>
            ) : null}
            {hover?.caption ? (
              <p className="ez-concept-icon-stage-caption ez-caption font-mono uppercase tracking-wide text-[var(--ez-muted)]">
                {hover.caption}
              </p>
            ) : null}
          </>
        ) : (
          <div className="ez-concept-icon-stage-placeholder" />
        )}
      </div>
    </div>
  )
}
