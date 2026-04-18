'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { marketingHeaderSloganLines } from '@/lib/marketing/marketing-header-slogans';

const ROTATE_MS = 5200;

/**
 * Full-width rotating tagline under the main header row — mono / digital scanline styling.
 */
export function MarketingHeaderSloganBar() {
  const reduceMotion = useReducedMotion();
  const [i, setI] = useState(0);
  const line = marketingHeaderSloganLines[i] ?? marketingHeaderSloganLines[0];

  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => {
      setI((n) => (n + 1) % marketingHeaderSloganLines.length);
    }, ROTATE_MS);
    return () => window.clearInterval(t);
  }, [reduceMotion]);

  return (
    <div
      className="cdc-header-slogan-bar border-t border-[var(--cdc-border)] bg-[linear-gradient(180deg,rgba(0,212,170,0.06)_0%,transparent_55%)] dark:border-neutral-700/80 dark:bg-[linear-gradient(180deg,rgba(0,212,170,0.09)_0%,transparent_50%)]"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mx-auto flex min-h-[2.25rem] max-w-7xl items-center justify-center px-3 py-1.5 sm:min-h-[2.5rem] sm:px-6 lg:px-8">
        <p className="sr-only">Rotating tagline: {line}</p>
        <div
          className="cdc-font-mono-accent relative max-w-4xl text-center text-[11px] font-medium leading-snug tracking-[0.04em] text-neutral-700 sm:text-xs dark:text-neutral-200"
          aria-hidden
        >
          {reduceMotion ? (
            <span className="cdc-header-slogan-text">{line}</span>
          ) : (
            <AnimatePresence mode="wait">
              <motion.span
                key={line}
                className="cdc-header-slogan-text block"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
