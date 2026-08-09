import { isAirtableConnectionConfigured } from '@/lib/airtable/client'
import {
  resolveLifeOsTaskFieldMap,
  type LifeOsTaskFieldMap,
} from '@/lib/life-os/field-map'

export const LIFE_OS_BASE_ID_DEFAULT = 'apprswzWnLrHBwFcx'

export type LifeOsConnection = {
  apiKey: string
  baseId: string
  tasksTableId: string
  fieldMap: LifeOsTaskFieldMap
}

function readEnv(key: string): string | undefined {
  const v = process.env[key]?.trim()
  return v || undefined
}

/**
 * LIFE OS (personal PM / career / strategy) connection.
 * PAT: AIRTABLE_LIFE_OS_API_KEY → AIRTABLE_API_KEY
 */
export function getLifeOsConnection(): LifeOsConnection | null {
  const apiKey =
    readEnv('AIRTABLE_LIFE_OS_API_KEY') || readEnv('AIRTABLE_API_KEY')
  const baseId =
    readEnv('AIRTABLE_LIFE_OS_BASE_ID') || LIFE_OS_BASE_ID_DEFAULT
  const tasksTableId = readEnv('AIRTABLE_LIFE_OS_TABLE_TASKS')

  if (
    !isAirtableConnectionConfigured({
      apiKey,
      baseId,
      tableId: tasksTableId,
    })
  ) {
    return null
  }

  return {
    apiKey: apiKey!,
    baseId: baseId!,
    tasksTableId: tasksTableId!,
    fieldMap: resolveLifeOsTaskFieldMap(),
  }
}

export function isLifeOsConfigured(): boolean {
  return getLifeOsConnection() !== null
}
