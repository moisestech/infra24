import Image from 'next/image'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { edgeZonesHeroCollagePhotos } from '@/lib/marketing/edgezones-media'
import { cn } from '@/lib/utils'

export function EdgeZonesProposalHero() {
  const { hero, primaryCtas, creditLine } = edgeZonesPortal
  const collage = edgeZonesHeroCollagePhotos()

  return (
    <section id="overview" className="ez-section relative border-b border-[var(--ez-border)]">
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:items-start">
          <div>
            <p className="ez-heading text-xs text-[var(--ez-muted)]">{hero.eyebrow}</p>
            <h1 className="ez-display mt-4 text-4xl sm:text-5xl lg:text-6xl">{hero.title}</h1>
            <p className="ez-heading mt-3 text-lg text-[var(--ez-blue)] sm:text-xl">{hero.subtitle}</p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--ez-muted)]">
              {hero.intro.split('\n\n').map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="mt-6 border-l-2 border-[var(--ez-ink)] pl-4 text-sm font-medium leading-relaxed">
              {creditLine}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {hero.statusChips.map((chip, i) => (
                <li
                  key={chip}
                  className={cn(
                    'ez-chip rounded px-2.5 py-1',
                    i === 0 && 'ez-chip-orange',
                    i === 1 && 'ez-chip-blue',
                    i === 2 && 'ez-chip-green'
                  )}
                >
                  {chip}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {primaryCtas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  className="ez-btn-primary inline-flex min-h-11 items-center justify-center px-5 py-2.5 transition"
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden border border-[var(--ez-border)]">
                <Image src={collage[0].src} alt={collage[0].alt} fill className="object-cover" sizes="400px" priority />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--ez-blue)]" aria-hidden />
              </div>
              {collage.slice(1).map((photo, i) => (
                <div key={photo.src} className="relative aspect-square overflow-hidden border border-[var(--ez-border)]">
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="200px" />
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
