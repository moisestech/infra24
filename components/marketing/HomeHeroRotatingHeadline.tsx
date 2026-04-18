'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GlitchText } from '@/components/marketing/GlitchText';
import {
  heroHeadlineRotateIntervalMs,
  heroHeadlineRotateTransitionSec,
  heroSubheadRotateIntervalMs,
} from '@/lib/marketing/dcc-pilot-home-content';
import { cn } from '@/lib/utils';

type HomeHeroRotatingHeadlineProps = {
  lines: readonly string[];
  intervalMs?: number;
  transitionSec?: number;
  /** `hero`: large tier-1 + aria-live polite. `subhead`: body tier-2, no live region (avoids double SR announcements). */
  variant?: 'hero' | 'subhead';
};

const rotatingHeadlineTypeClass = cn(
  'm-0 max-w-[min(100%,42rem)] font-bold leading-[1.12] tracking-tight text-neutral-800 dark:text-neutral-100',
  'text-[clamp(1.35rem,5vw+0.35rem,2.85rem)]',
  'sm:text-[clamp(1.45rem,4.2vw+0.55rem,3.1rem)]',
  'lg:text-[clamp(1.65rem,3.2vw+1rem,3.45rem)]'
);

const rotatingSubheadTypeClass = cn(
  'm-0 max-w-[min(100%,40rem)] font-medium leading-relaxed tracking-tight text-neutral-600 dark:text-neutral-300',
  'text-base sm:text-lg'
);

export function HomeHeroRotatingHeadline({
  lines,
  intervalMs,
  transitionSec = heroHeadlineRotateTransitionSec,
  variant = 'hero',
}: HomeHeroRotatingHeadlineProps) {
  const resolvedIntervalMs =
    intervalMs ?? (variant === 'subhead' ? heroSubheadRotateIntervalMs : heroHeadlineRotateIntervalMs);
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || lines.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, resolvedIntervalMs);
    return () => window.clearInterval(id);
  }, [lines.length, resolvedIntervalMs, reduceMotion, paused]);

  if (!lines.length) return null;

  const active = lines[reduceMotion ? 0 : index % lines.length] ?? '';

  const isSubhead = variant === 'subhead';
  const typeClass = isSubhead ? rotatingSubheadTypeClass : rotatingHeadlineTypeClass;
  const minHeightClass = isSubhead
    ? 'min-h-[4.5rem] sm:min-h-[5.25rem]'
    : 'min-h-[7rem] sm:min-h-[8.5rem] lg:min-h-[9.5rem]';
  const rootClass = cn('max-w-2xl', isSubhead ? 'mt-0' : 'mt-4');

  if (reduceMotion) {
    return (
      <div className={cn(rootClass, minHeightClass)}>
        <GlitchText
          as="p"
          className={typeClass}
          interactive={false}
          disabled
        >
          {lines[0]}
        </GlitchText>
      </div>
    );
  }

  if (lines.length === 1) {
    return (
      <div className={cn(rootClass, minHeightClass)}>
        <GlitchText as="p" className={typeClass} interactive={!isSubhead}>
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
          <GlitchText as="p" className={typeClass} interactive>
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
