import { fetchAllRecords, isAirtableConnectionConfigured } from '@/lib/airtable/client'
import { buildCrmGraphElements } from '@/lib/airtable/crm-graph-transform'
import { filterGraphForHome, HOME_GRAPH_MAX_TOTAL_NODES } from '@/lib/airtable/crm-graph-home-filter'
import { getSampleGraphPayload } from '@/lib/marketing/fixtures/dcc-crm-graph-sample'
import type { DccNetworkGraphPayload, DccNetworkGraphSurface } from '@/lib/marketing/dcc-crm-graph-types'

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

export function isDccCrmGraphConfigured(): boolean {
  return isAirtableConnectionConfigured({
    apiKey: env('AIRTABLE_DCC_CRM_API_KEY'),
    baseId: env('AIRTABLE_DCC_CRM_BASE_ID'),
    tableId: env('AIRTABLE_DCC_CRM_TABLE_PEOPLE'),
  })
}

function peopleListOptions(): { viewId?: string } | undefined {
  const view =
    env('AIRTABLE_DCC_CRM_VIEW_PEOPLE')?.trim() || env('AIRTABLE_DCC_CRM_VIEW_ID')?.trim() || undefined
  return view ? { viewId: view } : undefined
}

/**
 * Load all CRM tables and build graph JSON. Falls back to fixture when env incomplete.
 * Requires base + API key + People table; other tables are optional (empty until you add ids).
 */
export async function fetchDccCrmGraphPayload(surface: DccNetworkGraphSurface): Promise<DccNetworkGraphPayload> {
  const apiKey = env('AIRTABLE_DCC_CRM_API_KEY')
  const baseId = env('AIRTABLE_DCC_CRM_BASE_ID')
  const tablePeople = env('AIRTABLE_DCC_CRM_TABLE_PEOPLE')
  const tableInstitutions = env('AIRTABLE_DCC_CRM_TABLE_INSTITUTIONS')
  const tableOpportunities = env('AIRTABLE_DCC_CRM_TABLE_OPPORTUNITIES')
  const tableInteractions = env('AIRTABLE_DCC_CRM_TABLE_INTERACTIONS')
  const tableCampaigns = env('AIRTABLE_DCC_CRM_TABLE_CAMPAIGNS')

  if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId: tablePeople })) {
    return getSampleGraphPayload(surface)
  }

  const peopleOpts = peopleListOptions()
  const [people, institutions, opportunities, interactions, campaigns] = await Promise.all([
    fetchAllRecords(baseId!, tablePeople!, apiKey!, peopleOpts),
    tableInstitutions ? fetchAllRecords(baseId!, tableInstitutions, apiKey!) : Promise.resolve([]),
    tableOpportunities ? fetchAllRecords(baseId!, tableOpportunities, apiKey!) : Promise.resolve([]),
    tableInteractions ? fetchAllRecords(baseId!, tableInteractions, apiKey!) : Promise.resolve([]),
    tableCampaigns ? fetchAllRecords(baseId!, tableCampaigns, apiKey!) : Promise.resolve([]),
  ])

  const elements = buildCrmGraphElements(
    { people, institutions, opportunities, interactions, campaigns },
    surface
  )

  const nodeCount = elements.filter((e) => 'kind' in e.data && !('source' in e.data)).length
  const edgeCount = elements.filter((e) => 'source' in e.data).length

  let payload: DccNetworkGraphPayload = {
    elements,
    meta: {
      source: 'airtable',
      surface,
      generatedAt: new Date().toISOString(),
      nodeCount,
      edgeCount,
    },
  }

  if (surface === 'home') {
    payload = filterGraphForHome(payload, { maxPeople: 80, maxTotalNodes: HOME_GRAPH_MAX_TOTAL_NODES })
  }

  return payload
}
