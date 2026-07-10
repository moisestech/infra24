import Image from 'next/image'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { EDGE_ZONES_BANNERS, type EdgeZonesBannerKey } from '@/lib/marketing/edgezones-media'
import { cn } from '@/lib/utils'

type Props = {
  banner: EdgeZonesBannerKey
  caption?: string
  priority?: boolean
  className?: string
}

/** Full-width section banner with bottom gradient scrim. */
export function EdgeZonesSectionBanner({ banner, caption, priority = false, className }: Props) {
  const photo = EDGE_ZONES_BANNERS[banner]

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-[var(--ez-border)] bg-white',
        className
      )}
    >
      <div className="relative aspect-[5/2] w-full min-h-[9rem] sm:min-h-[12rem] lg:min-h-[14rem]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1152px"
        />
        <div className="ez-banner-scrim pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" aria-hidden />
        {caption ? (
          <p className="absolute bottom-3 left-4 right-4 font-mono text-xs font-medium text-white/90 sm:text-sm">
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function EdgeZonesArchiveSection() {
  const { archive } = edgeZonesPortal.sections

  return (
    <section id="archive" className="ez-section border-b border-[var(--ez-border)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <EdgeZonesSectionBanner banner="archive" className="mb-8" caption="Documentation archive" />
        <h2 className="ez-heading text-xl sm:text-2xl">{archive.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ez-muted)]">{archive.intro}</p>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {archive.deliverables.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span className="font-mono text-[var(--ez-green)]" aria-hidden>
                +
              </span>
              {item}
            </li>
          ))}
        </ul>
        <span className="ez-status-soon mt-6 inline-block rounded px-3 py-1">{archive.status}</span>
      </div>
    </section>
  )
}
