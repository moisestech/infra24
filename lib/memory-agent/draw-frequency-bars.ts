import type { MemoryAgentAudioVizPalette } from '@/lib/memory-agent/audio-viz-palette'

/** Shared bar count for mic + playback analysers (strip + hero canvas). */
export const MEMORY_AGENT_BAR_COUNT = 56

export function emptyFrequencyLevels(count = MEMORY_AGENT_BAR_COUNT): number[] {
  return Array.from({ length: count }, () => 0)
}

export type DrawMirroredFrequencyBarsOptions = {
  levels: number[]
  width: number
  height: number
  active: boolean
  palette: MemoryAgentAudioVizPalette
  /** 0–1 phase for idle / synthesizing placeholder animation */
  animationPhase?: number
}

/**
 * Draw mirrored frequency bars from horizontal center (tutorial-style).
 */
export function drawMirroredFrequencyBars(
  ctx: CanvasRenderingContext2D,
  options: DrawMirroredFrequencyBarsOptions
): void {
  const { levels, width, height, active, palette, animationPhase = 0 } = options

  ctx.clearRect(0, 0, width, height)

  const midY = height / 2
  const n = levels.length
  if (n === 0) return

  const slot = width / n
  const barW = Math.max(2, slot * 0.7)
  const lit = active || animationPhase > 0

  for (let i = 0; i < n; i++) {
    let v = levels[i] ?? 0
    if (!active && animationPhase > 0) {
      v = 0.1 + (Math.sin(animationPhase * 0.11 + i * 0.38) * 0.5 + 0.5) * 0.32
    }

    const barH = lit ? Math.max(3, v * height * 0.44) : height * 0.035
    const x = i * slot + (slot - barW) / 2
    const centerX = width / 2
    const dist = x + barW / 2 - centerX
    const mirrorX = centerX - dist - barW / 2

    ctx.fillStyle = palette.barColor({ index: i, total: n, level: v, lit })
    ctx.fillRect(mirrorX, midY - barH, barW, barH)
    ctx.fillRect(mirrorX, midY, barW, barH)
  }
}

/** Placeholder levels while TTS is loading (no playback FFT yet). */
export function synthesizingPlaceholderLevels(count: number, phase: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.sin(phase * 0.14 + i * 0.42) * 0.5 + 0.5
    return 0.1 + wave * 0.38
  })
}
