import {
  DEFAULT_DCC_PEOPLE_FIELD_MAP,
  NETWORK_PEOPLE_FIELD_SPECS,
} from '@/lib/network-builder/field-map'
import type { NetworkPeopleFieldMap } from '@/lib/network-builder/field-map'

export type SchemaGapEntry = {
  key: string
  label: string
  airtableColumn: string
  status: 'existing' | 'future'
  present: boolean
  scoringImpact?: string
}

export type SchemaGapReport = {
  orgSlug: string
  observedFieldCount: number
  mappedPresent: number
  mappedMissing: number
  futureMissing: number
  entries: SchemaGapEntry[]
}

export function buildSchemaGapReport(
  orgSlug: string,
  observedFieldNames: string[],
  fieldMap: NetworkPeopleFieldMap = DEFAULT_DCC_PEOPLE_FIELD_MAP
): SchemaGapReport {
  const observed = new Set(observedFieldNames)

  const entries: SchemaGapEntry[] = NETWORK_PEOPLE_FIELD_SPECS.map((spec) => {
    const airtableColumn = fieldMap[spec.key]
    const present = observed.has(airtableColumn)
    return {
      key: spec.key,
      label: spec.label,
      airtableColumn,
      status: spec.status,
      present,
      scoringImpact: spec.scoringImpact,
    }
  })

  const mapped = entries.filter((e) => e.status === 'existing')
  const future = entries.filter((e) => e.status === 'future')

  return {
    orgSlug,
    observedFieldCount: observedFieldNames.length,
    mappedPresent: mapped.filter((e) => e.present).length,
    mappedMissing: mapped.filter((e) => !e.present).length,
    futureMissing: future.filter((e) => !e.present).length,
    entries,
  }
}

export function formatSchemaGapReportMarkdown(report: SchemaGapReport): string {
  const lines: string[] = [
    `# DCC Network Builder — Schema Gap Report`,
    ``,
    `**Org:** ${report.orgSlug}`,
    `**Observed Airtable columns:** ${report.observedFieldCount}`,
    `**Existing fields mapped & present:** ${report.mappedPresent}`,
    `**Existing fields mapped & missing:** ${report.mappedMissing}`,
    `**Future fields not yet in base:** ${report.futureMissing}`,
    ``,
    `## Existing INFRA24 fields`,
    ``,
    `| Field | Airtable column | Present | Scoring impact |`,
    `|-------|-----------------|---------|----------------|`,
  ]

  for (const e of report.entries.filter((x) => x.status === 'existing')) {
    lines.push(
      `| ${e.label} | ${e.airtableColumn} | ${e.present ? 'Yes' : '**No**'} | ${e.scoringImpact ?? '—'} |`
    )
  }

  lines.push(``, `## Future DCC fields (add when ready)`, ``)
  lines.push(`| Field | Airtable column | Present | Scoring impact |`, `|-------|-----------------|---------|----------------|`)

  for (const e of report.entries.filter((x) => x.status === 'future')) {
    lines.push(
      `| ${e.label} | ${e.airtableColumn} | ${e.present ? 'Yes' : 'No'} | ${e.scoringImpact ?? '—'} |`
    )
  }

  return lines.join('\n')
}
