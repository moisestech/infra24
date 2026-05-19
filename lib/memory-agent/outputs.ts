import type {
  MemoryAgentClientOutputs,
  MemoryAgentLeadershipOutput,
  MemoryAgentMode,
  MemoryAgentPublicOutput,
  MemoryAgentSignageAudience,
  MemoryAgentSignageDraft,
  MemoryAgentStaffOutput,
  MemoryAgentTripleOutputs,
} from '@/types/memory-agent'

const SIGNAGE_AUDIENCES = new Set<MemoryAgentSignageAudience>([
  'public',
  'members',
  'residents',
  'guests',
  'staff',
])

function stringsArray(raw: unknown, maxItems: number): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((x): x is string => typeof x === 'string')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxItems)
}

function parseTitleSummaryBullets(raw: unknown): { title: string; summary: string; bullets: string[] } | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const title = typeof r.title === 'string' ? r.title.trim() : ''
  const summary = typeof r.summary === 'string' ? r.summary.trim() : ''
  const bullets = stringsArray(r.bullets, 12)
  if (!title || !summary || bullets.length === 0) return null
  return { title, summary, bullets }
}

export function parsePublicOutputSlice(raw: unknown): MemoryAgentPublicOutput | null {
  const t = parseTitleSummaryBullets(raw)
  if (!t) return null
  const r = raw as Record<string, unknown>
  const suggestedAction = typeof r.suggestedAction === 'string' ? r.suggestedAction.trim() : ''
  return { ...t, suggestedAction: suggestedAction || undefined }
}

export function parseStaffOutputSlice(raw: unknown): MemoryAgentStaffOutput | null {
  const t = parseTitleSummaryBullets(raw)
  if (!t) return null
  const r = raw as Record<string, unknown>
  const tasks = stringsArray(r.tasks, 16)
  const suggestedAction = typeof r.suggestedAction === 'string' ? r.suggestedAction.trim() : ''
  return {
    ...t,
    tasks: tasks.length ? tasks : undefined,
    suggestedAction: suggestedAction || undefined,
  }
}

export function parseLeadershipOutputSlice(raw: unknown): MemoryAgentLeadershipOutput | null {
  const t = parseTitleSummaryBullets(raw)
  if (!t) return null
  const r = raw as Record<string, unknown>
  const risks = stringsArray(r.risks, 12)
  const opportunities = stringsArray(r.opportunities, 12)
  const suggestedAction = typeof r.suggestedAction === 'string' ? r.suggestedAction.trim() : ''
  return {
    ...t,
    risks: risks.length ? risks : undefined,
    opportunities: opportunities.length ? opportunities : undefined,
    suggestedAction: suggestedAction || undefined,
  }
}

/** Validates the full triple from model JSON; returns null if any slice is invalid. */
export function parseTripleOutputs(raw: unknown): MemoryAgentTripleOutputs | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const pub = parsePublicOutputSlice(o.public)
  const staff = parseStaffOutputSlice(o.staff)
  const leadership = parseLeadershipOutputSlice(o.leadership)
  if (!pub || !staff || !leadership) return null
  return { public: pub, staff, leadership }
}

export function toClientOutputs(
  triple: MemoryAgentTripleOutputs | null | undefined,
  mode: MemoryAgentMode
): MemoryAgentClientOutputs | undefined {
  if (!triple) return undefined
  if (mode === 'public') return { public: triple.public }
  return triple
}

/**
 * Parses `outputs` from API JSON (supports public-only payload after server governance).
 */
export function parseClientOutputsFromApi(
  raw: unknown,
  mode: MemoryAgentMode
): MemoryAgentClientOutputs | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const o = raw as Record<string, unknown>
  const pub = parsePublicOutputSlice(o.public)
  if (!pub) return undefined
  if (mode === 'public') {
    return { public: pub }
  }
  const staff = parseStaffOutputSlice(o.staff)
  const leadership = parseLeadershipOutputSlice(o.leadership)
  if (!staff || !leadership) return undefined
  return { public: pub, staff, leadership }
}

function wordCount(s: string): number {
  const t = s.trim()
  if (!t) return 0
  return t.split(/\s+/).length
}

function hasLikelyPiiOrUnsafePatterns(s: string): boolean {
  if (s.includes('@')) return true
  if (/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(s)) return true
  return false
}

/** Extra checks for public-mode API responses (signage is visitor-facing). */
export function isPublicSafeSignage(draft: MemoryAgentSignageDraft): boolean {
  const parts = [draft.title, draft.subtitle, draft.body, draft.cta, draft.qrLabel, draft.locationHint]
  for (const p of parts) {
    if (p && hasLikelyPiiOrUnsafePatterns(p)) return false
  }
  return true
}

/**
 * Validates signage JSON from the model. Enforces short, signage-readable copy.
 * Returns null if invalid.
 */
export function parseSignageDraft(raw: unknown): MemoryAgentSignageDraft | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const title = typeof r.title === 'string' ? r.title.trim() : ''
  const body = typeof r.body === 'string' ? r.body.trim() : ''
  const cta = typeof r.cta === 'string' ? r.cta.trim() : ''
  if (!title || !body || !cta) return null
  if (wordCount(title) > 8) return null
  if (wordCount(body) > 40) return null
  if (wordCount(cta) > 8) return null

  let subtitle: string | undefined
  if (typeof r.subtitle === 'string') {
    const st = r.subtitle.trim()
    if (st) {
      if (wordCount(st) > 12) return null
      subtitle = st
    }
  }

  let qrLabel: string | undefined
  if (typeof r.qrLabel === 'string') {
    const q = r.qrLabel.trim()
    if (q) {
      if (wordCount(q) > 10 || q.length > 72) return null
      qrLabel = q
    }
  }

  let audience: MemoryAgentSignageAudience | undefined
  if (typeof r.audience === 'string') {
    const a = r.audience.trim() as MemoryAgentSignageAudience
    if (SIGNAGE_AUDIENCES.has(a)) audience = a
  }

  let locationHint: string | undefined
  if (typeof r.locationHint === 'string') {
    const lh = r.locationHint.trim()
    if (lh) {
      if (wordCount(lh) > 12 || lh.length > 96) return null
      locationHint = lh
    }
  }

  let expiresAt: string | undefined
  if (typeof r.expiresAt === 'string') {
    const e = r.expiresAt.trim()
    if (e) {
      if (e.length > 48) return null
      expiresAt = e
    }
  }

  let sourceOutput: 'public' | undefined
  if (r.sourceOutput === 'public') sourceOutput = 'public'

  return {
    title,
    subtitle,
    body,
    cta,
    qrLabel,
    audience,
    locationHint,
    expiresAt,
    sourceOutput,
  }
}

/**
 * Signage is only attached when the model produced a valid `outputs.public` (full triple path)
 * and a valid signage payload. In public mode, also requires `isPublicSafeSignage`.
 */
export function attachSignageForAsk(args: {
  signageRaw: unknown
  tripleOutputs: MemoryAgentTripleOutputs | undefined
}): MemoryAgentSignageDraft | undefined {
  if (!args.tripleOutputs?.public) return undefined
  const parsed = parseSignageDraft(args.signageRaw)
  if (!parsed) return undefined
  if (!isPublicSafeSignage(parsed)) return undefined
  return { ...parsed, sourceOutput: 'public' }
}

export function parseClientSignageFromApi(
  raw: unknown,
  outputs: MemoryAgentClientOutputs | undefined
): MemoryAgentSignageDraft | undefined {
  if (!outputs?.public) return undefined
  const parsed = parseSignageDraft(raw)
  if (!parsed) return undefined
  if (!isPublicSafeSignage(parsed)) return undefined
  return { ...parsed, sourceOutput: 'public' }
}
