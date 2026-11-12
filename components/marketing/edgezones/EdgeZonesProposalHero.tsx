'use client'

import { EdgeZonesIcon } from '@/components/marketing/edgezones/EdgeZonesIcon'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { EdgeZonesHighlightParagraph } from '@/components/marketing/edgezones/EdgeZonesHighlightParagraph'
import { EdgeZonesHeroCollage } from '@/components/marketing/edgezones/EdgeZonesHeroCollage'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import { EDGE_ZONES_CTA_ICONS_BY_HREF, EDGE_ZONES_HERO_CHIP_ICONS } from '@/lib/marketing/edgezones-icons'
import { edgeZonesHeroCollagePhotos } from '@/lib/marketing/edgezones-media'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { EDGE_ZONES_GALLERY_MARK_URL } from '@/lib/marketing/edgezones-network-index'

export function EdgeZonesProposalHero() {
  const { portal } = useEdgeZonesLocale()
  const { hero, primaryCtas, creditLine } = portal
  const collage = edgeZonesHeroCollagePhotos()

  return (
    <section id="overview" className="ez-section relative border-b border-[var(--ez-border)]">
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,520px)] lg:items-start">
          <div>
            <div className="mb-6 flex items-center gap-4 border-l-4 border-[var(--ez-orange)] bg-[var(--ez-surface)] p-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded bg-white p-1">
                <Image src={EDGE_ZONES_GALLERY_MARK_URL} alt="Edge Zones Gallery logo" width={72} height={72} className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="ez-module-number">HOST INSTITUTION · EDGE ZONES</p>
                <a href="https://edgezones.org" target="_blank" rel="noopener noreferrer" className="ez-heading text-2xl leading-tight underline decoration-[var(--ez-blue)] underline-offset-4">Edge Zones</a>
                <p className="ez-caption text-[var(--ez-muted)]">Miami · Experimental art since 1996</p>
              </div>
            </div>
            <p className="ez-heading ez-caption flex items-center gap-2 text-[var(--ez-muted)]">
              <EdgeZonesIconBadge icon="sparkles" accent="teal" size="compact" />
              {hero.eyebrow}
            </p>
            <h1 className="ez-display mt-4 text-5xl sm:text-6xl lg:text-[4rem]">{hero.title}</h1>
            <p className="ez-heading mt-3 text-xl text-[var(--ez-blue)] sm:text-2xl">{hero.subtitle}</p>
            <div className="mt-6 space-y-4">
              {hero.intro.split('\n\n').map((p) => (
                <EdgeZonesHighlightParagraph key={p.slice(0, 24)}>{p}</EdgeZonesHighlightParagraph>
              ))}
            </div>
            <p className="ez-body mt-6 border-l-2 border-[var(--ez-ink)] pl-4 font-medium text-[var(--ez-body-fg)]">
              {creditLine}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {hero.statusChips.map((chip, i) => {
                const chipIcon = EDGE_ZONES_HERO_CHIP_ICONS[i] ?? 'sparkles'
                return (
                  <li
                    key={chip}
                    className={cn(
                      'ez-chip inline-flex items-center gap-2 rounded px-3 py-1.5',
                      i === 0 && 'ez-chip-orange',
                      i === 1 && 'ez-chip-blue',
                      i === 2 && 'ez-chip-green'
                    )}
                  >
                    <EdgeZonesIcon name={chipIcon} className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                    {chip}
                  </li>
                )
              })}
            </ul>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {primaryCtas.map((cta) => {
                const ctaIcon = EDGE_ZONES_CTA_ICONS_BY_HREF[cta.href]
                return (
                  <a
                    key={cta.href}
                    href={cta.href}
                    className="ez-btn-primary inline-flex min-h-12 items-center justify-center gap-2 px-5 py-2.5 transition"
                  >
                    {ctaIcon ? <EdgeZonesIcon name={ctaIcon} className="h-4 w-4 shrink-0" strokeWidth={2} /> : null}
                    {cta.label}
                  </a>
                )
              })}
            </div>
          </div>

          <EdgeZonesHeroCollage photos={collage} />
        </div>
      </div>
      <div className="ez-pixel-divider" aria-hidden />
    </section>
  )
}
