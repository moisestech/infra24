import { parseWorkshopScheduleBlocks } from '@/lib/display/workshop-schedule-blocks';

describe('parseWorkshopScheduleBlocks', () => {
  it('splits schedule into structured blocks in display order', () => {
    const schedule = `Four-Week Course
Tuesdays
May 26 - June 23, 2026
6 p.m. - 9 p.m.
(No class on 6/9/26)`;

    const blocks = parseWorkshopScheduleBlocks(schedule);
    expect(blocks.map((b) => b.type)).toEqual([
      'course_type',
      'weekday',
      'date',
      'time',
      'note',
    ]);
    expect(blocks.find((b) => b.type === 'date')?.text).toContain('May 26');
  });
});
