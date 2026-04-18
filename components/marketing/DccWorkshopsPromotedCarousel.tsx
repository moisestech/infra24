'use client'

import Link from 'next/link'
import { Carousel } from '@/components/ui/carousel'
import type { DccPromotedProgramSlide } from '@/lib/marketing/dcc-workshops-catalog-ui'

type Props = {
  slides: DccPromotedProgramSlide[]
}

export function DccWorkshopsPromotedCarousel({ slides }: Props) {
  if (!slides.length) return null

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-900 text-neutral-50 shadow-md dark:border-neutral-700">
      <Carousel autoPlay autoPlayInterval={6500} className="min-h-[220px] md:min-h-[200px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative flex min-h-[220px] flex-col justify-end overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-950 px-6 pb-12 pt-8 md:min-h-[200px] md:px-8"
          >
            {slide.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.imageUrl}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
              />
            ) : null}
            <div className="relative z-[1] max-w-lg">
              <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">{slide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-200">{slide.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={slide.learnMoreHref}
                  className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20"
                >
                  Learn More
                </Link>
                <Link
                  href={slide.viewProgramHref}
                  className="inline-flex rounded-full bg-[var(--cdc-teal)] px-4 py-2 text-sm font-semibold text-neutral-950 hover:opacity-90"
                >
                  View Program
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
