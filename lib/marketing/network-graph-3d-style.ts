import type { DccGraphEdgeData, DccGraphNodeData, DccGraphNodeKind } from '@/lib/marketing/dcc-crm-graph-types'

export type ColorTheme = 'kind' | 'warmth' | 'recency'

const KIND_HEX: Record<DccGraphNodeKind, string> = {
  person: '#2dd4bf',
  seedCandidate: '#a78bfa',
  institution: '#94a3b8',
  opportunity: '#fde68a',
  campaign: '#c4b5fd',
}

const WARMTH_HEX: Record<string, string> = {
  'very warm': '#34d399',
  warm: '#2dd4bf',
  active: '#38bdf8',
  aware: '#a78bfa',
  cold: '#64748b',
}

function warmthKey(warmth?: string): string {
  return (warmth ?? '').toLowerCase()
}

function recencyHex(score: number): string {
  if (score >= 2.5) return '#34d399'
  if (score >= 1.5) return '#2dd4bf'
  if (score >= 0.8) return '#fbbf24'
  return '#64748b'
}

export function nodeColor(
  data: DccGraphNodeData,
  theme: ColorTheme,
  nodeRecencyScore = 0
): string {
  if (theme === 'kind') return KIND_HEX[data.kind]
  if (theme === 'warmth') {
    const w = warmthKey(data.warmth)
    for (const [key, hex] of Object.entries(WARMTH_HEX)) {
      if (w.includes(key)) return hex
    }
    return data.kind === 'person' ? KIND_HEX.person : KIND_HEX[data.kind]
  }
  return recencyHex(nodeRecencyScore)
}

export function nodeSize(data: DccGraphNodeData): number {
  const scale = data.nodeScale ?? 1
  const base =
    data.kind === 'institution'
      ? 1.4
      : data.kind === 'opportunity'
        ? 1.0
        : data.kind === 'campaign'
          ? 1.1
          : data.kind === 'seedCandidate'
            ? 0.8
            : 0.85
  const interactions = data.interactionCount ?? 0
  const boost = Math.min(0.6, interactions * 0.08)
  return (base + boost) * scale
}

export function edgeOpacity(edge: DccGraphEdgeData): number {
  const recency = edge.recencyScore ?? 0.3
  const weight = edge.weight ?? 1
  return Math.min(0.95, 0.25 + recency * 0.2 + Math.min(weight, 6) * 0.06)
}

export function edgeWidth(edge: DccGraphEdgeData): number {
  const weight = edge.weight ?? 1
  return 0.4 + Math.min(weight, 8) * 0.15
}

export function computeNodeRecencyScores(
  nodeIds: string[],
  edges: DccGraphEdgeData[]
): Map<string, number> {
  const scores = new Map<string, number>()
  for (const id of nodeIds) scores.set(id, 0)
  for (const e of edges) {
    const r = e.recencyScore ?? 0
    if (scores.has(e.source)) scores.set(e.source, Math.max(scores.get(e.source)!, r))
    if (scores.has(e.target)) scores.set(e.target, Math.max(scores.get(e.target)!, r))
  }
  return scores
}
