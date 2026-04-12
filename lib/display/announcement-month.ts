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

const MONTH_KEY_RE = /^\d{4}-\d{2}$/;

export function isValidDisplayCalendarMonthKey(key: string): boolean {
  return MONTH_KEY_RE.test(key.trim());
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
