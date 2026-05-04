'use client';

import { useReducedMotion } from 'framer-motion';
import { Marquee } from '@/components/magicui/marquee';
import { cn } from '@/lib/utils';

/** Phrases + high-viz separators; `markAlt` crossfades on hover for a “signal flip” feel. */
const SEGMENTS: readonly {
  readonly text: string;
  readonly mark: string;
  readonly markAlt: string;
  readonly markClass: string;
}[] = [
  { text: 'born-digital art', mark: '◆', markAlt: '✧', markClass: 'text-[var(--cdc-teal)]' },
  { text: 'artist websites', mark: '▸', markAlt: '▶', markClass: 'text-[var(--cdc-coral)]' },
  { text: 'public screens', mark: '●', markAlt: '◉', markClass: 'text-fuchsia-400' },
  { text: 'network maps', mark: '✦', markAlt: '✶', markClass: 'text-cyan-400' },
  { text: 'QR systems', mark: '⌖', markAlt: '⊕', markClass: 'text-amber-400' },
  { text: 'digital archives', mark: '⚡', markAlt: '⌁', markClass: 'text-teal-300' },
  { text: 'workshops', mark: '⧉', markAlt: '⊞', markClass: 'text-violet-400' },
  { text: 'clinics', mark: '◆', markAlt: '◇', markClass: 'text-[var(--cdc-magenta)]' },
  { text: 'newsletter', mark: '▸', markAlt: '⋗', markClass: 'text-rose-400' },
  { text: 'public interfaces', mark: '●', markAlt: '◐', markClass: 'text-emerald-400' },
  { text: 'Miami digital culture', mark: '✦', markAlt: '★', markClass: 'text-[var(--cdc-teal)]' },
] as const;

function TickerRow() {
  return (
    <div className="pointer-events-auto flex shrink-0 items-center gap-x-10 pr-[3.5rem] sm:gap-x-12 sm:pr-16">
      {SEGMENTS.map((s) => (
        <span
          key={s.text}
          className="group/seg relative inline-flex cursor-default items-center gap-x-4 sm:gap-x-5"
        >
          <span
            className={cn(
              'relative inline-flex h-[2.75rem] w-[2.75rem] shrink-0 items-center justify-center sm:h-[3.25rem] sm:w-[3.25rem]',
              'text-2xl font-black tabular-nums leading-none sm:text-3xl',
              'drop-shadow-[0_0_14px_rgba(45,212,191,0.35)]',
              'motion-safe:group-hover/seg:animate-dcc-ticker-mark-pulse'
            )}
            aria-hidden
          >
            <span
              className={cn(
                'absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out',
                s.markClass,
                'group-hover/seg:scale-[0.72] group-hover/seg:opacity-0 group-hover/seg:blur-[2px]'
              )}
            >
              {s.mark}
            </span>
            <span
              className={cn(
                'absolute inset-0 flex items-center justify-center opacity-0 scale-[0.55] blur-[1px] transition-all duration-200 ease-out',
                s.markClass,
                'group-hover/seg:scale-110 group-hover/seg:opacity-100 group-hover/seg:blur-0 group-hover/seg:rotate-[8deg]'
              )}
            >
              {s.markAlt}
            </span>
          </span>
          <span
            className={cn(
              'cdc-font-mono-accent inline-block whitespace-nowrap font-mono text-lg font-semibold uppercase tracking-[0.22em] text-neutral-200/95 sm:text-xl sm:tracking-[0.26em]',
              'transition-[color] duration-200',
              'group-hover/seg:text-teal-100',
              'motion-safe:group-hover/seg:animate-dcc-ticker-glitch'
            )}
          >
            {s.text}
          </span>
        </span>
      ))}
    </div>
  );
}

export function DigitalCultureFooterTicker() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        'relative w-screen border-t border-neutral-800 bg-neutral-950 py-[0.7rem] text-neutral-300 dark:border-neutral-800 sm:py-5',
        'left-1/2 -translate-x-1/2 shadow-[inset_0_1px_0_0_rgba(45,212,191,0.08)]'
      )}
      role="region"
      aria-label="Digital culture signal strip"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-20 bg-gradient-to-r from-neutral-950 to-transparent sm:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-20 bg-gradient-to-l from-neutral-950 to-transparent sm:w-32"
        aria-hidden
      />

      {reduceMotion ? (
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center font-mono text-sm font-medium uppercase leading-relaxed tracking-[0.18em] text-neutral-400 sm:text-base">
            Digital culture in public: code, screens, networks, archives, workshops, artist support, and
            updateable civic interfaces.
          </p>
        </div>
      ) : (
        <Marquee
          repeat={4}
          pauseOnHover
          className="bg-transparent p-0 [--duration:78s] [--gap:4.25rem] motion-reduce:[--gap:2.5rem]"
        >
          <TickerRow />
        </Marquee>
      )}
    </div>
  );
}
