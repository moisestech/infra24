/** Stable accent colors from a name — used when no profile photo is available. */
export function artistPlaceholderPalette(seed: string): {
  from: string
  to: string
  accent: string
} {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  const hue = hash % 360
  const hue2 = (hue + 38) % 360
  return {
    from: `hsl(${hue} 48% 38%)`,
    to: `hsl(${hue2} 55% 24%)`,
    accent: `hsl(${(hue + 12) % 360} 65% 88%)`,
  }
}
