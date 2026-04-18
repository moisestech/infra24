'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';
import { GlitchText } from '@/components/marketing/GlitchText';
import {
  heroHeadlineRotateIntervalMs,
  heroHeadlineRotateTransitionSec,
  heroHeadlineTypewriterHoldMs,
  heroHeadlineTypewriterMsPerChar,
  heroSubheadRotateIntervalMs,
} from '@/lib/marketing/dcc-pilot-home-content';
import { cn } from '@/lib/utils';

type HomeHeroRotatingHeadlineProps = {
  lines: readonly string[];
  intervalMs?: number;
  transitionSec?: number;
  /** `hero`: large tier-1 + aria-live polite. `subhead`: body tier-2, no live region (avoids double SR announcements). */
  variant?: 'hero' | 'subhead';
  /** Tier-1 semantic element when used as the primary homepage title. */
  headlineAs?: 'h1' | 'p';
  /** `dominant` — roughly 2× default hero scale for above-the-fold digital lines. */
  textScale?: 'default' | 'dominant';
  /** `glitch`: cross-fade + GlitchText. `typewriter`: character reveal; honors `prefers-reduced-motion`. */
  textMotion?: 'glitch' | 'typewriter';
  typewriterMsPerChar?: number;
  typewriterHoldMs?: number;
};

const rotatingHeadlineTypeClass = cn(
  'cdc-font-display m-0 max-w-[min(100%,48rem)] font-bold leading-[1.08] tracking-tight text-neutral-800 dark:text-neutral-100',
  'text-[clamp(1.35rem,5vw+0.35rem,2.85rem)]',
  'sm:text-[clamp(1.45rem,4.2vw+0.55rem,3.1rem)]',
  'lg:text-[clamp(1.65rem,3.2vw+1rem,3.45rem)]'
);

const rotatingHeadlineDominantClass = cn(
  'cdc-font-display m-0 max-w-[min(100%,52rem)] font-bold leading-[1.05] tracking-tight text-neutral-900 dark:text-neutral-50',
  'text-[clamp(2.1rem,6.5vw+0.6rem,4.6rem)]',
  'sm:text-[clamp(2.35rem,5.5vw+0.85rem,5.1rem)]',
  'lg:text-[clamp(2.65rem,4.2vw+1.1rem,5.75rem)]'
);

const rotatingSubheadTypeClass = cn(
  'cdc-font-display m-0 max-w-[min(100%,40rem)] font-medium leading-relaxed tracking-tight text-neutral-600 dark:text-neutral-300',
  'text-base sm:text-lg'
);

const rotatingSubheadLargeTypeClass = cn(
  'cdc-font-display m-0 max-w-[min(100%,48rem)] font-medium leading-relaxed tracking-tight text-neutral-700 dark:text-neutral-200',
  'text-xl sm:text-2xl md:text-[1.65rem] lg:text-3xl'
);

export function HomeHeroRotatingHeadline({
  lines,
  intervalMs,
  transitionSec = heroHeadlineRotateTransitionSec,
  variant = 'hero',
  headlineAs = 'p',
  textScale = 'default',
  textMotion = 'glitch',
  typewriterMsPerChar = heroHeadlineTypewriterMsPerChar,
  typewriterHoldMs = heroHeadlineTypewriterHoldMs,
}: HomeHeroRotatingHeadlineProps) {
  const resolvedIntervalMs =
    intervalMs ?? (variant === 'subhead' ? heroSubheadRotateIntervalMs : heroHeadlineRotateIntervalMs);
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [displayedLen, setDisplayedLen] = useState(0);

  const useTypewriter = !reduceMotion && textMotion === 'typewriter';

  useEffect(() => {
    if (reduceMotion || useTypewriter || lines.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, resolvedIntervalMs);
    return () => window.clearInterval(id);
  }, [lines.length, resolvedIntervalMs, reduceMotion, paused, useTypewriter]);

  useEffect(() => {
    if (!useTypewriter || paused || !lines.length) return;
    const lineIndex = index % lines.length;
    const line = lines[lineIndex] ?? '';
    if (!line) return;

    if (displayedLen < line.length) {
      const id = window.setTimeout(() => setDisplayedLen((n) => n + 1), typewriterMsPerChar);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      if (lines.length <= 1) {
        setDisplayedLen(0);
      } else {
        setIndex((i) => (i + 1) % lines.length);
        setDisplayedLen(0);
      }
    }, typewriterHoldMs);
    return () => window.clearTimeout(id);
  }, [useTypewriter, paused, lines, index, displayedLen, typewriterMsPerChar, typewriterHoldMs]);

  if (!lines.length) return null;

  const active = lines[reduceMotion ? 0 : index % lines.length] ?? '';

  const isSubhead = variant === 'subhead';
  const typeClass = isSubhead
    ? textScale === 'dominant'
      ? rotatingSubheadLargeTypeClass
      : rotatingSubheadTypeClass
    : textScale === 'dominant'
      ? rotatingHeadlineDominantClass
      : rotatingHeadlineTypeClass;
  const minHeightClass = isSubhead
    ? textScale === 'dominant'
      ? 'min-h-[6rem] sm:min-h-[7rem] md:min-h-[7.5rem]'
      : 'min-h-[4.5rem] sm:min-h-[5.25rem]'
    : textScale === 'dominant'
      ? 'min-h-[11rem] sm:min-h-[13rem] lg:min-h-[15rem]'
      : 'min-h-[7rem] sm:min-h-[8.5rem] lg:min-h-[9.5rem]';
  const rootClass = cn(
    textScale === 'dominant' ? 'max-w-4xl' : 'max-w-2xl',
    isSubhead ? 'mt-0' : textScale === 'dominant' ? 'mt-0' : 'mt-4'
  );
  const ContentTag = (
    !isSubhead && headlineAs === 'h1' ? 'h1' : 'p'
  ) as ElementType;

  if (reduceMotion) {
    return (
      <div className={cn(rootClass, minHeightClass)}>
        <GlitchText
          as={ContentTag}
          className={typeClass}
          interactive={false}
          disabled
        >
          {lines[0]}
        </GlitchText>
      </div>
    );
  }

  if (useTypewriter) {
    const typed = active.slice(0, displayedLen);
    const showCaret = displayedLen < active.length;

    return (
      <div className={rootClass} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className={minHeightClass}>
          <ContentTag
            className={typeClass}
            {...(!isSubhead && active ? { 'aria-label': active } : {})}
          >
            <span aria-hidden="true" className="inline">
              {typed}
              {showCaret ? (
                <span className="ml-px inline-block animate-pulse text-[var(--cdc-teal)] opacity-90">▍</span>
              ) : null}
            </span>
          </ContentTag>
        </div>
      </div>
    );
  }

  if (lines.length === 1) {
    return (
      <div className={cn(rootClass, minHeightClass)}>
        <GlitchText as={ContentTag} className={typeClass} interactive={!isSubhead}>
          {lines[0]}
        </GlitchText>
      </div>
    );
  }

  const liveRegion = !isSubhead ? (
    <div role="status" aria-live="polite" aria-atomic="true" className={minHeightClass}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: transitionSec, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlitchText as={ContentTag} className={typeClass} interactive>
            {active}
          </GlitchText>
        </motion.div>
      </AnimatePresence>
    </div>
  ) : (
    <div className={minHeightClass}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: transitionSec, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlitchText as="p" className={typeClass} interactive={false}>
            {active}
          </GlitchText>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className={rootClass} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {liveRegion}
    </div>
  );
}
