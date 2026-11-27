import { createClient } from '@supabase/supabase-js'
import { fetchAllRecords, isAirtableConnectionConfigured, type AirtableRecord } from '@/lib/airtable/client'
import { buildCrmGraphElements } from '@/lib/airtable/crm-graph-transform'
import { getDccOsConnection } from '@/lib/dcc/os-config'
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

function graphConnection(): { apiKey: string; baseId: string; tablePeople: string } | null {
  const legacyKey = env('AIRTABLE_DCC_CRM_API_KEY')
  const legacyBase = env('AIRTABLE_DCC_CRM_BASE_ID')
  const legacyPeople = env('AIRTABLE_DCC_CRM_TABLE_PEOPLE')
  if (isAirtableConnectionConfigured({ apiKey: legacyKey, baseId: legacyBase, tableId: legacyPeople })) {
    return { apiKey: legacyKey!, baseId: legacyBase!, tablePeople: legacyPeople! }
  }
  const os = getDccOsConnection()
  if (!os?.tables.people) return null
  return { apiKey: os.apiKey, baseId: os.baseId, tablePeople: os.tables.people }
}

export function isDccCrmGraphConfigured(): boolean {
  return graphConnection() !== null
}

function peopleListOptions(): { viewId?: string } | undefined {
  const view =
    env('AIRTABLE_DCC_CRM_VIEW_PEOPLE')?.trim() || env('AIRTABLE_DCC_CRM_VIEW_ID')?.trim() || undefined
  return view ? { viewId: view } : undefined
}

/** Website identities are never published through the older CRM graph.
 * Canonical SQL record ownership wins even if an Airtable marker was cleared.
 * Missing credentials / failed reads suppress people rather than leak identity.
 */
export async function excludeWebsiteBoundPeople(people: AirtableRecord[]): Promise<AirtableRecord[]> {
  const candidates=people.filter(person=>!person.fields['DCC Website Member Binding ID'])
  if(!candidates.length) return []
  const url=env('NEXT_PUBLIC_SUPABASE_URL')
  const key=env('SUPABASE_SERVICE_ROLE_KEY')
  if(!url || !key) return []
  try {
    const db=createClient<any>(url,key,{auth:{autoRefreshToken:false,persistSession:false}})
    const bound=new Set<string>()
    for(let i=0;i<candidates.length;i+=40) {
      const {data,error}=await db.from('dcc_platform_member_bindings').select('airtable_person_id')
        .in('airtable_person_id',candidates.slice(i,i+40).map(person=>person.id))
      if(error || !Array.isArray(data)) return []
      for(const row of data) if(row.airtable_person_id) bound.add(row.airtable_person_id)
    }
    return candidates.filter(person=>!bound.has(person.id))
  } catch { return [] }
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

  const connection = graphConnection()
  const tableSeedCandidates = env('AIRTABLE_DCC_CRM_TABLE_SEED_CANDIDATES')
  const tableInstitutions = env('AIRTABLE_DCC_CRM_TABLE_INSTITUTIONS')
  const tableOpportunities = env('AIRTABLE_DCC_CRM_TABLE_OPPORTUNITIES')
  const tableInteractions = env('AIRTABLE_DCC_CRM_TABLE_INTERACTIONS')
  const tableCampaigns = env('AIRTABLE_DCC_CRM_TABLE_CAMPAIGNS')

  if (!connection) {
    return getSampleGraphPayload({ surface, mode, visibility })
  }

  const { apiKey, baseId, tablePeople } = connection

  const peopleOpts = peopleListOptions()
  const [people, seedCandidates, institutions, opportunities, interactions, campaigns] = await Promise.all([
    fetchAllRecords(baseId!, tablePeople!, apiKey!, peopleOpts),
    tableSeedCandidates ? fetchAllRecords(baseId!, tableSeedCandidates, apiKey!) : Promise.resolve([]),
    tableInstitutions ? fetchAllRecords(baseId!, tableInstitutions, apiKey!) : Promise.resolve([]),
    tableOpportunities ? fetchAllRecords(baseId!, tableOpportunities, apiKey!) : Promise.resolve([]),
    tableInteractions ? fetchAllRecords(baseId!, tableInteractions, apiKey!) : Promise.resolve([]),
    tableCampaigns ? fetchAllRecords(baseId!, tableCampaigns, apiKey!) : Promise.resolve([]),
  ])

  const visiblePeople = visibility==='public' ? await excludeWebsiteBoundPeople(people) : people
  const elements = buildCrmGraphElements(
    { people:visiblePeople, seedCandidates, institutions, opportunities, interactions, campaigns },
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
