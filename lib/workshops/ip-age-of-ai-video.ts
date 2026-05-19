/** Single full-session recording for all syllabus modules */
export const IP_AGE_OF_AI_YOUTUBE_VIDEO_ID = 'VeUA5KgRO9A'

/** Landscape hero / video poster */
export const IP_AGE_OF_AI_LANDSCAPE_BANNER_URL =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1778264792/skills-age-of-ai_landscape-banner_ffazsw.webp'

/**
 * Parse timestamps used in `ipAgeOfAiWorkshop` modules.
 * - `MM:SS` with MM under 60
 * - `MMMM:SS` when minutes ≥ 60 (e.g. `60:45` → 60 minutes + 45 seconds)
 * - `H:MM:SS` when three segments are present
 */
export function parseWallTimeToSeconds(raw: string): number {
  const t = raw.trim()
  if (!t) return 0
  const parts = t.split(':').map((p) => Number(p.trim()))
  if (parts.some((n) => Number.isNaN(n))) return 0

  if (parts.length === 3) {
    const [h, m, s] = parts
    if (m >= 60 || s >= 60) return 0
    return h * 3600 + m * 60 + s
  }

  if (parts.length === 2) {
    const [a, b] = parts
    if (b >= 60) return 0
    if (a >= 60) return a * 60 + b
    return a * 60 + b
  }

  return 0
}

export function buildIpAgeOfAiYoutubeEmbedSrc(startSec: number, endSec: number): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    start: String(Math.max(0, Math.floor(startSec))),
  })
  if (Number.isFinite(endSec) && endSec > startSec) {
    params.set('end', String(Math.floor(endSec)))
  }
  return `https://www.youtube.com/embed/${IP_AGE_OF_AI_YOUTUBE_VIDEO_ID}?${params.toString()}`
}

export function buildIpAgeOfAiYoutubeWatchUrl(startSec: number): string {
  const t = Math.max(0, Math.floor(startSec))
  return `https://www.youtube.com/watch?v=${IP_AGE_OF_AI_YOUTUBE_VIDEO_ID}&t=${t}s`
}

/** Rough minutes from strings like `10m 25s` for catalog UI */
export function estimateMinutesFromDurationLabel(label: string): number {
  const m = label.match(/(\d+)\s*m/)
  const s = label.match(/(\d+)\s*s/)
  const minutes = m ? parseInt(m[1], 10) : 0
  const seconds = s ? parseInt(s[1], 10) : 0
  const total = minutes * 60 + seconds
  return Math.max(1, Math.round(total / 60))
}
