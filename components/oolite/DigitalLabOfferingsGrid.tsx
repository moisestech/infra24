'use client'

import { ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DIGITAL_LAB_OFFERING_KIND_LABELS,
  DIGITAL_LAB_QGIV_HUB_URL,
  type DigitalLabOfferingKind,
  getDigitalLabQgivOfferingsByKind,
} from '@/lib/orgs/oolite/digital-lab-qgiv-offerings'

const KIND_ORDER: DigitalLabOfferingKind[] = ['workshop', 'consulting', 'visit']

type DigitalLabOfferingsGridProps = {
  primaryColor?: string
  showHubCta?: boolean
}

export function DigitalLabOfferingsGrid({
  primaryColor = '#47abc4',
  showHubCta = true,
}: DigitalLabOfferingsGridProps) {
  return (
    <section className="mb-16" id="digital-lab-book">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold text-gray-900">Book workshops & consulting</h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Reserve a workshop seat, 1:1 consultation, or studio visit through the Digital Lab
          booking portal.
        </p>
        {showHubCta ? (
          <Button asChild size="lg" className="mt-6" style={{ backgroundColor: primaryColor }}>
            <a href={DIGITAL_LAB_QGIV_HUB_URL} target="_blank" rel="noopener noreferrer">
              Browse all offerings
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : null}
      </div>

      <div className="space-y-12">
        {KIND_ORDER.map((kind) => {
          const offerings = getDigitalLabQgivOfferingsByKind(kind)
          return (
            <div key={kind}>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                {DIGITAL_LAB_OFFERING_KIND_LABELS[kind]}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {offerings.map((offering) => (
                  <Card key={offering.key} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg leading-snug">
                        {offering.shortLabel ?? offering.title}
                      </CardTitle>
                      {offering.description ? (
                        <CardDescription>{offering.description}</CardDescription>
                      ) : null}
                    </CardHeader>
                    <CardContent className="mt-auto pt-0">
                      <Button
                        asChild
                        size="sm"
                        className="w-full sm:w-auto"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <a
                          href={offering.bookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Book now
                          <ExternalLink className="ml-2 h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
