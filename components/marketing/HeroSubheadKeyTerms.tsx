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
   * Large screens + fine pointer: layered preview image sits behind copy and fades into the card.
   * Use on below-the-fold blocks; keep default for tight hero cards.
   */
  desktopSplitPreview?: boolean;
  /**
   * When set with `desktopSplitPreview`, the parent owns backdrop layers (full card height).
   * Provide `previewIndex` + `onPreviewIndexChange` from the same card wrapper.
   */
  cardLevelBackdrop?: boolean;
  /** Controlled active term index (term segments only); use with `onPreviewIndexChange`. */
  previewIndex?: number | null;
  onPreviewIndexChange?: (index: number | null) => void;
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

export function PreviewFigure({
  segment,
  layout = 'card',
}: {
  segment: Extract<MarketingHeroSubheadSegment, { kind: 'term' }>;
  /** `splitColumn` — beside-copy column. `backdrop` — behind copy + scrim (below-the-fold desktop). */
  layout?: 'card' | 'splitColumn' | 'backdrop';
}) {
  const imageSrc = segment.preview.imageSrc?.trim();
  const splitColumn = layout === 'splitColumn';
  const backdrop = layout === 'backdrop';

  const sizesCard =
    '(min-width: 1536px) 640px, (min-width: 1280px) 560px, (min-width: 1024px) min(45vw, 520px), (min-width: 640px) min(92vw, 720px), min(95vw, 660px)';
  /** Tall column: request enough pixels for large cover + height. */
  const sizesSplit =
    '(min-width: 1536px) 960px, (min-width: 1280px) 900px, (min-width: 1024px) 800px, (min-width: 640px) min(92vw, 720px), min(95vw, 660px)';
  const sizesBackdrop =
    '(min-width: 1536px) 1200px, (min-width: 1280px) 1000px, (min-width: 1024px) 900px, (min-width: 640px) 85vw, 90vw';
  const sizes = backdrop ? sizesBackdrop : splitColumn ? sizesSplit : sizesCard;

  return (
    <figure
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-neutral-100 shadow-[0_12px_40px_-12px_rgba(45,212,191,0.22)] dark:border-neutral-600 dark:bg-neutral-900 dark:shadow-[0_12px_40px_-12px_rgba(45,212,191,0.18)]',
        splitColumn && 'flex h-full min-h-0 w-full max-w-none flex-1 flex-col',
        backdrop &&
          'h-full w-full rounded-none border-0 bg-transparent shadow-none dark:border-0 dark:bg-transparent dark:shadow-none'
      )}
    >
      <div
        className={cn(
          'relative w-full',
          splitColumn ? 'min-h-0 flex-1' : 'aspect-square max-w-[min(95vw,660px)] sm:max-w-[min(92vw,720px)] lg:max-w-none lg:w-[33rem] xl:w-[39rem]',
          backdrop && 'aspect-auto h-full min-h-[12rem] max-w-none',
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
              className={cn('object-cover', backdrop && 'object-[75%_center]')}
            />
            <div
              className={cn(
                'pointer-events-none absolute inset-0 opacity-55 mix-blend-multiply dark:opacity-45 dark:mix-blend-soft-light',
                marketingGradientSurfaceClass(segment.preview.gradientId, { mesh: false })
              )}
              aria-hidden
            />
            <div
              className={cn(
                'pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent dark:from-black/55 dark:via-black/20',
                backdrop && 'from-black/35 via-transparent to-black/25 dark:from-black/40 dark:to-black/30'
              )}
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
      {segment.caption && !backdrop ? (
        <figcaption
          className={cn(
            'border-t border-neutral-200 bg-neutral-50/90 px-2.5 py-2 text-[11px] font-medium leading-snug text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950/80 dark:text-neutral-200',
            splitColumn && 'shrink-0'
          )}
        >
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
  cardLevelBackdrop = false,
  previewIndex: controlledPreviewIndex,
  onPreviewIndexChange,
}: HeroSubheadKeyTermsProps) {
  const reactId = useId();
  const previewId = `${reactId}-hero-term-preview`;
  const [hoverFine, setHoverFine] = useState(false);
  const [internalIndex, setInternalIndex] = useState<number | null>(null);

  const isControlled = typeof onPreviewIndexChange === 'function';
  const activeIndex = isControlled ? (controlledPreviewIndex ?? null) : internalIndex;
  const setActiveIndex = (index: number | null) => {
    if (isControlled) onPreviewIndexChange(index);
    else setInternalIndex(index);
  };

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
    const parentBackdrop = Boolean(cardLevelBackdrop && isControlled);

    return (
      <div
        className={cn('relative isolate mt-6 min-w-0', className)}
        onMouseLeave={() => {
          if (usePointerHover && !parentBackdrop) setActiveIndex(null);
        }}
      >
        {showPreview && activeTerm && !parentBackdrop ? (
          <>
            <div className="pointer-events-none absolute bottom-0 right-[-0.75rem] top-0 z-0 hidden min-h-[11rem] w-[min(82%,44rem)] overflow-hidden rounded-l-2xl sm:right-[-1rem] lg:block xl:w-[min(78%,52rem)]">
              <PreviewFigure segment={activeTerm} layout="backdrop" />
            </div>
            {/* Match pilot card bg so the photo dissolves into the band, not a hard edge */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[1] hidden bg-gradient-to-r from-white from-[18%] via-white/97 via-[46%] to-transparent to-[88%] dark:from-neutral-900 dark:from-[14%] dark:via-neutral-900/[0.96] dark:via-[50%] dark:to-transparent dark:to-[90%] lg:block"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 right-[-0.75rem] z-[1] hidden h-[min(52%,20rem)] w-[min(82%,44rem)] bg-gradient-to-t from-neutral-50/95 via-neutral-50/35 to-transparent sm:right-[-1rem] dark:from-neutral-950/95 dark:via-neutral-950/30 lg:block xl:w-[min(78%,52rem)]"
              aria-hidden
            />
          </>
        ) : null}

        <div id={previewId} role="region" aria-label="Term preview" className="relative z-[2] min-w-0">
          {termButtons}
          {showPreview && activeTerm?.caption ? (
            <p className="mt-4 max-w-2xl text-xs font-medium leading-snug text-neutral-600 dark:text-neutral-400">
              {activeTerm.caption}
            </p>
          ) : !showPreview ? (
            <p className="mt-4 max-w-xl text-xs font-medium leading-snug text-neutral-500 dark:text-neutral-400">
              Hover a highlighted keyword for a short description and color read.
            </p>
          ) : null}
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
            ? 'absolute left-0 top-full mt-4 w-[min(100%,720px)] lg:left-full lg:top-0 lg:mt-0 lg:ml-5 lg:w-max lg:max-w-[min(100vw-2rem,40.5rem)]'
            : 'relative mt-5 w-full max-w-[min(100%,720px)] border-t border-[var(--cdc-border)] pt-5 dark:border-neutral-700'
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
          usePointerHover && 'lg:max-w-none lg:pr-[min(40.5rem,min(90vw,52rem))]'
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
