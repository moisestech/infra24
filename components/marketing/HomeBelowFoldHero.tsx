'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { HomeHeroRotatingHeadline } from '@/components/marketing/HomeHeroRotatingHeadline';
import { HeroSubheadKeyTerms } from '@/components/marketing/HeroSubheadKeyTerms';
import { HeroAboveFoldEngagement } from '@/components/marketing/HeroAboveFoldEngagement';
import { marketingHeroSubheadSegments } from '@/lib/marketing/content';
import { dccHeroRotatingSubheads } from '@/lib/marketing/dcc-pilot-home-content';
import { cn } from '@/lib/utils';

const pilotBandClass = cn(
  'rounded-2xl border border-[var(--cdc-border)] bg-gradient-to-b from-white via-white to-neutral-50/90 p-6 shadow-[0_1px_0_rgba(45,212,191,0.12)] sm:p-8',
  'dark:border-neutral-700 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950/95 dark:shadow-[0_0_0_1px_rgba(45,212,191,0.08)]'
);

export function HomeBelowFoldHero() {
  const reduceMotion = useReducedMotion();

  const pilotHeadingClass =
    'relative z-[1] cdc-font-display text-[clamp(0.95rem,1.35vw+0.55rem,1.35rem)] font-bold uppercase leading-tight tracking-[0.14em] sm:tracking-[0.18em]';
  const pilotHeadingGradient = (
    <span
      className={cn(
        'bg-gradient-to-r from-teal-600 via-cyan-500 to-violet-600 bg-[length:200%_100%] bg-clip-text text-transparent dark:from-teal-400 dark:via-cyan-300 dark:to-violet-400',
        !reduceMotion && 'animate-dcc-pilot-heading-shimmer'
      )}
    >
      What DCC is building
    </span>
  );

  return (
    <div className="space-y-14">
      <div className={cn(pilotBandClass, 'overflow-visible')}>
        <div className="relative">
          {reduceMotion ? (
            <h2 className={pilotHeadingClass}>{pilotHeadingGradient}</h2>
          ) : (
            <motion.h2
              className={pilotHeadingClass}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {pilotHeadingGradient}
            </motion.h2>
          )}
          <span
            className="pointer-events-none absolute -bottom-1 left-0 right-0 h-px max-w-xl bg-gradient-to-r from-transparent via-teal-400/70 to-transparent blur-[0.5px] dark:via-teal-400/50"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -bottom-2 left-0 h-0.5 w-24 max-w-[40%] rounded-full bg-gradient-to-r from-teal-500/90 to-cyan-400/40 shadow-[0_0_18px_rgba(45,212,191,0.45)] dark:from-teal-400 dark:to-cyan-300/50 dark:shadow-[0_0_22px_rgba(45,212,191,0.35)]"
            aria-hidden
          />
        </div>

        <div className="mt-8 border-t border-[var(--cdc-border)] pt-8 dark:border-neutral-700 lg:hidden">
          <HomeHeroRotatingHeadline
            lines={[...dccHeroRotatingSubheads]}
            variant="subhead"
            textScale="dominant"
          />
        </div>

        <div className="mt-10 hidden border-t border-[var(--cdc-border)] pt-10 dark:border-neutral-700 lg:block">
          <h3 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 xl:text-4xl">
            Digital culture, in plain language
          </h3>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neutral-800 dark:text-neutral-200 xl:text-lg">
            Explore the terms that shape DCC&apos;s work.
          </p>
          <HeroSubheadKeyTerms
            segments={marketingHeroSubheadSegments}
            reduceMotion={Boolean(reduceMotion)}
            desktopSplitPreview
            className="mt-6"
            paragraphClassName="text-xl font-medium leading-relaxed text-neutral-900 dark:text-neutral-100 sm:text-2xl md:text-[1.75rem] md:leading-relaxed lg:text-[1.85rem] lg:leading-[1.45] xl:text-[2rem] xl:leading-[1.42]"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Stay connected to DCC
        </h2>
        <HeroAboveFoldEngagement className="mt-4" />
      </div>
    </div>
  );
}
