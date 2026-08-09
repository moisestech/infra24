import type { Metadata } from 'next'
import Link from 'next/link'
import { dccSiteMeta } from '@/lib/marketing/content'
import { isDccOsConfigured } from '@/lib/dcc/os-config'
import { formatTierPrice, listActiveServices, type DccService } from '@/lib/dcc/services'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Three-tier DCC operating model — Bakehouse Associate, Public, and Commercial rates.',
  openGraph: {
    title: `Pricing | ${dccSiteMeta.organizationName}`,
    url: '/pricing',
  },
}

function groupByCategory(services: DccService[]): Map<string, DccService[]> {
  const map = new Map<string, DccService[]>()
  for (const s of services) {
    const key = s.category?.trim() || 'General'
    const list = map.get(key) ?? []
    list.push(s)
    map.set(key, list)
  }
  return map
}

export default async function PricingPage() {
  let services: DccService[] = []
  let error: string | null = null

  if (!isDccOsConfigured()) {
    error = 'DCC OS pricing is not configured yet. Rates will appear when Services sync is live.'
  } else {
    try {
      services = await listActiveServices()
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load services'
    }
  }

  const grouped = groupByCategory(services)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          DCC.miami
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Pricing
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Commercial work pays market rates → public programming pays sustainable rates → Bakehouse
          Associates receive preferred access (typically 30–40% preferred pricing when the Artist
          Access Fund is funded). Draft rates are unvalidated until a Miami market pass.
        </p>
      </header>

      <section className="mb-10 border border-[var(--cdc-border)] bg-neutral-50 p-5 text-sm dark:bg-neutral-900/50">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Large-format &amp; resin
        </h2>
        <p className="mt-2 font-mono text-neutral-700 dark:text-neutral-300">
          setup + material + machine time + technician labor + post-processing
        </p>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          These processes never display a flat hourly rate. Blank tier cells render as Quoted — never
          $0.
        </p>
      </section>

      {error ? (
        <p className="text-sm text-amber-800 dark:text-amber-200">{error}</p>
      ) : services.length === 0 ? (
        <p className="text-sm text-neutral-600">No active services in DCC OS yet.</p>
      ) : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([category, rows]) => (
            <section key={category}>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {category}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--cdc-border)] font-mono text-xs uppercase tracking-wide text-neutral-500">
                      <th className="py-2 pr-4 font-medium">Service</th>
                      <th className="py-2 pr-4 font-medium">Associate</th>
                      <th className="py-2 pr-4 font-medium">Public</th>
                      <th className="py-2 pr-4 font-medium">Commercial</th>
                      <th className="py-2 font-medium">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((s: DccService) => (
                      <tr key={s.id} className="border-b border-[var(--cdc-border)]">
                        <td className="py-3 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                          {s.name}
                          {s.quoteFormulaOnly ? (
                            <span className="mt-1 block font-mono text-xs font-normal text-neutral-500">
                              Quote formula
                            </span>
                          ) : null}
                        </td>
                        <td className="py-3 pr-4 font-mono">
                          {s.quoteFormulaOnly ? 'Quoted' : formatTierPrice(s.associatePrice)}
                        </td>
                        <td className="py-3 pr-4 font-mono">
                          {s.quoteFormulaOnly ? 'Quoted' : formatTierPrice(s.publicPrice)}
                        </td>
                        <td className="py-3 pr-4 font-mono">
                          {s.quoteFormulaOnly ? 'Quoted' : formatTierPrice(s.commercialPrice)}
                        </td>
                        <td className="py-3 font-mono text-neutral-500">{s.unit ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="mt-12 text-sm text-neutral-600 dark:text-neutral-400">
        Ready to fabricate?{' '}
        <Link href="/make" className="font-semibold text-[var(--cdc-teal)] hover:underline">
          Start a request
        </Link>
        .
      </p>
    </div>
  )
}
