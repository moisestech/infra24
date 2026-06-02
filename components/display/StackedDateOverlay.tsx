'use client';

import { cn } from '@/lib/utils';
import type { StackedDateParts } from '@/lib/display/stacked-date-display';

export type StackedDateOverlaySize = 'md' | 'lg';

interface StackedDateOverlayProps {
  parts?: StackedDateParts | null;
  /** Corner badge when no parseable date (online / coming soon workshops). */
  comingSoon?: boolean;
  size?: StackedDateOverlaySize;
  className?: string;
}

const sizeClasses: Record<
  StackedDateOverlaySize,
  { shell: string; number: string; month: string; weekday: string; hint: string; comingSoon: string }
> = {
  md: {
    shell: 'bottom-3 right-3 md:bottom-4 md:right-4 px-3 py-2 md:px-4 md:py-2.5',
    number: 'text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl',
    month: 'text-base md:text-lg xl:text-xl font-bold',
    weekday: 'text-sm md:text-base xl:text-lg font-semibold uppercase tracking-wide',
    hint: 'text-xs md:text-sm font-medium opacity-90',
    comingSoon: 'text-lg md:text-xl xl:text-2xl',
  },
  lg: {
    shell: 'bottom-4 right-4 md:bottom-5 md:right-5 px-4 py-3 md:px-5 md:py-3.5',
    number: 'text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl',
    month: 'text-xl md:text-2xl xl:text-3xl font-bold',
    weekday: 'text-base md:text-lg xl:text-xl font-semibold uppercase tracking-wide',
    hint: 'text-sm md:text-base font-medium opacity-90',
    comingSoon: 'text-xl md:text-2xl xl:text-3xl',
  },
};

/** Bottom-right stacked date: number → month → weekday (+ optional opens/closes hint). */
export function StackedDateOverlay({
  parts,
  comingSoon = false,
  size = 'md',
  className,
}: StackedDateOverlayProps) {
  const s = sizeClasses[size];

  if (comingSoon) {
    return (
      <div
        className={cn(
          'absolute z-10 rounded-xl bg-black/80 text-right shadow-lg backdrop-blur-sm',
          s.shell,
          className
        )}
      >
        <p
          className={cn(
            'font-bold uppercase tracking-wide leading-tight text-white',
            s.comingSoon
          )}
        >
          Coming Soon
        </p>
      </div>
    );
  }

  if (!parts) return null;

  return (
    <div
      className={cn(
        'absolute z-10 max-w-[min(88%,14rem)] rounded-xl bg-black/80 text-right shadow-lg backdrop-blur-sm',
        s.shell,
        className
      )}
    >
      <div className="flex flex-col items-end leading-none">
        <span className={cn('font-black tabular-nums tracking-tighter text-white', s.number)}>
          {parts.dayNumber}
        </span>
        <span className={cn('mt-0.5 text-white', s.month)}>{parts.monthLabel}</span>
        <span className={cn('mt-0.5 text-white/85', s.weekday)}>{parts.weekday}</span>
        {parts.otherDateHint ? (
          <span className={cn('mt-2 text-white/75', s.hint)}>{parts.otherDateHint}</span>
        ) : null}
      </div>
    </div>
  );
}
