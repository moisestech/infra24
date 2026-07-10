'use client'

import { EdgeZonesIcon } from '@/components/marketing/edgezones/EdgeZonesIcon'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import {
  edgeZonesConceptThemeAccent,
  edgeZonesConceptThemeIcon,
} from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

const KEYWORD_LAYOUT = [
  { top: '14%', left: '8%', delay: '0s', duration: '5.2s' },
  { top: '62%', left: '12%', delay: '0.8s', duration: '6.1s' },
  { top: '28%', left: '58%', delay: '1.4s', duration: '5.6s' },
  { top: '72%', left: '52%', delay: '0.3s', duration: '6.4s' },
  { top: '44%', left: '34%', delay: '1.9s', duration: '5.9s' },
] as const

const PARTICLE_LAYOUT = [
  { top: '18%', left: '22%', delay: '0s' },
  { top: '36%', left: '78%', delay: '0.6s' },
  { top: '58%', left: '18%', delay: '1.1s' },
  { top: '74%', left: '68%', delay: '0.4s' },
  { top: '48%', left: '86%', delay: '1.7s' },
  { top: '82%', left: '40%', delay: '0.9s' },
] as const

type Props = {
  label: string
  description: string
  keywords: string[]
}

export function EdgeZonesThemeCard({ label, description, keywords }: Props) {
  const icon = edgeZonesConceptThemeIcon(label)
  const accent = edgeZonesConceptThemeAccent(icon)

  return (
    <li
      className={cn('ez-theme-card ez-card group min-h-[11.5rem]', `ez-theme-accent-${accent}`)}
      data-theme-icon={icon}
    >
      <div className="ez-theme-scanlines pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="ez-theme-pixel-grid pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="ez-theme-bg-icon pointer-events-none absolute z-0" aria-hidden>
        <EdgeZonesIcon name={icon} className="h-full w-full" strokeWidth={1.25} />
      </div>

      <div className="ez-theme-particles pointer-events-none absolute inset-0 z-[2]" aria-hidden>
        {PARTICLE_LAYOUT.map((particle, index) => (
          <span
            key={`particle-${index}`}
            className="ez-theme-particle"
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="ez-theme-keywords pointer-events-none absolute inset-0 z-[2]" aria-hidden>
        {keywords.slice(0, KEYWORD_LAYOUT.length).map((keyword, index) => {
          const layout = KEYWORD_LAYOUT[index]
          return (
            <span
              key={keyword}
              className="ez-theme-keyword"
              style={{
                top: layout.top,
                left: layout.left,
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
        <div className="min-w-0">
          <p className="ez-theme-label ez-heading ez-caption text-[var(--ez-blue)]" data-text={label}>
            <span className="ez-theme-label-base">{label}</span>
            <span className="ez-theme-label-glitch" aria-hidden>
              {label}
            </span>
          </p>
          <p className="ez-body mt-2 text-[var(--ez-muted)] transition-colors duration-300 group-hover:text-[var(--ez-ink)]">
            {description}
          </p>
        </div>
      </div>
    </li>
  )
}
