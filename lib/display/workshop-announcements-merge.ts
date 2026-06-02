import type { Announcement } from '@/types/announcement';
import type { WorkshopGridItem } from '@/components/display/DisplayGrid';
import { resolveWorkshopScheduleDisplay } from '@/lib/display/workshop-schedule-display';
import { parseWorkshopEventMs } from '@/lib/display/workshop-grid-segment';

function isFilmStyleRow(a: Announcement): boolean {
  const t = String(a.type || '').toLowerCase();
  if (t === 'cinematic') return true;
  if (t !== 'promotion') return false;
  const meta = (a as Announcement & { metadata?: { image_only?: boolean } }).metadata;
  if (meta?.image_only) return true;
  const tags = Array.isArray(a.tags) ? a.tags.map((x) => String(x).toLowerCase()) : [];
  return tags.some((x) => /film|poster|image-only/.test(x));
}

/** True for class/workshop-style rows merged into the smart-sign workshop grid (not film posters). */
export function isClassOrWorkshopAnnouncement(a: Announcement): boolean {
  if (isFilmStyleRow(a)) return false;
  const t = String(a.type || '').toLowerCase();
  const st = String(a.sub_type || '').toLowerCase();
  if (st === 'workshop') return true;
  const tags = Array.isArray(a.tags) ? a.tags.map((x) => String(x).toLowerCase()) : [];
  const tagHit =
    tags.includes('workshop') ||
    tags.includes('classes') ||
    tags.includes('class') ||
    tags.includes('education') ||
    tags.includes('digital-lab') ||
    tags.includes('digital_lab');
  if (tagHit) return true;
  if (t === 'event' && tags.includes('workshop')) return true;
  return false;
}

function categoryForAnnouncement(a: Announcement): string | null {
  const tags = Array.isArray(a.tags) ? a.tags.map((x) => String(x).toLowerCase()) : [];
  if (tags.includes('digital-lab') || tags.includes('digital_lab')) return 'Digital Lab';
  if (tags.some((x) => x.includes('class') || x === 'classes' || x === 'education')) return 'Class';
  return 'Workshop';
}

function announcementDateMs(a: Announcement): number {
  const raw = a.ends_at || a.starts_at || a.scheduled_at || a.created_at;
  if (!raw) return 0;
  const n = new Date(raw).getTime();
  return Number.isNaN(n) ? 0 : n;
}

/** True for digital-lab / online class rows (drives the "Coming Soon" badge when undated). */
export function isOnlineClassAnnouncement(a: Announcement): boolean {
  const tags = Array.isArray(a.tags) ? a.tags.map((x) => String(x).toLowerCase()) : [];
  return (
    tags.includes('digital-lab') ||
    tags.includes('digital_lab') ||
    tags.includes('online') ||
    tags.includes('class') ||
    tags.includes('classes')
  );
}

export function announcementsToWorkshopGridItems(announcements: Announcement[]): WorkshopGridItem[] {
  const rows = announcements.filter(isClassOrWorkshopAnnouncement);
  const sorted = [...rows].sort((a, b) => announcementDateMs(b) - announcementDateMs(a));
  return sorted.map((a) => {
    const body = String(a.body || '').trim();
    const resolved = resolveWorkshopScheduleDisplay({
      additionalInfo: a.additional_info,
      body,
      startsAt: a.starts_at,
      endsAt: a.ends_at,
      startDate: a.start_date,
      endDate: a.end_date,
    });
    const descCap = 520;
    const schedule = resolved.scheduleText;
    const eventSortMs = parseWorkshopEventMs(a.starts_at || a.start_date);
    const eventEndMs = parseWorkshopEventMs(a.ends_at || a.end_date);
    return {
      id: `ann:${a.id}`,
      title: a.title,
      description:
        schedule || !body
          ? null
          : body.slice(0, descCap) + (body.length > descCap ? '…' : ''),
      image_url: a.image_url || null,
      category: categoryForAnnouncement(a),
      schedule_detail: schedule,
      schedule_date_label: resolved.dateLabel,
      event_sort_ms: eventSortMs,
      event_end_ms: eventEndMs,
      is_online_class: eventSortMs == null && isOnlineClassAnnouncement(a),
    };
  });
}

/** Announcement-backed classes first (newest), then catalog workshops; dedupe by title. */
export function mergeWorkshopGridItems(
  announcements: Announcement[],
  tableWorkshops: WorkshopGridItem[]
): WorkshopGridItem[] {
  const fromAnn = announcementsToWorkshopGridItems(announcements);
  const seen = new Set<string>();
  const out: WorkshopGridItem[] = [];
  for (const item of [...fromAnn, ...tableWorkshops]) {
    const key = item.title.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
