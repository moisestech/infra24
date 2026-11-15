'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { BufferGeometry, DoubleSide, Vector3 } from 'three'

type LoadedMesh = {
  type: 'ready'
  geometry: BufferGeometry
  size: [number, number, number]
  vertices: number
  label: string
  origin: 'private storage' | 'this device'
}
type MeshState =
  | { type: 'loading' }
  | LoadedMesh
  | { type: 'missing' }
  | { type: 'error'; message: string }

const MAX_STL_BYTES = 20 * 1024 * 1024
const MAX_VERTICES = 900_000

function parsePreview(payload: ArrayBuffer, label: string, origin: LoadedMesh['origin']): LoadedMesh {
  if (payload.byteLength < 84 || payload.byteLength > MAX_STL_BYTES) {
    throw new Error('Use an STL file between 84 bytes and 20 MB.')
  }
  const geometry = new STLLoader().parse(payload)
  try {
    const vertices = geometry.getAttribute('position')?.count ?? 0
    if (vertices < 3 || vertices > MAX_VERTICES) throw new Error('STL mesh is empty or too complex for this preview.')
    // STL coordinates are typically Z-up. Rotate only for the three.js display.
    geometry.rotateX(-Math.PI / 2)
    geometry.computeBoundingBox()
    const size = new Vector3()
    if (!geometry.boundingBox) throw new Error('Mesh has no valid bounding box.')
    geometry.boundingBox.getSize(size)
    const extents: [number, number, number] = [size.x, size.y, size.z]
    const largest = Math.max(...extents)
    if (!extents.every(Number.isFinite) || largest <= 0) throw new Error('Invalid STL bounds.')
    geometry.center()
    geometry.scale(2.6 / largest, 2.6 / largest, 2.6 / largest)
    geometry.computeVertexNormals()
    return { type: 'ready', geometry, size: extents, vertices, label, origin }
  } catch (error) {
    geometry.dispose()
    throw error
  }
}

/**
 * Private hosted STL OR local-preview-only STL (never uploads the selected file).
 * Orbit, scale display and coloring are a visualization, NOT mesh integrity or
 * printability certification. Both proposal pages reuse the same component.
 */
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
  const meshRef = useRef<BufferGeometry | null>(null)
  const requestRef = useRef(0)

  function showModel(model: LoadedMesh) {
    meshRef.current?.dispose()
    meshRef.current = model.geometry
    setState(model)
  }

  useEffect(() => {
    const controller = new AbortController()
    const sequence = ++requestRef.current

    async function load() {
      setState({ type: 'loading' })
      try {
        // src is a fixed allowlisted same-origin endpoint, not a user URL.
        const response = await fetch(src, { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
        if (sequence !== requestRef.current) return
        if (response.status === 404 || response.status === 503) {
          setState({ type: 'missing' })
          return
        }
        if (!response.ok) throw new Error('Hosted model is unavailable.')
        const payload = await response.arrayBuffer()
        if (sequence !== requestRef.current) return
        showModel(parsePreview(payload, 'Approved project STL', 'private storage'))
      } catch {
        if (!controller.signal.aborted && sequence === requestRef.current) {
          setState({ type: 'error', message: 'The hosted STL could not be read. Check the export.' })
        }
      }
    }

    void load()
    return () => {
      controller.abort()
      requestRef.current++
      meshRef.current?.dispose()
      meshRef.current = null
    }
  }, [src])

  async function loadLocal(file?: File) {
    if (!file) return
    const sequence = ++requestRef.current
    try {
      if (!file.name.toLowerCase().endsWith('.stl')) throw new Error('Select a .stl file.')
      if (file.size > MAX_STL_BYTES) throw new Error('The STL is larger than 20 MB.')
      const payload = await file.arrayBuffer()
      if (sequence !== requestRef.current) return
      showModel(parsePreview(payload, file.name, 'this device'))
    } catch (error) {
      if (sequence === requestRef.current) {
        setState({ type: 'error', message: error instanceof Error ? error.message : 'Cannot open this STL.' })
      }
    }
  }

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
                <meshStandardMaterial color={color} roughness={0.68} metalness={0.02} side={DoubleSide} />
              </mesh>
              <OrbitControls enablePan={false} enableDamping minDistance={2} maxDistance={12} />
            </Canvas>
          </div>
          <div className="space-y-1 border-t border-[var(--cdc-border)] px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400">
            <p>Drag to rotate · scroll/pinch to zoom</p>
            <p>{state.label} · {state.origin} · {Math.floor(state.vertices / 3).toLocaleString()} triangles</p>
            <p>Mesh bounds: {state.size.map(x => x.toFixed(1)).join(' × ')} (STL units; confirm millimeters)</p>
          </div>
          <p className="px-4 pb-3 text-xs text-neutral-500">
            Color is illustrative. Viewer does not check watertightness, minimum wall thickness,
            slicer settings, or whether jewelry is safe to wear.
          </p>
        </>
      ) : (
        <div className="flex min-h-60 flex-col items-center justify-center px-6 py-10 text-center">
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {state.type === 'loading' ? 'Checking private 3D preview…' :
              state.type === 'missing' ? '3D preview coming soon' : 'STL cannot be displayed yet'}
          </p>
          <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            {state.type === 'loading' ? 'Checking whether a model has been approved for private viewing.' :
              state.type === 'missing' ? 'No approved STL has been hosted for this project. You can still preview a file locally below.' :
              state.message}
          </p>
        </div>
      )}
      <div className="border-t border-[var(--cdc-border)] bg-white px-4 py-4 dark:bg-neutral-950">
        <label htmlFor={`stl-preview-${title.replace(/\W/g, '-').toLowerCase()}`} className="block text-sm font-medium">
          Preview an STL from this device
        </label>
        <input
          id={`stl-preview-${title.replace(/\W/g, '-').toLowerCase()}`}
          type="file"
          accept=".stl,model/stl,application/sla"
          className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-white dark:file:bg-neutral-100 dark:file:text-neutral-900"
          onChange={e => {
            void loadLocal(e.currentTarget.files?.[0])
            e.currentTarget.value = ''
          }}
        />
        <p className="mt-2 text-xs text-neutral-500">
          Local preview only: the selected file stays in this browser, is not saved or uploaded,
          and disappears on refresh. Supported: STL up to 20 MB.
        </p>
      </div>
    </section>
  )
}
