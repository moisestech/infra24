'use client'

import Image from 'next/image'
import { EdgeZonesIcon } from '@/components/marketing/edgezones/EdgeZonesIcon'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import { EDGE_ZONES_CTA_ICONS_BY_HREF, EDGE_ZONES_HERO_CHIP_ICONS } from '@/lib/marketing/edgezones-icons'
import { edgeZonesHeroCollagePhotos } from '@/lib/marketing/edgezones-media'
import { cn } from '@/lib/utils'

export function EdgeZonesProposalHero() {
  const { portal } = useEdgeZonesLocale()
  const { hero, primaryCtas, creditLine } = portal
  const collage = edgeZonesHeroCollagePhotos()

  return (
    <section id="overview" className="ez-section relative border-b border-[var(--ez-border)]">
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,520px)] lg:items-start">
          <div>
            <p className="ez-heading ez-caption flex items-center gap-2 text-[var(--ez-muted)]">
              <EdgeZonesIconBadge icon="sparkles" accent="teal" size="compact" />
              {hero.eyebrow}
            </p>
            <h1 className="ez-display mt-4 text-5xl sm:text-6xl lg:text-[4rem]">{hero.title}</h1>
            <p className="ez-heading mt-3 text-xl text-[var(--ez-blue)] sm:text-2xl">{hero.subtitle}</p>
            <div className="ez-body mt-6 space-y-4 text-[var(--ez-muted)]">
              {hero.intro.split('\n\n').map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="ez-body mt-6 border-l-2 border-[var(--ez-ink)] pl-4 font-medium">
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

          <div className="relative">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden border border-[var(--ez-border)] sm:aspect-[5/3]">
                <Image src={collage[0].src} alt={collage[0].alt} fill className="object-cover" sizes="520px" priority />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--ez-blue)]" aria-hidden />
              </div>
              {collage.slice(1).map((photo, i) => (
                <div key={photo.src} className="relative aspect-square overflow-hidden border border-[var(--ez-border)] sm:aspect-[4/5]">
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="260px" />
                  <div
                    className={cn('absolute bottom-0 left-0 right-0 h-1', i === 0 ? 'bg-[var(--ez-green)]' : 'bg-[var(--ez-orange)]')}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
            <div className="absolute -right-2 -top-2 h-8 w-8 border border-[var(--ez-blue)] bg-[var(--ez-blue)] opacity-80" aria-hidden />
            <div className="absolute -bottom-2 -left-2 h-6 w-6 border border-[var(--ez-orange)] bg-[var(--ez-orange)] opacity-70" aria-hidden />
          </div>
        </div>
      </div>
      <div className="ez-pixel-divider" aria-hidden />
    </section>
  )
}
