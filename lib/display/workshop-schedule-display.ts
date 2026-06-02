const MONTH =
  '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';

/** Line contains a workshop/event calendar date (month + year). */
export const WORKSHOP_SCHEDULE_DATE_LINE = new RegExp(
  `^(?:[A-Za-z]+,\\s+)?${MONTH}\\.?\\s+\\d{1,2}(?:\\s*[-–—]\\s*(?:${MONTH}\\.?\\s+)?\\d{1,2})?,?\\s+\\d{4}(?:\\s*\\([^)]*\\))?\\s*$`,
  'i'
);

const SCHEDULE_BLOCK_HINT =
  /\b(?:one|two|three|four|five|six|seven|eight)[- ]week course\b|\bone-day workshop\b|\bwalking tour\b/i;

function parseYmd(raw: string): Date | null {
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(raw).trim());
  if (!ymd) return null;
  const d = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatMonthDay(d: Date, month: 'short' | 'long' = 'short'): string {
  return `${d.toLocaleString('en-US', { month })} ${d.getDate()}`;
}

function formatRangeLabel(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    const month = start.toLocaleString('en-US', { month: 'long' });
    return `${month} ${start.getDate()} - ${end.getDate()}`;
  }

  if (sameYear) {
    return `${formatMonthDay(start)} - ${formatMonthDay(end, 'long')}`;
  }

  return `${formatMonthDay(start, 'long')} ${start.getDate()} - ${formatMonthDay(end, 'long')} ${end.getDate()}`;
}

/** Remove trailing calendar year from a workshop date line. */
export function stripYearFromWorkshopDateLabel(label: string): string {
  return String(label || '')
    .replace(/,?\s+\d{4}(\s*(\([^)]*\)))?\s*$/, (_match, parens?: string) =>
      parens ? ` ${parens.trim()}` : ''
    )
    .trim();
}

/** Strip year from date lines inside a workshop schedule block. */
export function stripYearFromWorkshopScheduleText(schedule: string): string {
  return String(schedule || '')
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (WORKSHOP_SCHEDULE_DATE_LINE.test(trimmed)) {
        return stripYearFromWorkshopDateLabel(trimmed);
      }
      return line;
    })
    .join('\n');
}

/** Pull the schedule block from the tail of an announcement body. */
export function extractWorkshopScheduleBlockFromBody(body: string): string | null {
  const trimmed = String(body || '').trim();
  if (!trimmed) return null;

  const blocks = trimmed.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i];
    if (SCHEDULE_BLOCK_HINT.test(block)) return block;
    if (block.split('\n').some((line) => WORKSHOP_SCHEDULE_DATE_LINE.test(line.trim()))) {
      return block;
    }
  }
  return null;
}

/** Primary date line inside a workshop schedule block. */
export function extractWorkshopScheduleDateLine(schedule: string): string | null {
  const lines = String(schedule || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (WORKSHOP_SCHEDULE_DATE_LINE.test(line)) return line;
  }
  return null;
}

export function formatWorkshopDateFromIsoRange(
  startRaw?: string | null,
  endRaw?: string | null
): string | null {
  const start = startRaw ? parseYmd(startRaw) || new Date(startRaw) : null;
  if (!start || Number.isNaN(start.getTime())) return null;

  const end = endRaw ? parseYmd(endRaw) || new Date(endRaw) : null;
  if (end && !Number.isNaN(end.getTime()) && end.toDateString() !== start.toDateString()) {
    return formatRangeLabel(start, end);
  }

  const weekday = start.toLocaleString('en-US', { weekday: 'long' });
  return `${weekday}, ${formatMonthDay(start, 'long')}`;
}

export interface WorkshopScheduleDisplay {
  scheduleText: string | null;
  dateLabel: string | null;
}

/** Resolve schedule copy + overlay date for workshop grid cards. */
export function resolveWorkshopScheduleDisplay(input: {
  additionalInfo?: string | null;
  body?: string | null;
  metadataSchedule?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}): WorkshopScheduleDisplay {
  const fromInfo = String(input.additionalInfo || '').trim();
  const fromMeta = String(input.metadataSchedule || '').trim();
  const fromBody = fromInfo ? '' : extractWorkshopScheduleBlockFromBody(String(input.body || '')) || '';
  const scheduleText = fromInfo || fromMeta || fromBody || null;

  const dateFromSchedule = scheduleText ? extractWorkshopScheduleDateLine(scheduleText) : null;
  if (dateFromSchedule) {
    return {
      scheduleText: stripYearFromWorkshopScheduleText(scheduleText!),
      dateLabel: stripYearFromWorkshopDateLabel(dateFromSchedule),
    };
  }

  const fallback = formatWorkshopDateFromIsoRange(
    input.startsAt || input.startDate,
    input.endsAt || input.endDate
  );

  return {
    scheduleText: scheduleText ? stripYearFromWorkshopScheduleText(scheduleText) : null,
    dateLabel: fallback ? stripYearFromWorkshopDateLabel(fallback) : null,
  };
}
