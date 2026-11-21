'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ForceGraph3DInstance, LinkObject, NodeObject } from '3d-force-graph'
import { useTheme } from '@/contexts/ThemeContext'
import { presenceSpherePosition } from '@/lib/dcc/artwork/member-presence'
import { makePeoplePracticeGraph } from '@/lib/dcc/artwork/people-practice-graph'
import { NetworkGraphFallback } from './NetworkGraphBoundary'

type FieldNode = NodeObject & {
  id: string
  label: string
  kind: 'public-cofounder' | 'public-artist' | 'anonymous-presence' | 'practice'
  choiceId?: string
  count?: number
}
type FieldEdge = LinkObject<FieldNode> & {
  kind: 'documented-cofounding' | 'listed-practice'
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
  const links: FieldEdge[] = [
    ...data.connections.map((edge) => ({ source: edge.from, target: edge.to, kind: edge.kind })),
    ...data.practiceEdges.map((edge) => ({ source: edge.source, target: edge.target, kind: edge.kind })),
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
          .nodeVal((node) => node.kind === 'practice' ? 9 : node.kind === 'anonymous-presence' ? 0.75 : 4)
          .nodeOpacity(0.96)
          .nodeLabel((node) => {
            const label = document.createElement('span')
            label.className = 'dn-node-tooltip'
            label.textContent = node.kind === 'practice'
              ? node.label + ' · ' + node.count + ' community poll selections'
              : node.kind === 'anonymous-presence'
                ? 'Anonymous member-presence mark'
                : node.label + ' · public artist profile'
            return label
          })
          .linkWidth((link) => link.kind === 'documented-cofounding' ? 2.2 : 1.1)
          .linkOpacity(0.75)
          .linkLabel((link) => link.kind === 'documented-cofounding'
            ? 'DCC cofounding'
            : 'Public profile practice, not a poll vote')
          .onNodeClick((node) => onSelectRef.current(node.kind === 'anonymous-presence' ? null : node.id))
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
      graph.nodeVal((node) => node.id === selected ? 12 : node.kind === 'practice' ? 9 : node.kind === 'anonymous-presence' ? 0.75 : 4)
      graph.nodeColor((node) => {
        if (node.id === selected) return theme('--dn-graph-selected', '#f4dda5')
        if (node.kind === 'practice') return theme('--dn-poll-' + (node.choiceId ?? 'art'), '#8fae95')
        if (node.kind === 'anonymous-presence') return theme('--dn-graph-node', '#9bb5a8')
        return theme('--dn-graph-founder', '#e1edd4')
      })
      graph.linkColor((link) =>
        selected && [endpointId(link.source), endpointId(link.target)].includes(selected)
          ? theme('--dn-graph-selected', '#f4dda5')
          : link.kind === 'documented-cofounding'
            ? theme('--dn-graph-link', '#d1ecbb')
            : theme('--dn-graph-muted', '#88baa0'))
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

  if (failed) return <NetworkGraphFallback />
  return (
    <div className="relative h-full w-full">
      {!enabled && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 overflow-y-auto p-3">
          <NetworkGraphFallback />
          <button type="button" onClick={() => setEnabled(true)}
            className="rounded-full border border-[color:var(--dn-line-strong)] bg-[var(--dn-accent)] px-5 py-3 text-xs font-medium text-[color:var(--dn-accent-ink)]">
            Explore 3D network
          </button>
        </div>
      )}
      <div ref={elementRef} className="dn-network-field h-full min-h-[350px] w-full"
        role="img" aria-label="Three-dimensional network of public artist nodes and six practice categories. Other member positions do not identify individual people." />
      {enabled && !ready && !failed && (
        <p className="pointer-events-none absolute bottom-5 left-5 text-xs text-[color:var(--dn-graph-muted)]" role="status">Opening the network…</p>
      )}
    </div>
  )
}
