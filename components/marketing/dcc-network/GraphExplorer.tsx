'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Core, Stylesheet } from 'cytoscape'
import type { DccGraphNodeData, DccNetworkGraphPayload, DccNetworkGraphSurface } from '@/lib/marketing/dcc-crm-graph-types'
import { cn } from '@/lib/utils'

type TooltipState = { x: number; y: number; html: string } | null

const cytoscapeStylesheet: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'font-size': 11,
      'text-wrap': 'wrap',
      'text-max-width': 96,
      color: '#171717',
      'text-valign': 'center',
      'text-halign': 'center',
    },
  },
  {
    selector: 'node[kind = "person"]',
    style: {
      'background-color': '#2dd4bf',
      width: 32,
      height: 32,
      shape: 'ellipse',
      'border-width': 2,
      'border-color': '#0f766e',
    },
  },
  {
    selector: 'node[kind = "institution"]',
    style: {
      'background-color': '#e2e8f0',
      width: 52,
      height: 44,
      shape: 'round-rectangle',
      'border-width': 1,
      'border-color': '#64748b',
    },
  },
  {
    selector: 'node[kind = "opportunity"]',
    style: {
      'background-color': '#fde68a',
      width: 36,
      height: 36,
      shape: 'diamond',
      'border-width': 2,
      'border-color': '#ea580c',
    },
  },
  {
    selector: 'node[kind = "campaign"]',
    style: {
      'background-color': '#ddd6fe',
      width: 40,
      height: 40,
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
]

export function GraphExplorer({
  surface,
  className,
}: {
  surface: DccNetworkGraphSurface
  className?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const [payload, setPayload] = useState<DccNetworkGraphPayload | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [tip, setTip] = useState<TooltipState>(null)
  const [selected, setSelected] = useState<DccGraphNodeData | null>(null)
  const [search, setSearch] = useState('')
  const [filterMiami, setFilterMiami] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(`/api/marketing/dcc-network-graph?surface=${encodeURIComponent(surface)}`)
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
  }, [surface])

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
        elements: payload.elements as cytoscape.ElementDefinition[],
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
        const d = evt.target.data() as DccGraphNodeData
        const lines = [
          `<strong>${d.label}</strong>`,
          d.kind,
          d.contactCategory ? `Category: ${d.contactCategory}` : '',
          d.warmth ? `Warmth: ${d.warmth}` : '',
          d.city ? `City: ${d.city}` : '',
          d.opportunityStatus ? `Status: ${d.opportunityStatus}` : '',
        ].filter(Boolean)
        setTip({ x: e.clientX - box.left + 8, y: e.clientY - box.top + 8, html: lines.join('<br/>') })
      })
      cy.on('mouseout', 'node', () => setTip(null))

      cy.on('tap', 'node', (evt) => {
        setSelected(evt.target.data() as DccGraphNodeData)
      })
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
    const q = search.trim().toLowerCase()
    const visible = (d: DccGraphNodeData) => {
      const label = (d.label ?? '').toLowerCase()
      const match = !q || label.includes(q)
      const miamiOk = !filterMiami || d.miami === true
      return match && miamiOk
    }
    cy.batch(() => {
      cy.nodes().forEach((n) => {
        const d = n.data() as DccGraphNodeData
        n.style('opacity', visible(d) ? 1 : 0.12)
      })
      cy.edges().forEach((e) => {
        const sd = e.source().data() as DccGraphNodeData
        const td = e.target().data() as DccGraphNodeData
        e.style('opacity', visible(sd) && visible(td) ? 0.55 : 0.06)
      })
    })
  }, [search, filterMiami, payload])

  return (
    <div className={cn('relative flex flex-col', className)}>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterMiami((v) => !v)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition',
              filterMiami
                ? 'border-[var(--cdc-teal)] bg-[var(--cdc-teal)]/15 text-neutral-900 dark:text-neutral-100'
                : 'border-neutral-200 bg-white text-neutral-600 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300'
            )}
          >
            Miami
          </button>
          {surface === 'explorer' ? (
            <Link
              href="/programs"
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"
            >
              Programs
            </Link>
          ) : null}
        </div>
      </div>

      {loadError ? (
        <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
      ) : null}

      <div className="relative min-h-[min(85dvh,720px)] w-full flex-1 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div ref={hostRef} className="h-full min-h-[min(85dvh,720px)] w-full" />

        {tip ? (
          <div
            className="pointer-events-none absolute z-20 max-w-xs rounded-md border border-neutral-200 bg-white/95 px-3 py-2 text-xs text-neutral-800 shadow-lg dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100"
            style={{ left: tip.x, top: tip.y }}
            dangerouslySetInnerHTML={{ __html: tip.html }}
          />
        ) : null}

        {selected ? (
          <aside className="absolute bottom-0 right-0 top-0 z-10 w-full max-w-sm border-l border-neutral-200 bg-white/95 p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-950/95 sm:w-80">
            <button
              type="button"
              className="mb-3 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.label}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">{selected.kind}</p>
            <dl className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              {selected.contactCategory ? (
                <div>
                  <dt className="text-xs text-neutral-400">Category</dt>
                  <dd>{selected.contactCategory}</dd>
                </div>
              ) : null}
              {selected.warmth ? (
                <div>
                  <dt className="text-xs text-neutral-400">Warmth</dt>
                  <dd>{selected.warmth}</dd>
                </div>
              ) : null}
              {selected.city ? (
                <div>
                  <dt className="text-xs text-neutral-400">City</dt>
                  <dd>{selected.city}</dd>
                </div>
              ) : null}
              {selected.relationshipStrength ? (
                <div>
                  <dt className="text-xs text-neutral-400">Relationship</dt>
                  <dd>{selected.relationshipStrength}</dd>
                </div>
              ) : null}
              {selected.deadline ? (
                <div>
                  <dt className="text-xs text-neutral-400">Deadline</dt>
                  <dd>{selected.deadline}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/contact"
                className="rounded-lg bg-neutral-900 px-3 py-2 text-center text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                Contact DCC
              </Link>
              {surface === 'home' ? (
                <Link
                  href="/network"
                  className="text-center text-sm text-[var(--cdc-teal)] underline-offset-4 hover:underline"
                >
                  Open network explorer
                </Link>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>

      {payload ? (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {payload.meta.source === 'fixture' ? 'Sample data' : 'Live CRM'} · {payload.meta.nodeCount} nodes ·{' '}
          {payload.meta.edgeCount} links
        </p>
      ) : null}
    </div>
  )
}
