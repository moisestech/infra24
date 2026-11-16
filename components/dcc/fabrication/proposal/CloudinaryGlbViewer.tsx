'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei'

function GlbObject({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return (
    <Bounds fit clip observe margin={1.35}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  )
}

/** Only for a client-approved, explicitly public Cloudinary GLB URL. */
export function CloudinaryGlbViewer({ url, title }: { url: string; title: string }) {
  return (
    <section aria-label={`Interactive 3D view for ${title}`} className="overflow-hidden rounded-2xl border border-[var(--cdc-border)] bg-neutral-100 dark:bg-neutral-900">
      <div className="relative h-72 w-full sm:h-[25rem]">
        <Canvas camera={{ position: [3, 2.5, 4], fov: 45 }} frameloop="demand">
          <color attach="background" args={['#171e1d']} />
          <ambientLight intensity={1.6} />
          <directionalLight position={[5, 8, 5]} intensity={2} />
          <directionalLight position={[-4, 2, -3]} intensity={1} />
          <Suspense fallback={null}>
            <GlbObject url={url} />
          </Suspense>
          <OrbitControls enableDamping enablePan={false} makeDefault />
        </Canvas>
      </div>
      <p className="px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400">
        Drag to rotate · pinch or scroll to zoom. Approved visual preview only — not a manufacturing or printability approval.
      </p>
    </section>
  )
}
