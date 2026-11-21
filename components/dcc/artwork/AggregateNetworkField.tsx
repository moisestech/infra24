'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ForceGraph3DInstance, LinkObject, NodeObject } from '3d-force-graph'
import {
  PATTERN_GROUPS, REVIEWED_OVERLAPS,
  type PatternLens,
} from '@/lib/dcc/artwork/network-patterns'

export type LocalNode = { group: string; signal: 'show' | 'need' | 'offer' }
type FieldNode = NodeObject & {
  id: string
  label: string
  color: string
  tier: number
  role: 'commons' | 'group' | 'local'
}
type FieldLink = LinkObject<FieldNode> & {
  kind: 'index' | 'overlap' | 'local'
  color: string
}
export type AggregateNetworkFieldProps = {
  lens: PatternLens
  selected: string | null
  onSelect: (id: string) => void
  local: LocalNode | null
}

function makeGraph(lens: PatternLens, local: LocalNode | null) {
  const groups = PATTERN_GROUPS[lens]
  const nodes: FieldNode[] = [
    { id: 'commons', label: 'DCC / network commons', color: '#eff8e9', tier: 3, role: 'commons' },
    ...groups.map((group) => ({
      id: group.id, label: group.label, color: group.color, tier: group.tier, role: 'group' as const,
    })),
  ]
  const links: FieldLink[] = groups.map((group) => ({
    source: 'commons', target: group.id, kind: 'index' as const, color: '#526d63',
  }))
  if (lens === 'practices') {
    for (const link of REVIEWED_OVERLAPS) {
      if (link.lens !== lens) continue
      links.push({ source: link.from, target: link.to, kind: 'overlap', color: '#b6e6bc' })
    }
  }
  if (local) {
    const group = lens === 'practices'
      ? groups.find((item) => item.id === local.group)
      : groups.find((item) => item.id === (local.signal === 'offer' ? 'exchange' : local.signal))
    if (group) {
      nodes.push({ id: 'local', label: 'Your local experiment · not shared', color: '#f8e3aa', tier: 1, role: 'local' })
      links.push({ source: 'local', target: group.id, kind: 'local', color: '#f6dcaa' })
    }
  }
  return { nodes, links }
}

export default function AggregateNetworkField({ lens, selected, onSelect, local }: AggregateNetworkFieldProps) {
  const host = useRef<HTMLDivElement>(null)
  const graph = useRef<ForceGraph3DInstance<FieldNode, FieldLink> | null>(null)
  const selectedHandler = useRef(onSelect)
  selectedHandler.current = onSelect

  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const data = useMemo(() => makeGraph(lens, local), [lens, local])

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
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect() }
    }, { rootMargin: '150px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || !host.current) return
    const el = host.current
    let canceled = false
    let resize: ResizeObserver | null = null
    let onVisibility: (() => void) | null = null
    void import('3d-force-graph').then(({ default: ForceGraph3D }) => {
      if (canceled) return
      try {
        const instance = new ForceGraph3D(el, {
          controlType: 'orbit',
          rendererConfig: { antialias: true, alpha: true },
        }) as unknown as ForceGraph3DInstance<FieldNode, FieldLink>
        graph.current = instance
        instance
          .backgroundColor('#091313')
          .showNavInfo(false)
          .nodeResolution(22)
          .nodeOpacity(0.91)
          .nodeRelSize(5.2)
          .nodeColor((node) => node.color)
          .nodeVal((node) => node.role === 'commons' ? 5.5 : node.role === 'local' ? 2 : node.tier === 3 ? 4.3 : node.tier === 2 ? 2.6 : 1.6)
          .nodeLabel((node) => {
            const element = document.createElement('span')
            element.textContent = node.label
            return element
          })
          .linkColor((link) => link.color)
          .linkOpacity(0.68)
          .linkWidth((link) => link.kind === 'overlap' ? 1.8 : link.kind === 'local' ? 1.2 : 0.65)
          .linkLabel((link) => link.kind === 'overlap'
            ? 'Supported shared-theme overlap, not a person-to-person relationship'
            : link.kind === 'local'
              ? 'A node added to this browser only'
              : 'Category belongs to the DCC network index; not a social relationship')
          .onNodeClick((node) => { selectedHandler.current(node.id) })
          .onNodeHover((node) => { el.style.cursor = node ? 'pointer' : 'grab' })
          .warmupTicks(100)
          .cooldownTicks(150)
        resize = new ResizeObserver(() => {
          const { width, height } = el.getBoundingClientRect()
          if (width > 0 && height > 0) instance.width(width).height(height)
        })
        resize.observe(el)
        onVisibility = () => document.hidden ? instance.pauseAnimation() : instance.resumeAnimation()
        document.addEventListener('visibilitychange', onVisibility)
        setReady(true)
      } catch {
        if (!canceled) setUnavailable(true)
      }
    }).catch(() => { if (!canceled) setUnavailable(true) })
    return () => {
      canceled = true
      resize?.disconnect()
      if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)
      graph.current?._destructor()
      graph.current = null
      el.replaceChildren()
    }
  }, [inView])

  useEffect(() => {
    if (!graph.current || !ready) return
    const instance = graph.current
    const existing = new Map(instance.graphData().nodes.map((item) => [item.id, item]))
    instance.graphData({
      nodes: data.nodes.map((node) => Object.assign(existing.get(node.id) ?? {}, node)),
      links: data.links.map((link) => ({ ...link })),
    })
    instance.zoomToFit(600, 100)
  }, [ready, data])

  useEffect(() => {
    if (!graph.current || !ready) return
    const instance = graph.current
    instance.nodeVal((node) => node.id === selected ? 6 : node.role === 'commons' ? 5.5 : node.role === 'local' ? 2 : node.tier === 3 ? 4.3 : node.tier === 2 ? 2.6 : 1.6)
  }, [ready, selected])

  useEffect(() => {
    if (!graph.current || !ready) return
    if (reducedMotion) graph.current.pauseAnimation()
    else if (!document.hidden) graph.current.resumeAnimation()
  }, [ready, reducedMotion])

  return (
    <div className="relative h-full w-full">
      <div ref={host} className="h-full min-h-[400px] w-full" role="img" aria-label="Three-dimensional artistic index of broad, anonymous DCC activity and creative-practice patterns. Select named categories using the controls." />
      {!ready && !unavailable ? <p className="pointer-events-none absolute bottom-5 left-5 text-xs text-white/45" role="status">Opening the network…</p> : null}
      {unavailable ? (
        <div role="status" className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm leading-relaxed text-white/65">
          The 3D view is unavailable. Explore the same anonymized categories using the category selector below.
        </div>
      ) : null}
    </div>
  )
}
