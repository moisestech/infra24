'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { dccHomeHeroActionBand } from '@/lib/marketing/dcc-pilot-home-content';
import { cn } from '@/lib/utils';

export function HomeHeroActionBand() {
  const reduceMotion = useReducedMotion();
  const { primaries } = dccHomeHeroActionBand;

  return (
    <motion.div
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-4"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
    >
      {primaries.map((cta, i) => (
        <Link
          key={cta.href}
          href={cta.href}
          className={cn(
            'inline-flex min-h-[3.25rem] flex-1 items-center justify-center px-6 text-center text-base font-bold tracking-wide no-underline transition-transform duration-300 ease-in-out active:translate-y-px sm:min-w-[10.5rem] sm:px-8 sm:text-lg',
            i === 0
              ? 'group relative z-0 w-full cursor-pointer overflow-hidden rounded-lg border-2 border-teal-500/35 bg-slate-900 text-white shadow-sm hover:opacity-95 sm:w-auto sm:min-w-[14rem]'
              : 'cdc-arcade-secondary-btn text-neutral-900 dark:text-neutral-100'
          )}
        >
          {cta.label}
        </Link>
      ))}
    </motion.div>
  );
}
