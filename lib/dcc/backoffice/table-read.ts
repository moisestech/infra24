import { getDccOsConnection, type DccOsConnection, type DccOsTables } from '@/lib/dcc/os-config'

export type TableRead<T> =
  | {
      status: 'records'
      records: T[]
      tableName: string
      tableId: string
      baseId: string
    }
  | { status: 'unconfigured'; tableName: string }
  | { status: 'missing'; tableName: string }
  | {
      status: 'forbidden'
      tableName: string
      tableId: string
      baseId: string
      detail: string
    }

export type StaffNotice = {
  tone: 'ready' | 'failure' | 'pending' | 'finance'
  text: string
}

export async function readTable<T>(
  tableName: string,
  tableKey: keyof DccOsTables,
  load: (conn: DccOsConnection) => Promise<T[]>
): Promise<TableRead<T>> {
  const conn = getDccOsConnection()
  if (!conn) return { status: 'unconfigured', tableName }
  const tableId = conn.tables[tableKey]
  if (!tableId) return { status: 'missing', tableName }
  try {
    const records = await load(conn)
    return { status: 'records', records, tableName, tableId, baseId: conn.baseId }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Airtable request failed'
    const forbidden =
      message.includes('403') || message.includes('INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND')
    return {
      status: 'forbidden',
      tableName,
      tableId,
      baseId: conn.baseId,
      detail: forbidden ? '' : sanitizeAirtableError(message),
    }
  }
}

export function noticeFromRead(read: TableRead<unknown>): StaffNotice | null {
  if (read.status === 'records') return null
  if (read.status === 'unconfigured') {
    return {
      tone: 'pending',
      text: `Airtable is not connected in this environment. ${read.tableName} is withheld.`,
    }
  }
  if (read.status === 'missing') {
    return {
      tone: 'pending',
      text: `${read.tableName} is not a table on DCC CRM yet.`,
    }
  }
  const extra = read.detail ? ` ${read.detail}` : ''
  return {
    tone: 'failure',
    text: `The Airtable token cannot read ${read.tableName} (${read.tableId}) on base ${read.baseId}. The token needs data.records:read on INFRA24 CRM.${extra}`,
  }
}

function sanitizeAirtableError(message: string): string {
  return message.replace(/Bearer\s+\S+/gi, 'Bearer [token]').slice(0, 180)
}
