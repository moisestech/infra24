'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OfferLink } from './OfferLink';
import { cn } from '@/lib/utils';

export type HeroCarouselSlide = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  credit?: string;
  href?: string;
  sectionId?: string;
  sectionLabel: string;
};

export function HeroWorkshopCarousel({
  slides,
  note,
}: {
  slides: readonly HeroCarouselSlide[];
  note?: string;
}) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  if (!slide) return null;
  const target = slide.href ?? (slide.sectionId ? `#${slide.sectionId}` : undefined);

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="relative aspect-[16/9]">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 640px"
            priority={index === 0}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/80 to-transparent p-4 sm:p-5">
          <p className="text-sm font-semibold text-white">{slide.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/85">{slide.caption}</p>
          {target ? (
            <OfferLink
              href={target}
              className="mt-2 inline-flex text-xs font-medium text-white underline-offset-4 hover:underline"
            >
              {slide.sectionLabel}
            </OfferLink>
          ) : null}
        </div>
        {slides.length > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950/60 text-white hover:bg-neutral-950/80"
              aria-label="Previous workshop slide"
              onClick={() => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1))}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950/60 text-white hover:bg-neutral-950/80"
              aria-label="Next workshop slide"
              onClick={() => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1))}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {slides.map((item, i) => (
          <button
            key={`${item.title}-${i}`}
            type="button"
            aria-label={`Show ${item.title}`}
            aria-current={i === index ? 'true' : undefined}
            className={cn(
              'h-1.5 w-6 rounded-full',
              i === index ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-700'
            )}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
      {note ? (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{note}</p>
      ) : null}
    </div>
  );
}
