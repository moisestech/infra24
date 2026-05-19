/**
 * Org-themed color gradation for Memory Agent audio visualizers (bars + line waves).
 * Builds a cyan-style ramp for Oolite and analogous ramps from each org primary/secondary/accent.
 */

export type MemoryAgentAudioVizColors = {
  primary: string
  secondary?: string
  accent?: string
}

export type MemoryAgentAudioVizPalette = {
  primary: string
  secondary: string
  accent: string
  /** CSS linear-gradient for line-wave canvas backgrounds */
  waveCanvasGradient: string
  barColor: (opts: {
    index: number
    total: number
    level: number
    lit: boolean
  }) => string
  waveStroke: (active: boolean) => string
  /** 0–1 stops for canvas line gradient along x-axis */
  waveLineGradientStops: { offset: number; color: string }[]
}

type Hsl = { h: number; s: number; l: number }

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpHue(a: number, b: number, t: number): number {
  const diff = ((b - a + 540) % 360) - 180
  return (a + diff * t + 360) % 360
}

function lerpHsl(a: Hsl, b: Hsl, t: number): Hsl {
  return {
    h: lerpHue(a.h, b.h, t),
    s: clamp(lerp(a.s, b.s, t), 0, 100),
    l: clamp(lerp(a.l, b.l, t), 0, 100),
  }
}

function hsl({ h, s, l }: Hsl, alpha?: number): string {
  if (alpha != null && alpha < 1) {
    return `hsla(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}% / ${alpha})`
  }
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`
}

/** Parse #rgb / #rrggbb (and bare 6-digit) to HSL. */
export function hexToHsl(hex: string): Hsl | null {
  let raw = hex.trim()
  if (raw.startsWith('#')) raw = raw.slice(1)
  if (raw.length === 3) {
    raw = raw
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (raw.length !== 6 || !/^[0-9a-fA-F]+$/.test(raw)) return null

  const r = parseInt(raw.slice(0, 2), 16) / 255
  const g = parseInt(raw.slice(2, 4), 16) / 255
  const b = parseInt(raw.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: l * 100 }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function deriveSecondary(primary: Hsl): Hsl {
  return {
    h: primary.h,
    s: clamp(primary.s + 6, 0, 100),
    l: clamp(primary.l - 14, 0, 100),
  }
}

function deriveAccent(primary: Hsl): Hsl {
  return {
    h: (primary.h + 8) % 360,
    s: clamp(primary.s - 12, 0, 100),
    l: clamp(primary.l + 22, 0, 100),
  }
}

/** Add alpha to an `hsl(...)` string from this module. */
export function hslWithAlpha(hslColor: string, alpha: number): string {
  if (hslColor.startsWith('hsla(')) return hslColor
  const inner = hslColor.slice(4, -1).trim()
  return `hsla(${inner} / ${alpha})`
}

export function createMemoryAgentAudioVizPalette(
  colors: MemoryAgentAudioVizColors
): MemoryAgentAudioVizPalette {
  const primaryHsl = hexToHsl(colors.primary) ?? { h: 192, s: 92, l: 37 }
  const secondaryHsl = colors.secondary
    ? hexToHsl(colors.secondary) ?? deriveSecondary(primaryHsl)
    : deriveSecondary(primaryHsl)
  const accentHsl = colors.accent
    ? hexToHsl(colors.accent) ?? deriveAccent(primaryHsl)
    : deriveAccent(primaryHsl)

  const deep = lerpHsl(secondaryHsl, primaryHsl, 0.35)
  const mid = primaryHsl
  const bright = lerpHsl(primaryHsl, accentHsl, 0.65)
  const peak = accentHsl

  const waveLineGradientStops = [
    { offset: 0, color: hsl(deep) },
    { offset: 0.35, color: hsl(mid) },
    { offset: 0.7, color: hsl(bright) },
    { offset: 1, color: hsl(peak) },
  ]

  return {
    primary: colors.primary,
    secondary: colors.secondary ?? colors.primary,
    accent: colors.accent ?? colors.primary,
    waveCanvasGradient: `linear-gradient(180deg, ${hsl(lerpHsl(deep, mid, 0.5), 0.35)} 0%, ${hsl(mid, 0.08)} 100%)`,
    waveLineGradientStops,
    waveStroke(active) {
      return active ? hsl(mid) : hsl(deep, 0.45)
    },
    barColor({ index, total, level, lit }) {
      const t = total > 1 ? index / (total - 1) : 0
      const base = lerpHsl(deep, peak, t)
      if (!lit) {
        return hsl({ ...base, s: base.s * 0.42, l: clamp(base.l - 6, 18, 55) })
      }
      const amp = Math.min(1, level * 1.35)
      return hsl({
        h: base.h,
        s: clamp(base.s + amp * 10, 0, 100),
        l: clamp(base.l + amp * 14 - 4, 28, 82),
      })
    },
  }
}
