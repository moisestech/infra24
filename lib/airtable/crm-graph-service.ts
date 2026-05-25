import { fetchAllRecords, isAirtableConnectionConfigured } from '@/lib/airtable/client'
import { buildCrmGraphElements } from '@/lib/airtable/crm-graph-transform'
import { filterGraphForHome, HOME_GRAPH_MAX_TOTAL_NODES } from '@/lib/airtable/crm-graph-home-filter'
import { getSampleGraphPayload } from '@/lib/marketing/fixtures/dcc-crm-graph-sample'
import type {
  DccGraphMode,
  DccGraphVisibility,
  DccNetworkGraphPayload,
  DccNetworkGraphSurface,
} from '@/lib/marketing/dcc-crm-graph-types'

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

export type FetchDccCrmGraphOptions = {
  surface?: DccNetworkGraphSurface
  mode?: DccGraphMode
  visibility?: DccGraphVisibility
}

/**
 * Load all CRM tables and build graph JSON. Falls back to fixture when env incomplete.
 */
export async function fetchDccCrmGraphPayload(
  surfaceOrOptions: DccNetworkGraphSurface | FetchDccCrmGraphOptions = 'home'
): Promise<DccNetworkGraphPayload> {
  const options: FetchDccCrmGraphOptions =
    typeof surfaceOrOptions === 'string' ? { surface: surfaceOrOptions } : surfaceOrOptions

  const surface = options.surface ?? 'home'
  const mode = options.mode ?? 'active'
  const visibility = options.visibility ?? 'public'

  const apiKey = env('AIRTABLE_DCC_CRM_API_KEY')
  const baseId = env('AIRTABLE_DCC_CRM_BASE_ID')
  const tablePeople = env('AIRTABLE_DCC_CRM_TABLE_PEOPLE')
  const tableSeedCandidates = env('AIRTABLE_DCC_CRM_TABLE_SEED_CANDIDATES')
  const tableInstitutions = env('AIRTABLE_DCC_CRM_TABLE_INSTITUTIONS')
  const tableOpportunities = env('AIRTABLE_DCC_CRM_TABLE_OPPORTUNITIES')
  const tableInteractions = env('AIRTABLE_DCC_CRM_TABLE_INTERACTIONS')
  const tableCampaigns = env('AIRTABLE_DCC_CRM_TABLE_CAMPAIGNS')

  if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId: tablePeople })) {
    return getSampleGraphPayload({ surface, mode, visibility })
  }

  const peopleOpts = peopleListOptions()
  const [people, seedCandidates, institutions, opportunities, interactions, campaigns] = await Promise.all([
    fetchAllRecords(baseId!, tablePeople!, apiKey!, peopleOpts),
    tableSeedCandidates ? fetchAllRecords(baseId!, tableSeedCandidates, apiKey!) : Promise.resolve([]),
    tableInstitutions ? fetchAllRecords(baseId!, tableInstitutions, apiKey!) : Promise.resolve([]),
    tableOpportunities ? fetchAllRecords(baseId!, tableOpportunities, apiKey!) : Promise.resolve([]),
    tableInteractions ? fetchAllRecords(baseId!, tableInteractions, apiKey!) : Promise.resolve([]),
    tableCampaigns ? fetchAllRecords(baseId!, tableCampaigns, apiKey!) : Promise.resolve([]),
  ])

  const elements = buildCrmGraphElements(
    { people, seedCandidates, institutions, opportunities, interactions, campaigns },
    { surface, mode, visibility }
  )

  const nodeCount = elements.filter((e) => 'kind' in e.data && !('source' in e.data)).length
  const edgeCount = elements.filter((e) => 'source' in e.data).length

  let payload: DccNetworkGraphPayload = {
    elements,
    meta: {
      source: 'airtable',
      surface,
      mode,
      visibility,
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
