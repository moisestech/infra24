'use client'

import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { useEdgeZonesConceptHover } from '@/components/marketing/edgezones/EdgeZonesConceptHoverContext'
import {
  edgeZonesConceptThemeAccent,
  edgeZonesConceptThemeIcon,
} from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

const KEYWORD_LAYOUT = [
  { left: '6%', bottom: '38%', delay: '0s', duration: '5.2s' },
  { left: '14%', bottom: '14%', delay: '0.8s', duration: '6.1s' },
  { left: '52%', bottom: '32%', delay: '1.4s', duration: '5.6s' },
  { left: '68%', bottom: '10%', delay: '0.3s', duration: '6.4s' },
  { left: '36%', bottom: '6%', delay: '1.9s', duration: '5.9s' },
] as const

type Props = {
  label: string
  description: string
  keywords: string[]
}

export function EdgeZonesThemeCard({ label, description, keywords }: Props) {
  const { setHover } = useEdgeZonesConceptHover()
  const icon = edgeZonesConceptThemeIcon(label)
  const accent = edgeZonesConceptThemeAccent(icon)

  return (
    <li
      className={cn('ez-theme-card ez-card ez-logo-watermark group', `ez-theme-accent-${accent}`)}
      data-theme-icon={icon}
      onMouseEnter={() => setHover({ icon, accent })}
      onFocus={() => setHover({ icon, accent })}
      tabIndex={0}
    >
      <span className="ez-card-watermark pointer-events-none absolute inset-0 z-0" aria-hidden />

      <div className="ez-theme-scanlines pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="ez-theme-pixel-grid pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="ez-theme-keywords pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%]" aria-hidden>
        {keywords.slice(0, KEYWORD_LAYOUT.length).map((keyword, index) => {
          const layout = KEYWORD_LAYOUT[index]
          return (
            <span
              key={keyword}
              className="ez-theme-keyword"
              style={{
                left: layout.left,
                bottom: layout.bottom,
                animationDelay: layout.delay,
                animationDuration: layout.duration,
              }}
            >
              {keyword}
            </span>
          )
        })}
      </div>

      <div className="relative z-[3] flex items-start gap-3">
        <EdgeZonesIconBadge icon={icon} accent="indigo" size="compact" />
        <div className="ez-theme-content min-w-0 flex-1">
          <p className="ez-theme-label ez-heading ez-caption text-[var(--ez-blue)]" data-text={label}>
            <span className="ez-theme-label-base">{label}</span>
            <span className="ez-theme-label-glitch" aria-hidden>
              {label}
            </span>
          </p>
          <p className="ez-body ez-theme-description mt-2 text-[var(--ez-body-fg)]">{description}</p>
        </div>
      </div>
    </li>
  )
}
