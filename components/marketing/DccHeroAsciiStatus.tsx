'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  dccHomeMonoAccentPhrases,
  heroHeadlineTypewriterHoldMs,
  heroHeadlineTypewriterMsPerChar,
} from '@/lib/marketing/dcc-pilot-home-content';

/**
 * Decorative mono accent for hero (underscore phrases); not critical content.
 */
export function DccHeroAsciiStatus() {
  const reduceMotion = useReducedMotion();
  const phrases = dccHomeMonoAccentPhrases;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const active = phrases[phraseIndex % phrases.length] ?? '';
  const typed = reduceMotion ? active : active.slice(0, charCount);

  useEffect(() => {
    if (reduceMotion || !phrases.length) return;
    if (charCount < active.length) {
      const t = window.setTimeout(
        () => setCharCount((c) => c + 1),
        heroHeadlineTypewriterMsPerChar
      );
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
      setCharCount(0);
    }, heroHeadlineTypewriterHoldMs);
    return () => window.clearTimeout(t);
  }, [reduceMotion, phrases.length, active, charCount, phraseIndex]);

  return (
    <pre
      className="cdc-font-mono-accent cdc-hero-ascii-status cdc-hero-ascii-status--animate"
      aria-hidden
    >
      {typed}
      {!reduceMotion && charCount < active.length ? (
        <span className="text-[var(--cdc-teal)]">▍</span>
      ) : null}
    </pre>
  );
}
