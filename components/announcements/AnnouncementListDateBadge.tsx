'use client';

import { dateToStackedParts } from '@/lib/display/stacked-date-display';
import { cn } from '@/lib/utils';

function parseListDate(raw: string): Date | null {
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(raw).trim());
  if (ymd) {
    const d = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Shared list-row tile height (date badge + thumbnail). */
export const ANNOUNCEMENT_LIST_ROW_TILE_HEIGHT_CLASS = 'h-[5.5rem]';
export const ANNOUNCEMENT_LIST_DATE_TILE_WIDTH_CLASS = 'w-[4.25rem]';
export const ANNOUNCEMENT_LIST_THUMB_SIZE_CLASS = 'h-[5.5rem] w-[5.5rem]';

export type AnnouncementListDateBadgeProps = {
  dateString: string;
  muted?: boolean;
  className?: string;
};

/**
 * Compact list-row date: weekday → day number (largest) → month,
 * centered in a white tile (no year, no "Date" label).
 */
export function AnnouncementListDateBadge({
  dateString,
  muted = false,
  className,
}: AnnouncementListDateBadgeProps) {
  const parsed = parseListDate(dateString);
  if (!parsed) {
    return (
      <div
        className={cn(
          'flex shrink-0 flex-col items-center justify-center rounded-lg bg-white px-2 py-2 text-center shadow-sm ring-1 ring-gray-200/90 dark:bg-gray-950 dark:ring-gray-600',
          ANNOUNCEMENT_LIST_ROW_TILE_HEIGHT_CLASS,
          ANNOUNCEMENT_LIST_DATE_TILE_WIDTH_CLASS,
          muted && 'opacity-65',
          className
        )}
      >
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">—</span>
      </div>
    );
  }

  const { dayNumber, monthLabel, weekday } = dateToStackedParts(parsed);
  const weekdayShort = weekday.slice(0, 3);

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col items-center justify-center rounded-lg bg-white px-1.5 py-2 text-center shadow-sm ring-1 ring-gray-200/90 dark:bg-gray-950 dark:ring-gray-600',
        ANNOUNCEMENT_LIST_ROW_TILE_HEIGHT_CLASS,
        ANNOUNCEMENT_LIST_DATE_TILE_WIDTH_CLASS,
        muted && 'opacity-65 grayscale-[20%]',
        className
      )}
    >
      <span className="text-xs font-semibold uppercase leading-none tracking-wide text-gray-500 dark:text-gray-400">
        {weekdayShort}
      </span>
      <span className="mt-1 text-[2rem] font-black tabular-nums leading-none tracking-tight text-gray-900 dark:text-white">
        {dayNumber}
      </span>
      <span className="mt-1 text-sm font-bold uppercase leading-none text-gray-600 dark:text-gray-300">
        {monthLabel}
      </span>
    </div>
  );
}
