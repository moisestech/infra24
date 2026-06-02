import {
  dateToStackedParts,
  pickHighlightDate,
  stackedDateFromAnnouncement,
} from '@/lib/display/stacked-date-display';
import type { Announcement } from '@/types/announcement';

describe('stacked-date-display', () => {
  it('stacks number, month, weekday from a date', () => {
    const d = new Date(2026, 4, 30);
    expect(dateToStackedParts(d)).toEqual({
      dayNumber: '30',
      monthLabel: 'May',
      weekday: 'Saturday',
    });
  });

  it('highlights the date closest to today in a range', () => {
    const today = new Date(2026, 5, 15);
    const start = new Date(2026, 4, 26);
    const end = new Date(2026, 5, 23);
    const { highlight, other } = pickHighlightDate(start, end, today);
    expect(highlight.getDate()).toBe(23);
    expect(other?.getDate()).toBe(26);
  });

  it('shows opens/closes hint for the non-highlight date', () => {
    const ann = {
      id: '1',
      org_id: 'o',
      author_clerk_id: 'x',
      title: 'Show',
      media: [],
      tags: ['exhibition'],
      status: 'published',
      priority: 1,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      sub_type: 'exhibition',
      starts_at: '2026-05-26',
      ends_at: '2026-06-23',
    } as Announcement;

    const today = new Date(2026, 5, 20);
    jest.useFakeTimers();
    jest.setSystemTime(today);

    const stacked = stackedDateFromAnnouncement(ann);
    expect(stacked?.dayNumber).toBe('23');
    expect(stacked?.otherDateHint).toMatch(/Opens May 26/);

    jest.useRealTimers();
  });
});
