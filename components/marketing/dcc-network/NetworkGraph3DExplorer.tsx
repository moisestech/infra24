'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { GraphNodeCard } from '@/components/marketing/dcc-network/GraphNodeCard'
import type { DccGraphMode, DccGraphNodeData, DccNetworkGraphPayload } from '@/lib/marketing/dcc-crm-graph-types'
import {
  buildGraph3D,
  getEgoNetwork,
  LAYOUT_MODE_LABELS,
  nextLayoutMode,
  type LayoutMode,
} from '@/lib/marketing/network-graph-3d-layout'
import type { ColorTheme } from '@/lib/marketing/network-graph-3d-style'
import { NetworkGraph3D, resetNetworkGraphCamera } from '@/components/marketing/dcc-network/NetworkGraph3D'
import { cn } from '@/lib/utils'

const COLOR_THEMES: { id: ColorTheme; label: string }[] = [
  { id: 'kind', label: 'By type' },
  { id: 'warmth', label: 'By warmth' },
  { id: 'recency', label: 'By recency' },
]

export function NetworkGraph3DExplorer({ initialMode = 'combined' }: { initialMode?: DccGraphMode }) {
  const [mode, setMode] = useState<DccGraphMode>(initialMode)
  const [payload, setPayload] = useState<DccNetworkGraphPayload | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterMiami, setFilterMiami] = useState(false)
  const [selected, setSelected] = useState<DccGraphNodeData | null>(null)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('organic')
  const [colorTheme, setColorTheme] = useState<ColorTheme>('kind')
  const [paused, setPaused] = useState(false)
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null)
  const [pulseOriginId, setPulseOriginId] = useState<string | null>(null)
  const [pulseStartTime, setPulseStartTime] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(
          `/api/marketing/dcc-network-graph?surface=explorer&mode=${encodeURIComponent(mode)}&visibility=public`
        )
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
  }, [mode])

  const graph = useMemo(() => {
    if (!payload) return null
    return buildGraph3D(payload, layoutMode, colorTheme)
  }, [payload, layoutMode, colorTheme])

  const highlightedIds = useMemo(() => {
    if (!selected || !graph) return new Set<string>()
    return getEgoNetwork(selected.id, graph.adjacency)
  }, [selected, graph])

  const searchFilteredNodes = useMemo(() => {
    if (!graph) return []
    const q = search.trim().toLowerCase()
    return graph.nodes.filter((n) => {
      const label = (n.data.displayLabel ?? n.data.label ?? '').toLowerCase()
      const match = !q || label.includes(q)
      const miamiOk = !filterMiami || n.data.miami === true
      return match && miamiOk
    })
  }, [graph, search, filterMiami])

  const handleSelectNode = useCallback(
    (id: string | null) => {
      if (!id || !graph) {
        setSelected(null)
        setPulseOriginId(null)
        setPulseStartTime(null)
        return
      }
      const node = graph.nodes.find((n) => n.id === id)
      if (!node) return
      setSelected(node.data)
      setPulseOriginId(id)
      setPulseStartTime(Date.now() / 1000)
    },
    [graph]
  )

  const handleSearchPick = useCallback(
    (nodeId: string) => {
      if (!graph) return
      const node = graph.nodes.find((n) => n.id === nodeId)
      if (!node) return
      setSelected(node.data)
      setFocusNodeId(nodeId)
      setPulseOriginId(nodeId)
      setPulseStartTime(Date.now() / 1000)
    },
    [graph]
  )

  const morphLayout = useCallback(() => {
    setLayoutMode((m) => nextLayoutMode(m))
    resetNetworkGraphCamera()
  }, [])

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#050508] text-white">
      <div className="absolute inset-0 z-0">
        {graph ? (
          <NetworkGraph3D
            nodes={graph.nodes}
            edges={graph.edges}
            selectedId={selected?.id ?? null}
            highlightedIds={highlightedIds}
            searchQuery={search}
            filterMiami={filterMiami}
            paused={paused}
            pulseOriginId={pulseOriginId}
            pulseStartTime={pulseStartTime}
            onSelectNode={handleSelectNode}
            focusNodeId={focusNodeId}
            onFocusComplete={() => setFocusNodeId(null)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" aria-hidden />
          </div>
        )}
      </div>

      {/* Top-left instructions */}
      <div className="glass-panel pointer-events-auto absolute left-4 top-4 z-10 max-w-[280px] p-5 sm:left-8 sm:top-8">
        <div className="bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-lg font-medium tracking-tight text-transparent">
          Miami cultural field
        </div>
        <p className="mt-2 text-sm font-light leading-relaxed text-white/60">
          Search a name · drag to explore · click a node to inspect its connections.
        </p>
        {loadError ? <p className="mt-2 text-xs text-red-400">{loadError}</p> : null}
        {payload ? (
          <p className="mt-2 text-xs text-white/40">
            {payload.meta.source === 'fixture' ? 'Sample data' : 'Live CRM'} · {graph?.nodes.length ?? 0} nodes ·{' '}
            {graph?.edges.length ?? 0} links
          </p>
        ) : null}
      </div>

      {/* Top-right theme + search */}
      <div className="glass-panel pointer-events-auto absolute right-4 top-4 z-10 flex w-[min(100%,280px)] flex-col gap-3 p-5 sm:right-8 sm:top-8">
        <div className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">Search</div>
        <input
          type="search"
          placeholder="Name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none"
          list="network-node-suggestions"
        />
        <datalist id="network-node-suggestions">
          {searchFilteredNodes.slice(0, 12).map((n) => (
            <option key={n.id} value={n.data.label} />
          ))}
        </datalist>
        {search.trim() && searchFilteredNodes.length > 0 ? (
          <ul className="max-h-32 overflow-y-auto rounded-lg border border-white/10 bg-black/40 text-sm">
            {searchFilteredNodes.slice(0, 8).map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-white/10"
                  onClick={() => handleSearchPick(n.id)}
                >
                  {n.data.label}
                  <span className="ml-2 text-xs text-white/40">{n.data.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">Color by</div>
        <div className="flex flex-wrap gap-2">
          {COLOR_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setColorTheme(t.id)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs transition',
                colorTheme === t.id
                  ? 'border-white/60 bg-white/15 text-white'
                  : 'border-white/15 text-white/60 hover:border-white/30'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {(['active', 'research', 'combined'] as DccGraphMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'rounded-full border px-2 py-1 text-[10px] uppercase tracking-wide transition',
                mode === m
                  ? 'border-teal-400/60 bg-teal-400/15 text-teal-200'
                  : 'border-white/15 text-white/50 hover:border-white/30'
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setFilterMiami((v) => !v)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium transition',
            filterMiami
              ? 'border-teal-400/60 bg-teal-400/15 text-teal-200'
              : 'border-white/15 text-white/60 hover:border-white/30'
          )}
        >
          Miami only
        </button>
      </div>

      {/* Bottom controls */}
      <div className="pointer-events-auto absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-3 sm:bottom-10">
        <button type="button" className="control-button" onClick={morphLayout}>
          {LAYOUT_MODE_LABELS[layoutMode]}
        </button>
        <button type="button" className="control-button" onClick={() => setPaused((p) => !p)}>
          {paused ? 'Play' : 'Freeze'}
        </button>
        <button type="button" className="control-button" onClick={() => resetNetworkGraphCamera()}>
          Reset
        </button>
      </div>

      {/* Cross-link */}
      <div className="pointer-events-auto absolute bottom-6 left-4 z-10 sm:bottom-10 sm:left-8">
        <Link
          href="/network"
          className="text-xs text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
        >
          Map explorer →
        </Link>
      </div>

      {/* Detail panel */}
      {selected ? (
        <aside className="glass-panel pointer-events-auto absolute bottom-0 right-0 top-0 z-20 w-full max-w-sm overflow-y-auto border-l border-white/10 p-5 text-white sm:w-80 [&_*]:text-inherit [&_a]:text-teal-300">
          <GraphNodeCard node={selected} mode={mode} onClose={() => setSelected(null)} compact />
        </aside>
      ) : null}

      <style jsx global>{`
        .glass-panel {
          backdrop-filter: blur(24px) saturate(120%);
          -webkit-backdrop-filter: blur(24px) saturate(120%);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
        }
        .control-button {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          min-width: 90px;
        }
        .control-button:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.35);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
