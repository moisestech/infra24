'use client';

import { useReducedMotion } from 'framer-motion';
import { HomeHeroRotatingHeadline } from '@/components/marketing/HomeHeroRotatingHeadline';
import { HeroSubheadKeyTerms } from '@/components/marketing/HeroSubheadKeyTerms';
import { HeroAboveFoldEngagement } from '@/components/marketing/HeroAboveFoldEngagement';
import { marketingHeroSubheadSegments } from '@/lib/marketing/content';
import { dccHeroRotatingSubheads, dccPilotHomeHero } from '@/lib/marketing/dcc-pilot-home-content';

export function HomeBelowFoldHero() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-14">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          What the pilot is building
        </p>
        <HomeHeroRotatingHeadline
          lines={[...dccHeroRotatingSubheads]}
          variant="subhead"
          textScale="dominant"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Digital culture, in plain language
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Hover or tap an underlined term for a short description and color read.
        </p>
        <HeroSubheadKeyTerms
          segments={marketingHeroSubheadSegments}
          reduceMotion={Boolean(reduceMotion)}
          className="mt-5"
          paragraphClassName="text-xl leading-relaxed sm:text-2xl md:text-[1.65rem] md:leading-relaxed"
        />
      </div>

      <p className="max-w-3xl text-xl font-medium leading-relaxed text-neutral-700 dark:text-neutral-200 sm:text-2xl">
        {dccPilotHomeHero.trustLine}
      </p>

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Stay close to the pilot
        </h2>
        <HeroAboveFoldEngagement className="mt-4" />
      </div>
    </div>
  );
}
