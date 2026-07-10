import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { EDGE_ZONES_BANNERS } from '@/lib/marketing/edgezones-media'
import { EdgeZonesSectionBanner } from '@/components/marketing/edgezones/EdgeZonesSectionBanner'

export function DccPublicProgram() {
  const program = edgeZonesPortal.sections.publicProgram

  return (
    <section id="programs" className="ez-section border-b border-[var(--ez-border)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <EdgeZonesSectionBanner banner="programs" className="mb-8" caption="DCC-supported public program" />
        <h2 className="ez-heading text-xl sm:text-2xl">{program.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ez-muted)]">{program.intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="ez-chip ez-chip-blue rounded px-3 py-1.5">{program.dateLabel}</span>
          <span className="ez-chip ez-chip-orange rounded px-3 py-1.5">{program.formatLabel}</span>
        </div>

        <h3 className="ez-heading mt-8 text-sm">Possible formats</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {program.formats.map((format) => (
            <li key={format} className="flex gap-2 text-sm">
              <span className="text-[var(--ez-blue)]" aria-hidden>
                —
              </span>
              {format}
            </li>
          ))}
        </ul>

        <a href={program.ctaHref} className="ez-btn-primary mt-8 inline-flex min-h-11 items-center px-5 py-2.5">
          {program.ctaLabel}
        </a>
      </div>
    </section>
  )
}
