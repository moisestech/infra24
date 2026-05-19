'use client'

import { useEffect, useRef, useState } from 'react'

import type { MemoryAgentAudioVizPalette } from '@/lib/memory-agent/audio-viz-palette'
import {
  MEMORY_AGENT_BAR_COUNT,
  synthesizingPlaceholderLevels,
} from '@/lib/memory-agent/draw-frequency-bars'
import { cn } from '@/lib/utils'

type OutputStatus = 'idle' | 'loading' | 'live'

type MemoryAgentWaveformStripProps = {
  inputLevels: number[]
  outputLevels: number[]
  inputActive: boolean
  outputStatus: OutputStatus
  palette: MemoryAgentAudioVizPalette
}

function WaveRow({
  label,
  levels,
  active,
  variant,
  statusLabel,
  synthesizing = false,
  palette,
}: {
  label: string
  levels: number[]
  active: boolean
  variant: 'input' | 'output'
  statusLabel: string
  synthesizing?: boolean
  palette: MemoryAgentAudioVizPalette
}) {
  const phaseRef = useRef(0)
  const [displayLevels, setDisplayLevels] = useState(levels)

  useEffect(() => {
    if (!synthesizing) {
      setDisplayLevels(levels)
      return
    }
    let raf: number
    const tick = () => {
      phaseRef.current += 1
      setDisplayLevels(
        synthesizingPlaceholderLevels(
          levels.length || MEMORY_AGENT_BAR_COUNT,
          phaseRef.current
        )
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [synthesizing, levels])

  const barsLit = active || synthesizing
  const n = displayLevels.length

  const aria =
    variant === 'input'
      ? active
        ? `${label}: live microphone levels`
        : `${label}: idle`
      : statusLabel === 'Live'
        ? `${label}: live playback levels`
        : statusLabel === 'Synthesizing…'
          ? `${label}: speech synthesizing`
          : `${label}: idle`

  return (
    <div
      className="rounded-lg border border-border px-3 py-2"
      style={{ background: palette.waveCanvasGradient }}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">
          {label}
        </span>
        <span
          className={cn(
            'text-[10px] font-medium',
            barsLit ? 'text-[var(--ma-text)]' : 'text-[var(--ma-text-muted)]'
          )}
          style={barsLit ? { color: palette.primary } : undefined}
        >
          {statusLabel}
        </span>
      </div>
      <div
        className="flex h-11 items-end justify-between gap-px rounded-md bg-[var(--ma-surface-muted)]/80 px-1 py-1"
        role="img"
        aria-label={aria}
      >
        {displayLevels.map((v, i) => {
          const pct = barsLit
            ? `${Math.max(12, Math.round((0.08 + Math.min(1, v * 1.25)) * 100))}%`
            : '10%'
          const barColor = palette.barColor({
            index: i,
            total: n,
            level: v,
            lit: barsLit,
          })
          return (
            <span
              key={i}
              className="min-w-[2px] flex-1 rounded-sm transition-[height,opacity,box-shadow] duration-75"
              style={{
                height: pct,
                backgroundColor: barColor,
                opacity: barsLit ? 0.92 : 0.35,
                boxShadow: barsLit
                  ? `0 0 6px ${palette.primary}55`
                  : undefined,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * Side-by-side intake (mic) and output (TTS / audio element) bar visualizer.
 * Uses Web Audio frequency data from parent hooks — no extra npm packages.
 */
export function MemoryAgentWaveformStrip({
  inputLevels,
  outputLevels,
  inputActive,
  outputStatus,
  palette,
}: MemoryAgentWaveformStripProps) {
  const outputLabel =
    outputStatus === 'live' ? 'Live' : outputStatus === 'loading' ? 'Synthesizing…' : 'Idle'
  const outputBarsActive = outputStatus === 'live'
  const outputSynthesizing = outputStatus === 'loading'

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <WaveRow
        label="Input"
        levels={inputLevels}
        active={inputActive}
        variant="input"
        statusLabel={inputActive ? 'Live' : 'Idle'}
        palette={palette}
      />
      <WaveRow
        label="Output"
        levels={outputLevels}
        active={outputBarsActive}
        synthesizing={outputSynthesizing}
        variant="output"
        statusLabel={outputLabel}
        palette={palette}
      />
    </div>
  )
}
