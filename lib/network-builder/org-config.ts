import { isAirtableConnectionConfigured } from '@/lib/airtable/client'
import {
  DEFAULT_DCC_PEOPLE_FIELD_MAP,
  type NetworkPeopleFieldMap,
} from '@/lib/network-builder/field-map'

export type NetworkBuilderConnection = {
  orgSlug: string
  apiKey: string
  baseId: string
  tables: {
    people: string
    institutions?: string
    opportunities?: string
    interactions?: string
    campaigns?: string
    programs?: string
    agentApprovals?: string
  }
  views?: {
    people?: string
  }
  peopleFieldMap: NetworkPeopleFieldMap
}

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

function orgToken(slug: string): string {
  return slug.toUpperCase().replace(/-/g, '_')
}

function prefixed(slug: string, suffix: string): string | undefined {
  return env(`AIRTABLE_${orgToken(slug)}_NETWORK_${suffix}`)
}

/** Resolve network builder Airtable connection for an org. DCC falls back to legacy DCC CRM env. */
export function getNetworkBuilderConnection(orgSlug: string): NetworkBuilderConnection | null {
  const slug = orgSlug.trim().toLowerCase()
  const token = orgToken(slug)

  const apiKey =
    prefixed(slug, 'API_KEY') ??
    (slug === 'dcc' ? env('AIRTABLE_DCC_CRM_API_KEY') : undefined) ??
    env('AIRTABLE_API_KEY')

  const baseId =
    prefixed(slug, 'BASE_ID') ??
    (slug === 'dcc' ? env('AIRTABLE_DCC_CRM_BASE_ID') : undefined)

  const tablePeople =
    prefixed(slug, 'TABLE_PEOPLE') ??
    (slug === 'dcc' ? env('AIRTABLE_DCC_CRM_TABLE_PEOPLE') : undefined)

  if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId: tablePeople })) {
    return null
  }

  return {
    orgSlug: slug,
    apiKey: apiKey!,
    baseId: baseId!,
    tables: {
      people: tablePeople!,
      institutions:
        prefixed(slug, 'TABLE_INSTITUTIONS') ??
        (slug === 'dcc' ? env('AIRTABLE_DCC_CRM_TABLE_INSTITUTIONS') : undefined),
      opportunities:
        prefixed(slug, 'TABLE_OPPORTUNITIES') ??
        (slug === 'dcc' ? env('AIRTABLE_DCC_CRM_TABLE_OPPORTUNITIES') : undefined),
      interactions:
        prefixed(slug, 'TABLE_INTERACTIONS') ??
        (slug === 'dcc' ? env('AIRTABLE_DCC_CRM_TABLE_INTERACTIONS') : undefined),
      campaigns:
        prefixed(slug, 'TABLE_CAMPAIGNS') ??
        (slug === 'dcc' ? env('AIRTABLE_DCC_CRM_TABLE_CAMPAIGNS') : undefined),
      programs: prefixed(slug, 'TABLE_PROGRAMS'),
      agentApprovals:
        prefixed(slug, 'TABLE_AGENT_APPROVALS') ??
        (slug === 'dcc' ? env('AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS') : undefined),
    },
    views: {
      people:
        prefixed(slug, 'VIEW_PEOPLE') ??
        (slug === 'dcc'
          ? env('AIRTABLE_DCC_CRM_VIEW_PEOPLE') ?? env('AIRTABLE_DCC_CRM_VIEW_ID')
          : undefined),
    },
    peopleFieldMap: DEFAULT_DCC_PEOPLE_FIELD_MAP,
  }
}

export function isNetworkBuilderConfigured(orgSlug: string): boolean {
  return getNetworkBuilderConnection(orgSlug) !== null
}
