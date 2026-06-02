import {
  extractWorkshopScheduleBlockFromBody,
  extractWorkshopScheduleDateLine,
  formatWorkshopDateFromIsoRange,
  resolveWorkshopScheduleDisplay,
  stripYearFromWorkshopDateLabel,
  stripYearFromWorkshopScheduleText,
} from '@/lib/display/workshop-schedule-display';

describe('workshop-schedule-display', () => {
  it('extracts date line from multi-week schedule blocks', () => {
    const schedule = `Four-Week Course
Tuesdays
May 26 - June 23, 2026
No class on 6/9/26
6 p.m. - 9 p.m.`;

    expect(extractWorkshopScheduleDateLine(schedule)).toBe('May 26 - June 23, 2026');
  });

  it('extracts single-day and weekday-prefixed dates', () => {
    expect(extractWorkshopScheduleDateLine('Saturday\nMay 30, 2026\n10:30 a.m. - 3:30 p.m.')).toBe(
      'May 30, 2026'
    );
    expect(extractWorkshopScheduleDateLine('Wednesday, June 3, 2026\n6 – 9 p.m.')).toBe(
      'Wednesday, June 3, 2026'
    );
  });

  it('pulls schedule block from announcement body tail', () => {
    const body = `Instructor José Delgado Zúñiga

This four-week course introduces Impressionist painting.

Four-Week Course
Sundays
May 31 - June 28, 2026 ( No class on 6/7/26)
10:00 a.m. - 1:00 p.m.`;

    expect(extractWorkshopScheduleBlockFromBody(body)).toContain('May 31 - June 28, 2026');
  });

  it('extracts date lines with trailing no-class notes', () => {
    expect(
      extractWorkshopScheduleDateLine('May 31 - June 28, 2026 ( No class on 6/7/26)')
    ).toBe('May 31 - June 28, 2026 ( No class on 6/7/26)');
  });

  it('formats ISO fallback ranges without year', () => {
    expect(formatWorkshopDateFromIsoRange('2026-05-30', '2026-05-30')).toBe(
      'Saturday, May 30'
    );
    expect(formatWorkshopDateFromIsoRange('2026-05-26', '2026-06-23')).toBe(
      'May 26 - June 23'
    );
  });

  it('strips year from schedule text and overlay labels', () => {
    expect(stripYearFromWorkshopDateLabel('May 26 - June 23, 2026')).toBe('May 26 - June 23');
    expect(stripYearFromWorkshopDateLabel('May 31 - June 28, 2026 ( No class on 6/7/26)')).toBe(
      'May 31 - June 28 ( No class on 6/7/26)'
    );

    const schedule = `Four-Week Course
Tuesdays
May 26 - June 23, 2026
6 p.m. - 9 p.m.`;
    expect(stripYearFromWorkshopScheduleText(schedule)).toContain('May 26 - June 23');
    expect(stripYearFromWorkshopScheduleText(schedule)).not.toContain('2026');
  });

  it('resolves schedule text and matching overlay date without year', () => {
    const resolved = resolveWorkshopScheduleDisplay({
      body: `Intro copy

Four-Week Course
Tuesdays
June 9 - 30, 2026
10 a.m. - 1 p.m.`,
    });

    expect(resolved.scheduleText).toContain('June 9 - 30');
    expect(resolved.scheduleText).not.toContain('2026');
    expect(resolved.dateLabel).toBe('June 9 - 30');
  });
});
