'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TimelineEvent } from './FilmstripTimeline'

/**
 * MiniMapDensity
 * - Renders a density heatmap (canvas) across the full timeline domain
 * - Shows a draggable viewport rectangle synced to the filmstrip's scrollLeft
 * - Click / drag to navigate; updates as you scroll or resize
 */
export function MiniMapDensity({
  events,
  scrollRef,
  height = 56,
  neon = '#00ff00',
  binCount, // optional: override auto bins
}: {
  events: TimelineEvent[]
  scrollRef: React.RefObject<HTMLElement|null>
  height?: number
  neon?: string
  binCount?: number
}) {
  const wrapRef = useRef<HTMLDivElement|null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const [w, setW] = useState(0)

  // domain
  const [minTs, maxTs] = useMemo(() => {
    if (events.length === 0) return [0, 1]
    const first = new Date(events[0].date).getTime()
    const last  = new Date(events[events.length - 1].date).getTime()
    return [first, last]
  }, [events])

  // resize observer to redraw canvas
  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        setW(Math.round(e.contentRect.width))
      }
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  // build density bins (light smoothing)
  const bins = useMemo(() => {
    const N = binCount ?? Math.max(64, Math.min(240, Math.round(w / 6)))
    const arr = new Array(N).fill(0)
    if (events.length === 0 || minTs === maxTs) return arr
    const range = maxTs - minTs
    for (const ev of events) {
      const t = (new Date(ev.date).getTime() - minTs) / range
      const i = Math.max(0, Math.min(N-1, Math.floor(t * N)))
      arr[i] += 1
    }
    // simple smoothing (triangular kernel)
    const smooth = arr.slice()
    for (let i=0;i<N;i++){
      const a = arr[i-1] ?? 0
      const b = arr[i]
      const c = arr[i+1] ?? 0
      smooth[i] = (a + 2*b + c) / 4
    }
    return smooth
  }, [events, minTs, maxTs, w, binCount])

  // draw heatmap
  useEffect(() => {
    const c = canvasRef.current
    if (!c || w === 0) return
    const ctx = c.getContext('2d', { alpha: true })
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const H = height
    c.width = Math.round(w * dpr)
    c.height = Math.round(H * dpr)
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, H)

    const maxVal = Math.max(1, Math.max(...bins))
    const N = bins.length
    const colW = w / N

    for (let i=0;i<N;i++){
      const v = bins[i] / maxVal // 0..1
      // map density to neon alpha; tweak curve for pop
      const alpha = Math.pow(v, 0.8) // perceptual boost
      ctx.fillStyle = hexToRgba(neon, 0.15 + alpha * 0.75)
      ctx.fillRect(i * colW, 0, Math.ceil(colW)+1, H)
    }

    // top/bottom glow strokes
    ctx.strokeStyle = hexToRgba(neon, 0.3)
    ctx.beginPath()
    ctx.moveTo(0, 0.5)
    ctx.lineTo(w, 0.5)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, H - 0.5)
    ctx.lineTo(w, H - 0.5)
    ctx.stroke()
  }, [bins, w, height, neon])

  // sync viewport rect with rail scroll
  const [vpLeft, setVpLeft] = useState(0)     // px in mini-map
  const [vpWidth, setVpWidth] = useState(40)  // px in mini-map

  const syncViewport = useCallback(() => {
    const rail = scrollRef.current
    const wrap = wrapRef.current
    if (!rail || !wrap) return
    const sw = (rail as HTMLElement).scrollWidth
    const cw = (rail as HTMLElement).clientWidth
    const sl = (rail as HTMLElement).scrollLeft
    if (sw <= cw) { setVpLeft(0); setVpWidth(w); return }
    const fracLeft = sl / sw
    const fracWidth = cw / sw
    setVpLeft(fracLeft * w)
    setVpWidth(Math.max(24, fracWidth * w))
  }, [scrollRef, w])

  useEffect(() => {
    syncViewport()
    const rail = scrollRef.current as HTMLElement | null
    if (!rail) return
    const onScroll = () => syncViewport()
    rail.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(syncViewport)
    ro.observe(rail)
    return () => { rail.removeEventListener('scroll', onScroll); ro.disconnect() }
  }, [scrollRef, syncViewport])

  // drag to navigate
  const dragging = useRef(false)
  const dragOffset = useRef(0)

  const setScrollFromMini = (centerX: number) => {
    const rail = scrollRef.current as HTMLElement | null
    if (!rail) return
    const sw = rail.scrollWidth, cw = rail.clientWidth
    if (sw <= cw) return
    // target left so that viewport centers at centerX
    const targetLeft = (centerX - vpWidth/2) / w * sw
    rail.scrollTo({ left: clamp(targetLeft, 0, sw - cw), behavior: 'smooth' })
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - box.left
    // if pointer inside current viewport: start dragging with offset
    if (x >= vpLeft && x <= vpLeft + vpWidth) {
      dragging.current = true
      dragOffset.current = x - vpLeft
    } else {
      // jump to position (center)
      setScrollFromMini(x)
    }
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const box = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - box.left
    const left = clamp(x - dragOffset.current + vpWidth/2, vpWidth/2, w - vpWidth/2)
    setScrollFromMini(left)
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
  }

  return (
    <div ref={wrapRef} className="relative w-full select-none">
      {/* heatmap canvas */}
      <canvas ref={canvasRef} style={{ width: '100%', height }} />

      {/* draggable viewport */}
      <div
        role="slider"
        aria-label="Timeline viewport"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((vpLeft / Math.max(1, w - vpWidth)) * 100)}
        tabIndex={0}
        onKeyDown={(e) => {
          const rail = scrollRef.current as HTMLElement | null
          if (!rail) return
          const step = rail.clientWidth * 0.2
          if (e.key === 'ArrowRight') rail.scrollBy({ left:  step, behavior: 'smooth' })
          if (e.key === 'ArrowLeft')  rail.scrollBy({ left: -step, behavior: 'smooth' })
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="absolute top-0 h-full rounded-md border"
        style={{
          left: vpLeft,
          width: vpWidth,
          borderColor: `${neon}AA`,
          boxShadow: `inset 0 0 0 1px ${neon}AA, 0 0 12px ${neon}66`,
          background: 'linear-gradient(to bottom, rgba(0,0,0,.10), rgba(0,0,0,.20))',
          cursor: 'grab',
        }}
      />
    </div>
  )
}

/* ---------- utils ---------- */

function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)) }

function hexToRgba(hex: string, alpha = 1) {
  const m = hex.replace('#','')
  const bigint = parseInt(m.length===3 ? m.split('').map(c=>c+c).join('') : m, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r},${g},${b},${alpha})`
}
