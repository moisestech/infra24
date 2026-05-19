'use client'

import { useEffect, useRef } from 'react'

import type { MemoryAgentAudioVizPalette } from '@/lib/memory-agent/audio-viz-palette'
import { hslWithAlpha } from '@/lib/memory-agent/audio-viz-palette'

type MemoryWaveCanvasProps = {
  levels: number[]
  active: boolean
  variant: 'input' | 'output'
  height?: number
  palette: MemoryAgentAudioVizPalette
}

/**
 * Lightweight canvas line through level samples — org-colored gradient stroke.
 */
export function MemoryWaveCanvas({
  levels,
  active,
  variant,
  height = 44,
  palette,
}: MemoryWaveCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const paletteRef = useRef(palette)
  paletteRef.current = palette

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      const w = canvas.clientWidth
      const h = height
      if (w <= 0) return
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.clearRect(0, 0, w, h)
      const p = paletteRef.current

      if (levels.length < 2) return

      const mid = h / 2
      const step = w / (levels.length - 1)

      const points: { x: number; y: number }[] = []
      for (let i = 0; i < levels.length; i++) {
        const v = active ? Math.min(1, levels[i]! * 1.25) : 0.08
        points.push({
          x: i * step,
          y: mid - v * (h * 0.38) * (variant === 'output' ? 1.05 : 1),
        })
      }

      const lineGrad = ctx.createLinearGradient(0, 0, w, 0)
      for (const stop of p.waveLineGradientStops) {
        lineGrad.addColorStop(stop.offset, stop.color)
      }

      if (active) {
        ctx.beginPath()
        ctx.moveTo(points[0]!.x, points[0]!.y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i]!.x, points[i]!.y)
        }
        ctx.lineTo(w, mid)
        ctx.lineTo(0, mid)
        ctx.closePath()
        const fillGrad = ctx.createLinearGradient(0, 0, w, 0)
        for (const stop of p.waveLineGradientStops) {
          fillGrad.addColorStop(stop.offset, hslWithAlpha(stop.color, 0.28))
        }
        ctx.fillStyle = fillGrad
        ctx.globalAlpha = 0.65
        ctx.fill()
        ctx.globalAlpha = 1
      }

      ctx.beginPath()
      ctx.moveTo(points[0]!.x, points[0]!.y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i]!.x, points[i]!.y)
      }
      ctx.strokeStyle = active ? lineGrad : p.waveStroke(false)
      ctx.lineWidth = active ? 2.2 : 1.2
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.globalAlpha = active ? 0.98 : 0.4
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    draw()
    const ro = new ResizeObserver(() => draw())
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [levels, active, variant, height, palette])

  return (
    <canvas
      ref={ref}
      className="w-full rounded-md border border-border"
      style={{ height, background: palette.waveCanvasGradient }}
      aria-hidden
    />
  )
}
