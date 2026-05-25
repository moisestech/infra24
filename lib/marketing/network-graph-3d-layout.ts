import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force-3d'
import { scorePersonNode } from '@/lib/airtable/crm-graph-home-filter'
import type {
  DccGraphEdgeData,
  DccGraphNodeData,
  DccGraphElement,
  DccNetworkGraphPayload,
} from '@/lib/marketing/dcc-crm-graph-types'
import {
  ColorTheme,
  computeNodeRecencyScores,
  edgeOpacity,
  edgeWidth,
  nodeColor,
  nodeSize,
} from '@/lib/marketing/network-graph-3d-style'

export type LayoutMode = 'organic' | 'institutionHubs' | 'recencyRings'

export type Graph3DNode = {
  id: string
  data: DccGraphNodeData
  x: number
  y: number
  z: number
  size: number
  color: string
}

export type Graph3DEdge = {
  id: string
  source: string
  target: string
  data: DccGraphEdgeData
  opacity: number
  width: number
}

export type Graph3DModel = {
  nodes: Graph3DNode[]
  edges: Graph3DEdge[]
  adjacency: Map<string, Set<string>>
}

const IMMERSIVE_MAX_NODES = 200

function isNode(el: DccGraphElement): el is { data: DccGraphNodeData } {
  return 'kind' in el.data && !('source' in el.data)
}

function isEdge(el: DccGraphElement): el is { data: DccGraphEdgeData } {
  return 'source' in el.data && 'target' in el.data
}

function parseElements(payload: DccNetworkGraphPayload): {
  nodes: DccGraphNodeData[]
  edges: DccGraphEdgeData[]
} {
  const nodes = payload.elements.filter(isNode).map((e) => e.data)
  const edges = payload.elements.filter(isEdge).map((e) => e.data)
  return { nodes, edges }
}

/** Cap graph size for WebGL while preserving high-signal people + their neighborhood. */
export function filterGraphForImmersive3D(
  payload: DccNetworkGraphPayload,
  maxNodes = IMMERSIVE_MAX_NODES
): { nodes: DccGraphNodeData[]; edges: DccGraphEdgeData[] } {
  const { nodes, edges } = parseElements(payload)
  if (nodes.length <= maxNodes) return { nodes, edges }

  const people = nodes
    .filter((n) => n.kind === 'person')
    .sort((a, b) => {
      const scoreA = scorePersonNode(a) + (a.interactionCount ?? 0) * 0.5
      const scoreB = scorePersonNode(b) + (b.interactionCount ?? 0) * 0.5
      return scoreB - scoreA
    })

  const keep = new Set<string>()
  for (const p of people) {
    if (keep.size >= maxNodes) break
    keep.add(p.id)
  }

  // Expand with 1-hop neighbors until cap
  let expanded = true
  while (expanded && keep.size < maxNodes) {
    expanded = false
    for (const e of edges) {
      if (keep.size >= maxNodes) break
      if (keep.has(e.source) && !keep.has(e.target)) {
        keep.add(e.target)
        expanded = true
      } else if (keep.has(e.target) && !keep.has(e.source)) {
        keep.add(e.source)
        expanded = true
      }
    }
  }

  const filteredNodes = nodes.filter((n) => keep.has(n.id))
  const filteredEdges = edges.filter((e) => keep.has(e.source) && keep.has(e.target))
  return { nodes: filteredNodes, edges: filteredEdges }
}

function buildAdjacency(edges: DccGraphEdgeData[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>()
  const touch = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set())
    adj.get(a)!.add(b)
  }
  for (const e of edges) {
    touch(e.source, e.target)
    touch(e.target, e.source)
  }
  return adj
}

export function getEgoNetwork(nodeId: string, adjacency: Map<string, Set<string>>): Set<string> {
  const ego = new Set<string>([nodeId])
  const neighbors = adjacency.get(nodeId)
  if (neighbors) neighbors.forEach((id) => ego.add(id))
  return ego
}

type SimNode = DccGraphNodeData & { x: number; y: number; z: number; vx?: number; vy?: number; vz?: number }

function runForceLayout(
  nodes: DccGraphNodeData[],
  edges: DccGraphEdgeData[],
  iterations = 120
): Map<string, { x: number; y: number; z: number }> {
  const simNodes: SimNode[] = nodes.map((n, i) => ({
    ...n,
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 40,
    z: (Math.random() - 0.5) * 40,
  }))

  const links = edges.map((e) => ({ source: e.source, target: e.target, weight: e.weight ?? 1 }))

  const sim = forceSimulation(simNodes as SimNode & { index?: number }[])
    .force(
      'link',
      forceLink(links)
        .id((d: SimNode) => d.id)
        .distance((l: { weight?: number }) => 12 + 40 / (1 + (l.weight ?? 1)))
        .strength(0.4)
    )
    .force('charge', forceManyBody().strength(-80))
    .force('center', forceCenter(0, 0, 0))
    .stop()

  for (let i = 0; i < iterations; i++) sim.tick()

  const positions = new Map<string, { x: number; y: number; z: number }>()
  for (const n of simNodes) positions.set(n.id, { x: n.x, y: n.y, z: n.z })
  return positions
}

function layoutInstitutionHubs(
  nodes: DccGraphNodeData[],
  edges: DccGraphEdgeData[]
): Map<string, { x: number; y: number; z: number }> {
  const positions = new Map<string, { x: number; y: number; z: number }>()
  const institutions = nodes.filter((n) => n.kind === 'institution')
  const others = nodes.filter((n) => n.kind !== 'institution')

  institutions.forEach((inst, i) => {
    const angle = (i / Math.max(1, institutions.length)) * Math.PI * 2
    const r = institutions.length > 1 ? 6 : 0
    positions.set(inst.id, {
      x: Math.cos(angle) * r,
      y: 0,
      z: Math.sin(angle) * r,
    })
  })

  const instAffiliations = new Map<string, string>()
  for (const e of edges) {
    if (e.kind === 'affiliated_with') {
      if (e.source.startsWith('person:')) instAffiliations.set(e.source, e.target)
      if (e.target.startsWith('person:')) instAffiliations.set(e.target, e.source)
    }
  }

  const byInst = new Map<string, DccGraphNodeData[]>()
  for (const n of others) {
    const instId = instAffiliations.get(n.id) ?? institutions[0]?.id ?? 'center'
    if (!byInst.has(instId)) byInst.set(instId, [])
    byInst.get(instId)!.push(n)
  }

  byInst.forEach((group, instId) => {
    const hub = positions.get(instId) ?? { x: 0, y: 0, z: 0 }
    group.forEach((n, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(1, group.length))
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const radius = 8 + (n.kind === 'opportunity' ? 4 : 0)
      positions.set(n.id, {
        x: hub.x + radius * Math.sin(phi) * Math.cos(theta),
        y: hub.y + radius * Math.sin(phi) * Math.sin(theta) * 0.5,
        z: hub.z + radius * Math.cos(phi),
      })
    })
  })

  for (const n of nodes) {
    if (!positions.has(n.id)) {
      positions.set(n.id, {
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 30,
      })
    }
  }
  return positions
}

function layoutRecencyRings(
  nodes: DccGraphNodeData[],
  edges: DccGraphEdgeData[]
): Map<string, { x: number; y: number; z: number }> {
  const recency = computeNodeRecencyScores(
    nodes.map((n) => n.id),
    edges
  )
  const positions = new Map<string, { x: number; y: number; z: number }>()

  nodes.forEach((n, i) => {
    const score = recency.get(n.id) ?? 0
    const band = score >= 2.5 ? 22 : score >= 1.5 ? 16 : score >= 0.8 ? 10 : 5
    const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(1, nodes.length))
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    positions.set(n.id, {
      x: band * Math.sin(phi) * Math.cos(theta),
      y: (Math.random() - 0.5) * 4,
      z: band * Math.cos(phi),
    })
  })
  return positions
}

export function computeLayout(
  nodes: DccGraphNodeData[],
  edges: DccGraphEdgeData[],
  mode: LayoutMode
): Map<string, { x: number; y: number; z: number }> {
  switch (mode) {
    case 'institutionHubs':
      return layoutInstitutionHubs(nodes, edges)
    case 'recencyRings':
      return layoutRecencyRings(nodes, edges)
    default:
      return runForceLayout(nodes, edges)
  }
}

export function buildGraph3D(
  payload: DccNetworkGraphPayload,
  layoutMode: LayoutMode,
  colorTheme: ColorTheme,
  maxNodes = IMMERSIVE_MAX_NODES
): Graph3DModel {
  const { nodes, edges } = filterGraphForImmersive3D(payload, maxNodes)
  const adjacency = buildAdjacency(edges)
  const positions = computeLayout(nodes, edges, layoutMode)
  const recencyScores = computeNodeRecencyScores(
    nodes.map((n) => n.id),
    edges
  )

  const graphNodes: Graph3DNode[] = nodes.map((data) => {
    const pos = positions.get(data.id) ?? { x: 0, y: 0, z: 0 }
    return {
      id: data.id,
      data,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      size: nodeSize(data),
      color: nodeColor(data, colorTheme, recencyScores.get(data.id) ?? 0),
    }
  })

  const graphEdges: Graph3DEdge[] = edges.map((data) => ({
    id: data.id,
    source: data.source,
    target: data.target,
    data,
    opacity: edgeOpacity(data),
    width: edgeWidth(data),
  }))

  return { nodes: graphNodes, edges: graphEdges, adjacency }
}

export const LAYOUT_MODE_LABELS: Record<LayoutMode, string> = {
  organic: 'Organic',
  institutionHubs: 'Institution hubs',
  recencyRings: 'Recency rings',
}

export function nextLayoutMode(mode: LayoutMode): LayoutMode {
  const order: LayoutMode[] = ['organic', 'institutionHubs', 'recencyRings']
  const i = order.indexOf(mode)
  return order[(i + 1) % order.length]!
}
