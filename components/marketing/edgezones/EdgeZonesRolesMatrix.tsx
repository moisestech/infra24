import Link from 'next/link'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { cn } from '@/lib/utils'

const ACCENT_BORDER = {
  coral: 'border-t-[var(--ez-orange)]',
  indigo: 'border-t-[var(--ez-blue)]',
  teal: 'border-t-[var(--ez-green)]',
} as const

export function EdgeZonesRolesMatrix() {
  const { rolesMatrix } = edgeZonesPortal
  const columns = [rolesMatrix.edgeZones, rolesMatrix.jordanHorton, rolesMatrix.dccMiami]

  return (
    <section id="roles" className="ez-section border-b border-[var(--ez-border)] bg-[var(--ez-paper-alt)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="ez-heading text-xl sm:text-2xl">{rolesMatrix.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--ez-muted)]">{rolesMatrix.intro}</p>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {columns.map((col) => (
            <li
              key={col.title}
              className={cn(
                'ez-card border-t-4 p-5',
                ACCENT_BORDER[col.accent as keyof typeof ACCENT_BORDER]
              )}
            >
              <p className="ez-module-number">ROLE</p>
              <h3 className="ez-heading mt-2 text-base">{col.title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--ez-muted)]">
                {col.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ez-muted)]">{col.intro}</p>
              <ul className="mt-4 space-y-2">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-snug">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--ez-ink)]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {'href' in col && col.href ? (
                <Link
                  href={col.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-xs font-semibold uppercase tracking-wide text-[var(--ez-blue)] hover:underline"
                >
                  {col.hrefLabel} →
                </Link>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="ez-accent-block-blue mt-10 p-4 text-sm leading-relaxed">
          <p className="font-medium">{rolesMatrix.disclaimer}</p>
        </div>
      </div>
    </section>
  )
}
