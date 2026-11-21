'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { ForceGraph3DInstance, LinkObject, NodeObject } from '3d-force-graph'
import { useTheme } from '@/contexts/ThemeContext'
import { presenceSpherePosition } from '@/lib/dcc/artwork/member-presence'
import { makePeoplePracticeGraph } from '@/lib/dcc/artwork/people-practice-graph'
import { DCC_DISCOVERY_POLL } from '@/lib/dcc/artwork/discovery-poll'

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
  const content = makePeoplePracticeGraph()
  const anonymousCount = content.marks.filter((mark) => mark.kind === 'anonymous-presence').length
  let anonymousIndex = 0
  const nodes: FieldNode[] = content.marks.map((mark) => {
    const position = mark.kind === 'anonymous-presence'
      ? presenceSpherePosition(anonymousIndex++, anonymousCount, 132)
      : POSITIONS[mark.id] ?? { x: 0, y: 0, z: 0 }
    return {
      id: mark.id, label: mark.label, kind: mark.kind,
      ...position, fx: position.x, fy: position.y, fz: position.z,
    }
  })
  content.practices.forEach((practice, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / content.practices.length
    const position = { x: Math.cos(angle) * 215, y: Math.sin(angle) * 180, z: -9 }
    nodes.push({
      id: practice.id, label: practice.short, kind: 'practice',
      choiceId: practice.choiceId, count: practice.count,
      ...position, fx: position.x, fy: position.y, fz: position.z,
    })
  })
  const links: FieldEdge[] = [
    ...content.connections.map((edge) => ({ source: edge.from, target: edge.to, kind: edge.kind })),
    ...content.practiceEdges.map((edge) => ({ source: edge.source, target: edge.target, kind: edge.kind })),
  ]
  return { nodes, links }
}

function nodeId(endpoint: string | FieldNode | undefined): string {
  return typeof endpoint === 'string' ? endpoint : endpoint?.id ?? ''
}

/** Sprite text is scene geometry, not a DOM card or emoji. */
function labelSprite(label: string, count: number | null, ink: string, surface: string): THREE.Sprite {
  const canvas = document.createElement('canvas')
  canvas.width = 580
  canvas.height = 155
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = surface
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = ink
    ctx.font = '600 57px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, canvas.width / 2, count === null ? 97 : 67, 552)
    if (count !== null) {
      ctx.font = '37px Arial, sans-serif'
      ctx.fillText(count + ' selections', canvas.width / 2, 125)
    }
  }
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    depthWrite: false,
  }))
  sprite.scale.set(count === null ? 92 : 153, count === null ? 24 : 40, 1)
  sprite.position.y = count === null ? 15 : 33
  return sprite
}

export default function PeopleNetworkField({ selected, onSelect }: PeopleNetworkFieldProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<ForceGraph3DInstance<FieldNode, FieldEdge> | null>(null)
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const { resolvedTheme } = useTheme()
  const data = useMemo(buildGraph, [])

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
        const graph = new ForceGraph3D(element, {
          controlType: 'orbit',
          rendererConfig: { antialias: true, alpha: true },
        }) as unknown as ForceGraph3DInstance<FieldNode, FieldEdge>
        graphRef.current = graph
        const style = getComputedStyle(element)
        graph
          .backgroundColor(style.getPropertyValue('--dn-graph-bg').trim() || '#091313')
          .showNavInfo(false)
          .graphData({ nodes: data.nodes, links: data.links })
          .nodeResolution(14)
          .nodeRelSize(3)
          .nodeOpacity(0.95)
          .nodeVal((node) => node.kind === 'practice' ? 7 : node.kind === 'anonymous-presence' ? 0.8 : 4)
          .nodeColor((node) => node.kind === 'practice' ? '#8fae95' : node.kind === 'anonymous-presence' ? '#9bb5a8' : '#e1edd4')
          .nodeLabel((node) => {
            const label = document.createElement('span')
            label.className = 'dn-node-tooltip'
            label.textContent = node.kind === 'practice'
              ? node.label + ': ' + node.count + ' community poll selections. Public profile lines show listed practices, not individual poll answers.'
              : node.kind === 'anonymous-presence'
                ? 'Anonymous membership mark'
                : node.label + ' · public artist profile'
            return label
          })
          .nodeThreeObjectExtend(true)
          .nodeThreeObject((node) => {
            if (node.kind === 'anonymous-presence') return new THREE.Group()
            const css = getComputedStyle(element)
            const ink = css.getPropertyValue('--dn-on-graph').trim() || '#eef4ec'
            const background = css.getPropertyValue('--dn-graph-chip').trim() || '#091313'
            const group = new THREE.Group()
            group.add(labelSprite(node.kind === 'practice' ? node.label : node.label.split(' ')[0],
              node.kind === 'practice' ? node.count ?? 0 : null, ink, background))
            return group
          })
          .linkWidth((link) => link.kind === 'documented-cofounding' ? 2.4 : 1.2)
          .linkOpacity(0.82)
          .linkColor((link) => link.kind === 'documented-cofounding' ? '#d1ecbb' : '#88baa0')
          .linkLabel((link) => link.kind === 'documented-cofounding'
            ? 'Documented DCC cofounding'
            : 'Listed public artist practice — not a poll response')
          .onNodeClick((node) => {
            selectRef.current(node.kind === 'anonymous-presence' ? null : node.id)
          })
          .onNodeHover((node) => {
            element.style.cursor = node?.kind === 'anonymous-presence' ? 'grab' : node ? 'pointer' : 'grab'
          })
          .warmupTicks(30)
          .cooldownTicks(0)

        graph.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
        if (window.matchMedia('(pointer: coarse)').matches) {
          graph.renderer().domElement.style.touchAction = 'pan-y'
        }
        resize = new ResizeObserver(() => {
          const { width, height } = element.getBoundingClientRect()
          if (width > 0 && height > 0) graph.width(width).height(height)
        })
        resize.observe(element)
        onVisibility = () => {
          if (document.hidden) graph.pauseAnimation()
          else graph.resumeAnimation()
        }
        document.addEventListener('visibilitychange', onVisibility)
        graph.zoomToFit(500, 75)
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
    const graph = graphRef.current
    const style = elRef.current ? getComputedStyle(elRef.current) : null
    const theme = (key: string, fallback: string) => style?.getPropertyValue(key).trim() || fallback
    graph.backgroundColor(theme('--dn-graph-bg', '#091313'))
    graph.nodeVal((node) => node.id === selected ? 11 : node.kind === 'practice' ? 7 : node.kind === 'anonymous-presence' ? 0.8 : 4)
    graph.nodeColor((node) => {
      const highlighted = selected === node.id
      const connected = selected && data.links.some((edge) =>
        (nodeId(edge.source) === selected && nodeId(edge.target) === node.id) ||
        (nodeId(edge.target) === selected && nodeId(edge.source) === node.id))
      if (highlighted) return theme('--dn-graph-selected', '#f4dda5')
      if (connected) return theme('--dn-graph-founder', '#e1edd4')
      if (node.kind === 'practice') {
        return theme('--dn-poll-' + (node.choiceId ?? 'art'), '#8fae95')
      }
      if (node.kind === 'anonymous-presence') return theme('--dn-graph-node', '#9bb5a8')
      return theme('--dn-graph-founder', '#e1edd4')
    })
    graph.linkColor((link) => {
      if (selected) {
        const participates = nodeId(link.source) === selected || nodeId(link.target) === selected
        if (participates) return theme('--dn-graph-selected', '#f4dda5')
      }
      return link.kind === 'documented-cofounding'
        ? theme('--dn-graph-link', '#d1ecbb')
        : theme('--dn-graph-muted', '#88baa0')
    })
    // Rebuild the six text sprites when the user's light/dark preference changes.
    graph.nodeThreeObject((node) => {
      if (node.kind === 'anonymous-presence') return new THREE.Group()
      const group = new THREE.Group()
      group.add(labelSprite(node.kind === 'practice' ? node.label : node.label.split(' ')[0],
        node.kind === 'practice' ? node.count ?? 0 : null,
        theme('--dn-on-graph', '#eef4ec'), theme('--dn-graph-chip', '#091313')))
      return group
    })
    if (selected && data.nodes.some((node) => node.id === selected)) {
      const node = data.nodes.find((point) => point.id === selected)!
      graph.cameraPosition(
        { x: (node.x ?? 0) + 70, y: (node.y ?? 0) + 35, z: (node.z ?? 0) + 175 },
        { x: node.x ?? 0, y: node.y ?? 0, z: node.z ?? 0 },
        reducedMotion ? 0 : 550,
      )
    } else {
      graph.zoomToFit(reducedMotion ? 0 : 550, 75)
    }
  }, [data, ready, reducedMotion, resolvedTheme, selected])

  useEffect(() => {
    if (!ready || !graphRef.current) return
    if (!document.hidden) graphRef.current.resumeAnimation()
  }, [ready, reducedMotion])

  return (
    <div className="relative h-full w-full">
      <div ref={elRef} className="dn-network-field h-full min-h-[350px] w-full" role="img"
        aria-label={'Interactive 3D network of at least 101 reported people-positions, including Moises, Fabiola, and Angelo; six labeled practice nodes with poll totals ' +
          DCC_DISCOVERY_POLL.totalSelections + ' selections; edges link public artists to listed practices and the cofounders to one another. No anonymous vote or private relationship is attributed.'}
      />
      {!ready && !unavailable && (
        <p className="pointer-events-none absolute bottom-5 left-5 text-xs text-[color:var(--dn-graph-muted)]" role="status">Opening the network…</p>
      )}
      {unavailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--dn-graph-bg)] p-8 text-center text-sm text-[color:var(--dn-on-graph)]" role="status">
          3D display unavailable. The public profiles and practice interests are available below.
        </div>
      )}
    </div>
  )
}
