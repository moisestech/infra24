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
      // Display-local times: independent of the CI runner's time zone.
      starts_at: '2026-06-25T19:00:00',
      ends_at: '2026-06-25T21:00:00',
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
