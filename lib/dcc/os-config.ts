/**
 * DCC OS connection — staff product data on base appWoYBRdklcz2RJH.
 * Aliases AIRTABLE_DCC_CRM_* for People/CRM compatibility.
 */

import { isAirtableConnectionConfigured } from '@/lib/airtable/client'

export const DCC_OS_BASE_ID_DEFAULT = 'appWoYBRdklcz2RJH'

export const DCC_OS_TABLE_DEFAULTS = {
  machines: 'tblVtaUYHwgf1rRR8',
  services: 'tblP0tlOOVQE2gQBG',
  jobs: 'tblrkDpVTX2eX8QBl',
  bookings: 'tbljHuPYt3ArDuUpl',
  transactions: 'tbljoW6jK9ZgVuWYg',
  credits: 'tblm9gWEKM1WcfeKU',
  mbos: 'tbl0wHfhogs7Zqz7r',
  changeLog: 'tblrztSgiyzpXSq6y',
  people: 'tbltHiqscY80ybsGE',
  programming: 'tblY3pg6ksCWgsp9F',
} as const

export type DccOsTables = {
  machines: string
  services: string
  jobs: string
  bookings: string
  transactions: string
  credits: string
  mbos: string
  changeLog: string
  people: string
  programming: string
}

export type DccOsConnection = {
  apiKey: string
  baseId: string
  tables: DccOsTables
}

function env(key: string): string | undefined {
  const v = process.env[key]?.trim()
  return v || undefined
}

function tableId(
  osKey: string,
  crmKey: string | undefined,
  fallback: string
): string {
  return env(osKey) || (crmKey ? env(crmKey) : undefined) || fallback
}

export function getDccOsConnection(): DccOsConnection | null {
  const apiKey =
    env('AIRTABLE_DCC_OS_API_KEY') ||
    env('AIRTABLE_DCC_CRM_API_KEY') ||
    env('AIRTABLE_API_KEY')
  const baseId =
    env('AIRTABLE_DCC_OS_BASE_ID') ||
    env('AIRTABLE_DCC_CRM_BASE_ID') ||
    DCC_OS_BASE_ID_DEFAULT

  if (!apiKey?.trim() || !baseId?.trim()) return null

  const tables: DccOsTables = {
    machines: tableId(
      'AIRTABLE_DCC_OS_TABLE_MACHINES',
      undefined,
      DCC_OS_TABLE_DEFAULTS.machines
    ),
    services: tableId(
      'AIRTABLE_DCC_OS_TABLE_SERVICES',
      undefined,
      DCC_OS_TABLE_DEFAULTS.services
    ),
    jobs: tableId(
      'AIRTABLE_DCC_OS_TABLE_JOBS',
      undefined,
      DCC_OS_TABLE_DEFAULTS.jobs
    ),
    bookings: tableId(
      'AIRTABLE_DCC_OS_TABLE_BOOKINGS',
      undefined,
      DCC_OS_TABLE_DEFAULTS.bookings
    ),
    transactions: tableId(
      'AIRTABLE_DCC_OS_TABLE_TRANSACTIONS',
      undefined,
      DCC_OS_TABLE_DEFAULTS.transactions
    ),
    credits: tableId(
      'AIRTABLE_DCC_OS_TABLE_CREDITS',
      undefined,
      DCC_OS_TABLE_DEFAULTS.credits
    ),
    mbos: tableId(
      'AIRTABLE_DCC_OS_TABLE_MBOS',
      undefined,
      DCC_OS_TABLE_DEFAULTS.mbos
    ),
    changeLog: tableId(
      'AIRTABLE_DCC_OS_TABLE_CHANGE_LOG',
      undefined,
      DCC_OS_TABLE_DEFAULTS.changeLog
    ),
    people: tableId(
      'AIRTABLE_DCC_OS_TABLE_PEOPLE',
      'AIRTABLE_DCC_CRM_TABLE_PEOPLE',
      DCC_OS_TABLE_DEFAULTS.people
    ),
    programming: tableId(
      'AIRTABLE_DCC_OS_TABLE_PROGRAMMING',
      'AIRTABLE_OOLITE_PROGRAMMING_TABLE_ID',
      DCC_OS_TABLE_DEFAULTS.programming
    ),
  }

  // Configured when we have a PAT + base; tables have defaults from the product spec.
  if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId: tables.machines })) {
    return null
  }

  return { apiKey, baseId, tables }
}

export function isDccOsConfigured(): boolean {
  return getDccOsConnection() !== null
}

export function requireDccOsConnection(): DccOsConnection {
  const c = getDccOsConnection()
  if (!c) {
    throw new Error(
      'DCC OS not configured. Set AIRTABLE_DCC_OS_API_KEY or AIRTABLE_DCC_CRM_API_KEY (or AIRTABLE_API_KEY) and base id.'
    )
  }
  return c
}
