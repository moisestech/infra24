import type { Metadata } from 'next'
import {
  RESIN_BOOKLET_PDF_HREF,
  RESIN_PRINTING_MODULES,
} from '@/lib/workshop-engine/resin-printing'
import { RESIN_BOOKLET_EDITION } from '@/lib/workshop-engine/resin-printing/booklet'
import { BookletReference } from '@/components/workshop-engine/ModuleChrome'
import { weTouch, weType } from '@/components/workshop-engine/responsive'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Booklet — Resin Printing',
  description: 'Verified logical-page booklet references for the resin printing workshop.',
  alternates: { canonical: '/workshop/resin-printing/booklet' },
}

export default function ResinBookletPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className={weType.display}>Booklet</h1>
        <p className={cn(weType.body, 'max-w-[70ch] text-slate-700')}>
          {RESIN_BOOKLET_EDITION.title}. {RESIN_BOOKLET_EDITION.editionNote}
        </p>
        <p className="max-w-[70ch] rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950 md:text-base">
          Verified inventory: {RESIN_BOOKLET_EDITION.pdfSheetCount} PDF sheets ·{' '}
          {RESIN_BOOKLET_EDITION.logicalPageCount} logical page labels · missing pages{' '}
          {RESIN_BOOKLET_EDITION.missingLogicalPages.join(' and ')}. Format:{' '}
          {RESIN_BOOKLET_EDITION.format}. Download is a print-spread edition; logical-page
          previews appear when guide-page JPGs are present.
        </p>
        <a
          className={cn(weTouch.button, 'bg-slate-950 text-white hover:bg-slate-800')}
          href={RESIN_BOOKLET_PDF_HREF}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download print-spread PDF
        </a>
      </header>

      <div className="space-y-6">
        {RESIN_PRINTING_MODULES.map((workshopModule) => (
          <section key={workshopModule.id} className="space-y-3">
            <h2 className={weType.section}>
              Module {String(workshopModule.order).padStart(2, '0')} ·{' '}
              {workshopModule.title}
            </h2>
            <ul className="space-y-3">
              {workshopModule.bookletRefs.map((ref) => (
                <li key={`${ref.sectionTitle}-${ref.startPage ?? 'x'}`}>
                  <BookletReference
                    sectionTitle={ref.sectionTitle}
                    startPage={ref.startPage}
                    endPage={ref.endPage}
                    status={ref.status}
                    note={ref.note}
                    pagePreviewHref={ref.pagePreviewHref}
                    moduleId={workshopModule.id}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
