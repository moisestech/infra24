import { cn } from '@/lib/utils';
import type { Announcement } from '@/types/announcement';
import {
  announcementEventDateRaw,
  announcementEventEndDateRaw,
} from '@/lib/display/announcement-month';

/** Bottom-anchored smart-sign overlay layout (takeover_mode: overlay). */
export const takeoverOverlayLayout = {
  root: 'relative z-20 flex h-full min-h-0 w-full flex-col',
  topSpacer: 'min-h-[10vh] flex-1',
  panel: cn(
    'flex w-full shrink-0 flex-col',
    'px-6 pb-7 pt-2',
    'sm:px-10 sm:pb-10 sm:pt-4',
    'md:px-14 md:pb-12 md:pt-5',
    'xl:px-20 xl:pb-16 xl:pt-6',
    '2xl:px-24 2xl:pb-20',
    'max-w-[92vw] md:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl'
  ),
  textStack: cn(
    'flex flex-col',
    'gap-5 sm:gap-6 md:gap-7 xl:gap-8 2xl:gap-10'
  ),
  dateStack: cn('flex flex-col', 'gap-1 sm:gap-1.5 md:gap-2'),
  dateLine: cn(
    'font-semibold tracking-wide text-white/90',
    'text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl'
  ),
  timeLine: cn(
    'font-medium text-white/75',
    'text-lg sm:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl'
  ),
  typeBadge: cn(
    'inline-flex w-fit max-w-full items-center gap-2 rounded-full',
    'border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm',
    'md:gap-3 md:px-5 md:py-2.5 xl:px-6 xl:py-3'
  ),
  title: 'leading-[1.08] tracking-tight',
  body: 'max-w-[48ch] leading-relaxed text-white/88',
  locationRow: 'flex items-start gap-2 md:gap-3',
  qrZone: cn(
    'mt-9 sm:mt-10 md:mt-12 xl:mt-14 2xl:mt-16',
    'pt-7 sm:pt-8 md:pt-9 xl:pt-10 2xl:pt-12',
    'border-t border-white/20'
  ),
  qrRow: cn('flex flex-col items-start', 'gap-3 md:gap-4 xl:gap-5'),
  qrLabel: cn(
    'font-medium text-white/75',
    'text-base sm:text-lg md:text-xl xl:text-2xl'
  ),
  peopleSlot: cn(
    'mb-6 max-h-[22vh] overflow-y-auto pr-1',
    'md:mb-8 xl:mb-10'
  ),
} as const;

function formatCompactTime(date: Date): string {
  const raw = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: date.getMinutes() === 0 ? undefined : '2-digit',
    hour12: true,
  });
  return raw.replace(' AM', ' a.m.').replace(' PM', ' p.m.');
}

function formatTimeRange(start: Date, end: Date): string {
  const startMer = start.getHours() >= 12 ? 'p.m.' : 'a.m.';
  const endMer = end.getHours() >= 12 ? 'p.m.' : 'a.m.';
  const startHour = start
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: start.getMinutes() === 0 ? undefined : '2-digit',
      hour12: true,
    })
    .split(' ')[0];
  const endFormatted = formatCompactTime(end);

  if (startMer === endMer) {
    return `${startHour} – ${endFormatted}`;
  }
  return `${formatCompactTime(start)} – ${endFormatted}`;
}

/** Compact schedule lines for overlay takeover copy stack. */
export function formatTakeoverOverlaySchedule(announcement: Announcement): {
  dateLine: string | null;
  timeLine: string | null;
} {
  const eventDate = announcementEventDateRaw(announcement);
  if (!eventDate) return { dateLine: null, timeLine: null };

  const start = new Date(eventDate);
  if (Number.isNaN(start.getTime())) return { dateLine: null, timeLine: null };

  const dateLine = start.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const endRaw = announcementEventEndDateRaw(announcement);
  let timeLine: string | null = null;

  if (announcement.starts_at) {
    const startTime = formatCompactTime(start);
    if (endRaw && announcement.ends_at) {
      const end = new Date(endRaw);
      if (!Number.isNaN(end.getTime())) {
        timeLine =
          start.toDateString() === end.toDateString()
            ? formatTimeRange(start, end)
            : `${startTime} – ${formatCompactTime(end)}`;
      }
    } else if (startTime !== '12 a.m.') {
      timeLine = startTime;
    }
  }

  return { dateLine, timeLine };
}
