/** Two-letter initials for avatar fallbacks (display names, duos with “ & ”, etc.). */
export function initialsFromDisplayName(name: string): string {
  const n = name.trim()
  if (!n) return '—'

  if (n.includes(' & ')) {
    const [a, b] = n.split(' & ').map((s) => s.trim())
    const wa = a.split(/\s+/).filter(Boolean)
    const wb = b.split(/\s+/).filter(Boolean)
    const left = wa[0]?.[0] ?? '?'
    const right = wb[wb.length - 1]?.[0] ?? wb[0]?.[0] ?? '?'
    return (left + right).toUpperCase()
  }

  const words = n.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }
  if (words.length === 1) {
    const w = words[0]
    if (w.length >= 2) return w.slice(0, 2).toUpperCase()
    return (w[0] ?? '?').toUpperCase()
  }
  return '?'
}
