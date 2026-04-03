/** Calendar date YYYY-MM-DD in an IANA timezone (for matching "today" to timestamptz sessions). */
export function calendarDateInTimeZone(isoOrDate: string | Date, timeZone: string): string {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function formatTimeInTimeZone(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}
