import type { Announcement } from '@/types/announcement';
import {
  formatTakeoverOverlaySchedule,
  takeoverOverlayLayout,
} from '@/lib/display/takeover-overlay-layout';

describe('takeover-overlay-layout', () => {
  it('exposes bottom-anchored layout tokens', () => {
    expect(takeoverOverlayLayout.root).toContain('flex-col');
    expect(takeoverOverlayLayout.qrZone).toContain('border-t');
    expect(takeoverOverlayLayout.textStack).toContain('gap-');
  });

  it('formats compact date and time range for overlay copy', () => {
    const announcement = {
      starts_at: '2026-06-25T23:00:00.000Z',
      ends_at: '2026-06-26T01:00:00.000Z',
    } as Announcement;

    const { dateLine, timeLine } = formatTakeoverOverlaySchedule(announcement);

    expect(dateLine).toMatch(/Thursday, June 25, 2026/);
    expect(timeLine).toMatch(/7.*9 p\.m\./);
  });

  it('returns null schedule when no event date', () => {
    expect(formatTakeoverOverlaySchedule({} as Announcement)).toEqual({
      dateLine: null,
      timeLine: null,
    });
  });
});
