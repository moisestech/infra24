'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { eraAccent } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';
import { EffectFallback } from '@/components/era/effects/EffectFallback';

const NODE_COUNT = 64;
const MAX_DISTANCE = 2.6;
const SPHERE_RADIUS = 4.2;

function buildLayout(seed: number) {
  const positions = new Float32Array(NODE_COUNT * 3);
  const velocities = new Float32Array(NODE_COUNT * 3);
  const phases = new Float32Array(NODE_COUNT);
  // Deterministic-ish seed so SSR/CSR layouts feel consistent across loads.
  let s = seed || 1;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < NODE_COUNT; i += 1) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = SPHERE_RADIUS * (0.55 + 0.45 * rand());
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    velocities[i * 3] = (rand() - 0.5) * 0.25;
    velocities[i * 3 + 1] = (rand() - 0.5) * 0.25;
    velocities[i * 3 + 2] = (rand() - 0.5) * 0.25;
    phases[i] = rand() * Math.PI * 2;
  }
  return { positions, velocities, phases };
}

function MeshScene() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, velocities, phases, lineGeometry, pointGeometry } = useMemo(() => {
    const { positions: ps, velocities: vs, phases: ph } = buildLayout(7);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(ps, 3));

    const lg = new THREE.BufferGeometry();
    // Pre-allocate a max edge buffer so we can mutate per-frame without realloc.
    const maxEdges = NODE_COUNT * 4; // upper bound
    const linePositions = new Float32Array(maxEdges * 2 * 3);
    lg.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lg.setDrawRange(0, 0);

    return {
      positions: ps,
      velocities: vs,
      phases: ph,
      lineGeometry: lg,
      pointGeometry: pg,
    };
  }, []);

  useFrame((state, dt) => {
    const elapsed = state.clock.elapsedTime;
    const positionAttr = pointGeometry.getAttribute('position') as THREE.BufferAttribute;
    const linePositionAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
    const buf = linePositionAttr.array as Float32Array;

    // Drift each node with slow Lissajous-flavored motion bounded to the sphere.
    for (let i = 0; i < NODE_COUNT; i += 1) {
      const ix = i * 3;
      const phase = phases[i];
      positions[ix] += velocities[ix] * dt * 0.4;
      positions[ix + 1] += velocities[ix + 1] * dt * 0.4;
      positions[ix + 2] += velocities[ix + 2] * dt * 0.4;
      // Pull back to sphere surface gently.
      const x = positions[ix];
      const y = positions[ix + 1];
      const z = positions[ix + 2];
      const r = Math.sqrt(x * x + y * y + z * z) || 1;
      const target = SPHERE_RADIUS * (0.7 + 0.18 * Math.sin(phase + elapsed * 0.4));
      const k = 0.05;
      positions[ix] += ((target * x) / r - x) * k;
      positions[ix + 1] += ((target * y) / r - y) * k;
      positions[ix + 2] += ((target * z) / r - z) * k;
    }
    positionAttr.needsUpdate = true;

    // Recompute edges within MAX_DISTANCE — light O(n^2) for n=64.
    let edgeCount = 0;
    const maxEdges = buf.length / 6;
    for (let i = 0; i < NODE_COUNT && edgeCount < maxEdges; i += 1) {
      const ax = positions[i * 3];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];
      for (let j = i + 1; j < NODE_COUNT && edgeCount < maxEdges; j += 1) {
        const bx = positions[j * 3];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];
        const dx = bx - ax;
        const dy = by - ay;
        const dz = bz - az;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < MAX_DISTANCE * MAX_DISTANCE) {
          const off = edgeCount * 6;
          buf[off] = ax;
          buf[off + 1] = ay;
          buf[off + 2] = az;
          buf[off + 3] = bx;
          buf[off + 4] = by;
          buf[off + 5] = bz;
          edgeCount += 1;
        }
      }
    }
    lineGeometry.setDrawRange(0, edgeCount * 2);
    linePositionAttr.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.05;
      groupRef.current.rotation.x += dt * 0.012;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={pointGeometry}>
        <pointsMaterial
          color={eraAccent.network}
          size={0.13}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={eraAccent.network}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export type MeshFieldProps = {
  channelId?: string;
  className?: string;
};

/**
 * Network channel — 3D force-mesh hero. Nodes drift on a sphere and edges
 * appear when neighbors fall within `MAX_DISTANCE`. Stand-in for the live
 * cytoscape graph at the top of `/era/network` and on the homepage band.
 *
 * Rendered client-only; SSR shows `EffectFallback`. WebGL is required.
 */
export function MeshField({ className }: MeshFieldProps) {
  if (typeof window === 'undefined') {
    return <EffectFallback accentKey="network" shape="mesh" className={className} />;
  }
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        className
      )}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 11], fov: 50 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.4} />
        <Suspense fallback={null}>
          <MeshScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
