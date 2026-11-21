'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ForceGraph3DInstance, LinkObject, NodeObject } from '3d-force-graph'
import { INTERESTS, type InterestId } from '@/lib/dcc/community/atlas'

/**
 * The artwork borrows the Community Atlas's Three.js/3d-force-graph renderer,
 * but never reads Airtable directly. All positions below are fictional.
 * Signal categories reflect the shape of DCC's SHOW / NEED / OFFER / VISIT /
 * OPPORTUNITY practices, NOT the number or identity of CRM records.
 */
export type ArtworkPerson = {
  id: string
  label: string
  interests: InterestId[]
  guest?: boolean
}
export type ArtworkRelationship = {
  from: string
  to: string
  kind: 'declared' | 'proposal' | 'mutual'
  color: string
}
export type ArtworkSignal = 'show' | 'need' | 'offer'

type GraphNode = NodeObject & {
  id: string
  kind: 'interest' | 'person' | 'signal'
  label: string
  color: string
  personId?: string
  guest?: boolean
}
type GraphLink = LinkObject<GraphNode> & {
  kind: 'declared' | 'proposal' | 'mutual' | 'signal'
  color: string
}

const SIGNAL_HUBS = [
  { id: 'show', label: 'SHOW · sharing work', color: '#c8dbc1' },
  { id: 'need', label: 'NEED · an open question', color: '#e1b697' },
  { id: 'offer', label: 'OFFER · available knowledge', color: '#b5d3cf' },
  { id: 'visit', label: 'VISIT · an encounter', color: '#ada8ce' },
  { id: 'opportunity', label: 'OPPORTUNITY · a possibility', color: '#d9cd9d' },
] as const

// Anonymous fictional positions; never treat them as real people or Airtable rows.
const SAMPLE_PEOPLE: ArtworkPerson[] = [
  { id: 'material', label: 'MATERIAL', interests: ['making', 'culture'] },
  { id: 'signal', label: 'SIGNAL', interests: ['image-sound', 'code-ai'] },
  { id: 'bridge', label: 'BRIDGE', interests: ['culture', 'exploring'] },
  { id: 'device', label: 'DEVICE', interests: ['interactive', 'code-ai'] },
  { id: 'process', label: 'PROCESS', interests: ['making', 'interactive'] },
  { id: 'guest', label: 'YOUR NODE', interests: ['making', 'code-ai'], guest: true },
]
const SAMPLE_CONNECTIONS: ArtworkRelationship[] = [
  { from: 'guest', to: 'bridge', kind: 'proposal', color: '#ebc87f' },
]
const SAMPLE_SIGNALS: Record<string, string> = {
  material: 'show',
  signal: 'offer',
  bridge: 'opportunity',
  device: 'need',
  process: 'visit',
}
const STYLE_BY_KIND: Record<GraphNode['kind'], string> = {
  interest: '#9ec9b0',
  person: '#c7ead7',
  signal: '#b5b9a5',
}

export type ArtworkForceFieldProps = {
  people?: ArtworkPerson[]
  relationships?: ArtworkRelationship[]
  guestSignal?: ArtworkSignal
  selected?: string | null
  onSelect?: (id: string) => void
  compact?: boolean
  paused?: boolean
}

function buildGraph(people: ArtworkPerson[], relationships: ArtworkRelationship[], guestSignal: ArtworkSignal) {
  const nodes: GraphNode[] = [
    ...INTERESTS.map((item) => ({
      id: 'hub:' + item.id, kind: 'interest' as const,
      label: item.short + ' · interest, not a person',
      color: item.color,
    })),
    ...SIGNAL_HUBS.map((signal) => ({
      id: 'signal:' + signal.id, kind: 'signal' as const,
      label: signal.label + ' · type of activity, not a person',
      color: signal.color,
    })),
    ...people.map((person) => ({
      id: 'person:' + person.id, kind: 'person' as const,
      label: person.label + (person.guest ? ' · editable fictional node' : ' · fictional position'),
      color: person.guest ? '#f5e4b4' : STYLE_BY_KIND.person,
      personId: person.id,
      guest: person.guest,
    })),
  ]
  const allowed = new Set(nodes.map((node) => node.id))
  const links: GraphLink[] = []
  for (const person of people) {
    for (const interest of person.interests) {
      const hub = INTERESTS.find((item) => item.id === interest)
      if (hub) links.push({
        source: 'person:' + person.id, target: 'hub:' + interest,
        kind: 'declared', color: hub.color,
      })
    }
    // These markers demonstrate DCC activity *types*, not private signal records.
    const activity = person.guest ? guestSignal : SAMPLE_SIGNALS[person.id]
    if (activity && SIGNAL_HUBS.some((signal) => signal.id === activity)) {
      links.push({
        source: 'person:' + person.id, target: 'signal:' + activity,
        kind: 'signal', color: '#839f91',
      })
    }
  }
  for (const relationship of relationships) {
    const source = 'person:' + relationship.from
    const target = 'person:' + relationship.to
    if (!allowed.has(source) || !allowed.has(target) || relationship.kind === 'declared') continue
    links.push({
      source, target, kind: relationship.kind,
      color: relationship.kind === 'mutual' ? '#f8d88a' : '#9e8662',
    })
  }
  return { nodes, links }
}

export default function ArtworkForceField({
  people = SAMPLE_PEOPLE,
  relationships = SAMPLE_CONNECTIONS,
  guestSignal = 'show',
  selected = null,
  onSelect,
  compact = false,
  paused = false,
}: ArtworkForceFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<ForceGraph3DInstance<GraphNode, GraphLink> | null>(null)
  const callbacksRef = useRef({ onSelect, paused, selected })
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const motionPaused = paused || reducedMotion
  callbacksRef.current = { onSelect, paused: motionPaused, selected }
  const data = useMemo(() => buildGraph(people, relationships, guestSignal), [people, relationships, guestSignal])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  // Defer WebGL setup until this part of the page is on screen.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '120px' })
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const element = hostRef.current
    if (!element) return
    let disposed = false
    let resize: ResizeObserver | undefined
    let onVisibility: (() => void) | undefined

    void import('3d-force-graph').then(({ default: ForceGraph3D }) => {
      if (disposed) return
      try {
        const instance = new ForceGraph3D(element, {
          controlType: 'orbit', rendererConfig: { antialias: true, alpha: true },
        }) as unknown as ForceGraph3DInstance<GraphNode, GraphLink>
        graphRef.current = instance
        instance
          .backgroundColor('#0a1719')
          .showNavInfo(false)
          .nodeRelSize(compact ? 2.4 : 3.7)
          .nodeResolution(18)
          .nodeOpacity(0.93)
          .nodeColor((node) => node.color)
          .nodeVal((node) =>
            node.guest ? 3.3 : node.kind === 'person' ? 1.8 : node.kind === 'signal' ? 1.35 : 1.15
          )
          .nodeLabel((node) => {
            const label = document.createElement('span')
            label.textContent = node.label // HTML is supported by the library: never insert member text as markup.
            return label
          })
          .linkColor((link) => link.color)
          .linkOpacity(0.62)
          .linkWidth((link) => link.kind === 'mutual' ? 2.2 : link.kind === 'proposal' ? 0.8 : 0.45)
          .linkLabel((link) =>
            link.kind === 'mutual'
              ? 'Hypothetical mutual approval · simulated, not a real collaboration'
              : link.kind === 'proposal'
                ? 'Unapproved hypothetical proposal · simulated'
                : link.kind === 'signal'
                  ? 'Illustrated activity type · not an individual CRM record'
                  : 'Declared interest · not an interpersonal relationship'
          )
          .onNodeClick((node) => {
            if (!node.personId || compact) return
            callbacksRef.current.onSelect?.(node.personId)
            const x = node.x ?? 0, y = node.y ?? 0, z = node.z ?? 0
            instance.cameraPosition(
              { x: x + 36, y: y + 18, z: z + 66 },
              { x, y, z },
              callbacksRef.current.paused ? 0 : 700
            )
          })
          .onNodeHover((node) => { element.style.cursor = node?.personId && !compact ? 'pointer' : 'grab' })
          .onNodeDragEnd((node) => { node.fx = node.x; node.fy = node.y; node.fz = node.z })
          .warmupTicks(90)
          .cooldownTicks(motionPaused ? 0 : 140)

        resize = new ResizeObserver(() => {
          const { width, height } = element.getBoundingClientRect()
          if (width && height) instance.width(width).height(height)
        })
        resize.observe(element)
        onVisibility = () => { if (document.hidden) instance.pauseAnimation(); else instance.resumeAnimation() }
        document.addEventListener('visibilitychange', onVisibility)
        instance.renderer().domElement.setAttribute(
          'aria-label',
          'Three-dimensional fictional network artwork. Use the node controls beside the graph for keyboard interaction.'
        )
        setReady(true)
      } catch {
        if (!disposed) setUnavailable(true)
      }
    }).catch(() => { if (!disposed) setUnavailable(true) })

    return () => {
      disposed = true
      resize?.disconnect()
      if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)
      graphRef.current?._destructor()
      graphRef.current = null
      element.replaceChildren()
    }
  }, [visible, compact])

  useEffect(() => {
    if (!ready || !graphRef.current) return
    const instance = graphRef.current
    const previous = new Map(instance.graphData().nodes.map((node) => [node.id, node]))
    instance.graphData({
      nodes: data.nodes.map((node) => Object.assign(previous.get(node.id) ?? {}, node)),
      links: data.links.map((link) => ({ ...link })),
    })
    // Preserve the camera as participants re-author the graph.
    instance.d3ReheatSimulation()
  }, [ready, data])

  useEffect(() => {
    if (!ready || !graphRef.current) return
    const instance = graphRef.current
    instance.nodeVal((node) =>
      node.personId === selected ? 4 : node.guest ? 3 : node.kind === 'person' ? 1.7 : 1.1
    )
    instance.cooldownTicks(motionPaused ? 0 : 140)
    if (!motionPaused) instance.d3ReheatSimulation()
  }, [ready, motionPaused, selected])

  return (
    <div className="relative h-full min-h-[340px] w-full">
      <div ref={hostRef} className="h-full min-h-[340px] w-full" role="img"
        aria-label="Three-dimensional force-directed illustration of fictional coauthor nodes, shared interests, and activity categories."
      />
      {!ready && !unavailable ? <p className="pointer-events-none absolute bottom-5 left-5 text-xs text-white/55" role="status">Preparing the 3D network…</p> : null}
      {unavailable ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a1719] p-6 text-center text-sm text-white/75" role="status">
          3D graphics are unavailable in this browser. Use the accessible node editor and fabrication study below.
        </div>
      ) : null}
    </div>
  )
}
