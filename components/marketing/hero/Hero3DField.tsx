'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

const POINT_COUNT = 280;
const LINE_SEGMENTS = 90;

function FieldScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { pointsGeometry, linesGeometry } = useMemo(() => {
    const positions = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < POINT_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    const linePositions = new Float32Array(LINE_SEGMENTS * 2 * 3);
    let o = 0;
    for (let s = 0; s < LINE_SEGMENTS; s++) {
      const ia = Math.floor(Math.random() * POINT_COUNT) * 3;
      const ib = Math.floor(Math.random() * POINT_COUNT) * 3;
      linePositions[o++] = positions[ia];
      linePositions[o++] = positions[ia + 1];
      linePositions[o++] = positions[ia + 2];
      linePositions[o++] = positions[ib];
      linePositions[o++] = positions[ib + 1];
      linePositions[o++] = positions[ib + 2];
    }

    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    return { pointsGeometry: pg, linesGeometry: lg };
  }, []);

  useFrame((_, delta) => {
    const p = pointsRef.current;
    const l = linesRef.current;
    if (!p) return;
    p.rotation.y += delta * 0.035;
    p.rotation.x += delta * 0.01;
    if (l) {
      l.rotation.copy(p.rotation);
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          color="#2dd4bf"
          size={0.055}
          transparent
          opacity={0.38}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial color="#64748b" transparent opacity={0.14} depthWrite={false} />
      </lineSegments>
    </>
  );
}

type Hero3DFieldProps = {
  className?: string;
};

/**
 * Subtle particle + network field for the marketing hero (client-only WebGL).
 */
export function Hero3DField({ className }: Hero3DFieldProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 min-h-[220px] overflow-hidden rounded-2xl',
        className
      )}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 9], fov: 52 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <FieldScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
