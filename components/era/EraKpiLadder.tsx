'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import {
  formatEraMetricCount,
  getEraLadderProgress,
  type EraMetricLadder,
} from '@/lib/era/metrics';
import { eraEasing } from '@/lib/era/tokens';

type EraKpiLadderProps = {
  ladder: EraMetricLadder;
  /** Hex / CSS color for the active fill. Defaults to neutral ink. */
  accentColor?: string;
  /** `compact` is for inflection cards; `full` is for `/era/[channel]` pages. */
  density?: 'compact' | 'full';
  className?: string;
};

/**
 * Renders the 3-tier ladder for a channel: a track with three pegs, a fill bar
 * showing progress to the next unmet tier, and the current value beside it.
 * Single source of truth for "how close to 100/1k/etc." across the Era surfaces.
 */
export function EraKpiLadder({
  ladder,
  accentColor = 'currentColor',
  density = 'compact',
  className,
}: EraKpiLadderProps) {
  const reduceMotion = useReducedMotion();
  const labelId = useId();
  const { tierIndex, progress, nextTier } = getEraLadderProgress(ladder);
  const tiers = ladder.tiers;
  const maxTarget = tiers[tiers.length - 1].target;
  const currentRatio = Math.min(1, ladder.current / maxTarget);

  const compact = density === 'compact';

  return (
    <div
      className={cn('w-full text-current', className)}
      role="group"
      aria-labelledby={labelId}
    >
      <div
        id={labelId}
        className={cn(
          'flex items-baseline justify-between gap-3 font-mono uppercase tracking-[0.18em]',
          compact ? 'text-[10px]' : 'text-[11px]'
        )}
      >
        <span className="opacity-70">{ladder.metric}</span>
        <span className="tabular-nums opacity-90">
          {formatEraMetricCount(ladder.current, ladder.unit)}
        </span>
      </div>

      <div
        className={cn(
          'relative mt-2 w-full rounded-full',
          compact ? 'h-1.5' : 'h-2'
        )}
        style={{ backgroundColor: 'var(--era-ladder-track, rgba(15,23,42,0.08))' }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${currentRatio * 100}%` }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }
          }
        />
        {tiers.map((tier) => {
          const left = Math.min(100, (tier.target / maxTarget) * 100);
          const reached = ladder.current >= tier.target;
          return (
            <span
              key={tier.tier}
              aria-hidden
              className={cn(
                'absolute -top-1 h-3 w-px',
                reached ? 'opacity-100' : 'opacity-50'
              )}
              style={{
                left: `${left}%`,
                backgroundColor: reached ? accentColor : 'currentColor',
              }}
            />
          );
        })}
      </div>

      <div
        className={cn(
          'mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono uppercase tracking-[0.16em]',
          compact ? 'text-[9px]' : 'text-[10px]'
        )}
      >
        <span className="opacity-60">
          Next: {nextTier.label} · {formatEraMetricCount(nextTier.target, ladder.unit)}
        </span>
        <span className="tabular-nums opacity-60">
          {Math.round(progress * 100)}% to T{tierIndex + 1}
        </span>
      </div>

      {!compact && ladder.support?.length ? (
        <ul className="mt-3 space-y-1 font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
          {ladder.support.map((s) => (
            <li key={s.label} className="flex items-baseline justify-between gap-3">
              <span>{s.label}</span>
              <span className="tabular-nums">{s.value}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="sr-only">
        {`${ladder.metric}: ${ladder.current} ${ladder.unit}. Next tier ${nextTier.label} at ${nextTier.target}, ${Math.round(progress * 100)} percent of the way.`}
      </p>
    </div>
  );
}
