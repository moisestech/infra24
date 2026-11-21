'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ForceGraph3DInstance, LinkObject, NodeObject } from '3d-force-graph'
import { makeMembershipPresenceGraph, presenceSpherePosition, type MemberPresenceMark } from '@/lib/dcc/artwork/member-presence'

type HumanNode = NodeObject & {
  id: string
  label: string
  kind: MemberPresenceMark['kind']
  color: string
}
type HumanLink = LinkObject<HumanNode> & { kind: 'documented-cofounding'; color: string }

export type PeopleNetworkFieldProps = {
  selected: string | null
  onSelect: (id: string | null) => void
}

function graphData() {
  const graph = makeMembershipPresenceGraph()
  const anonymousCount = graph.marks.filter((mark) => mark.kind === 'anonymous-presence').length
  let anonymousIndex = 0
  const nodes: HumanNode[] = graph.marks.map((mark) => {
    const publicFounder = mark.kind === 'public-cofounder'
    const position = publicFounder
      ? { x: mark.id === 'moises-sanabria' ? -32 : 32, y: 0, z: 0 }
      : presenceSpherePosition(anonymousIndex++, anonymousCount, 156)
    return {
      id: mark.id,
      label: mark.label,
      kind: mark.kind,
      color: publicFounder ? '#e1edd4' : '#9bb5a8',
      x: position.x, y: position.y, z: position.z,
      fx: position.x, fy: position.y, fz: position.z,
    }
  })
  const links: HumanLink[] = graph.connections.map((edge) => ({
    source: edge.from,
    target: edge.to,
    kind: edge.kind,
    color: '#d1ecbb',
  }))
  return { nodes, links }
}

export default function PeopleNetworkField({ selected, onSelect }: PeopleNetworkFieldProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<ForceGraph3DInstance<HumanNode, HumanLink> | null>(null)
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const data = useMemo(graphData, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const element = elRef.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '150px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !elRef.current) return
    const element = elRef.current
    let disposed = false
    let resize: ResizeObserver | null = null
    let onVisibility: (() => void) | null = null

    void import('3d-force-graph').then(({ default: ForceGraph3D }) => {
      if (disposed) return
      try {
        const instance = new ForceGraph3D(element, {
          controlType: 'orbit',
          rendererConfig: { antialias: true, alpha: true },
        }) as unknown as ForceGraph3DInstance<HumanNode, HumanLink>
        graphRef.current = instance
        instance
          .backgroundColor('#091313')
          .showNavInfo(false)
          .graphData({ nodes: data.nodes, links: data.links })
          .nodeResolution(16)
          .nodeRelSize(3.2)
          .nodeOpacity(0.94)
          .nodeVal((node) => node.kind === 'public-cofounder' ? 3.4 : 0.9)
          .nodeColor((node) => node.color)
          .nodeLabel((node) => {
            const label = document.createElement('span')
            label.textContent = node.kind === 'public-cofounder'
              ? node.label + ' · publicly identified DCC cofounder'
              : 'Anonymous member-presence mark · no identity or poll choice mapped'
            return label
          })
          .linkColor((link) => link.color)
          .linkOpacity(0.9)
          .linkWidth(2.1)
          .linkLabel(() => 'Documented connection: DCC cofounding (not a poll response)')
          .onNodeClick((node) => {
            if (node.kind === 'public-cofounder') selectRef.current(node.id)
            else selectRef.current(null)
          })
          .onNodeHover((node) => { element.style.cursor = node?.kind === 'public-cofounder' ? 'pointer' : 'grab' })
          .warmupTicks(30)
          .cooldownTicks(0)

        resize = new ResizeObserver(() => {
          const { width, height } = element.getBoundingClientRect()
          if (width > 0 && height > 0) instance.width(width).height(height)
        })
        resize.observe(element)
        onVisibility = () => {
          if (document.hidden) instance.pauseAnimation()
          else instance.resumeAnimation()
        }
        document.addEventListener('visibilitychange', onVisibility)
        instance.zoomToFit(500, 85)
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
  }, [data, visible])

  useEffect(() => {
    if (!ready || !graphRef.current) return
    const instance = graphRef.current
    instance.nodeVal((node) => node.id === selected ? 5.6 : node.kind === 'public-cofounder' ? 3.4 : 0.9)
    instance.nodeColor((node) => node.id === selected ? '#f4dda5' : node.color)
    if (selected === 'moises-sanabria' || selected === 'fabiola-larios') {
      const x = selected === 'moises-sanabria' ? -32 : 32
      instance.cameraPosition({ x: x + 58, y: 31, z: 110 }, { x, y: 0, z: 0 }, reducedMotion ? 0 : 550)
    } else {
      instance.zoomToFit(reducedMotion ? 0 : 550, 85)
    }
  }, [ready, reducedMotion, selected])

  useEffect(() => {
    if (!ready || !graphRef.current) return
    if (reducedMotion) graphRef.current.pauseAnimation()
    else if (!document.hidden) graphRef.current.resumeAnimation()
  }, [ready, reducedMotion])

  return (
    <div className="relative h-full w-full">
      <div ref={elRef} className="h-full min-h-[380px] w-full" role="img"
        aria-label="Three-dimensional DCC member-presence sculpture: 101 minimum-count marks including two named public cofounders with one documented cofounding relationship. All other positions have no member identifiers or poll answers."
      />
      {!ready && !unavailable && (
        <p className="pointer-events-none absolute bottom-5 left-5 text-xs text-white/45" role="status">Opening the network…</p>
      )}
      {unavailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#091313] p-8 text-center text-sm text-white/70" role="status">
          3D display unavailable. You can still explore the public cofounders and poll totals below.
        </div>
      )}
    </div>
  )
}
