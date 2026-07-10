import Image from 'next/image'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { EDGE_ZONES_BANNERS } from '@/lib/marketing/edgezones-media'

export function TouchingGrassConcept() {
  const { concept } = edgeZonesPortal
  const banner = EDGE_ZONES_BANNERS.concept

  return (
    <section id="concept" className="ez-section border-b border-[var(--ez-border)]">
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative mb-8 overflow-hidden border border-[var(--ez-border)]">
          <div className="relative aspect-[21/9] w-full min-h-[12rem] sm:min-h-[16rem]">
            <Image src={banner.src} alt={banner.alt} fill className="object-cover" sizes="1152px" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ez-paper)] via-[var(--ez-paper)]/70 to-transparent" />
          </div>
        </div>

        <h2 className="ez-heading text-xl sm:text-2xl">{concept.title}</h2>
        <p className="ez-heading mt-2 text-sm text-[var(--ez-blue)]">{concept.subtitle}</p>

        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-[var(--ez-muted)]">
          {concept.paragraphs.map((p) => (
            <p key={p.slice(0, 30)}>{p}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-mono">
          {concept.diagram.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className="ez-chip rounded px-2 py-1">{step}</span>
              {i < concept.diagram.length - 1 ? <span className="text-[var(--ez-muted)]">→</span> : null}
            </span>
          ))}
        </div>

        <h3 className="ez-heading mt-10 text-sm">Key themes</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {concept.themes.map((theme) => (
            <li key={theme.label} className="ez-card p-4">
              <p className="ez-heading text-xs text-[var(--ez-blue)]">{theme.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ez-muted)]">{theme.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
