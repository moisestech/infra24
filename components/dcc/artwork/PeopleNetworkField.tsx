'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ForceGraph3DInstance, LinkObject, NodeObject } from '3d-force-graph'
import { makeIllustrativePeopleGraph, colorForPerson, type LocalExperiment } from '@/lib/dcc/artwork/people-graph'
import { makeMembershipPresenceGraph, presenceSpherePosition } from '@/lib/dcc/artwork/member-presence'
import type { PatternLens } from '@/lib/dcc/artwork/network-patterns'

export type { LocalExperiment as LocalNode } from '@/lib/dcc/artwork/people-graph'
type PersonNode = NodeObject & {
  id: string
  label: string
  color: string
  local: boolean
}
type ConnectionLink = LinkObject<PersonNode> & {
  kind: 'illustrative' | 'local'
  color: string
}
export type PeopleNetworkFieldProps = {
  mode?: 'presence' | 'study'
  lens: PatternLens
  selected: string | null
  onSelect: (id: string) => void
  local: LocalExperiment | null
}

function graphData(lens: PatternLens, local: LocalExperiment | null, mode: 'presence' | 'study') {
  if (mode === 'presence') {
    const presence = makeMembershipPresenceGraph()
    return {
      nodes: presence.marks.map((mark, i) => {
        const point = presenceSpherePosition(i, presence.marks.length)
        return {
          id: mark.id, label: mark.label, color: '#adcfc0', local: false,
          x: point.x, y: point.y, z: point.z,
          fx: point.x, fy: point.y, fz: point.z,
        }
      }),
      // Shared group membership is not a person-to-person relationship.
      links: [] as { source: string; target: string; kind: 'illustrative' | 'local'; color: string }[],
    }
  }
  const study = makeIllustrativePeopleGraph(local)
  return {
    nodes: study.people.map((person) => ({
      id: person.id,
      label: person.label,
      color: person.id === 'visitor-local' ? '#f7dfa5' : colorForPerson(person, lens),
      local: person.id === 'visitor-local',
    })),
    links: study.connections.map((link) => ({
      source: link.source, target: link.target, kind: link.kind,
      color: link.kind === 'local' ? '#f4d998' : '#7fa394',
    })),
  }
}
function idOf(value: string | PersonNode | number | undefined) {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return value?.id ?? ''
}

export default function PeopleNetworkField({ mode = 'presence', lens, selected, onSelect, local }: PeopleNetworkFieldProps) {
  const host = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<ForceGraph3DInstance<PersonNode, ConnectionLink> | null>(null)
  const callbacks = useRef({ onSelect, selected })
  callbacks.current = { onSelect, selected }

  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const data = useMemo(() => graphData(lens, local, mode), [lens, local, mode])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const el = host.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '180px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !host.current) return
    const el = host.current
    let disposed = false
    let resize: ResizeObserver | undefined
    let onVisibility: (() => void) | undefined

    void import('3d-force-graph').then(({ default: ForceGraph3D }) => {
      if (disposed) return
      try {
        const graph = new ForceGraph3D(el, {
          controlType: 'orbit',
          rendererConfig: { antialias: true, alpha: true },
        }) as unknown as ForceGraph3DInstance<PersonNode, ConnectionLink>
        instanceRef.current = graph
        graph
          .backgroundColor('#091313')
          .showNavInfo(false)
          .nodeResolution(20)
          .nodeOpacity(0.94)
          .nodeRelSize(2.9)
          .nodeVal((node) => node.local ? 2.7 : node.id === callbacks.current.selected ? 2.4 : 1.15)
          .nodeColor((node) => node.id === callbacks.current.selected ? '#fff7dd' : node.color)
          .nodeLabel((node) => {
            const label = document.createElement('span')
            label.textContent = node.local
              ? 'Your local illustration · not submitted'
              : node.id.startsWith('member-mark-')
                ? 'Count-based member mark · anonymous placement, not a roster identifier'
                : node.label + ' · illustrative position, not a real member'
            return label
          })
          .linkColor((link) => {
            const a = idOf(link.source), b = idOf(link.target)
            return link.kind === 'local'
              ? '#f5d28d'
              : callbacks.current.selected && [a,b].includes(callbacks.current.selected)
                ? '#c7f0d0'
                : link.color
          })
          .linkOpacity(0.55)
          .linkWidth((link) => {
            const a = idOf(link.source), b = idOf(link.target)
            return callbacks.current.selected && [a,b].includes(callbacks.current.selected) ? 2.5 : link.kind === 'local' ? 1.4 : 0.65
          })
          .linkLabel((link) =>
            link.kind === 'local'
              ? 'Your temporary illustrated connection, not an introduction'
              : 'Illustrative person-to-person connection · NOT verified or derived from CRM'
          )
          .onNodeClick((node) => { callbacks.current.onSelect(node.id) })
          .onNodeHover((node) => { el.style.cursor = node ? 'pointer' : 'grab' })
          .onNodeDragEnd((node) => { node.fx = node.x; node.fy = node.y; node.fz = node.z })
          .warmupTicks(80)
          .cooldownTicks(200)

        resize = new ResizeObserver(() => {
          const { width, height } = el.getBoundingClientRect()
          if (width > 0 && height > 0) graph.width(width).height(height)
        })
        resize.observe(el)
        onVisibility = () => {
          if (document.hidden) graph.pauseAnimation()
          else graph.resumeAnimation()
        }
        document.addEventListener('visibilitychange', onVisibility)
        setReady(true)
      } catch {
        if (!disposed) setUnavailable(true)
      }
    }).catch(() => { if (!disposed) setUnavailable(true) })

    return () => {
      disposed = true
      resize?.disconnect()
      if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)
      instanceRef.current?._destructor()
      instanceRef.current = null
      el.replaceChildren()
    }
  }, [visible])

  useEffect(() => {
    if (!ready || !instanceRef.current) return
    const graph = instanceRef.current
    const prior = new Map(graph.graphData().nodes.map((node) => [node.id, node]))
    graph.graphData({
      nodes: data.nodes.map((node) => Object.assign(prior.get(node.id) ?? {}, node)),
      links: data.links.map((edge) => ({ ...edge })),
    })
    graph.zoomToFit(700, 75)
    graph.d3ReheatSimulation()
  }, [ready, data])

  useEffect(() => {
    if (!ready || !instanceRef.current) return
    const graph = instanceRef.current
    graph.nodeVal((node) => node.local ? 2.7 : node.id === selected ? 2.4 : 1.15)
    graph.nodeColor((node) => node.id === selected ? '#fff7dd' : node.color)
    graph.linkWidth((link) =>
      selected && [idOf(link.source), idOf(link.target)].includes(selected)
        ? 2.5 : link.kind === 'local' ? 1.4 : 0.65
    )
  }, [ready, selected])

  useEffect(() => {
    if (!ready || !instanceRef.current) return
    if (reducedMotion) instanceRef.current.pauseAnimation()
    else if (!document.hidden) instanceRef.current.resumeAnimation()
  }, [ready, reducedMotion])

  return (
    <div className="relative h-full w-full">
      <div ref={host} className="h-full min-h-[400px] w-full" role="img"
        aria-label={mode === "presence" ? "Three-dimensional arrangement of anonymous marks, one for each of at least 101 founder-reported WhatsApp members. No real member identity or person-to-person edge is exposed." : "3D illustrative people-and-connections network; all interpersonal edges are fictional."}
      />
      {!ready && !unavailable ? <p role="status" className="pointer-events-none absolute bottom-5 left-5 text-xs text-white/45">Building the field…</p> : null}
      {unavailable ? <p role="status" className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-white/65">
        The 3D view is unavailable. Use the node selector below to explore the illustrative model.
      </p> : null}
    </div>
  )
}
