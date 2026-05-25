'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { Graph3DEdge, Graph3DNode } from '@/lib/marketing/network-graph-3d-layout'

export type NetworkGraph3DProps = {
  nodes: Graph3DNode[]
  edges: Graph3DEdge[]
  selectedId: string | null
  highlightedIds: Set<string>
  searchQuery: string
  filterMiami: boolean
  paused: boolean
  pulseOriginId: string | null
  pulseStartTime: number | null
  onSelectNode: (id: string | null) => void
  focusNodeId: string | null
  onFocusComplete?: () => void
}

function Starfield() {
  return <Stars radius={120} depth={60} count={5000} factor={3} saturation={0} fade speed={0.5} />
}

function CameraFocus({
  focusNodeId,
  nodes,
  onComplete,
}: {
  focusNodeId: string | null
  nodes: Graph3DNode[]
  onComplete?: () => void
}) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const animating = useRef(false)

  useEffect(() => {
    if (!focusNodeId) return
    const node = nodes.find((n) => n.id === focusNodeId)
    if (!node) return
    desired.current.set(node.x, node.y, node.z)
    target.current.copy(desired.current)
    animating.current = true
  }, [focusNodeId, nodes])

  useFrame((_, delta) => {
    if (!animating.current) return
    camera.position.lerp(
      new THREE.Vector3(
        target.current.x,
        target.current.y + 8,
        target.current.z + 28
      ),
      1 - Math.exp(-4 * delta)
    )
    camera.lookAt(target.current)
    if (camera.position.distanceTo(new THREE.Vector3(target.current.x, target.current.y + 8, target.current.z + 28)) < 0.5) {
      animating.current = false
      onComplete?.()
    }
  })

  return null
}

function NetworkNodes({
  nodes,
  selectedId,
  highlightedIds,
  searchQuery,
  filterMiami,
  onSelectNode,
}: Pick<
  NetworkGraph3DProps,
  'nodes' | 'selectedId' | 'highlightedIds' | 'searchQuery' | 'filterMiami' | 'onSelectNode'
>) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const q = searchQuery.trim().toLowerCase()

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    nodes.forEach((node, i) => {
      dummy.position.set(node.x, node.y, node.z)
      const scale = node.size * (selectedId === node.id ? 1.35 : 1)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      const col = new THREE.Color(node.color)
      const label = (node.data.label ?? '').toLowerCase()
      const matchSearch = !q || label.includes(q)
      const miamiOk = !filterMiami || node.data.miami === true || node.data.kind !== 'person'
      const inHighlight = highlightedIds.size === 0 || highlightedIds.has(node.id)
      let alpha = 1
      if (!matchSearch || !miamiOk) alpha = 0.12
      else if (!inHighlight && highlightedIds.size > 0) alpha = 0.25
      else if (selectedId && selectedId !== node.id && !highlightedIds.has(node.id)) alpha = 0.35

      mesh.setColorAt(i, col.multiplyScalar(alpha))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [nodes, selectedId, highlightedIds, searchQuery, filterMiami, q, dummy])

  const handleClick = useCallback(
    (e: { instanceId?: number; stopPropagation: () => void }) => {
      e.stopPropagation()
      const idx = e.instanceId
      if (idx == null || idx < 0 || idx >= nodes.length) return
      onSelectNode(nodes[idx]!.id)
    },
    [nodes, onSelectNode]
  )

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, nodes.length]}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.55, 12, 12]} />
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.92}
        emissive="#ffffff"
        emissiveIntensity={0.15}
        roughness={0.4}
        metalness={0.2}
      />
    </instancedMesh>
  )
}

function NetworkEdges({
  nodes,
  edges,
  highlightedIds,
  searchQuery,
  filterMiami,
  pulseOriginId,
  pulseStartTime,
}: Pick<
  NetworkGraph3DProps,
  'nodes' | 'edges' | 'highlightedIds' | 'searchQuery' | 'filterMiami' | 'pulseOriginId' | 'pulseStartTime'
>) {
  const lineRef = useRef<THREE.LineSegments>(null)
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  const q = searchQuery.trim().toLowerCase()

  const { positions, colors } = useMemo(() => {
    const pos: number[] = []
    const col: number[] = []
    for (const edge of edges) {
      const a = nodeMap.get(edge.source)
      const b = nodeMap.get(edge.target)
      if (!a || !b) continue
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z)
      const c = new THREE.Color('#94a3b8')
      col.push(c.r, c.g, c.b, c.r, c.g, c.b)
    }
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    }
  }, [edges, nodeMap])

  useFrame(() => {
    const geo = lineRef.current?.geometry
    if (!geo) return
    const colorAttr = geo.getAttribute('color') as THREE.BufferAttribute
    if (!colorAttr) return

    const now = Date.now() / 1000
    let vi = 0
    for (const edge of edges) {
      const a = nodeMap.get(edge.source)
      const b = nodeMap.get(edge.target)
      if (!a || !b) continue

      const labelA = (a.data.label ?? '').toLowerCase()
      const labelB = (b.data.label ?? '').toLowerCase()
      const matchSearch = !q || labelA.includes(q) || labelB.includes(q)
      const miamiOk =
        !filterMiami ||
        ((a.data.miami === true || a.data.kind !== 'person') &&
          (b.data.miami === true || b.data.kind !== 'person'))
      const touchesHighlight =
        highlightedIds.size === 0 ||
        (highlightedIds.has(edge.source) && highlightedIds.has(edge.target))

      let brightness = edge.opacity * (matchSearch && miamiOk ? 1 : 0.08)
      if (highlightedIds.size > 0 && touchesHighlight) brightness = Math.min(1, brightness * 2.2)

      if (pulseOriginId && pulseStartTime != null) {
        const elapsed = now - pulseStartTime
        if (elapsed >= 0 && elapsed < 3) {
          const wave = elapsed * 18
          const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 }
          const origin = nodeMap.get(pulseOriginId)
          if (origin) {
            const dist = Math.hypot(mid.x - origin.x, mid.y - origin.y, mid.z - origin.z)
            const proximity = Math.abs(dist - wave)
            if (proximity < 3) brightness = Math.min(1, brightness + 0.8 * (1 - proximity / 3))
          }
        }
      }

      const c = new THREE.Color('#94a3b8').multiplyScalar(brightness)
      colorAttr.setXYZ(vi, c.r, c.g, c.b)
      colorAttr.setXYZ(vi + 1, c.r, c.g, c.b)
      vi += 2
    }
    colorAttr.needsUpdate = true
  })

  if (positions.length === 0) return null

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.75} blending={THREE.AdditiveBlending} />
    </lineSegments>
  )
}

function Scene(props: NetworkGraph3DProps) {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null)

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = !props.paused
  }, [props.paused])

  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 40, 120]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[20, 20, 20]} intensity={0.8} />
      <Starfield />
      <NetworkEdges {...props} />
      <NetworkNodes
        nodes={props.nodes}
        selectedId={props.selectedId}
        highlightedIds={props.highlightedIds}
        searchQuery={props.searchQuery}
        filterMiami={props.filterMiami}
        onSelectNode={props.onSelectNode}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={8}
        maxDistance={80}
        autoRotate={!props.paused}
        autoRotateSpeed={0.2}
        rotateSpeed={0.6}
        enableDamping
        dampingFactor={0.05}
      />
      <CameraFocus
        focusNodeId={props.focusNodeId}
        nodes={props.nodes}
        onComplete={props.onFocusComplete}
      />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={1.2} />
      </EffectComposer>
    </>
  )
}

export function NetworkGraph3D(props: NetworkGraph3DProps) {
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    const handler = () => setResetKey((k) => k + 1)
    window.addEventListener('network-graph-reset-camera', handler)
    return () => window.removeEventListener('network-graph-reset-camera', handler)
  }, [])

  return (
    <Canvas
      key={resetKey}
      camera={{ position: [0, 8, 28], fov: 65, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => props.onSelectNode(null)}
      className="h-full w-full cursor-crosshair"
    >
      <Scene {...props} />
    </Canvas>
  )
}

export function resetNetworkGraphCamera() {
  window.dispatchEvent(new Event('network-graph-reset-camera'))
}
