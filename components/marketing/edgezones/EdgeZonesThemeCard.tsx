'use client'

import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { useEdgeZonesConceptHover } from '@/components/marketing/edgezones/EdgeZonesConceptHoverContext'
import {
  edgeZonesConceptThemeAccent,
  edgeZonesConceptThemeIcon,
} from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

const KEYWORD_LAYOUT = [
  { left: '6%', bottom: '58%', delay: '0s', duration: '5.2s' },
  { left: '16%', bottom: '18%', delay: '0.8s', duration: '6.1s' },
  { left: '54%', bottom: '52%', delay: '1.4s', duration: '5.6s' },
  { left: '72%', bottom: '14%', delay: '0.3s', duration: '6.4s' },
  { left: '38%', bottom: '8%', delay: '1.9s', duration: '5.9s' },
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
      className={cn(
        'ez-theme-card ez-card ez-logo-watermark group flex min-h-[15.5rem] flex-col',
        `ez-theme-accent-${accent}`
      )}
      data-theme-icon={icon}
      onMouseEnter={() => setHover({ icon, accent })}
      onFocus={() => setHover({ icon, accent })}
      tabIndex={0}
    >
      <span className="ez-card-watermark pointer-events-none absolute inset-0 z-0" aria-hidden />

      <div className="ez-theme-scanlines pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="ez-theme-pixel-grid pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="ez-theme-body relative z-[3] flex flex-1 flex-col">
        <div className="flex items-start gap-3">
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
      </div>

      <div className="ez-theme-keywords relative z-[2] mt-4 min-h-[5.25rem] shrink-0" aria-hidden>
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
    </li>
  )
}
