import { fetchAllRecords } from '@/lib/airtable/client'
import type { OoliteCrmPeopleConnection } from '@/lib/airtable/oolite-crm-people-config'
import type { KnowledgeRecord } from '@/lib/memory-agent/knowledge-record'

function cellStr(fields: Record<string, unknown>, key: string): string | undefined {
  const raw = fields[key]
  if (raw == null) return undefined
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length ? t : undefined
  }
  return undefined
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size))
  }
  return out
}

function resolveNames(ids: string[] | undefined, map: Map<string, string>): string[] | undefined {
  if (!ids?.length) return undefined
  const names = ids.map((id) => map.get(id)).filter((n): n is string => Boolean(n))
  return names.length ? names : undefined
}

export async function fetchCrmPeopleNameMap(
  conn: OoliteCrmPeopleConnection,
  recordIds: string[]
): Promise<Map<string, string>> {
  const ids = [...new Set(recordIds.filter(Boolean))]
  const map = new Map<string, string>()
  if (!ids.length) return map

  for (const batch of chunk(ids, 10)) {
    const formula = `OR(${batch.map((id) => `RECORD_ID()='${id}'`).join(',')})`
    const rows = await fetchAllRecords(conn.baseId, conn.tableId, conn.apiKey, {
      filterFormula: formula,
      viewId: conn.viewId,
    })
    for (const row of rows) {
      const name = cellStr(row.fields, conn.fieldMap.name)
      if (name) map.set(row.id, name)
    }
  }

  return map
}

export function enrichProgrammingRecordsWithPeopleNames(
  records: KnowledgeRecord[],
  nameMap: Map<string, string>
): KnowledgeRecord[] {
  return records.map((record) => {
    const artistIds = record.artistRecordIds ?? record.relatedPeopleIds
    const artistNames = resolveNames(artistIds, nameMap)
    const curatorNames = resolveNames(record.curatorRecordIds, nameMap)
    const programStaffNames = resolveNames(record.programStaffRecordIds, nameMap)

    return {
      ...record,
      artistNames,
      curatorNames,
      programStaffNames,
    }
  })
}
