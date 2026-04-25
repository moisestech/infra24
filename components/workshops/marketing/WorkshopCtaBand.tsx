import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import { Calendar, Download, Mail } from 'lucide-react'

export function WorkshopCtaBand({
  marketing,
  bookHref,
  onInterest,
  interestDisabled,
  interestLabel,
}: {
  marketing: WorkshopMarketingMetadata
  workshopId?: string
  /** e.g. /o/slug/bookings?workshopId= */
  bookHref?: string
  onInterest?: () => void
  interestDisabled?: boolean
  interestLabel?: string
}) {
  const { primary, secondary, institutional } = marketing.ctas ?? {}

  if (!primary) return null

  const primaryIsBook = primary.action === 'book' && bookHref
  const primaryIsInterest = primary.action === 'interest' || !primary.action
  const primaryHasHref =
    primary.href &&
    (primary.action === 'external' || primary.action === undefined)

  const ooliteUsd = marketing.ooliteRegistrationUsd
  const showOolitePricingNote =
    typeof ooliteUsd === 'number' &&
    ooliteUsd > 0 &&
    (typeof marketing.publicListPriceUsd !== 'number' ||
      marketing.publicListPriceUsd > ooliteUsd)

  return (
    <div className="space-y-3 rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {primaryHasHref && primary.href && (
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={primary.href} target="_blank" rel="noopener noreferrer">
              {primary.label}
            </a>
          </Button>
        )}
        {primaryIsBook && bookHref && (
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={bookHref}>
              <Calendar className="mr-2 h-4 w-4" />
              {primary.label}
            </Link>
          </Button>
        )}
        {primaryIsInterest && onInterest && !primaryHasHref && !primaryIsBook && (
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={onInterest}
            disabled={interestDisabled}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {interestLabel ?? primary.label}
          </Button>
        )}
        {secondary?.label && secondary.href && (
          <Button asChild variant="outline" size="lg">
            <a href={secondary.href}>
              <Download className="mr-2 h-4 w-4" />
              {secondary.label}
            </a>
          </Button>
        )}
        {marketing.packetPdfUrl && !secondary?.href && (
          <Button asChild variant="outline" size="lg">
            <a href={marketing.packetPdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Workshop packet
            </a>
          </Button>
        )}
        {institutional?.href && (
          <Button asChild variant="ghost" size="lg">
            <a href={institutional.href}>
              <Mail className="mr-2 h-4 w-4" />
              {institutional.label}
            </a>
          </Button>
        )}
      </div>
      {showOolitePricingNote || marketing.alumniCouponCode ? (
        <div className="border-t pt-3 text-xs leading-relaxed text-muted-foreground">
          {showOolitePricingNote ? (
            <p>
              Oolite member registration is <span className="font-medium text-foreground">${ooliteUsd}</span>{' '}
              when you book through Oolite (public list price is shown in the Join card above).
            </p>
          ) : null}
          {marketing.alumniCouponCode ? (
            <p className={showOolitePricingNote ? 'mt-2' : ''}>
              Oolite alumni: use coupon{' '}
              <span className="font-mono font-medium text-foreground">{marketing.alumniCouponCode}</span>{' '}
              at checkout for the published alumni discount.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
