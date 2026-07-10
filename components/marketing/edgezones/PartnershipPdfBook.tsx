import Image from 'next/image'
import { getEdgeZonesPortal } from '@/lib/marketing/edgezones/content'
import type { EdgeZonesLocale } from '@/lib/marketing/edgezones/edgezones-locale'
import {
  EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_VIEW_URL,
  edgeZonesPartnershipPdfCover,
} from '@/lib/marketing/edgezones-media'

type Props = {
  locale: EdgeZonesLocale
  className?: string
}

/** 3D booklet preview — cover art with spine and page edge. */
export function PartnershipPdfBook({ locale, className }: Props) {
  const { ui } = getEdgeZonesPortal(locale)
  const cover = edgeZonesPartnershipPdfCover()

  return (
    <a
      href={EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_VIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`ez-book group block ${className ?? ''}`}
      aria-label={ui.bookletAriaLabel}
    >
      <div className="ez-book-stage">
        <div className="ez-book-shadow" aria-hidden />
        <div className="ez-book-body">
          <div className="ez-book-spine" aria-hidden />
          <div className="ez-book-pages" aria-hidden />
          <div className="ez-book-cover relative overflow-hidden">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              className="object-cover object-center transition duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 70vw, 280px"
              priority={false}
            />
            <div className="ez-book-cover-sheen pointer-events-none absolute inset-0" aria-hidden />
          </div>
        </div>
      </div>
      <p className="ez-caption mt-4 text-center font-mono uppercase tracking-wider text-[var(--ez-muted)]">
        {ui.bookletLabel}
      </p>
    </a>
  )
}
