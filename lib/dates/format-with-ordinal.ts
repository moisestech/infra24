function dayOrdinalSuffix(day: number): string {
  const j = day % 10
  const k = day % 100
  if (j === 1 && k !== 11) return 'st'
  if (j === 2 && k !== 12) return 'nd'
  if (j === 3 && k !== 13) return 'rd'
  return 'th'
}

/** e.g. `April 19th, 2026` in `en-US` */
export function formatMonthDayYearWithOrdinal(isoOrDate: string | Date): string | null {
  let d: Date
  if (typeof isoOrDate === 'string') {
    const t = isoOrDate.trim()
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(t)
    d = new Date(dateOnly ? `${t}T12:00:00.000Z` : t)
  } else {
    d = isoOrDate
  }
  if (Number.isNaN(d.getTime())) return null
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d)
  const year = d.getFullYear()
  const day = d.getDate()
  return `${month} ${day}${dayOrdinalSuffix(day)}, ${year}`
}
