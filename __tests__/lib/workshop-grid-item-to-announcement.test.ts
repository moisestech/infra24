import type { WorkshopGridItem } from '@/components/display/DisplayGrid';
import { workshopGridItemToAnnouncement } from '@/lib/display/workshop-grid-item-to-announcement';

describe('workshopGridItemToAnnouncement', () => {
  it('maps a dated workshop into a card-layout announcement', () => {
    const item: WorkshopGridItem = {
      id: 'ann:123',
      title: 'Intro to Cyanotype',
      image_url: 'https://example.com/img.jpg',
      schedule_detail: 'Saturday\nMay 30\n10 a.m. - 1 p.m.',
      schedule_date_label: 'May 30',
      event_sort_ms: new Date(2026, 4, 30).getTime(),
      event_end_ms: new Date(2026, 4, 30).getTime(),
    };

    const ann = workshopGridItemToAnnouncement(item);
    expect(ann.title).toBe('Intro to Cyanotype');
    expect(ann.image_layout).toBe('card');
    expect(ann.sub_type).toBe('workshop');
    expect(ann.status).toBe('published');
    expect(ann.tags).toContain('workshop');
    expect(ann.start_date).toBe('2026-05-30');
    expect(ann.end_date).toBe('2026-05-30');
    expect(ann.body).toContain('May 30');
  });

  it('omits dates for undated (coming soon) workshops', () => {
    const item: WorkshopGridItem = {
      id: 'ann:456',
      title: 'Online Class TBD',
      event_sort_ms: null,
      event_end_ms: null,
      is_online_class: true,
    };

    const ann = workshopGridItemToAnnouncement(item);
    expect(ann.start_date).toBeUndefined();
    expect(ann.end_date).toBeUndefined();
    expect(ann.image_layout).toBe('card');
  });
});
