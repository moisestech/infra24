'use client';

import { useEffect, useId, useMemo, useState } from 'react';

import type { MarketingHeroSubheadSegment } from '@/lib/marketing/content';
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients';
import { cn } from '@/lib/utils';

type HeroSubheadKeyTermsProps = {
  segments: readonly MarketingHeroSubheadSegment[];
  reduceMotion: boolean;
  className?: string;
};

function PreviewFigure({
  segment,
}: {
  segment: Extract<MarketingHeroSubheadSegment, { kind: 'term' }>;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-neutral-100 shadow-[0_12px_40px_-12px_rgba(0,212,170,0.2)]">
      <div
        className={cn(
          'relative aspect-square w-full max-w-[220px] sm:max-w-[240px] lg:max-w-none lg:w-44 xl:w-52',
          marketingGradientSurfaceClass(segment.preview.gradientId)
        )}
        role="img"
        aria-label={segment.preview.alt}
      />
      {segment.caption ? (
        <figcaption className="border-t border-neutral-100 px-2.5 py-2 text-[11px] leading-snug text-neutral-600">
          {segment.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function HeroSubheadKeyTerms({
  segments,
  reduceMotion,
  className,
}: HeroSubheadKeyTermsProps) {
  const reactId = useId();
  const previewId = `${reactId}-hero-term-preview`;
  const [hoverFine, setHoverFine] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setHoverFine(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const usePointerHover = hoverFine && !reduceMotion;

  const activeTerm = useMemo(() => {
    if (activeIndex === null) return null;
    const seg = segments[activeIndex];
    return seg?.kind === 'term' ? seg : null;
  }, [activeIndex, segments]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const showPreview = activeTerm !== null;

  return (
    <div
      className={cn('relative mt-6', className)}
      onMouseLeave={() => {
        if (usePointerHover) setActiveIndex(null);
      }}
    >
      <div className="relative inline-block w-full max-w-2xl">
        <p className="text-lg leading-relaxed text-neutral-600">
          {segments.map((seg, i) => {
            if (seg.kind === 'text') {
              return <span key={i}>{seg.text}</span>;
            }
            const isActive = activeIndex === i;
            return (
              <span
                key={i}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-controls={previewId}
                className={cn(
                  'cursor-pointer rounded-sm border-b-2 border-dotted border-[rgb(0,212,170)]/55 text-neutral-800 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[rgb(255,0,136)] focus-visible:ring-offset-2',
                  isActive &&
                    'border-solid border-[rgb(255,0,136)] bg-[rgba(255,0,136,0.08)] text-neutral-900',
                  usePointerHover &&
                    'hover:border-[rgb(0,212,170)] hover:bg-[rgba(0,212,170,0.1)]'
                )}
                onMouseEnter={() => {
                  if (usePointerHover) setActiveIndex(i);
                }}
                onClick={() => {
                  setActiveIndex((prev) => (prev === i ? null : i));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIndex((prev) => (prev === i ? null : i));
                  }
                }}
              >
                {seg.text}
              </span>
            );
          })}
        </p>

        {showPreview && activeTerm ? (
          <div
            id={previewId}
            role="region"
            aria-label="Term preview"
            className="absolute left-0 top-full z-20 mt-4 w-[min(100%,240px)] lg:left-full lg:top-0 lg:mt-0 lg:ml-5 lg:w-max lg:max-w-[min(100vw-2rem,13.5rem)]"
          >
            <PreviewFigure segment={activeTerm} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
