'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GlitchText } from '@/components/marketing/GlitchText';
import {
  heroHeadlineRotateIntervalMs,
  heroHeadlineRotateTransitionSec,
} from '@/lib/marketing/dcc-pilot-home-content';
import { cn } from '@/lib/utils';

type HomeHeroRotatingHeadlineProps = {
  lines: readonly string[];
  intervalMs?: number;
  transitionSec?: number;
};

const rotatingHeadlineTypeClass = cn(
  'm-0 max-w-[min(100%,42rem)] font-bold leading-[1.12] tracking-tight text-neutral-800 dark:text-neutral-100',
  'text-[clamp(1.35rem,5vw+0.35rem,2.85rem)]',
  'sm:text-[clamp(1.45rem,4.2vw+0.55rem,3.1rem)]',
  'lg:text-[clamp(1.65rem,3.2vw+1rem,3.45rem)]'
);

export function HomeHeroRotatingHeadline({
  lines,
  intervalMs = heroHeadlineRotateIntervalMs,
  transitionSec = heroHeadlineRotateTransitionSec,
}: HomeHeroRotatingHeadlineProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || lines.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [lines.length, intervalMs, reduceMotion, paused]);

  if (!lines.length) return null;

  const active = lines[reduceMotion ? 0 : index % lines.length] ?? '';

  const minHeightClass = 'min-h-[7rem] sm:min-h-[8.5rem] lg:min-h-[9.5rem]';

  if (reduceMotion) {
    return (
      <div className={cn('mt-4 max-w-2xl', minHeightClass)}>
        <GlitchText
          as="p"
          className={rotatingHeadlineTypeClass}
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
      <div className={cn('mt-4 max-w-2xl', minHeightClass)}>
        <GlitchText as="p" className={rotatingHeadlineTypeClass} interactive>
          {lines[0]}
        </GlitchText>
      </div>
    );
  }

  return (
    <div
      className="mt-4 max-w-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={minHeightClass}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: transitionSec, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlitchText as="p" className={rotatingHeadlineTypeClass} interactive>
              {active}
            </GlitchText>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
