'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Per-word “no signal” RGB offset — subtle staggered chroma (scoped under `.cdc-marketing`).
 */
export function GlitchWords({ text, className }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return null;

  if (reduceMotion) {
    return <span className={className}>{text.trim()}</span>;
  }

  return (
    <span className={cn('cdc-institutional-glitch-words', className)}>
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          className={cn(
            'cdc-institutional-glitch-word',
            `cdc-institutional-glitch-word--${i % 4}`,
            i < words.length - 1 && 'mr-[0.28em] sm:mr-[0.32em]'
          )}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
