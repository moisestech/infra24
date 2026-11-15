'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildAnonymousNodes, INTERESTS, type AtlasProfile } from '@/lib/dcc/community/atlas'

type Props = { profiles: AtlasProfile[]; selected: string | null; paused: boolean; onSelect: (slug: string) => void }

export default function CommunityField({ profiles, selected, paused, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [unavailable, setUnavailable] = useState(false)
  const callbacks = useRef({ onSelect, paused, selected })
  callbacks.current = { onSelect, paused, selected }

  useEffect(() => {
    const element = host.current
    if (!element) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) }
    catch { setUnavailable(true); return }
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200)
    camera.position.set(0, 8, 35)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    element.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-label', 'Illustrative DCC network. Use the profile list for keyboard navigation.')
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 20
    controls.maxDistance = 55
    controls.autoRotateSpeed = 0.35

    const geometry = new THREE.SphereGeometry(0.11, 10, 10)
    const anonymous = buildAnonymousNodes(64)
    const dots = new THREE.InstancedMesh(geometry, new THREE.MeshBasicMaterial({ color: '#627e7f', transparent: true, opacity: 0.55 }), anonymous.length)
    const matrix = new THREE.Matrix4()
    anonymous.forEach((n, i) => dots.setMatrixAt(i, matrix.makeTranslation(...n.position)))
    dots.instanceMatrix.needsUpdate = true
    scene.add(dots)

    const hubs = new Map<string, THREE.Vector3>()
    INTERESTS.forEach((interest, i) => {
      const angle = (i / INTERESTS.length) * Math.PI * 2
      const position = new THREE.Vector3(Math.cos(angle) * 8, Math.sin(angle) * 5, -2)
      hubs.set(interest.id, position)
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: interest.color }))
      orb.position.copy(position)
      scene.add(orb)
    })

    const pickable: THREE.Mesh[] = []
    profiles.forEach((profile, i) => {
      const angle = (i / Math.max(3, profiles.length)) * Math.PI * 2 - Math.PI / 2
      const position = new THREE.Vector3(Math.cos(angle) * 4, Math.sin(angle) * 3, 3)
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), new THREE.MeshBasicMaterial({ color: '#ddf6ea' }))
      orb.position.copy(position)
      orb.userData.slug = profile.slug
      scene.add(orb)
      pickable.push(orb)
      profile.interests.forEach((interest) => {
        const hub = hubs.get(interest)
        if (!hub) return
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([position, hub]), new THREE.LineBasicMaterial({ color: INTERESTS.find((v) => v.id === interest)!.color, transparent: true, opacity: 0.23 }))
        scene.add(line)
      })
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let down = { x: 0, y: 0 }
    const pointerDown = (event: PointerEvent) => { down = { x: event.clientX, y: event.clientY } }
    const pointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6) return
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(pickable)[0]
      if (hit) callbacks.current.onSelect(String(hit.object.userData.slug))
    }
    renderer.domElement.addEventListener('pointerdown', pointerDown)
    renderer.domElement.addEventListener('pointerup', pointerUp)
    const resize = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect()
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    })
    resize.observe(element)
    let frame = 0
    let active = true
    const visibility = () => {
      active = !document.hidden
      if (active) animate()
      else cancelAnimationFrame(frame)
    }
    function animate() {
      if (!active) return
      controls.autoRotate = !callbacks.current.paused
      controls.update()
      pickable.forEach((mesh) => mesh.scale.setScalar(mesh.userData.slug === callbacks.current.selected ? 1.5 : 1))
      renderer.render(scene, camera)
      frame = requestAnimationFrame(animate)
    }
    document.addEventListener('visibilitychange', visibility)
    animate()
    return () => {
      active = false
      cancelAnimationFrame(frame)
      resize.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      renderer.domElement.removeEventListener('pointerdown', pointerDown)
      renderer.domElement.removeEventListener('pointerup', pointerUp)
      controls.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [profiles])

  return <div ref={host} style={{ width: '100%', height: '100%', minHeight: 380 }}>
    {unavailable ? <p role="status" style={{ padding: 32 }}>The 3D view is unavailable here. All profiles and filters are available in the list below.</p> : null}
  </div>
}
