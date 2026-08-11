import type { Metadata } from 'next'
import {
  RESIN_BOOKLET_DRAFT_HREF,
  RESIN_PRINTING_MODULES,
} from '@/lib/workshop-engine/resin-printing'
import { RESIN_BOOKLET_EDITION } from '@/lib/workshop-engine/resin-printing/booklet'
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
          {RESIN_BOOKLET_EDITION.title}. {RESIN_BOOKLET_EDITION.editionNote}
        </p>
        <p className="max-w-2xl rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Exact section page ranges stay <span className="font-medium">mapping pending</span>{' '}
          until verified page-by-page. Do not treat module booklet links as certified page
          numbers yet. Interim 9-page draft PDF is available for download.
        </p>
        <a
          className="inline-block rounded-md bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white"
          href={RESIN_BOOKLET_DRAFT_HREF}
        >
          Download draft PDF
        </a>
      </header>

      <div className="space-y-3">
        {RESIN_PRINTING_MODULES.map((workshopModule) =>
          workshopModule.bookletRefs.map((ref) => (
            <div key={`${workshopModule.id}-${ref.sectionTitle}`} className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Module {String(workshopModule.order).padStart(2, '0')} · {workshopModule.title}
              </p>
              <BookletReference
                sectionTitle={ref.sectionTitle}
                startPage={ref.startPage}
                endPage={ref.endPage}
                mappingPending={ref.mappingPending}
                href={`/workshop/resin-printing/modules/${workshopModule.slug}`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
