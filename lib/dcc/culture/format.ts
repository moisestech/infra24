export function formatCultureDateRange(
  startDate?: string,
  endDate?: string
): string | undefined {
  if (!startDate && !endDate) return undefined
  const start = startDate ? formatCultureDate(startDate) : undefined
  const end = endDate ? formatCultureDate(endDate) : undefined
  if (start && end && start !== end) return `${start} – ${end}`
  return start ?? end
}

export function formatCultureDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
