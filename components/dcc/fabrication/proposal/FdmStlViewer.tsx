'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { Box3, BufferGeometry, Vector3 } from 'three'

type MeshState =
  | { type: 'loading' }
  | { type: 'ready'; geometry: BufferGeometry; size: [number, number, number] }
  | { type: 'missing' }
  | { type: 'error' }

const DIMENSION = 20 * 1024 * 1024

/** Restricted same-origin endpoint. Never accepts third-party or user-supplied URLs. */
export function FdmStlViewer({
  src,
  color,
  title,
}: {
  src: string
  color: string
  title: string
}) {
  const [state, setState] = useState<MeshState>({ type: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    let current: BufferGeometry | null = null
    let active = true

    async function load() {
      setState({ type: 'loading' })
      try {
        const response = await fetch(src, {
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        })
        if (response.status === 404 || response.status === 503) {
          if (active) setState({ type: 'missing' })
          return
        }
        if (!response.ok) throw new Error('Model unavailable')
        const payload = await response.arrayBuffer()
        if (payload.byteLength < 84 || payload.byteLength > DIMENSION) {
          throw new Error('Invalid STL size')
        }
        const geometry = new STLLoader().parse(payload)
        if (geometry.attributes.position.count > 2_000_000) {
          geometry.dispose()
          throw new Error('Mesh too large to preview')
        }
        // STLs are usually Z-up; Three.js scene uses Y-up.
        geometry.rotateX(-Math.PI / 2)
        geometry.computeBoundingBox()
        const extents = new Vector3()
        new Box3().setFromBufferAttribute(geometry.attributes.position).getSize(extents)
        if (!Number.isFinite(extents.x + extents.y + extents.z) ||
            Math.max(extents.x, extents.y, extents.z) <= 0) {
          geometry.dispose()
          throw new Error('Invalid mesh bounds')
        }
        const size: [number, number, number] = [extents.x, extents.y, extents.z]
        geometry.center()
        const maxDimension = Math.max(...size)
        geometry.scale(2.6 / maxDimension, 2.6 / maxDimension, 2.6 / maxDimension)
        geometry.computeVertexNormals()
        current = geometry
        if (active) setState({ type: 'ready', geometry, size })
      } catch (error) {
        if (active && !controller.signal.aborted) setState({ type: 'error' })
      }
    }
    void load()
    return () => {
      active = false
      controller.abort()
      current?.dispose()
    }
  }, [src])

  return (
    <section
      aria-label={`Interactive 3D preview for ${title}`}
      className="overflow-hidden rounded-2xl border border-[var(--cdc-border)] bg-neutral-100 dark:bg-neutral-900"
    >
      {state.type === 'ready' ? (
        <>
          <div className="h-72 w-full sm:h-[25rem]">
            <Canvas camera={{ position: [3.7, 2.8, 4.3], fov: 43, near: 0.01, far: 100 }}>
              <color attach="background" args={['#171e1d']} />
              <ambientLight intensity={1.35} />
              <directionalLight position={[4, 7, 5]} intensity={2.2} />
              <directionalLight position={[-4, 1, -3]} intensity={0.9} />
              <mesh geometry={state.geometry}>
                <meshStandardMaterial color={color} roughness={0.68} metalness={0.02} side={2} />
              </mesh>
              <OrbitControls enablePan={false} enableDamping minDistance={2} maxDistance={12} />
            </Canvas>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--cdc-border)] px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400">
            <span>Drag to rotate · scroll/pinch to zoom</span>
            <span>
              Mesh bounds: {state.size.map((x) => x.toFixed(1)).join(' × ')} (STL units)
            </span>
          </div>
          <p className="px-4 pb-3 text-xs text-neutral-500">
            Preview tint is illustrative. An STL does not contain filament color, material, or guaranteed printable dimensions.
          </p>
        </>
      ) : (
        <div className="flex min-h-60 flex-col items-center justify-center px-6 py-10 text-center">
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {state.type === 'loading' ? 'Checking model preview…' :
              state.type === 'missing' ? '3D preview coming soon' :
              'Preview cannot be displayed yet'}
          </p>
          <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            {state.type === 'missing'
              ? 'The source STL has not been uploaded to the private project storage. Nothing has been printed or approved yet.'
              : state.type === 'error'
                ? 'The file needs inspection or a new export before it can be previewed.'
                : 'We are checking the private model file.'}
          </p>
        </div>
      )}
    </section>
  )
}
