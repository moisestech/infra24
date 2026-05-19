'use client'

import { useEffect, useRef, useState } from 'react'

import type { MemoryAgentAudioVizPalette } from '@/lib/memory-agent/audio-viz-palette'
import {
  drawMirroredFrequencyBars,
  emptyFrequencyLevels,
  MEMORY_AGENT_BAR_COUNT,
  synthesizingPlaceholderLevels,
} from '@/lib/memory-agent/draw-frequency-bars'
import { cn } from '@/lib/utils'

export type MemoryAgentFrequencyCanvasProps = {
  levels: number[]
  active: boolean
  variant: 'input' | 'output' | 'idle'
  /** ElevenLabs fetch in progress — animated placeholder bars */
  synthesizing?: boolean
  palette: MemoryAgentAudioVizPalette
  height?: number
  className?: string
  'aria-label'?: string
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function normalizeLevels(levels: number[]): number[] {
  if (levels.length === MEMORY_AGENT_BAR_COUNT) return levels
  if (levels.length > MEMORY_AGENT_BAR_COUNT) return levels.slice(0, MEMORY_AGENT_BAR_COUNT)
  return [...levels, ...emptyFrequencyLevels(MEMORY_AGENT_BAR_COUNT - levels.length)]
}

/**
 * Hero frequency bar visualizer (Web Audio levels → canvas, mirrored bars).
 */
export function MemoryAgentFrequencyCanvas({
  levels,
  active,
  variant,
  synthesizing = false,
  palette,
  height = 140,
  className,
  'aria-label': ariaLabel,
}: MemoryAgentFrequencyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const levelsRef = useRef(levels)
  const paletteRef = useRef(palette)
  const phaseRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  levelsRef.current = levels
  paletteRef.current = palette

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawFrame = () => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      const w = canvas.clientWidth
      const h = height
      if (w <= 0) return

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const base = normalizeLevels(levelsRef.current)
      const displayLevels =
        synthesizing && !active
          ? synthesizingPlaceholderLevels(MEMORY_AGENT_BAR_COUNT, phaseRef.current)
          : base

      const showIdlePulse =
        !reducedMotion && variant === 'idle' && !active && !synthesizing

      drawMirroredFrequencyBars(ctx, {
        levels: displayLevels,
        width: w,
        height: h,
        active: active && !synthesizing,
        palette: paletteRef.current,
        animationPhase:
          synthesizing || showIdlePulse ? phaseRef.current : 0,
      })
    }

    const shouldAnimate =
      !reducedMotion && (active || synthesizing || variant === 'idle')

    if (!shouldAnimate) {
      drawFrame()
      return
    }

    const tick = () => {
      if (shouldAnimate) phaseRef.current += 1
      drawFrame()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [active, synthesizing, variant, palette, height, reducedMotion])

  const label =
    ariaLabel ??
    (variant === 'input' && active
      ? 'Live microphone frequency visualization'
      : variant === 'output' && active
        ? 'Live speech playback visualization'
        : synthesizing
          ? 'Synthesizing speech'
          : 'Audio visualizer idle')

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'w-full rounded-xl border border-border',
        className
      )}
      style={{
        height,
        background: palette.waveCanvasGradient,
      }}
      role="img"
      aria-label={label}
    />
  )
}
