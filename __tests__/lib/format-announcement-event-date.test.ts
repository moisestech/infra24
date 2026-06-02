import type { Announcement } from '@/types/announcement';
import { formatCardEventDateDisplay } from '@/lib/display/format-announcement-event-date';

describe('formatCardEventDateDisplay', () => {
  const base = {
    id: '1',
    org_id: 'org',
    author_clerk_id: 'x',
    title: 'Test',
    media: [] as any[],
    tags: [],
    status: 'published' as const,
    priority: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };

  it('formats exhibition on-view ranges', () => {
    const ann: Announcement = {
      ...base,
      sub_type: 'exhibition',
      starts_at: '2026-02-11T00:00:00Z',
      ends_at: '2026-05-03T00:00:00Z',
    };
    expect(formatCardEventDateDisplay(ann)?.primary).toBe('On view Feb 11 – May 3, 2026');
  });

  it('formats same-month exhibition ranges compactly', () => {
    const ann: Announcement = {
      ...base,
      sub_type: 'exhibition',
      starts_at: '2026-01-10T00:00:00Z',
      ends_at: '2026-01-31T00:00:00Z',
    };
    expect(formatCardEventDateDisplay(ann)?.primary).toBe('On view Jan 10–31, 2026');
  });

  it('includes opening time as secondary line when timed', () => {
    const ann: Announcement = {
      ...base,
      sub_type: 'exhibition',
      starts_at: '2026-02-25T18:00:00-05:00',
      ends_at: '2026-05-24T23:59:59-04:00',
    };
    const result = formatCardEventDateDisplay(ann);
    expect(result?.primary).toBe('On view Feb 25 – May 24, 2026');
    expect(result?.secondary).toContain('Opening');
    expect(result?.secondary).toContain('6:00 PM');
  });

  it('formats single-day events with weekday', () => {
    const ann: Announcement = {
      ...base,
      starts_at: '2026-03-12T12:00:00Z',
    };
    expect(formatCardEventDateDisplay(ann)?.primary).toContain('Mar 12');
  });

  it('strips the year from range copy when hideYear is set', () => {
    const ann: Announcement = {
      ...base,
      sub_type: 'exhibition',
      starts_at: '2026-02-11T00:00:00Z',
      ends_at: '2026-05-03T00:00:00Z',
    };
    expect(formatCardEventDateDisplay(ann, { hideYear: true })?.primary).toBe(
      'On view Feb 11 – May 3'
    );
    // default keeps the year
    expect(formatCardEventDateDisplay(ann)?.primary).toBe('On view Feb 11 – May 3, 2026');
  });

  it('exposes hero day number, weekday, and month for single-day events', () => {
    const ann: Announcement = {
      ...base,
      starts_at: '2026-03-12T12:00:00Z',
    };
    const result = formatCardEventDateDisplay(ann);
    expect(result?.dayNumber).toBe('12');
    expect(result?.monthLabel).toBe('Mar');
    expect(result?.weekday).toBeTruthy();
    expect(result?.isRange).toBe(false);
  });

  it('exposes highlight day number for ranges (closest to today)', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 1, 20));

    const ann: Announcement = {
      ...base,
      sub_type: 'exhibition',
      starts_at: '2026-02-11T00:00:00Z',
      ends_at: '2026-05-03T00:00:00Z',
    };
    const result = formatCardEventDateDisplay(ann);
    expect(result?.dayNumber).toBe('11');
    expect(result?.monthLabel).toBe('Feb');
    expect(result?.isRange).toBe(true);
    expect(result?.otherDateHint).toMatch(/Closes May 3/);

    jest.useRealTimers();
  });
});
