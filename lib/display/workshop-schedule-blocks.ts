import {
  WORKSHOP_SCHEDULE_DATE_LINE,
} from '@/lib/display/workshop-schedule-display';

export type WorkshopScheduleBlockType =
  | 'course_type'
  | 'weekday'
  | 'date'
  | 'time'
  | 'note'
  | 'other';

export interface WorkshopScheduleBlock {
  type: WorkshopScheduleBlockType;
  text: string;
}

const WEEKDAY_LINE =
  /^(?:Mondays?|Tuesdays?|Wednesdays?|Thursdays?|Fridays?|Saturdays?|Sundays?)$/i;

const TIME_LINE =
  /\d{1,2}(?::\d{2})?\s*(?:a\.m\.|p\.m\.|am|pm)/i;

const COURSE_TYPE =
  /\b(?:one|two|three|four|five|six|seven|eight)[- ]week course\b|\bone-day workshop\b|\bwalking tour\b/i;

function classifyLine(line: string): WorkshopScheduleBlockType {
  const trimmed = line.trim();
  if (!trimmed) return 'other';
  if (WORKSHOP_SCHEDULE_DATE_LINE.test(trimmed)) return 'date';
  if (WEEKDAY_LINE.test(trimmed)) return 'weekday';
  if (TIME_LINE.test(trimmed)) return 'time';
  if (COURSE_TYPE.test(trimmed)) return 'course_type';
  if (/^\([^)]+\)$/.test(trimmed) || /\bno class\b/i.test(trimmed)) return 'note';
  return 'other';
}

/**
 * Split workshop schedule copy into structured blocks for stacked display in card bodies.
 * Each block renders on its own line group (date → weekday → time → notes).
 */
export function parseWorkshopScheduleBlocks(schedule: string): WorkshopScheduleBlock[] {
  const lines = String(schedule || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: WorkshopScheduleBlock[] = [];
  for (const line of lines) {
    const type = classifyLine(line);
    blocks.push({ type, text: line });
  }

  // Stable display order: course type → weekday → date → time → notes → other
  const order: Record<WorkshopScheduleBlockType, number> = {
    course_type: 0,
    weekday: 1,
    date: 2,
    time: 3,
    note: 4,
    other: 5,
  };

  return [...blocks].sort((a, b) => order[a.type] - order[b.type]);
}
