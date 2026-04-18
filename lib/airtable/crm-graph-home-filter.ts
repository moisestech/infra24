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

/**
 * Keep top `maxPeople` people by score, institutions adjacent to them on any edge,
 * then only edges whose endpoints are both kept.
 */
export function filterGraphForHome(payload: DccNetworkGraphPayload, maxPeople = 60): DccNetworkGraphPayload {
  const nodeEls = payload.elements.filter(isNode)
  const edgeEls = payload.elements.filter(isEdge)

  const nodeData = nodeEls.map((n) => n.data)
  const edgeData = edgeEls.map((e) => e.data)

  const people = nodeData
    .filter((d) => d.kind === 'person')
    .sort((a, b) => scorePersonNode(b) - scorePersonNode(a))
    .slice(0, maxPeople)

  const keepPeople = new Set(people.map((p) => p.id))
  const instIds = new Set<string>()

  for (const e of edgeData) {
    const touchesPerson = keepPeople.has(e.source) || keepPeople.has(e.target)
    if (!touchesPerson) continue
    if (e.source.startsWith('institution:')) instIds.add(e.source)
    if (e.target.startsWith('institution:')) instIds.add(e.target)
  }

  const keep = new Set<string>([...keepPeople, ...instIds])
  const institutions = nodeData
    .filter((d) => d.kind === 'institution' && keep.has(d.id))
    .sort((a, b) => scoreInstitutionNode(b) - scoreInstitutionNode(a))

  const outNodeData = [...people, ...institutions]
  const outNodeIds = new Set(outNodeData.map((n) => n.id))
  const outEdges = edgeData.filter((e) => outNodeIds.has(e.source) && outNodeIds.has(e.target))

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
