'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ForceGraph3DInstance, LinkObject, NodeObject } from '3d-force-graph'
import { useTheme } from '@/contexts/ThemeContext'
import { presenceSpherePosition } from '@/lib/dcc/artwork/member-presence'
import { makePeoplePracticeGraph } from '@/lib/dcc/artwork/people-practice-graph'
import PeopleNetwork2D from './PeopleNetwork2D'

type FieldNode = NodeObject & {
  id: string
  label: string
  kind: 'public-cofounder' | 'public-artist' | 'anonymous-presence' | 'practice' | 'poll-selection'
  choiceId?: string
  count?: number
}
type FieldEdge = LinkObject<FieldNode> & {
  kind: 'documented-cofounding' | 'listed-practice' | 'aggregate-poll-selection'
  choiceId?: string
}
export type PeopleNetworkFieldProps = {
  selected: string | null
  onSelect: (id: string | null) => void
}
const POSITIONS: Record<string, { x: number; y: number; z: number }> = {
  'moises-sanabria': { x: -42, y: 0, z: 18 },
  'fabiola-larios': { x: 42, y: 0, z: 18 },
  'angelo-caruso': { x: 0, y: 62, z: 18 },
}

function buildGraph() {
  const data = makePeoplePracticeGraph()
  const anonymousCount = data.marks.filter((mark) => mark.kind === 'anonymous-presence').length
  let anonymousIndex = 0
  const nodes: FieldNode[] = data.marks.map((mark) => {
    const position = mark.kind === 'anonymous-presence'
      ? presenceSpherePosition(anonymousIndex++, anonymousCount, 132)
      : POSITIONS[mark.id] ?? { x: 0, y: 0, z: 0 }
    return {
      id: mark.id, label: mark.label, kind: mark.kind,
      ...position, fx: position.x, fy: position.y, fz: position.z,
    }
  })
  data.practices.forEach((practice, index) => {
    const theta = -Math.PI / 2 + index * Math.PI * 2 / data.practices.length
    const position = { x: Math.cos(theta) * 215, y: Math.sin(theta) * 180, z: -9 }
    nodes.push({
      id: practice.id, label: practice.short, kind: 'practice',
      choiceId: practice.choiceId, count: practice.count,
      ...position, fx: position.x, fy: position.y, fz: position.z,
    })
  })
  // Selection marks orbit their category; they are counts, not person identities.
  data.pollSelections.forEach((selection) => {
    const hub = nodes.find((node) => node.id === 'practice-' + selection.choiceId)
    if (!hub) return
    const index = Number(selection.id.split('-').pop() ?? '1') - 1
    const total = data.practices.find((practice) => practice.choiceId === selection.choiceId)?.count ?? 1
    const angle = index * Math.PI * (3 - Math.sqrt(5))
    const radius = 33 + Math.sqrt((index + 0.5) / total) * 42
    const position = {
      x: (hub.x ?? 0) + Math.cos(angle) * radius,
      y: (hub.y ?? 0) + Math.sin(angle) * radius,
      z: (hub.z ?? 0) + Math.sin(index * 2.3) * 26,
    }
    nodes.push({
      id: selection.id, label: 'Anonymous poll selection',
      kind: 'poll-selection', choiceId: selection.choiceId,
      ...position, fx: position.x, fy: position.y, fz: position.z,
    })
  })
  const links: FieldEdge[] = [
    ...data.connections.map((edge) => ({ source: edge.from, target: edge.to, kind: edge.kind })),
    ...data.practiceEdges.map((edge) => ({ source: edge.source, target: edge.target, kind: edge.kind })),
    ...data.pollEdges.map((edge) => ({
      source: edge.source, target: edge.target, kind: edge.kind,
      choiceId: edge.target.slice('practice-'.length),
    })),
  ]
  return { nodes, links }
}
function endpointId(value: string | number | FieldNode | undefined): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value?.id ?? ''
}

/**
 * Stable, low-risk WebGL view. The previous implementation added a custom
 * THREE.CanvasTexture/TorusGeometry to every category/artist. Those custom
 * objects execute inside WebGL's asynchronous render loop, outside React's
 * error handling. Keep the real people/practice model, but use built-in
 * 3d-force-graph spheres and HTML category labels until browser QA confirms
 * the custom geometry can be reintroduced safely.
 *
 * On touch devices, show the functional lightweight view by default and
 * allow opt-in WebGL. A phone must never need WebGL to access the network.
 */
export default function PeopleNetworkField({ selected, onSelect }: PeopleNetworkFieldProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<ForceGraph3DInstance<FieldNode, FieldEdge> | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const { resolvedTheme } = useTheme()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const data = useMemo(buildGraph, [])

  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse), (max-width: 640px)').matches
    setEnabled(!touch)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element || !enabled) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '120px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [enabled])

  useEffect(() => {
    const element = elementRef.current
    if (!enabled || !visible || !element || failed) return
    let disposed = false
    let resize: ResizeObserver | undefined
    let visibilityListener: (() => void) | undefined
    let contextLossListener: ((event: Event) => void) | undefined
    let instance: ForceGraph3DInstance<FieldNode, FieldEdge> | null = null

    void import('3d-force-graph').then(({ default: ForceGraph3D }) => {
      if (disposed) return
      try {
        instance = new ForceGraph3D(element, {
          controlType: 'orbit',
          rendererConfig: { antialias: true, alpha: true },
        }) as unknown as ForceGraph3DInstance<FieldNode, FieldEdge>
        const graph = instance
        graphRef.current = graph
        const style = getComputedStyle(element)
        graph
          .backgroundColor(style.getPropertyValue('--dn-graph-bg').trim() || '#091313')
          .showNavInfo(false)
          .graphData({ nodes: data.nodes, links: data.links })
          .nodeResolution(11)
          .nodeRelSize(2.7)
          .nodeVal((node) => node.kind === 'practice' ? 11 : node.kind === 'poll-selection' ? 1.2 : node.kind === 'anonymous-presence' ? 0.75 : 4)
          .nodeOpacity(0.96)
          .nodeLabel((node) => {
            const label = document.createElement('span')
            label.className = 'dn-node-tooltip'
            label.textContent = node.kind === 'practice'
              ? node.label + ' · ' + node.count + ' anonymous poll selection connections'
              : node.kind === 'poll-selection'
                ? 'An unattributed poll selection · category totals do not identify unique voters'
                : node.kind === 'anonymous-presence'
                  ? 'Anonymous member-presence mark · not a known voter'
                  : node.label + ' · public artist profile'
            return label
          })
          .linkWidth((link) => link.kind === 'documented-cofounding' ? 2.2 : link.kind === 'aggregate-poll-selection' ? 0.95 : 1.1)
          .linkOpacity(0.75)
          .linkLabel((link) => link.kind === 'documented-cofounding'
            ? 'DCC cofounding'
            : link.kind === 'aggregate-poll-selection'
              ? 'One aggregate poll selection, voter unknown'
              : 'Public editorial practice, not a poll response')
          .onNodeClick((node) => onSelectRef.current(node.kind === 'anonymous-presence' ? null : node.kind === 'poll-selection' ? 'practice-' + node.choiceId : node.id))
          .onNodeHover((node) => { element.style.cursor = node && node.kind !== 'anonymous-presence' ? 'pointer' : 'grab' })
          .cooldownTicks(0)

        // Not every browser or rendering implementation supports these
        // optional optimizations. Never let them crash the page.
        try {
          const renderer = graph.renderer()
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
          if (window.matchMedia('(pointer: coarse)').matches) renderer.domElement.style.touchAction = 'pan-y'
          contextLossListener = (event: Event) => {
            event.preventDefault()
            if (!disposed) { setFailed(true); setReady(false) }
          }
          renderer.domElement.addEventListener('webglcontextlost', contextLossListener)
        } catch { /* Keep the graph without renderer-specific tuning. */ }

        if (typeof ResizeObserver !== 'undefined') {
          resize = new ResizeObserver(() => {
            if (disposed) return
            const { width, height } = element.getBoundingClientRect()
            if (width > 0 && height > 0) graph.width(width).height(height)
          })
          resize.observe(element)
        } else {
          graph.width(Math.max(320, element.clientWidth)).height(Math.max(350, element.clientHeight))
        }
        visibilityListener = () => {
          if (document.hidden) graph.pauseAnimation()
          else graph.resumeAnimation()
        }
        document.addEventListener('visibilitychange', visibilityListener)
        graph.zoomToFit(0, 65)
        setReady(true)
      } catch (error) {
        console.error('[network-graph] WebGL initialization failed', error)
        if (!disposed) { setFailed(true); setReady(false) }
      }
    }).catch((error) => {
      console.error('[network-graph] Module failed to load', error)
      if (!disposed) { setFailed(true); setReady(false) }
    })

    return () => {
      disposed = true
      resize?.disconnect()
      if (visibilityListener) document.removeEventListener('visibilitychange', visibilityListener)
      if (contextLossListener && instance) {
        try { instance.renderer().domElement.removeEventListener('webglcontextlost', contextLossListener) } catch { /* context already gone */ }
      }
      try { instance?._destructor() } catch { /* WebGL context may be lost */ }
      graphRef.current = null
      element.replaceChildren()
    }
  }, [data, enabled, failed, visible])

  useEffect(() => {
    const graph = graphRef.current
    if (!ready || !graph) return
    try {
      const style = elementRef.current ? getComputedStyle(elementRef.current) : null
      const theme = (property: string, fallback: string) =>
        style?.getPropertyValue(property).trim() || fallback
      graph.backgroundColor(theme('--dn-graph-bg', '#091313'))
      graph.nodeVal((node) => node.id === selected ? 14 : node.kind === 'practice' ? 11 : node.kind === 'poll-selection' ? 1.2 : node.kind === 'anonymous-presence' ? 0.75 : 4)
      graph.nodeColor((node) => {
        if (node.id === selected) return theme('--dn-graph-selected', '#f4dda5')
        if (node.kind === 'practice' || node.kind === 'poll-selection') return theme('--dn-poll-' + (node.choiceId ?? 'art'), '#8fae95')
        if (node.kind === 'anonymous-presence') return theme('--dn-graph-node', '#9bb5a8')
        return theme('--dn-graph-founder', '#e1edd4')
      })
      graph.linkColor((link) => {
        if (selected && [endpointId(link.source), endpointId(link.target)].includes(selected)) {
          return theme('--dn-graph-selected', '#f4dda5')
        }
        if (link.kind === 'aggregate-poll-selection') {
          return theme('--dn-poll-' + (link.choiceId ?? 'art'), '#8fae95')
        }
        return link.kind === 'documented-cofounding'
          ? theme('--dn-graph-link', '#d1ecbb')
          : theme('--dn-graph-muted', '#88baa0')
      })
      if (selected) {
        const point = data.nodes.find((node) => node.id === selected)
        if (point) {
          graph.cameraPosition(
            { x: (point.x ?? 0) + 60, y: (point.y ?? 0) + 30, z: (point.z ?? 0) + 175 },
            { x: point.x ?? 0, y: point.y ?? 0, z: point.z ?? 0 },
            reducedMotion ? 0 : 450,
          )
        }
      } else {
        graph.zoomToFit(reducedMotion ? 0 : 450, 65)
      }
    } catch (error) {
      console.error('[network-graph] View update failed', error)
      setFailed(true)
      setReady(false)
    }
  }, [data, ready, reducedMotion, resolvedTheme, selected])

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      {(!enabled || failed) && (
        <div className="min-h-0 flex-1">
          <PeopleNetwork2D selected={selected} onSelect={onSelect} />
        </div>
      )}
      <div ref={elementRef}
        className={'dn-network-field min-h-0 w-full flex-1 ' + (enabled && !failed ? '' : 'hidden')}
        role="img"
        aria-label="3D network: reported people as neutral spheres, six large colored practice hubs and 72 anonymous poll-selection spokes. Selections are not unique voter identities."
      />
      {enabled && !ready && !failed && (
        <p className="pointer-events-none absolute bottom-16 left-4 text-xs text-[color:var(--dn-graph-muted)]" role="status">
          Opening 3D…
        </p>
      )}
      <div className="flex shrink-0 items-center justify-end px-4 pb-3 pt-1">
        {failed ? (
          <span className="text-xs text-[color:var(--dn-graph-muted)]">2D network</span>
        ) : (
          <button type="button"
            onClick={() => {
              setReady(false)
              setVisible(false)
              setEnabled((current) => !current)
            }}
            className="min-h-10 rounded-full border border-[color:var(--dn-line-strong)] bg-[var(--dn-graph-chip)] px-4 py-2 text-xs font-medium text-[color:var(--dn-on-graph)] transition hover:bg-[var(--dn-hover)]">
            {enabled ? 'View 2D' : 'Explore 3D'}
          </button>
        )}
      </div>
    </div>
  )
}
