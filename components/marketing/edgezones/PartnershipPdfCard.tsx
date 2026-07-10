import { Download, ExternalLink } from 'lucide-react'
import { EdgeZonesSectionHeader } from '@/components/marketing/edgezones/EdgeZonesSectionHeader'
import { PartnershipPdfBook } from '@/components/marketing/edgezones/PartnershipPdfBook'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { EDGE_ZONES_SECTION_ICONS } from '@/lib/marketing/edgezones-icons'
import {
  EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_DOWNLOAD_URL,
  EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_VIEW_URL,
} from '@/lib/marketing/edgezones-media'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

function localPdfAvailable(): boolean {
  try {
    const filePath = path.join(process.cwd(), 'public', 'docs', 'dcc-edgezones-partnership.pdf')
    if (!existsSync(filePath)) return false
    const header = readFileSync(filePath).subarray(0, 5).toString('utf8')
    return header.startsWith('%PDF')
  } catch {
    return false
  }
}

export function PartnershipPdfCard() {
  const { pdf } = edgeZonesPortal.sections
  const hasLocalPdf = localPdfAvailable()
  const viewUrl = hasLocalPdf ? '/docs/dcc-edgezones-partnership.pdf' : EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_VIEW_URL
  const downloadUrl = hasLocalPdf
    ? '/docs/dcc-edgezones-partnership.pdf'
    : EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_DOWNLOAD_URL

  return (
    <section id="pdf" className="ez-section border-b border-[var(--ez-border)] bg-[var(--ez-paper-alt)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <EdgeZonesSectionHeader
          icon={EDGE_ZONES_SECTION_ICONS.pdf}
          title={pdf.title}
          intro={pdf.description}
          accent="indigo"
          introClassName="max-w-2xl"
        />

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <PartnershipPdfBook className="mx-auto shrink-0 lg:mx-0" />

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <p className="ez-body text-[var(--ez-muted)]">
              The full proposal packet outlines the partnership framework, exhibition concept, DCC support model,
              artist cluster, and network index — formatted as a printable booklet.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ez-btn-primary inline-flex min-h-12 items-center justify-center gap-2 px-5 py-2.5"
              >
                <Download className="h-4 w-4" aria-hidden />
                Download Partnership PDF
              </a>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ez-btn-outline inline-flex min-h-12 items-center justify-center gap-2 px-5 py-2.5"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                Open PDF in New Tab
              </a>
            </div>

            <p className="ez-caption text-[var(--ez-muted)]">{pdf.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
