import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { alumniYearLabel, parseAlumniYearValue } from '@/lib/airtable/alumni-service'

const YEAR_IN_TEXT = /\b(19|20)\d{2}\b/g

/** Pull 4-digit years from free text (program names, cohort labels, etc.). */
export function extractYearTokensFromText(text?: string): string[] {
  if (!text?.trim()) return []
  const matches = text.match(YEAR_IN_TEXT)
  return matches ? [...new Set(matches)] : []
}

/** All residency-related year tokens we can infer for one alumni row. */
export function rowResidencyYearTokens(row: AlumniAirtableRow): string[] {
  const tokens = new Set<string>()
  const fields = [
    row.residencyYear,
    row.year,
    row.cohort,
    row.program,
    row.notes,
    row.artifacts,
  ]
  for (const field of fields) {
    if (!field?.trim()) continue
    const trimmed = field.trim()
    const label = alumniYearLabel(trimmed)
    if (label) tokens.add(label)
    if (/^\d{4}$/.test(trimmed)) tokens.add(trimmed)
    for (const y of extractYearTokensFromText(trimmed)) tokens.add(y)
  }
  return [...tokens]
}

export function collectResidencyYearOptions(rows: AlumniAirtableRow[]): string[] {
  const years = new Set<string>()
  for (const row of rows) {
    for (const token of rowResidencyYearTokens(row)) {
      years.add(token)
    }
  }
  return [...years].sort((a, b) => {
    const na = parseAlumniYearValue(a) ?? 0
    const nb = parseAlumniYearValue(b) ?? 0
    return nb - na
  })
}
