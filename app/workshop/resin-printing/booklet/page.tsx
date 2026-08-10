import type { Metadata } from 'next'
import { RESIN_BOOKLET_DRAFT_HREF, RESIN_PRINTING_MODULES } from '@/lib/workshop-engine/resin-printing'
import { BookletReference } from '@/components/workshop-engine/ModuleChrome'

export const metadata: Metadata = {
  title: 'Booklet — Resin Printing',
  description: 'Linked booklet references for the resin printing workshop modules.',
  alternates: { canonical: '/workshop/resin-printing/booklet' },
}

export default function ResinBookletPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-neutral-950">Booklet</h1>
        <p className="max-w-2xl text-neutral-700">
          Digital modules link to booklet sections. Exact page ranges stay marked pending until the
          canonical full guide is confirmed (interim draft is the 9-page PDF below; a 22-page Canva
          booklet also exists outside the repo).
        </p>
        <a
          className="inline-block rounded-md bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white"
          href={RESIN_BOOKLET_DRAFT_HREF}
        >
          Download draft PDF
        </a>
      </header>

      <div className="space-y-3">
        {RESIN_PRINTING_MODULES.map((module) =>
          module.bookletRefs.map((ref) => (
            <div key={`${module.id}-${ref.sectionTitle}`} className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Module {String(module.order).padStart(2, '0')} · {module.title}
              </p>
              <BookletReference
                sectionTitle={ref.sectionTitle}
                startPage={ref.startPage}
                endPage={ref.endPage}
                mappingPending={ref.mappingPending}
                href={`/workshop/resin-printing/modules/${module.slug}`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
