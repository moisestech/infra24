'use client';

import Image from 'next/image';
import { useEffect, useId, useMemo, useState } from 'react';

import type { MarketingHeroSubheadSegment } from '@/lib/marketing/content';
import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients';
import { cn } from '@/lib/utils';

type HeroSubheadKeyTermsProps = {
  segments: readonly MarketingHeroSubheadSegment[];
  reduceMotion: boolean;
  className?: string;
  /** Applied to the flowing paragraph (e.g. larger below-the-fold body). */
  paragraphClassName?: string;
  /**
   * Large screens: two-column layout with preview in a dedicated column (avoids clipping).
   * Use on below-the-fold blocks; keep default for tight hero cards.
   */
  desktopSplitPreview?: boolean;
};

/** Compact “keyword chip” colors aligned to each term’s preview gradient. */
function termHighlightClass(gradientId: MarketingGradientId): string {
  const map: Record<MarketingGradientId, string> = {
    stackTeal:
      'border-teal-400/55 bg-gradient-to-r from-teal-500/22 to-cyan-500/14 text-teal-950 dark:border-teal-500/45 dark:from-teal-400/25 dark:to-cyan-400/14 dark:text-teal-50',
    columnCoral:
      'border-orange-400/45 bg-gradient-to-r from-rose-500/20 to-amber-500/14 text-rose-950 dark:border-orange-500/40 dark:from-rose-400/22 dark:to-amber-400/12 dark:text-orange-50',
    fieldViolet:
      'border-fuchsia-400/45 bg-gradient-to-r from-fuchsia-500/18 to-violet-600/14 text-violet-950 dark:border-fuchsia-500/35 dark:from-fuchsia-400/22 dark:to-violet-500/14 dark:text-violet-50',
    meshSlate:
      'border-slate-400/50 bg-gradient-to-r from-slate-600/18 to-zinc-600/14 text-slate-900 dark:border-slate-500/45 dark:from-slate-400/18 dark:to-zinc-500/14 dark:text-slate-100',
    pulseMagenta:
      'border-pink-400/45 bg-gradient-to-r from-pink-500/18 to-fuchsia-600/14 text-pink-950 dark:border-pink-500/40 dark:from-pink-400/20 dark:to-fuchsia-500/14 dark:text-pink-50',
    warmAmber:
      'border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-yellow-500/12 text-amber-950 dark:border-amber-500/40 dark:from-amber-400/20 dark:to-yellow-400/12 dark:text-amber-50',
    deepInk:
      'border-neutral-500/45 bg-gradient-to-r from-neutral-700/18 to-neutral-900/16 text-neutral-900 dark:border-neutral-500/40 dark:from-neutral-500/20 dark:to-neutral-800/18 dark:text-neutral-100',
    signalCyan:
      'border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-teal-500/14 text-cyan-950 dark:border-cyan-500/40 dark:from-cyan-400/22 dark:to-teal-400/14 dark:text-cyan-50',
    roseMist:
      'border-rose-400/45 bg-gradient-to-r from-rose-500/18 to-neutral-600/12 text-rose-950 dark:border-rose-500/35 dark:from-rose-400/18 dark:to-neutral-500/14 dark:text-rose-50',
    indigoHaze:
      'border-indigo-400/45 bg-gradient-to-r from-indigo-500/18 to-blue-600/14 text-indigo-950 dark:border-indigo-500/40 dark:from-indigo-400/20 dark:to-blue-500/14 dark:text-indigo-50',
  };
  return map[gradientId];
}

function PreviewFigure({
  segment,
}: {
  segment: Extract<MarketingHeroSubheadSegment, { kind: 'term' }>;
}) {
  const imageSrc = segment.preview.imageSrc?.trim();
  const sizes =
    '(min-width: 1280px) 208px, (min-width: 1024px) 14rem, (min-width: 640px) 240px, 220px';

  return (
    <figure className="overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-neutral-100 shadow-[0_12px_40px_-12px_rgba(45,212,191,0.22)] dark:border-neutral-600 dark:bg-neutral-900 dark:shadow-[0_12px_40px_-12px_rgba(45,212,191,0.18)]">
      <div
        className={cn(
          'relative aspect-square w-full max-w-[220px] sm:max-w-[240px] lg:max-w-none lg:w-44 xl:w-52',
          imageSrc ? 'bg-neutral-200 dark:bg-neutral-950' : marketingGradientSurfaceClass(segment.preview.gradientId)
        )}
      >
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={segment.preview.alt}
              fill
              sizes={sizes}
              className="object-cover"
            />
            <div
              className={cn(
                'pointer-events-none absolute inset-0 opacity-55 mix-blend-multiply dark:opacity-45 dark:mix-blend-soft-light',
                marketingGradientSurfaceClass(segment.preview.gradientId, { mesh: false })
              )}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent dark:from-black/55 dark:via-black/20"
              aria-hidden
            />
          </>
        ) : (
          <div
            className={cn('h-full w-full', marketingGradientSurfaceClass(segment.preview.gradientId))}
            role="img"
            aria-label={segment.preview.alt}
          />
        )}
      </div>
      {segment.caption ? (
        <figcaption className="border-t border-neutral-200 bg-neutral-50/90 px-2.5 py-2 text-[11px] font-medium leading-snug text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950/80 dark:text-neutral-200">
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
  paragraphClassName,
  desktopSplitPreview = false,
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

  /** Desktop / trackpad: hover previews. Touch / coarse pointer: tap only (no hover affordance). */
  const usePointerHover = hoverFine && !reduceMotion;
  const splitPreview = desktopSplitPreview && usePointerHover;

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

  const termButtons = (
    <p
      className={cn(
        'leading-relaxed text-neutral-800 dark:text-neutral-200',
        paragraphClassName ?? 'text-lg',
      )}
    >
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
              'mx-0.5 inline-block align-baseline rounded-md border px-[0.22em] py-[0.06em] text-[1.02em] font-semibold tracking-tight outline-none transition-[box-shadow,transform,filter]',
              termHighlightClass(seg.preview.gradientId),
              usePointerHover && 'cursor-pointer hover:brightness-[1.06]',
              !usePointerHover && 'cursor-pointer touch-manipulation active:scale-[0.99]',
              isActive &&
                'ring-2 ring-[var(--cdc-teal)] ring-offset-2 ring-offset-white dark:ring-offset-neutral-900'
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
  );

  if (splitPreview) {
    return (
      <div
        className={cn('relative mt-6', className)}
        onMouseLeave={() => {
          if (usePointerHover) setActiveIndex(null);
        }}
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_min(13.5rem,16vw)] lg:items-start lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">{termButtons}</div>
          <div
            id={previewId}
            role="region"
            aria-label="Term preview"
            className={cn(
              'min-w-0 lg:sticky lg:top-28',
              showPreview ? 'mt-6 lg:mt-0' : 'mt-0 hidden lg:mt-0 lg:flex lg:min-h-[220px] lg:flex-col lg:justify-center'
            )}
          >
            {showPreview && activeTerm ? (
              <PreviewFigure segment={activeTerm} />
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--cdc-border)] bg-neutral-50/80 px-3 py-6 text-center dark:border-neutral-600 dark:bg-neutral-900/40">
                <p className="text-xs font-medium leading-snug text-neutral-500 dark:text-neutral-400">
                  Hover a highlighted keyword for a short description and color read.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const previewPanel =
    showPreview && activeTerm ? (
      <div
        id={previewId}
        role="region"
        aria-label="Term preview"
        className={cn(
          'z-20',
          usePointerHover
            ? 'absolute left-0 top-full mt-4 w-[min(100%,240px)] lg:left-full lg:top-0 lg:mt-0 lg:ml-5 lg:w-max lg:max-w-[min(100vw-2rem,13.5rem)]'
            : 'relative mt-5 w-full max-w-md border-t border-[var(--cdc-border)] pt-5 dark:border-neutral-700'
        )}
      >
        <PreviewFigure segment={activeTerm} />
      </div>
    ) : null;

  return (
    <div
      className={cn('relative mt-6', className)}
      onMouseLeave={() => {
        if (usePointerHover) setActiveIndex(null);
      }}
    >
      <div
        className={cn(
          'relative w-full max-w-2xl',
          usePointerHover && 'lg:max-w-none lg:pr-[min(15rem,22vw)]'
        )}
      >
        <div className="relative min-w-0">
          {termButtons}
          {previewPanel}
        </div>
      </div>
    </div>
  );
}
