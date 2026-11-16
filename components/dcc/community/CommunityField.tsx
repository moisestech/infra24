'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ForceGraph3DInstance, LinkObject, NodeObject } from '3d-force-graph'
import { INTERESTS, type AtlasProfile } from '@/lib/dcc/community/atlas'

type ForceNode = NodeObject & { id: string; kind: 'profile' | 'interest' | 'anonymous'; label: string; color: string; slug?: string }
type ForceLink = LinkObject<ForceNode> & { color: string }
type Props = { profiles: AtlasProfile[]; selected: string | null; paused: boolean; onSelect: (slug: string) => void; illustrative?: boolean }

export default function CommunityField({ profiles, selected, paused, onSelect, illustrative = true }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const graph = useRef<ForceGraph3DInstance<ForceNode, ForceLink> | null>(null)
  const callbacks = useRef({ onSelect, paused, selected })
  callbacks.current = { onSelect, paused, selected }
  const cleanupVisibility = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const data = useMemo(() => {
    const nodes: ForceNode[] = INTERESTS.map((i) => ({ id: `interest:${i.id}`, kind: 'interest', label: i.label, color: i.color }))
    const links: ForceLink[] = []
    profiles.forEach((profile) => {
      nodes.push({ id: `profile:${profile.slug}`, kind: 'profile', label: profile.name, color: '#c7eed7', slug: profile.slug })
      profile.interests.forEach((id) => links.push({ source: `profile:${profile.slug}`, target: `interest:${id}`, color: INTERESTS.find((i) => i.id === id)!.color }))
    })
    if (illustrative) for (let i = 0; i < 64; i++) nodes.push({ id: `illustration:${i}`, kind: 'anonymous', label: 'Illustrative anonymous presence — no member data', color: '#52696d' })
    return { nodes, links }
  }, [profiles, illustrative])

  useEffect(() => {
    let cancelled = false
    let resize: ResizeObserver | undefined
    const element = host.current
    if (!element) return
    void import('3d-force-graph').then(({ default: ForceGraph3D }) => {
      if (cancelled) return
      try {
        const instance = new ForceGraph3D(element, { controlType: 'orbit', rendererConfig: { antialias: true, alpha: true } }) as unknown as ForceGraph3DInstance<ForceNode, ForceLink>
        graph.current = instance
        instance.backgroundColor('#0b171a').showNavInfo(false).nodeRelSize(3).nodeResolution(12).nodeOpacity(0.9)
          .nodeColor((node) => node.color)
          .nodeLabel((node) => {
            const label = document.createElement('span')
            label.textContent = node.label // The library accepts HTML: use textContent for all member text.
            return label
          })
          .linkColor((link) => link.color).linkOpacity(0.25).linkWidth(0.5)
          .linkLabel(() => 'Declared interest — not a personal relationship')
          .onNodeClick((node) => {
            if (!node.slug) return
            callbacks.current.onSelect(node.slug)
            const x = node.x ?? 0, y = node.y ?? 0, z = node.z ?? 0
            const distance = Math.hypot(x, y, z)
            const ratio = distance ? 1 + 65 / distance : 1
            instance.cameraPosition(distance ? { x: x * ratio, y: y * ratio, z: z * ratio } : { x: 0, y: 0, z: 100 }, { x, y, z }, callbacks.current.paused ? 0 : 700)
          })
          .onNodeHover((node) => { element.style.cursor = node?.slug ? 'pointer' : 'grab' })
          .onNodeDragEnd((node) => { node.fx = node.x; node.fy = node.y; node.fz = node.z })
          .warmupTicks(80)
          .cooldownTicks(callbacks.current.paused ? 0 : 100)
        resize = new ResizeObserver(() => {
          const rect = element.getBoundingClientRect()
          if (rect.width && rect.height) instance.width(rect.width).height(rect.height)
        })
        resize.observe(element)
        const visibility = () => document.hidden ? instance.pauseAnimation() : instance.resumeAnimation()
        document.addEventListener('visibilitychange', visibility)
        instance.renderer().domElement.setAttribute('aria-label', 'DCC force-directed graph. The profile list provides keyboard access.')
        setReady(true)
        cleanupVisibility.current = () => document.removeEventListener('visibilitychange', visibility)
      } catch { setUnavailable(true) }
    }).catch(() => { if (!cancelled) setUnavailable(true) })
    return () => {
      cancelled = true
      resize?.disconnect()
      cleanupVisibility.current?.()
      graph.current?._destructor()
      graph.current = null
      element.replaceChildren()
    }
  }, [])

  useEffect(() => {
    const instance = graph.current
    if (!instance || !ready) return
    const old = new Map(instance.graphData().nodes.map((node) => [node.id, node]))
    instance.graphData({ nodes: data.nodes.map((node) => Object.assign(old.get(node.id) ?? {}, node)), links: data.links.map((link) => ({ ...link })) })
    instance.zoomToFit(0, 40)
  }, [data, ready])

  useEffect(() => {
    const instance = graph.current
    if (!instance || !ready) return
    instance.nodeVal((node) => node.kind === 'anonymous' ? 0.12 : node.slug === selected ? 2.5 : node.kind === 'profile' ? 1.5 : 0.65)
    // Freeze physics, preserving orbit/click interaction. pauseAnimation would disable both.
    instance.cooldownTicks(paused ? 0 : 100)
    if (!paused) instance.d3ReheatSimulation()
  }, [paused, selected, ready])

  return <div ref={host} style={{ width: '100%', height: '100%', minHeight: 380 }}>
    {unavailable ? <p role="status" style={{ padding: 32 }}>The 3D view is unavailable here. Use the profiles and interest filters below.</p> : null}
  </div>
}
