import type { Announcement } from '@/types/announcement';
import {
  announcementEventDateRaw,
  announcementEventEndDateRaw,
} from '@/lib/display/announcement-month';
import {
  stackedDateFromAnnouncement,
  type StackedDateParts,
} from '@/lib/display/stacked-date-display';

export interface CardEventDateDisplay {
  primary: string;
  secondary?: string;
  isToday?: boolean;
  /** Hero day number (highlight date closest to today for ranges). */
  dayNumber: string;
  weekday?: string;
  monthLabel: string;
  isRange?: boolean;
  otherDateHint?: string;
  /** Full stacked overlay payload (number → month → weekday). */
  stacked?: StackedDateParts;
}

export interface CardEventDateOptions {
  /** Drop the calendar year from rendered range copy (smart-sign workshops/classes). */
  hideYear?: boolean;
}

function parseEventDate(raw: string): Date | null {
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(raw).trim());
  if (ymd) {
    const y = Number(ymd[1]);
    const m = Number(ymd[2]) - 1;
    const day = Number(ymd[3]);
    const local = new Date(y, m, day);
    return Number.isNaN(local.getTime()) ? null : local;
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isExhibitionAnnouncement(announcement: Announcement): boolean {
  if (String(announcement.sub_type || '').toLowerCase() === 'exhibition') return true;
  const tags = announcement.tags;
  if (!Array.isArray(tags)) return false;
  return tags.some((t) => String(t).toLowerCase().includes('exhibition'));
}

function formatMonthDay(d: Date): string {
  return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
}

function formatWeekday(d: Date): string {
  return d.toLocaleString('en-US', { weekday: 'long' });
}

function formatTime(d: Date): string | null {
  const h = d.getHours();
  const m = d.getMinutes();
  if (h === 0 && m === 0) return null;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function formatOnViewRange(start: Date, end: Date, hideYear = false): string {
  const startMonth = start.toLocaleString('en-US', { month: 'short' });
  const endMonth = end.toLocaleString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = start.getFullYear();
  const endYear = end.getFullYear();

  if (startMonth === endMonth && start.getFullYear() === endYear) {
    return hideYear
      ? `On view ${startMonth} ${startDay}–${endDay}`
      : `On view ${startMonth} ${startDay}–${endDay}, ${year}`;
  }

  if (start.getFullYear() === endYear) {
    return hideYear
      ? `On view ${startMonth} ${startDay} – ${endMonth} ${endDay}`
      : `On view ${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
  }

  return `On view ${startMonth} ${startDay}, ${start.getFullYear()} – ${endMonth} ${endDay}, ${endYear}`;
}

/** Card-layout date line(s) for smart-sign carousel. */
export function formatCardEventDateDisplay(
  announcement: Announcement,
  options: CardEventDateOptions = {}
): CardEventDateDisplay | null {
  const hideYear = options.hideYear === true;
  const stacked = stackedDateFromAnnouncement(announcement, { hideYear });
  const startRaw = announcementEventDateRaw(announcement);
  if (!startRaw || !stacked) return null;

  const start = parseEventDate(startRaw);
  if (!start) return null;
  const startAt = new Date(startRaw);

  const endRaw = announcementEventEndDateRaw(announcement);
  const end = endRaw ? parseEventDate(endRaw) : null;
  const exhibition = isExhibitionAnnouncement(announcement);

  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);

  const openingTime = Number.isNaN(startAt.getTime()) ? null : formatTime(startAt);
  const isRange = Boolean(end && !sameCalendarDay(startDay, end));

  if (exhibition && end && isRange) {
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);
    const primary = formatOnViewRange(startDay, endDay, hideYear);
    const secondary =
      openingTime && announcement.starts_at
        ? `Opening ${formatWeekday(startDay)}, ${formatMonthDay(startDay)} · ${openingTime}`
        : undefined;
    return {
      primary,
      secondary,
      isToday: stacked.isToday,
      dayNumber: stacked.dayNumber,
      monthLabel: stacked.monthLabel,
      weekday: stacked.weekday,
      otherDateHint: stacked.otherDateHint,
      isRange: true,
      stacked,
    };
  }

  const weekday = stacked.weekday;
  const primary = `${weekday} · ${formatMonthDay(startDay)}${
    openingTime && announcement.starts_at ? ` · ${openingTime}` : ''
  }`;

  return {
    primary,
    isToday: stacked.isToday,
    dayNumber: stacked.dayNumber,
    monthLabel: stacked.monthLabel,
    weekday,
    otherDateHint: stacked.otherDateHint,
    isRange: false,
    stacked,
  };
}
