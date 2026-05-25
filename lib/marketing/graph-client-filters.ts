import type { DccGraphNodeData } from '@/lib/marketing/dcc-crm-graph-types'

export type GraphClientFilters = {
  search: string
  filterMiami: boolean
  demoReadiness: string
  constituentLabel: string
  miamiConnectionType: string
  nodePriority: string
  reviewStatus: string
  practiceTag: string
  dccSignupStatus: string
}

export const EMPTY_GRAPH_FILTERS: GraphClientFilters = {
  search: '',
  filterMiami: false,
  demoReadiness: '',
  constituentLabel: '',
  miamiConnectionType: '',
  nodePriority: '',
  reviewStatus: '',
  practiceTag: '',
  dccSignupStatus: '',
}

export function nodeMatchesFilters(node: DccGraphNodeData, filters: GraphClientFilters): boolean {
  const q = filters.search.trim().toLowerCase()
  if (q) {
    const haystack = [
      node.label,
      node.displayLabel,
      node.publicNodeSummary,
      node.constituentLabel,
      node.contactCategory,
      node.institutionSource,
      ...(node.practiceTags ?? []),
      ...(node.interestTags ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(q)) return false
  }

  if (filters.filterMiami && node.miami !== true && !node.miamiConnectionType?.toLowerCase().includes('miami')) {
    return false
  }
  if (filters.demoReadiness && node.demoReadiness !== filters.demoReadiness) return false
  if (filters.constituentLabel && node.constituentLabel !== filters.constituentLabel) return false
  if (filters.miamiConnectionType && node.miamiConnectionType !== filters.miamiConnectionType) return false
  if (filters.nodePriority && node.nodePriority !== filters.nodePriority) return false
  if (filters.reviewStatus && node.reviewStatus !== filters.reviewStatus) return false
  if (filters.dccSignupStatus && node.dccSignupStatus !== filters.dccSignupStatus) return false
  if (filters.practiceTag && !(node.practiceTags ?? []).includes(filters.practiceTag)) return false

  return true
}

export function collectFilterOptions(nodes: DccGraphNodeData[]): {
  demoReadiness: string[]
  constituentLabel: string[]
  miamiConnectionType: string[]
  nodePriority: string[]
  reviewStatus: string[]
  practiceTags: string[]
  dccSignupStatus: string[]
} {
  const sets = {
    demoReadiness: new Set<string>(),
    constituentLabel: new Set<string>(),
    miamiConnectionType: new Set<string>(),
    nodePriority: new Set<string>(),
    reviewStatus: new Set<string>(),
    practiceTags: new Set<string>(),
    dccSignupStatus: new Set<string>(),
  }

  for (const n of nodes) {
    if (n.demoReadiness) sets.demoReadiness.add(n.demoReadiness)
    if (n.constituentLabel) sets.constituentLabel.add(n.constituentLabel)
    if (n.miamiConnectionType) sets.miamiConnectionType.add(n.miamiConnectionType)
    if (n.nodePriority) sets.nodePriority.add(n.nodePriority)
    if (n.reviewStatus) sets.reviewStatus.add(n.reviewStatus)
    if (n.dccSignupStatus) sets.dccSignupStatus.add(n.dccSignupStatus)
    for (const t of n.practiceTags ?? []) sets.practiceTags.add(t)
  }

  const sort = (s: Set<string>) => [...s].sort()
  return {
    demoReadiness: sort(sets.demoReadiness),
    constituentLabel: sort(sets.constituentLabel),
    miamiConnectionType: sort(sets.miamiConnectionType),
    nodePriority: sort(sets.nodePriority),
    reviewStatus: sort(sets.reviewStatus),
    practiceTags: sort(sets.practiceTags),
    dccSignupStatus: sort(sets.dccSignupStatus),
  }
}

export function cytoscapeElementsFromPayload(
  elements: Array<{ data: Record<string, unknown> }>
): Array<{ data: Record<string, unknown> }> {
  return elements.map((el) => {
    if ('kind' in el.data && !('source' in el.data)) {
      const d = el.data as DccGraphNodeData
      const scale = d.nodeScale ?? 1
      const base = d.kind === 'institution' ? 44 : d.kind === 'seedCandidate' ? 30 : 32
      const size = Math.round(base * scale)
      return {
        data: {
          ...d,
          label: d.displayLabel || d.label,
          width: size,
          height: d.kind === 'institution' ? Math.round(size * 0.85) : size,
        },
      }
    }
    return el
  })
}
