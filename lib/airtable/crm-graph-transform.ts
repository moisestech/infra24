import type { AirtableRecord } from '@/lib/airtable/client'
import { CRM_GRAPH_FIELD_MAP } from '@/lib/airtable/crm-graph-field-map'
import {
  isActiveNetworkLayer,
  isDemoReadinessExcluded,
  isHiddenGraphLayer,
  isResearchGraphLayer,
  nodePriorityScale,
  normalizeGraphName,
} from '@/lib/network-builder/demo-select-options'
import { isPublicGraphEligible } from '@/lib/network-builder/people-select-options'
import type {
  BuildCrmGraphOptions,
  DccGraphEdgeData,
  DccGraphEdgeKind,
  DccGraphElement,
  DccGraphMode,
  DccGraphNodeData,
  DccGraphNodeKind,
  DccGraphVisibility,
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

function asNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v)
    return Number.isNaN(n) ? undefined : n
  }
  return undefined
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string') as string[]
  if (typeof v === 'string' && v.trim()) return [v.trim()]
  return []
}

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

function upsertEdge(
  map: Map<string, EdgeAgg>,
  e: Omit<EdgeAgg, 'weight' | 'interactionCount' | 'lastInteractionAt'> & { deltaWeight: number; at: number }
) {
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

function personEligibleForPublicGraph(fields: Record<string, unknown>): boolean {
  const consent = asString(fields[F.people.publicProfileConsent])
  const layer = asString(fields[F.people.graphLayer])
  if (!consent && !layer) return true
  return isPublicGraphEligible(consent, layer)
}

function personPassesActiveFilter(
  fields: Record<string, unknown>,
  mode: DccGraphMode,
  visibility: DccGraphVisibility
): boolean {
  if (isDemoReadinessExcluded(asString(fields[F.people.demoReadiness]))) return false
  if (isHiddenGraphLayer(asString(fields[F.people.graphLayer]))) return false
  if (mode === 'admin') return true
  if (!isActiveNetworkLayer(asString(fields[F.people.graphLayer]))) return false
  if (visibility === 'public' && !personEligibleForPublicGraph(fields)) return false
  return true
}

function seedPassesResearchFilter(fields: Record<string, unknown>, mode: DccGraphMode): boolean {
  if (isDemoReadinessExcluded(asString(fields[F.seedCandidates.demoReadiness]))) return false
  if (isHiddenGraphLayer(asString(fields[F.seedCandidates.graphLayer]))) return false
  if (mode === 'admin') return true
  return isResearchGraphLayer(asString(fields[F.seedCandidates.graphLayer]))
}

function buildPersonNodeData(
  r: AirtableRecord,
  visibility: DccGraphVisibility,
  seedContext?: Partial<DccGraphNodeData>
): DccGraphNodeData {
  const name = asString(r.fields[F.people.name]) ?? 'Person'
  const constituentLabel = seedContext?.constituentLabel
  const publicNodeSummary = asString(r.fields[F.people.publicNodeSummary]) ?? seedContext?.publicNodeSummary
  const nodePriority = seedContext?.nodePriority
  const practiceTags = asStringArray(r.fields[F.people.practiceTags])
  const mergedTags = practiceTags.length ? practiceTags : (seedContext?.practiceTags ?? [])

  return {
    id: nodeId('person', r.id),
    kind: 'person',
    provenance: 'people',
    label: name,
    displayLabel: name,
    contactCategory: asString(r.fields[F.people.contactCategory]),
    warmth: asString(r.fields[F.people.warmth]),
    miami: asBoolean(r.fields[F.people.miami]),
    city: asString(r.fields[F.people.city]),
    publicNodeSummary,
    demoReadiness: asString(r.fields[F.people.demoReadiness]),
    imageUrl: asString(r.fields[F.people.imagePortraitUrl]) ?? seedContext?.imageUrl,
    practiceTags: mergedTags,
    interestTags: asStringArray(r.fields[F.people.interestTags]),
    website: asString(r.fields[F.people.website]),
    graphLayer: asString(r.fields[F.people.graphLayer]),
    dccSignupStatus: asString(r.fields[F.people.dccSignupStatus]),
    publicProfileConsent: asString(r.fields[F.people.publicProfileConsent]),
    consentStatus: asString(r.fields[F.people.consentStatus]),
    constituentLabel,
    miamiConnectionType: seedContext?.miamiConnectionType,
    nodePriority,
    contextLinks: seedContext?.contextLinks,
    sourceUrl: seedContext?.sourceUrl,
    institutionSource: seedContext?.institutionSource,
    reviewStatus: seedContext?.reviewStatus,
    recommendedBucket: seedContext?.recommendedBucket,
    seedFitScore: seedContext?.seedFitScore,
    confidence: seedContext?.confidence,
    anonymized: false,
    nodeScale: nodePriorityScale(nodePriority),
  }
}

function buildSeedCandidateNodeData(
  r: AirtableRecord,
  mode: DccGraphMode,
  visibility: DccGraphVisibility
): DccGraphNodeData {
  const realName = asString(r.fields[F.seedCandidates.candidateName]) ?? 'Candidate'
  const constituentLabel = asString(r.fields[F.seedCandidates.constituentLabel])
  const roleType = asString(r.fields[F.seedCandidates.roleType])
  const anonymize = mode === 'research' && visibility === 'public'
  const displayLabel = anonymize
    ? constituentLabel ?? roleType ?? 'Research Node'
    : realName

  return {
    id: nodeId('seedCandidate', r.id),
    kind: 'seedCandidate',
    provenance: 'seedCandidate',
    label: realName,
    displayLabel,
    contactCategory: roleType,
    constituentLabel,
    miamiConnectionType: asString(r.fields[F.seedCandidates.miamiConnectionType]),
    nodePriority: asString(r.fields[F.seedCandidates.nodePriority]),
    publicNodeSummary: asString(r.fields[F.seedCandidates.publicNodeSummary]),
    demoReadiness: asString(r.fields[F.seedCandidates.demoReadiness]),
    imageUrl: asString(r.fields[F.seedCandidates.imagePortraitUrl]),
    practiceTags: asStringArray(r.fields[F.seedCandidates.suggestedPracticeTags]),
    interestTags: asStringArray(r.fields[F.seedCandidates.suggestedInterestTags]),
    website: asString(r.fields[F.seedCandidates.website]),
    sourceUrl: asString(r.fields[F.seedCandidates.sourceUrl]),
    contextLinks: asStringArray(r.fields[F.seedCandidates.contextLinks]),
    graphLayer: asString(r.fields[F.seedCandidates.graphLayer]),
    reviewStatus: asString(r.fields[F.seedCandidates.reviewStatus]),
    recommendedBucket: asString(r.fields[F.seedCandidates.recommendedBucket]),
    institutionSource: asString(r.fields[F.seedCandidates.institutionSource]),
    seedFitScore: asNumber(r.fields[F.seedCandidates.seedFitScore]),
    confidence: asString(r.fields[F.seedCandidates.confidence]),
    addToPeople: asBoolean(r.fields[F.seedCandidates.addToPeople]),
    city: asString(r.fields[F.seedCandidates.city]),
    miami: asString(r.fields[F.seedCandidates.miamiConnectionType])?.toLowerCase().includes('miami') ?? undefined,
    anonymized: anonymize,
    nodeScale: nodePriorityScale(asString(r.fields[F.seedCandidates.nodePriority])),
  }
}

export type CrmGraphTablesInput = {
  people: AirtableRecord[]
  seedCandidates: AirtableRecord[]
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
  surfaceOrOptions: DccNetworkGraphSurface | BuildCrmGraphOptions,
  legacyNowMs?: number
): DccGraphElement[] {
  const options: BuildCrmGraphOptions =
    typeof surfaceOrOptions === 'string'
      ? { surface: surfaceOrOptions, mode: 'active', visibility: 'public' }
      : surfaceOrOptions

  const { surface, mode = 'active', visibility = 'public', nowMs = legacyNowMs ?? Date.now() } = options
  const nodes = new Map<string, DccGraphNodeData>()
  const edgeMap = new Map<string, EdgeAgg>()

  const includeOpportunities = surface === 'explorer' && (mode === 'admin' || mode === 'combined')
  const includeCampaigns = surface === 'explorer' && (mode === 'admin' || mode === 'combined')
  const includePeople = mode === 'active' || mode === 'combined' || mode === 'admin'
  const includeSeeds = mode === 'research' || mode === 'combined' || mode === 'admin'

  const peopleByName = new Map<string, AirtableRecord>()
  for (const r of tables.people) {
    const n = normalizeGraphName(asString(r.fields[F.people.name]))
    if (n) peopleByName.set(n, r)
  }

  const seedContextByPersonName = new Map<string, Partial<DccGraphNodeData>>()
  for (const r of tables.seedCandidates) {
    const n = normalizeGraphName(asString(r.fields[F.seedCandidates.candidateName]))
    if (!n || !peopleByName.has(n)) continue
    seedContextByPersonName.set(n, {
      constituentLabel: asString(r.fields[F.seedCandidates.constituentLabel]),
      publicNodeSummary: asString(r.fields[F.seedCandidates.publicNodeSummary]),
      nodePriority: asString(r.fields[F.seedCandidates.nodePriority]),
      practiceTags: asStringArray(r.fields[F.seedCandidates.suggestedPracticeTags]),
      miamiConnectionType: asString(r.fields[F.seedCandidates.miamiConnectionType]),
      contextLinks: asStringArray(r.fields[F.seedCandidates.contextLinks]),
      sourceUrl: asString(r.fields[F.seedCandidates.sourceUrl]),
      institutionSource: asString(r.fields[F.seedCandidates.institutionSource]),
      reviewStatus: asString(r.fields[F.seedCandidates.reviewStatus]),
      recommendedBucket: asString(r.fields[F.seedCandidates.recommendedBucket]),
      seedFitScore: asNumber(r.fields[F.seedCandidates.seedFitScore]),
      confidence: asString(r.fields[F.seedCandidates.confidence]),
      imageUrl: asString(r.fields[F.seedCandidates.imagePortraitUrl]),
    })
  }

  if (mode !== 'research') {
    for (const r of tables.institutions) {
      const label = asString(r.fields[F.institutions.name]) ?? 'Institution'
      nodes.set(nodeId('institution', r.id), {
        id: nodeId('institution', r.id),
        kind: 'institution',
        provenance: 'people',
        label,
        displayLabel: label,
        city: asString(r.fields[F.institutions.city]),
        relationshipStrength: asString(r.fields[F.institutions.relationshipStrength]),
        miami: asBoolean(r.fields[F.institutions.miami]),
        nodeScale: 1.1,
      })
    }
  }

  if (includePeople) {
    for (const r of tables.people) {
      for (const instId of linkedIds(r.fields[F.people.institution])) {
        const tid = nodeId('institution', instId)
        if (nodes.has(tid)) continue
        nodes.set(tid, {
          id: tid,
          kind: 'institution',
          provenance: 'people',
          label: 'Organization',
          displayLabel: 'Organization',
          nodeScale: 1.0,
        })
      }
    }

    for (const r of tables.people) {
      if (!personPassesActiveFilter(r.fields, mode, visibility)) continue
      const nameKey = normalizeGraphName(asString(r.fields[F.people.name]))
      const seedCtx = nameKey ? seedContextByPersonName.get(nameKey) : undefined
      nodes.set(nodeId('person', r.id), buildPersonNodeData(r, visibility, seedCtx))
      const instLinks = linkedIds(r.fields[F.people.institution])
      for (const instId of instLinks) {
        const tid = nodeId('institution', instId)
        if (!nodes.has(tid)) continue
        upsertEdge(edgeMap, {
          id: `aff:${r.id}:${instId}`,
          source: nodeId('person', r.id),
          target: tid,
          kind: 'affiliated_with',
          deltaWeight: 1,
          at: 0,
        })
      }
    }
  }

  if (includeSeeds) {
    for (const r of tables.seedCandidates) {
      if (!seedPassesResearchFilter(r.fields, mode)) continue
      const nameKey = normalizeGraphName(asString(r.fields[F.seedCandidates.candidateName]))
      if (mode === 'combined' && nameKey && peopleByName.has(nameKey)) continue
      const data = buildSeedCandidateNodeData(r, mode, visibility)
      nodes.set(data.id, data)
      const instLabel = asString(r.fields[F.seedCandidates.institutionSource])
      if (instLabel) {
        const instKey = `institution:label:${instLabel.toLowerCase()}`
        if (!nodes.has(instKey)) {
          nodes.set(instKey, {
            id: instKey,
            kind: 'institution',
            provenance: 'seedCandidate',
            label: instLabel,
            displayLabel: instLabel,
            nodeScale: 0.95,
          })
        }
        upsertEdge(edgeMap, {
          id: `rctx:${r.id}:${instKey}`,
          source: data.id,
          target: instKey,
          kind: 'research_context',
          deltaWeight: 0.8,
          at: 0,
        })
      }
    }
  }

  if (includeOpportunities) {
    for (const r of tables.opportunities) {
      const label = asString(r.fields[F.opportunities.name]) ?? 'Opportunity'
      nodes.set(nodeId('opportunity', r.id), {
        id: nodeId('opportunity', r.id),
        kind: 'opportunity',
        provenance: 'people',
        label,
        displayLabel: label,
        opportunityStatus: asString(r.fields[F.opportunities.status]),
        deadline: asString(r.fields[F.opportunities.deadline]),
        nodeScale: 0.9,
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
        provenance: 'people',
        label,
        displayLabel: label,
        campaignName: label,
        nodeScale: 0.95,
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
    }
  }

  if (includePeople) {
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
          upsertEdge(edgeMap, {
            id: `int:${r.id}:p:${pid}:o:${oid}`,
            source: p,
            target: o,
            kind: 'interacted_with',
            deltaWeight: 0.5 + boost * 0.5,
            at,
          })
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

export function parseGraphMode(value: string | null | undefined): DccGraphMode {
  if (value === 'research' || value === 'combined' || value === 'admin') return value
  return 'active'
}

export function parseGraphVisibility(value: string | null | undefined): DccGraphVisibility {
  return value === 'internal' ? 'internal' : 'public'
}
