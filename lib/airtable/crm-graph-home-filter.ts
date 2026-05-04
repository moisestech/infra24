import type {
  DccGraphEdgeData,
  DccGraphElement,
  DccGraphNodeData,
  DccNetworkGraphPayload,
} from '@/lib/marketing/dcc-crm-graph-types'

function isNode(el: DccGraphElement): el is { data: DccGraphNodeData } {
  return 'kind' in el.data && !('source' in el.data)
}

function isEdge(el: DccGraphElement): el is { data: DccGraphEdgeData } {
  return 'source' in el.data && 'target' in el.data
}

/** Score people for homepage inclusion (higher = more relevant). */
export function scorePersonNode(n: DccGraphNodeData): number {
  if (n.kind !== 'person') return 0
  let s = 0
  if (n.miami) s += 3
  const w = (n.warmth ?? '').toLowerCase()
  if (w.includes('active') || w.includes('very warm')) s += 3
  else if (w.includes('warm')) s += 2
  else if (w.includes('aware')) s += 1
  const cat = (n.contactCategory ?? '').toLowerCase()
  if (
    cat.includes('artist') ||
    cat.includes('funder') ||
    cat.includes('partner') ||
    cat.includes('connector') ||
    cat.includes('institutional')
  ) {
    s += 2
  }
  return s
}

function scoreInstitutionNode(n: DccGraphNodeData): number {
  if (n.kind !== 'institution') return 0
  let s = 0
  if (n.miami) s += 3
  const rs = (n.relationshipStrength ?? '').toLowerCase()
  if (rs.includes('high') || rs.includes('strong')) s += 3
  return s
}

export type FilterGraphForHomeOptions = {
  /** Max people considered before trimming to `maxTotalNodes` (higher = more to choose from). */
  maxPeople?: number
  /** Hard cap on total nodes (people + adjacent institutions) for homepage embeds. */
  maxTotalNodes?: number
}

/** Homepage “living network” embed: max nodes (people + adjacent institutions) after scoring. */
export const HOME_GRAPH_MAX_TOTAL_NODES = 50 as const

function resolveHomeFilterOptions(
  input: number | FilterGraphForHomeOptions | undefined
): { maxPeople: number; maxTotalNodes: number } {
  if (input === undefined) return { maxPeople: 80, maxTotalNodes: HOME_GRAPH_MAX_TOTAL_NODES }
  if (typeof input === 'number') return { maxPeople: input, maxTotalNodes: HOME_GRAPH_MAX_TOTAL_NODES }
  return {
    maxPeople: input.maxPeople ?? 80,
    maxTotalNodes: input.maxTotalNodes ?? HOME_GRAPH_MAX_TOTAL_NODES,
  }
}

/**
 * Keep top-scoring people (up to `maxPeople`), adjacent institutions on any edge,
 * then only edges whose endpoints are both kept. If people + institutions exceed
 * `maxTotalNodes`, drops lowest-scoring people until the cap fits.
 */
export function filterGraphForHome(
  payload: DccNetworkGraphPayload,
  maxPeopleOrOpts?: number | FilterGraphForHomeOptions
): DccNetworkGraphPayload {
  const { maxPeople, maxTotalNodes } = resolveHomeFilterOptions(maxPeopleOrOpts)
  const nodeEls = payload.elements.filter(isNode)
  const edgeEls = payload.elements.filter(isEdge)

  const nodeData = nodeEls.map((n) => n.data)
  const edgeData = edgeEls.map((e) => e.data)

  const allPeopleSorted = nodeData
    .filter((d) => d.kind === 'person')
    .sort((a, b) => scorePersonNode(b) - scorePersonNode(a))

  let k = Math.min(maxPeople, allPeopleSorted.length)
  let chosenPeople: DccGraphNodeData[] = []
  let chosenInstitutions: DccGraphNodeData[] = []
  let outEdges: DccGraphEdgeData[] = []

  while (k > 0) {
    const people = allPeopleSorted.slice(0, k)
    const keepPeople = new Set(people.map((p) => p.id))
    const instIds = new Set<string>()

    for (const e of edgeData) {
      const touchesPerson = keepPeople.has(e.source) || keepPeople.has(e.target)
      if (!touchesPerson) continue
      if (e.source.startsWith('institution:')) instIds.add(e.source)
      if (e.target.startsWith('institution:')) instIds.add(e.target)
    }

    const keep = new Set<string>(people.map((p) => p.id))
    instIds.forEach((id) => keep.add(id))
    const institutions = nodeData
      .filter((d) => d.kind === 'institution' && keep.has(d.id))
      .sort((a, b) => scoreInstitutionNode(b) - scoreInstitutionNode(a))

    const trialNodes = [...people, ...institutions]
    if (trialNodes.length <= maxTotalNodes) {
      chosenPeople = people
      chosenInstitutions = institutions
      const outNodeIds = new Set(trialNodes.map((n) => n.id))
      outEdges = edgeData.filter((e) => outNodeIds.has(e.source) && outNodeIds.has(e.target))
      break
    }
    k -= 1
  }

  const outNodeData = [...chosenPeople, ...chosenInstitutions]
  const outNodeIds = new Set(outNodeData.map((n) => n.id))
  if (!outEdges.length && outNodeData.length) {
    outEdges = edgeData.filter((e) => outNodeIds.has(e.source) && outNodeIds.has(e.target))
  }

  const elements: DccGraphElement[] = [
    ...outNodeData.map((data) => ({ data: { ...data } })),
    ...outEdges.map((data) => ({ data: { ...data } })),
  ]

  return {
    elements,
    meta: {
      ...payload.meta,
      nodeCount: outNodeData.length,
      edgeCount: outEdges.length,
    },
  }
}
