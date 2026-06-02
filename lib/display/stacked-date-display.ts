import type { Announcement } from '@/types/announcement';
import type { WorkshopGridItem } from '@/components/display/DisplayGrid';
import {
  announcementEventDateRaw,
  announcementEventEndDateRaw,
} from '@/lib/display/announcement-month';
import { isClassOrWorkshopAnnouncement } from '@/lib/display/workshop-announcements-merge';

export interface StackedDateParts {
  dayNumber: string;
  monthLabel: string;
  weekday: string;
  /** Smaller line under the stack, e.g. "Opens May 26" / "Closes June 23". */
  otherDateHint?: string;
  isToday?: boolean;
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

function calendarDayMs(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function isExhibitionAnnouncement(announcement: Announcement): boolean {
  if (String(announcement.sub_type || '').toLowerCase() === 'exhibition') return true;
  const tags = announcement.tags;
  if (!Array.isArray(tags)) return false;
  return tags.some((t) => String(t).toLowerCase().includes('exhibition'));
}

export function dateToStackedParts(d: Date): Pick<StackedDateParts, 'dayNumber' | 'monthLabel' | 'weekday'> {
  return {
    dayNumber: String(d.getDate()),
    monthLabel: d.toLocaleString('en-US', { month: 'short' }),
    weekday: d.toLocaleString('en-US', { weekday: 'long' }),
  };
}

/** Pick opening or closing — whichever calendar day is closer to today. */
export function pickHighlightDate(
  start: Date,
  end: Date | null,
  today = new Date()
): { highlight: Date; other: Date | null } {
  if (!end || sameCalendarDay(start, end)) {
    return { highlight: start, other: null };
  }
  const startDist = Math.abs(calendarDayMs(start) - calendarDayMs(today));
  const endDist = Math.abs(calendarDayMs(end) - calendarDayMs(today));
  if (startDist <= endDist) {
    return { highlight: start, other: end };
  }
  return { highlight: end, other: start };
}

function formatOtherDateHint(other: Date, highlight: Date, hideYear: boolean): string {
  const otherMs = calendarDayMs(other);
  const highlightMs = calendarDayMs(highlight);
  const openingMs = Math.min(otherMs, highlightMs);
  const isOpening = otherMs === openingMs;
  const month = other.toLocaleString('en-US', { month: 'short' });
  const day = other.getDate();
  const yearSuffix = hideYear ? '' : `, ${other.getFullYear()}`;
  return isOpening ? `Opens ${month} ${day}${yearSuffix}` : `Closes ${month} ${day}${yearSuffix}`;
}

function computeIsToday(
  startDay: Date,
  end: Date | null,
  exhibition: boolean,
  today: Date
): boolean {
  const startMs = calendarDayMs(startDay);
  const todayMs = calendarDayMs(today);
  if (startMs === todayMs) return true;
  if (exhibition && end && !sameCalendarDay(startDay, end)) {
    const endMs = calendarDayMs(end);
    return todayMs >= startMs && todayMs <= endMs;
  }
  return false;
}

export interface StackedDateOptions {
  hideYear?: boolean;
}

export function stackedDateFromAnnouncement(
  announcement: Announcement,
  options: StackedDateOptions = {}
): StackedDateParts | null {
  const hideYear = options.hideYear === true;
  const startRaw = announcementEventDateRaw(announcement);
  if (!startRaw) return null;

  const start = parseEventDate(startRaw);
  if (!start) return null;

  const endRaw = announcementEventEndDateRaw(announcement);
  const end = endRaw ? parseEventDate(endRaw) : null;
  const exhibition = isExhibitionAnnouncement(announcement);

  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);
  const endDay = end ? new Date(end) : null;
  if (endDay) endDay.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { highlight, other } = pickHighlightDate(startDay, endDay);
  const stack = dateToStackedParts(highlight);

  const otherDateHint =
    other && !sameCalendarDay(highlight, other)
      ? formatOtherDateHint(other, highlight, hideYear)
      : undefined;

  return {
    ...stack,
    otherDateHint,
    isToday: computeIsToday(startDay, endDay, exhibition, today),
  };
}

export function stackedDateFromWorkshopItem(item: WorkshopGridItem): StackedDateParts | null {
  const startMs = item.event_sort_ms;
  if (typeof startMs === 'number' && startMs > 0) {
    const start = new Date(startMs);
    start.setHours(0, 0, 0, 0);
    const endMs = item.event_end_ms;
    const end =
      typeof endMs === 'number' && endMs > 0 ? new Date(endMs) : null;
    if (end) end.setHours(0, 0, 0, 0);

    const { highlight, other } = pickHighlightDate(start, end);
    const stack = dateToStackedParts(highlight);
    const otherDateHint =
      other && !sameCalendarDay(highlight, other)
        ? formatOtherDateHint(other, highlight, true)
        : undefined;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = calendarDayMs(highlight) === calendarDayMs(today);

    return { ...stack, otherDateHint, isToday };
  }
  return null;
}

export function stackedDateOptionsForAnnouncement(announcement: Announcement): StackedDateOptions {
  return { hideYear: isClassOrWorkshopAnnouncement(announcement) };
}
