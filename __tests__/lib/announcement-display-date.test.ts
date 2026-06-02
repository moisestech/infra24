import {
  getTodayDisplayDateKey,
  isDisplayDateToday,
  parseDisplayDateLocalMs,
  SMART_SIGN_DISPLAY_TIMEZONE,
} from '@/lib/display/announcement-month';

describe('isDisplayDateToday', () => {
  const june2Miami = new Date('2026-06-02T15:00:00-04:00');

  it('does not mark June 3 as today when today is June 2 (Miami)', () => {
    expect(isDisplayDateToday('2026-06-03', june2Miami)).toBe(false);
    expect(isDisplayDateToday('2026-06-03T00:00:00+00:00', june2Miami)).toBe(false);
    expect(isDisplayDateToday('2026-06-03T22:00:00.000Z', june2Miami)).toBe(false);
  });

  it('marks June 3 as today on June 3 (Miami)', () => {
    const june3Miami = new Date('2026-06-03T12:00:00-04:00');
    expect(isDisplayDateToday('2026-06-03', june3Miami)).toBe(true);
    expect(getTodayDisplayDateKey(SMART_SIGN_DISPLAY_TIMEZONE, june3Miami)).toBe('2026-06-03');
  });

  it('parseDisplayDateLocalMs uses calendar day not UTC shift', () => {
    const ms = parseDisplayDateLocalMs('2026-06-03');
    expect(new Date(ms).getFullYear()).toBe(2026);
    expect(new Date(ms).getMonth()).toBe(5);
    expect(new Date(ms).getDate()).toBe(3);
  });
});
