import type { AirtableRecord } from '@/lib/airtable/client'
import { CRM_GRAPH_FIELD_MAP } from '@/lib/airtable/crm-graph-field-map'
import type {
  DccGraphEdgeData,
  DccGraphEdgeKind,
  DccGraphElement,
  DccGraphNodeData,
  DccGraphNodeKind,
  DccNetworkGraphSurface,
} from '@/lib/marketing/dcc-crm-graph-types'

const F = CRM_GRAPH_FIELD_MAP

function asString(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim()
  return undefined
}

function asBoolean(v: unknown): boolean | undefined {
  if (typeof v === 'boolean') return v
  if (v === 'Yes' || v === 'yes' || v === true) return true
  if (v === 'No' || v === 'no' || v === false) return false
  return undefined
}

/** Airtable linked-record fields: string or string[] */
function linkedIds(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string') as string[]
  if (typeof v === 'string' && v.startsWith('rec')) return [v]
  return []
}

function nodeId(kind: DccGraphNodeKind, recordId: string): string {
  return `${kind}:${recordId}`
}

function parseInteractionDate(raw: unknown): number {
  const s = asString(raw)
  if (!s) return 0
  const t = Date.parse(s)
  return Number.isNaN(t) ? 0 : t
}

function recencyScoreFromTimestamp(ts: number, now: number): number {
  if (!ts) return 0
  const days = Math.max(0, (now - ts) / (1000 * 60 * 60 * 24))
  if (days <= 30) return 3
  if (days <= 90) return 2
  if (days <= 365) return 1
  return 0.3
}

type EdgeAgg = {
  id: string
  source: string
  target: string
  kind: DccGraphEdgeKind
  weight: number
  interactionCount: number
  lastInteractionAt: number
}

function edgeKey(kind: DccGraphEdgeKind, source: string, target: string): string {
  if (kind === 'co_appeared') {
    const [x, y] = source < target ? [source, target] : [target, source]
    return `${kind}|${x}|${y}`
  }
  return `${kind}|${source}|${target}`
}

function upsertEdge(map: Map<string, EdgeAgg>, e: Omit<EdgeAgg, 'weight' | 'interactionCount' | 'lastInteractionAt'> & { deltaWeight: number; at: number }) {
  const key = edgeKey(e.kind, e.source, e.target)
  const cur = map.get(key)
  if (cur) {
    cur.weight += e.deltaWeight
    cur.interactionCount += 1
    if (e.at > cur.lastInteractionAt) cur.lastInteractionAt = e.at
  } else {
    map.set(key, {
      id: e.id,
      source: e.source,
      target: e.target,
      kind: e.kind,
      weight: e.deltaWeight,
      interactionCount: 1,
      lastInteractionAt: e.at,
    })
  }
}

export type CrmGraphTablesInput = {
  people: AirtableRecord[]
  institutions: AirtableRecord[]
  opportunities: AirtableRecord[]
  interactions: AirtableRecord[]
  campaigns: AirtableRecord[]
}

/**
 * Build Cytoscape elements from CRM tables. Interactions do not become nodes;
 * they merge into edge weight / recency.
 */
export function buildCrmGraphElements(
  tables: CrmGraphTablesInput,
  surface: DccNetworkGraphSurface,
  nowMs: number = Date.now()
): DccGraphElement[] {
  const nodes = new Map<string, DccGraphNodeData>()
  const edgeMap = new Map<string, EdgeAgg>()

  const includeOpportunities = surface === 'explorer'
  const includeCampaigns = surface === 'explorer'

  for (const r of tables.institutions) {
    const label = asString(r.fields[F.institutions.name]) ?? 'Institution'
    nodes.set(nodeId('institution', r.id), {
      id: nodeId('institution', r.id),
      kind: 'institution',
      label,
      city: asString(r.fields[F.institutions.city]),
      relationshipStrength: asString(r.fields[F.institutions.relationshipStrength]),
      miami: asBoolean(r.fields[F.institutions.miami]),
    })
  }

  // When the Institutions table is not wired yet, still show org nodes + affiliation edges
  // for linked-record ids on People (lookup names arrive once that table is connected).
  for (const r of tables.people) {
    for (const instId of linkedIds(r.fields[F.people.institution])) {
      const tid = nodeId('institution', instId)
      if (nodes.has(tid)) continue
      nodes.set(tid, {
        id: tid,
        kind: 'institution',
        label: 'Organization',
        city: undefined,
        relationshipStrength: undefined,
        miami: undefined,
      })
    }
  }

  for (const r of tables.people) {
    const label = asString(r.fields[F.people.name]) ?? 'Person'
    nodes.set(nodeId('person', r.id), {
      id: nodeId('person', r.id),
      kind: 'person',
      label,
      contactCategory: asString(r.fields[F.people.contactCategory]),
      warmth: asString(r.fields[F.people.warmth]),
      miami: asBoolean(r.fields[F.people.miami]),
    })
    const instLinks = linkedIds(r.fields[F.people.institution])
    for (const instId of instLinks) {
      const tid = nodeId('institution', instId)
      if (!nodes.has(tid)) continue
      const id = `aff:${r.id}:${instId}`
      upsertEdge(edgeMap, {
        id,
        source: nodeId('person', r.id),
        target: tid,
        kind: 'affiliated_with',
        deltaWeight: 1,
        at: 0,
      })
    }
  }

  if (includeOpportunities) {
    for (const r of tables.opportunities) {
      const label = asString(r.fields[F.opportunities.name]) ?? 'Opportunity'
      nodes.set(nodeId('opportunity', r.id), {
        id: nodeId('opportunity', r.id),
        kind: 'opportunity',
        label,
        opportunityStatus: asString(r.fields[F.opportunities.status]),
        deadline: asString(r.fields[F.opportunities.deadline]),
      })
      for (const instId of linkedIds(r.fields[F.opportunities.institution])) {
        const tid = nodeId('institution', instId)
        if (!nodes.has(tid)) continue
        upsertEdge(edgeMap, {
          id: `relio:${r.id}:${instId}`,
          source: tid,
          target: nodeId('opportunity', r.id),
          kind: 'related_to',
          deltaWeight: 1,
          at: 0,
        })
      }
      for (const pid of linkedIds(r.fields[F.opportunities.peopleInvolved])) {
        const sid = nodeId('person', pid)
        if (!nodes.has(sid)) continue
        upsertEdge(edgeMap, {
          id: `inv:${pid}:${r.id}`,
          source: sid,
          target: nodeId('opportunity', r.id),
          kind: 'involved_in',
          deltaWeight: 1,
          at: 0,
        })
      }
    }
  }

  if (includeCampaigns) {
    for (const r of tables.campaigns) {
      const label = asString(r.fields[F.campaigns.name]) ?? 'Campaign'
      nodes.set(nodeId('campaign', r.id), {
        id: nodeId('campaign', r.id),
        kind: 'campaign',
        label,
        campaignName: label,
      })
      for (const pid of linkedIds(r.fields[F.campaigns.people])) {
        const sid = nodeId('person', pid)
        if (!nodes.has(sid)) continue
        upsertEdge(edgeMap, {
          id: `cmp:${r.id}:p:${pid}`,
          source: nodeId('campaign', r.id),
          target: sid,
          kind: 'campaign_link',
          deltaWeight: 0.5,
          at: 0,
        })
      }
      for (const iid of linkedIds(r.fields[F.campaigns.institutions])) {
        const tid = nodeId('institution', iid)
        if (!nodes.has(tid)) continue
        upsertEdge(edgeMap, {
          id: `cmp:${r.id}:i:${iid}`,
          source: nodeId('campaign', r.id),
          target: tid,
          kind: 'campaign_link',
          deltaWeight: 0.5,
          at: 0,
        })
      }
      for (const oid of linkedIds(r.fields[F.campaigns.opportunities])) {
        const oidn = nodeId('opportunity', oid)
        if (!nodes.has(oidn)) continue
        upsertEdge(edgeMap, {
          id: `cmp:${r.id}:o:${oid}`,
          source: nodeId('campaign', r.id),
          target: oidn,
          kind: 'campaign_link',
          deltaWeight: 0.5,
          at: 0,
        })
      }
    }
  }

  for (const r of tables.interactions) {
    const at = parseInteractionDate(r.fields[F.interactions.date])
    const boost = recencyScoreFromTimestamp(at, nowMs)
    const people = linkedIds(r.fields[F.interactions.people])
    const insts = linkedIds(r.fields[F.interactions.institution])
    const opps = linkedIds(r.fields[F.interactions.relatedOpportunity])

    for (const pid of people) {
      const p = nodeId('person', pid)
      if (!nodes.has(p)) continue
      for (const iid of insts) {
        const t = nodeId('institution', iid)
        if (!nodes.has(t)) continue
        upsertEdge(edgeMap, {
          id: `int:${r.id}:p:${pid}:i:${iid}`,
          source: p,
          target: t,
          kind: 'interacted_with',
          deltaWeight: 1 + boost,
          at,
        })
      }
      for (const oid of opps) {
        if (!includeOpportunities) continue
        const o = nodeId('opportunity', oid)
        if (!nodes.has(o)) continue
        for (const personId of people) {
          const p = nodeId('person', personId)
          if (!nodes.has(p)) continue
          upsertEdge(edgeMap, {
            id: `int:${r.id}:p:${personId}:o:${oid}`,
            source: p,
            target: o,
            kind: 'interacted_with',
            deltaWeight: 0.5 + boost * 0.5,
            at,
          })
        }
      }
    }

    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const a = nodeId('person', people[i])
        const b = nodeId('person', people[j])
        if (!nodes.has(a) || !nodes.has(b)) continue
        upsertEdge(edgeMap, {
          id: `co:${r.id}:${people[i]}:${people[j]}`,
          source: a,
          target: b,
          kind: 'co_appeared',
          deltaWeight: 0.5 + boost * 0.25,
          at,
        })
      }
    }
  }

  const elements: DccGraphElement[] = [...nodes.values()].map((data) => ({ data: { ...data } }))

  for (const e of edgeMap.values()) {
    const recencyScore = recencyScoreFromTimestamp(e.lastInteractionAt, nowMs)
    const edge: DccGraphEdgeData = {
      id: e.id,
      source: e.source,
      target: e.target,
      kind: e.kind,
      weight: e.weight,
      interactionCount: e.interactionCount,
      lastInteractionAt: e.lastInteractionAt ? new Date(e.lastInteractionAt).toISOString() : undefined,
      recencyScore,
    }
    elements.push({ data: edge })
  }

  return elements
}
