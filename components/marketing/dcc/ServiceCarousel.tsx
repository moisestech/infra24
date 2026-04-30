'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DccServiceSlide } from '@/lib/marketing/dcc-services';

type ServiceCarouselProps = {
  slides: DccServiceSlide[];
  accentClass?: string;
  serviceTitle: string;
};

export function ServiceCarousel({
  slides,
  accentClass = 'text-cyan-600 dark:text-cyan-400',
  serviceTitle,
}: ServiceCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0, true);
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative rounded-[1.75rem] border border-neutral-200/90 bg-neutral-50/80 p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-950/80 sm:p-4">
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-[0.35] dark:opacity-25"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <div className="relative mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500">
            Real examples
          </p>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{serviceTitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-0 flex-[0_0_100%]">
              <div className="overflow-hidden rounded-[1.35rem] border border-neutral-200/90 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-100">
                    {slide.caption}
                  </p>
                  {slide.meta ? (
                    <p
                      className={cn(
                        'mt-2 font-mono text-[10px] uppercase tracking-[0.18em]',
                        accentClass
                      )}
                    >
                      {slide.meta}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-500">
          {String(selectedIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </p>

        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                index === selectedIndex
                  ? 'w-8 bg-neutral-900 dark:bg-white'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
