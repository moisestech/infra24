import type { Announcement } from '@/types/announcement';

/**
 * Calendar month key (YYYY-MM) for smart-sign and list month chips.
 * Prefer a leading YYYY-MM from anchor strings so date-only values are not shifted by UTC parsing.
 * Anchor order matches `/o/.../announcements` (start-first).
 */
export function announcementDisplayMonthKey(a: Announcement): string | null {
  const raw =
    a.start_date ||
    a.starts_at ||
    a.end_date ||
    a.ends_at ||
    a.scheduled_at ||
    a.created_at;
  if (raw == null || String(raw).trim() === '') return null;
  const s = String(raw).trim();
  const ymd = /^(\d{4})-(\d{2})/.exec(s);
  if (ymd) return `${ymd[1]}-${ymd[2]}`;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

/** Best event datetime string for carousel / card UI (never falls back to created_at). */
export function announcementEventDateRaw(a: Announcement): string | null {
  const raw =
    a.start_date ||
    a.starts_at ||
    a.end_date ||
    a.ends_at ||
    a.scheduled_at;
  if (raw == null || String(raw).trim() === '') return null;
  return String(raw).trim();
}

export function announcementEventEndDateRaw(a: Announcement): string | null {
  const raw = a.end_date || a.ends_at;
  if (raw == null || String(raw).trim() === '') return null;
  return String(raw).trim();
}

const MONTH_KEY_RE = /^\d{4}-\d{2}$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDisplayCalendarMonthKey(key: string): boolean {
  return MONTH_KEY_RE.test(key.trim());
}

export function isValidDisplayOnOrAfterDate(key: string): boolean {
  return ISO_DATE_RE.test(key.trim());
}

/**
 * Calendar date key (YYYY-MM-DD) for smart-sign floors.
 * Anchor order matches `announcementDisplayMonthKey` (start-first).
 */
export function announcementDisplayAnchorDateKey(a: Announcement): string | null {
  const raw =
    a.start_date ||
    a.starts_at ||
    a.end_date ||
    a.ends_at ||
    a.scheduled_at ||
    a.created_at;
  if (raw == null || String(raw).trim() === '') return null;
  const s = String(raw).trim();
  const ymd = /^(\d{4}-\d{2}-\d{2})/.exec(s);
  if (ymd) return ymd[1];
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Smart-sign display timezone (Oolite / Miami). */
export const SMART_SIGN_DISPLAY_TIMEZONE = 'America/New_York';

/** Today as YYYY-MM-DD in the smart-sign timezone. */
export function getTodayDisplayDateKey(
  timeZone: string = SMART_SIGN_DISPLAY_TIMEZONE,
  now: Date = new Date()
): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(now);
}

function isoDateKeyFromRaw(raw: string | null | undefined): string | null {
  if (raw == null || String(raw).trim() === '') return null;
  const s = String(raw).trim();
  const ymd = /^(\d{4}-\d{2}-\d{2})/.exec(s);
  if (ymd) return ymd[1];
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', { timeZone: SMART_SIGN_DISPLAY_TIMEZONE }).format(d);
}

/** Event start date (YYYY-MM-DD); never falls back to created_at. */
export function announcementStartDateKey(a: Announcement): string | null {
  return isoDateKeyFromRaw(a.start_date || a.starts_at || a.scheduled_at);
}

/** Event end date (YYYY-MM-DD); never falls back to created_at. */
export function announcementEndDateKey(a: Announcement): string | null {
  return isoDateKeyFromRaw(a.end_date || a.ends_at);
}

/**
 * True when an announcement is still on view (end >= today) or upcoming (start >= today).
 * Rows with no event start/end are excluded (e.g. undated resident directory cards).
 */
export function isAnnouncementRelevantForDisplay(
  a: Announcement,
  todayKey: string = getTodayDisplayDateKey()
): boolean {
  if (!isValidDisplayOnOrAfterDate(todayKey.trim())) return false;
  const today = todayKey.trim();
  const start = announcementStartDateKey(a);
  const end = announcementEndDateKey(a);
  if (!start && !end) return false;
  if (end && end >= today) return true;
  if (start && start >= today) return true;
  return false;
}

/** Keep announcements that are on view or upcoming relative to `todayKey` (YYYY-MM-DD). */
export function filterAnnouncementsRelevantForDisplay(
  announcements: Announcement[],
  todayKey: string = getTodayDisplayDateKey()
): Announcement[] {
  const today = todayKey.trim();
  if (!isValidDisplayOnOrAfterDate(today)) return announcements;
  return announcements.filter((a) => isAnnouncementRelevantForDisplay(a, today));
}

/** Keep only announcements on or after `isoDate` (YYYY-MM-DD), by display anchor date. */
export function filterAnnouncementsOnOrAfterDate(
  announcements: Announcement[],
  isoDate: string
): Announcement[] {
  const floor = isoDate.trim();
  if (!isValidDisplayOnOrAfterDate(floor)) return announcements;
  return announcements.filter((a) => {
    const key = announcementDisplayAnchorDateKey(a);
    return key != null && key >= floor;
  });
}

/** Keep only announcements whose display month equals `monthKey` (e.g. `2026-04`). */
export function filterAnnouncementsByDisplayCalendarMonth(
  announcements: Announcement[],
  monthKey: string
): Announcement[] {
  const target = monthKey.trim();
  if (!isValidDisplayCalendarMonthKey(target)) return announcements;
  return announcements.filter((a) => announcementDisplayMonthKey(a) === target);
}
