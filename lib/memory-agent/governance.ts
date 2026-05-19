import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import type { AlumniFieldMap } from '@/lib/airtable/org-alumni-config'
import type { MemoryAgentMode } from '@/types/memory-agent'

/** Rows explicitly marked do-not-use are excluded in every mode. */
export function filterRowsForMemoryAgent(
  rows: AlumniAirtableRow[],
  mode: MemoryAgentMode,
  fieldMap: AlumniFieldMap
): AlumniAirtableRow[] {
  return rows.filter((row) => {
    if (row.doNotUseInAi === true) return false

    if (mode === 'staff_operator') return true

    const approvedCol = fieldMap.approvedForPublicAi.trim().length > 0
    if (approvedCol) {
      return row.approvedForPublicAi === true
    }

    const visCol = fieldMap.visibilityLevel.trim().length > 0
    if (visCol) {
      const v = (row.visibilityLevel || '').toLowerCase()
      if (v.includes('restrict')) return false
      if (v.includes('internal') && !v.includes('public')) return false
      return true
    }

    return true
  })
}

/**
 * Build plain-text context for the LLM from a row. Omits email, phone, and free-form Notes
 * (Phase 1 safeguard). Use publicBio / artifacts / structured fields only.
 */
export function rowToMemoryContextText(row: AlumniAirtableRow): string {
  const parts: string[] = []
  const name = row.artistName?.trim() || row.name
  parts.push(`Name: ${name}`)
  if (row.medium?.trim()) parts.push(`Discipline: ${row.medium}`)
  if (row.program?.trim()) parts.push(`Program: ${row.program}`)
  if (row.cohort?.trim()) parts.push(`Cohort: ${row.cohort}`)
  const residency = row.residencyYear?.trim() || row.year?.trim()
  if (residency) parts.push(`Residency year: ${residency}`)
  if (row.pronoun?.trim()) parts.push(`Pronoun: ${row.pronoun}`)
  if (row.ethnicity?.trim()) parts.push(`Ethnicity: ${row.ethnicity}`)
  if (row.nationality?.trim()) parts.push(`Nationality: ${row.nationality}`)
  if (row.location?.trim()) parts.push(`Location: ${row.location}`)
  const tags = [...row.topics, ...row.themes]
  if (tags.length) parts.push(`Themes/tags: ${tags.join(', ')}`)
  if (row.publicBio?.trim()) parts.push(`Public bio: ${row.publicBio}`)
  else if (row.artifacts?.trim()) parts.push(`Work summary: ${row.artifacts}`)
  // Phase 1 safeguard: never put free-form Notes into LLM context (PII / HR / informal comments).
  // Revisit only with an explicit allowlist field if staff-approved excerpts are needed.
  if (row.website?.trim()) parts.push(`Website: ${row.website}`)
  if (row.instagram?.trim()) parts.push(`Instagram: ${row.instagram}`)
  parts.push(`Record id: ${row.id}`)
  return parts.join('\n')
}

/** Remove contact and internal notes from payloads shown in public mode. */
export function redactRowForPublicDisplay(row: AlumniAirtableRow): AlumniAirtableRow {
  return {
    ...row,
    email: undefined,
    phone: undefined,
    notes: undefined,
  }
}
