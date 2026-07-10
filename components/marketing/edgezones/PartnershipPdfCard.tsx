import { FileText, Download, ExternalLink } from 'lucide-react'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { EDGE_ZONES_PARTNERSHIP_PDF_PATH } from '@/lib/marketing/edgezones-network-index'
import { existsSync } from 'fs'
import path from 'path'

function pdfAvailable(): boolean {
  try {
    return existsSync(path.join(process.cwd(), 'public', 'docs', 'dcc-edgezones-partnership.pdf'))
  } catch {
    return false
  }
}

export function PartnershipPdfCard() {
  const { pdf } = edgeZonesPortal.sections
  const available = pdfAvailable()

  return (
    <section id="pdf" className="ez-section border-b border-[var(--ez-border)] bg-[var(--ez-paper-alt)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="ez-heading text-xl sm:text-2xl">{pdf.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ez-muted)]">{pdf.description}</p>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="ez-card flex h-40 w-full max-w-[200px] shrink-0 flex-col items-center justify-center gap-2 p-4 sm:h-48">
            <FileText className="h-12 w-12 text-[var(--ez-muted)]" strokeWidth={1.5} />
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-[var(--ez-muted)]">
              {available ? 'Proposal packet' : 'PDF coming soon'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {available ? (
              <>
                <a
                  href={EDGE_ZONES_PARTNERSHIP_PDF_PATH}
                  download
                  className="ez-btn-primary inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download Partnership PDF
                </a>
                <a
                  href={EDGE_ZONES_PARTNERSHIP_PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ez-btn-outline inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  Open PDF in New Tab
                </a>
              </>
            ) : (
              <p className="ez-accent-block-orange p-4 text-sm">
                PDF coming soon — updated as roles and deliverables are confirmed. Path:{' '}
                <code className="font-mono text-xs">{EDGE_ZONES_PARTNERSHIP_PDF_PATH}</code>
              </p>
            )}
            <p className="text-xs text-[var(--ez-muted)]">{pdf.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
