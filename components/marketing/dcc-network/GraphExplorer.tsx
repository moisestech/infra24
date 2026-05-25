'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Core, Stylesheet } from 'cytoscape'
import { GraphFilterBar } from '@/components/marketing/dcc-network/GraphFilterBar'
import { GraphNodeCard, GraphNodeTooltip } from '@/components/marketing/dcc-network/GraphNodeCard'
import type {
  DccGraphMode,
  DccGraphNodeData,
  DccGraphVisibility,
  DccNetworkGraphPayload,
  DccNetworkGraphSurface,
} from '@/lib/marketing/dcc-crm-graph-types'
import {
  cytoscapeElementsFromPayload,
  EMPTY_GRAPH_FILTERS,
  nodeMatchesFilters,
  type GraphClientFilters,
} from '@/lib/marketing/graph-client-filters'
import { cn } from '@/lib/utils'

type TooltipState = { x: number; y: number; node: DccGraphNodeData } | null

const cytoscapeStylesheet: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': 88,
      color: '#171717',
      'text-valign': 'center',
      'text-halign': 'center',
      width: 'data(width)',
      height: 'data(height)',
    },
  },
  {
    selector: 'node[kind = "person"]',
    style: {
      'background-color': '#2dd4bf',
      shape: 'ellipse',
      'border-width': 2,
      'border-color': '#0f766e',
    },
  },
  {
    selector: 'node[kind = "seedCandidate"]',
    style: {
      'background-color': '#c4b5fd',
      shape: 'ellipse',
      'border-width': 2,
      'border-color': '#7c3aed',
      opacity: 0.92,
    },
  },
  {
    selector: 'node[graphLayer = "Both"]',
    style: {
      'border-width': 3,
      'border-color': '#f59e0b',
    },
  },
  {
    selector: 'node[kind = "institution"]',
    style: {
      'background-color': '#e2e8f0',
      shape: 'round-rectangle',
      'border-width': 1,
      'border-color': '#64748b',
    },
  },
  {
    selector: 'node[kind = "opportunity"]',
    style: {
      'background-color': '#fde68a',
      shape: 'diamond',
      'border-width': 2,
      'border-color': '#ea580c',
    },
  },
  {
    selector: 'node[kind = "campaign"]',
    style: {
      'background-color': '#ddd6fe',
      shape: 'round-octagon',
      'border-width': 1,
      'border-color': '#7c3aed',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 'mapData(weight, 0, 8, 1, 6)',
      'line-color': '#94a3b8',
      'target-arrow-color': '#94a3b8',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      opacity: 'mapData(recencyScore, 0, 3, 0.35, 0.9)',
    },
  },
  {
    selector: 'edge[kind = "research_context"]',
    style: {
      'line-style': 'dashed',
      'line-color': '#a78bfa',
      'target-arrow-color': '#a78bfa',
    },
  },
]

export type GraphExplorerProps = {
  surface: DccNetworkGraphSurface
  mode?: DccGraphMode
  visibility?: DccGraphVisibility
  className?: string
  showModeToggle?: boolean
  admin?: boolean
}

export function GraphExplorer({
  surface,
  mode: initialMode = 'active',
  visibility = 'public',
  className,
  showModeToggle = true,
  admin = false,
}: GraphExplorerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const [mode, setMode] = useState<DccGraphMode>(initialMode)
  const [payload, setPayload] = useState<DccNetworkGraphPayload | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [tip, setTip] = useState<TooltipState>(null)
  const [selected, setSelected] = useState<DccGraphNodeData | null>(null)
  const [filters, setFilters] = useState<GraphClientFilters>(EMPTY_GRAPH_FILTERS)

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const params = new URLSearchParams({
          surface,
          mode,
          visibility: admin ? 'internal' : visibility,
        })
        const res = await fetch(`/api/marketing/dcc-network-graph?${params}`)
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as DccNetworkGraphPayload
        if (!cancelled) {
          setPayload(data)
          setLoadError(null)
        }
      } catch {
        if (!cancelled) {
          setLoadError('Could not load network data.')
          setPayload(null)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [surface, mode, visibility, admin])

  const graphNodes = useMemo(
    () =>
      (payload?.elements ?? [])
        .filter((e): e is { data: DccGraphNodeData } => 'kind' in e.data && !('source' in e.data))
        .map((e) => e.data),
    [payload]
  )

  const runLayout = useCallback((cy: Core) => {
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 600,
      padding: 24,
      nodeRepulsion: 8000,
      idealEdgeLength: 90,
    }).run()
  }, [])

  useEffect(() => {
    if (!payload?.elements?.length || !hostRef.current) return

    let cancelled = false
    void import('cytoscape').then((mod) => {
      if (cancelled || !hostRef.current) return
      const cytoscape = mod.default
      cyRef.current?.destroy()
      const cy = cytoscape({
        container: hostRef.current,
        elements: cytoscapeElementsFromPayload(payload.elements as Array<{ data: Record<string, unknown> }>) as cytoscape.ElementDefinition[],
        style: cytoscapeStylesheet,
        minZoom: 0.2,
        maxZoom: 2.5,
        wheelSensitivity: 0.35,
      })
      cyRef.current = cy

      cy.on('mouseover', 'node', (evt) => {
        const e = evt.originalEvent as MouseEvent | undefined
        const box = hostRef.current?.getBoundingClientRect()
        if (!e || !box) return
        setTip({
          x: e.clientX - box.left + 8,
          y: e.clientY - box.top + 8,
          node: evt.target.data() as DccGraphNodeData,
        })
      })
      cy.on('mouseout', 'node', () => setTip(null))
      cy.on('tap', 'node', (evt) => setSelected(evt.target.data() as DccGraphNodeData))
      cy.on('tap', (evt) => {
        if (evt.target === cy) setSelected(null)
      })

      runLayout(cy)
    })

    return () => {
      cancelled = true
      cyRef.current?.destroy()
      cyRef.current = null
    }
  }, [payload, runLayout])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.batch(() => {
      cy.nodes().forEach((n) => {
        const d = n.data() as DccGraphNodeData
        n.style('opacity', nodeMatchesFilters(d, filters) ? 1 : 0.12)
      })
      cy.edges().forEach((e) => {
        const sd = e.source().data() as DccGraphNodeData
        const td = e.target().data() as DccGraphNodeData
        e.style('opacity', nodeMatchesFilters(sd, filters) && nodeMatchesFilters(td, filters) ? 0.55 : 0.06)
      })
    })
  }, [filters, payload])

  return (
    <div className={cn('relative flex flex-col', className)}>
      <GraphFilterBar
        nodes={graphNodes}
        mode={mode}
        filters={filters}
        onModeChange={showModeToggle ? setMode : undefined}
        onFiltersChange={setFilters}
        showModeToggle={showModeToggle}
        admin={admin}
        className="mb-3"
      />

      {loadError ? <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p> : null}

      <div className="relative min-h-[min(85dvh,720px)] w-full flex-1 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div ref={hostRef} className="h-full min-h-[min(85dvh,720px)] w-full" />

        {tip ? (
          <div
            className="pointer-events-none absolute z-20 max-w-xs rounded-md border border-neutral-200 bg-white/95 px-3 py-2 text-xs text-neutral-800 shadow-lg dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100"
            style={{ left: tip.x, top: tip.y }}
          >
            <GraphNodeTooltip node={tip.node} />
          </div>
        ) : null}

        {selected ? (
          <aside className="absolute bottom-0 right-0 top-0 z-10 w-full max-w-sm overflow-y-auto border-l border-neutral-200 bg-white/95 p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-950/95 sm:w-80">
            <GraphNodeCard node={selected} mode={mode} onClose={() => setSelected(null)} />
          </aside>
        ) : null}
      </div>

      {payload ? (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {payload.meta.source === 'fixture' ? 'Sample data' : 'Live CRM'} · {payload.meta.mode} ·{' '}
          {payload.meta.nodeCount} nodes · {payload.meta.edgeCount} links
        </p>
      ) : null}
    </div>
  )
}
