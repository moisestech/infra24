import type { Announcement } from '@/types/announcement';
import type { WorkshopGridItem } from '@/components/display/DisplayGrid';

/** Epoch ms -> local YYYY-MM-DD (parsed as a local calendar day downstream). */
function msToLocalIsoDate(ms?: number | null): string | undefined {
  if (ms == null || !Number.isFinite(ms)) return undefined;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return undefined;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Adapt a workshop grid item into a minimal Announcement so the featured
 * spotlight can render with the shared smart-sign card frame (image_layout: card).
 * Tagged `workshop` so the carousel card strips the calendar year from dates.
 */
export function workshopGridItemToAnnouncement(item: WorkshopGridItem): Announcement {
  const startDate = msToLocalIsoDate(item.event_sort_ms);
  const endDate = msToLocalIsoDate(item.event_end_ms);
  const body = (item.schedule_detail || item.description || '').trim() || undefined;
  const now = new Date().toISOString();

  return {
    id: `ws-featured:${item.id}`,
    org_id: '',
    author_clerk_id: '',
    title: item.title,
    body,
    media: [],
    tags: ['workshop'],
    status: 'published',
    priority: 0,
    created_at: now,
    updated_at: now,
    type: 'event',
    sub_type: 'workshop',
    image_url: item.image_url || undefined,
    image_layout: 'card',
    start_date: startDate,
    end_date: endDate,
  } as Announcement;
}
