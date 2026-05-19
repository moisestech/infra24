import type {
  MemoryAgentGeneratedAsset,
  MemoryAgentGeneratedAssetAudience,
  MemoryAgentGeneratedAssetChannel,
  MemoryAgentGeneratedAssetType,
  MemoryAgentEventCard,
  MemoryAgentLeadershipOutput,
  MemoryAgentPublicOutput,
  MemoryAgentSignageDraft,
  MemoryAgentStaffOutput,
} from '@/types/memory-agent'
import { formatEventCardSummaryText } from '@/lib/memory-agent/event-card-urls'

const STORAGE_PREFIX = 'memory-agent-generated-assets:'

function generatedAssetsStorageKey(orgSlug: string): string {
  return `${STORAGE_PREFIX}${orgSlug}`
}

export function getMemoryAgentHandoffPath(orgSlug: string, assetId: string): string {
  return `/o/${encodeURIComponent(orgSlug)}/memory-agent/handoff/${encodeURIComponent(assetId)}`
}

/** Absolute handoff URL for QR, copy-to-clipboard, and share targets. */
export function getMemoryAgentHandoffAbsoluteUrl(
  origin: string,
  orgSlug: string,
  assetId: string
): string {
  const base = origin.replace(/\/$/, '')
  return `${base}${getMemoryAgentHandoffPath(orgSlug, assetId)}`
}

export function isPublicHandoffAssetType(type: MemoryAgentGeneratedAssetType): boolean {
  return type === 'public_output' || type === 'signage_draft' || type === 'qr_handoff'
}

/**
 * Whether the asset may appear on the public handoff URL / QR (queue + local fallback).
 * Matches server `evaluatePublicHandoff`: public visibility, approved or published status,
 * channel `qr_handoff`, and non-expired handoff types.
 */
export function isGeneratedAssetHandoffPublished(asset: MemoryAgentGeneratedAsset): boolean {
  if (!isPublicHandoffAssetType(asset.type)) return false
  if (asset.status === 'archived') return false
  if (asset.status !== 'approved' && asset.status !== 'published') return false
  if (asset.visibility !== 'public') return false
  if (asset.channel !== 'qr_handoff') return false
  if (asset.expiresAt) {
    const t = Date.parse(asset.expiresAt)
    if (Number.isFinite(t) && t < Date.now()) return false
  }
  return true
}

function newAssetId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `ma-asset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function isAssetRecord(x: unknown): x is MemoryAgentGeneratedAsset {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.organizationSlug === 'string' &&
    typeof o.type === 'string' &&
    typeof o.status === 'string' &&
    typeof o.title === 'string' &&
    typeof o.body === 'string' &&
    typeof o.sourceQuestion === 'string' &&
    typeof o.createdAt === 'string'
  )
}

export function loadGeneratedAssetsFromStorage(orgSlug: string): MemoryAgentGeneratedAsset[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(generatedAssetsStorageKey(orgSlug))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isAssetRecord).filter((a) => a.organizationSlug === orgSlug)
  } catch {
    return []
  }
}

export function findGeneratedAssetById(
  orgSlug: string,
  assetId: string
): MemoryAgentGeneratedAsset | undefined {
  return loadGeneratedAssetsFromStorage(orgSlug).find((a) => a.id === assetId)
}

export function persistGeneratedAssetsToStorage(
  orgSlug: string,
  assets: MemoryAgentGeneratedAsset[]
): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(generatedAssetsStorageKey(orgSlug), JSON.stringify(assets))
  } catch {
    // Quota or private mode — ignore
  }
}

function joinBullets(bullets: string[]): string {
  return bullets.map((b) => `• ${b}`).join('\n')
}

export function buildPublicOutputAsset(
  slice: MemoryAgentPublicOutput,
  organizationSlug: string,
  meta: { sourceQuestion: string; sourceMessageId?: string }
): MemoryAgentGeneratedAsset {
  const bodyParts = [slice.summary, joinBullets(slice.bullets)]
  if (slice.suggestedAction) bodyParts.push(`Suggested action: ${slice.suggestedAction}`)
  return {
    id: newAssetId(),
    organizationSlug,
    type: 'public_output',
    status: 'draft',
    title: slice.title,
    summary: slice.summary,
    body: bodyParts.join('\n\n'),
    bullets: slice.bullets,
    sourceQuestion: meta.sourceQuestion,
    sourceMessageId: meta.sourceMessageId,
    createdAt: new Date().toISOString(),
    audience: 'public',
  }
}

export function buildStaffBriefAsset(
  slice: MemoryAgentStaffOutput,
  organizationSlug: string,
  meta: { sourceQuestion: string; sourceMessageId?: string }
): MemoryAgentGeneratedAsset {
  const bodyParts = [slice.summary, joinBullets(slice.bullets)]
  if (slice.tasks?.length) {
    bodyParts.push('Tasks:\n' + slice.tasks.map((t) => `- ${t}`).join('\n'))
  }
  if (slice.suggestedAction) bodyParts.push(`Suggested action: ${slice.suggestedAction}`)
  return {
    id: newAssetId(),
    organizationSlug,
    type: 'staff_brief',
    status: 'draft',
    title: slice.title,
    summary: slice.summary,
    body: bodyParts.join('\n\n'),
    bullets: slice.bullets,
    sourceQuestion: meta.sourceQuestion,
    sourceMessageId: meta.sourceMessageId,
    createdAt: new Date().toISOString(),
    audience: 'staff',
  }
}

export function buildLeadershipInsightAsset(
  slice: MemoryAgentLeadershipOutput,
  organizationSlug: string,
  meta: { sourceQuestion: string; sourceMessageId?: string }
): MemoryAgentGeneratedAsset {
  const bodyParts = [slice.summary, joinBullets(slice.bullets)]
  if (slice.risks?.length) {
    bodyParts.push('Risks:\n' + slice.risks.map((r) => `- ${r}`).join('\n'))
  }
  if (slice.opportunities?.length) {
    bodyParts.push('Opportunities:\n' + slice.opportunities.map((o) => `- ${o}`).join('\n'))
  }
  if (slice.suggestedAction) bodyParts.push(`Suggested action: ${slice.suggestedAction}`)
  return {
    id: newAssetId(),
    organizationSlug,
    type: 'leadership_insight',
    status: 'draft',
    title: slice.title,
    summary: slice.summary,
    body: bodyParts.join('\n\n'),
    bullets: slice.bullets,
    sourceQuestion: meta.sourceQuestion,
    sourceMessageId: meta.sourceMessageId,
    createdAt: new Date().toISOString(),
    audience: 'leadership',
  }
}

function signageMetaLines(draft: MemoryAgentSignageDraft): string[] {
  const lines: string[] = []
  if (draft.audience) lines.push(`Audience: ${draft.audience}`)
  if (draft.locationHint) lines.push(`Location: ${draft.locationHint}`)
  if (draft.expiresAt) lines.push(`Expires: ${draft.expiresAt}`)
  return lines
}

export function formatSignageAssetBody(draft: MemoryAgentSignageDraft): string {
  const parts = [draft.title]
  if (draft.subtitle) parts.push(draft.subtitle)
  parts.push('', draft.body)
  const meta = signageMetaLines(draft)
  if (meta.length) parts.push('', meta.join('\n'))
  parts.push('', draft.cta)
  return parts.join('\n')
}

export function formatQrHandoffBody(draft: MemoryAgentSignageDraft): string {
  const label = draft.qrLabel?.trim() || 'Scan to explore'
  return `${label}\n${draft.cta}`.trim()
}

export function buildSignageDraftAsset(
  draft: MemoryAgentSignageDraft,
  organizationSlug: string,
  meta: { sourceQuestion: string; sourceMessageId?: string }
): MemoryAgentGeneratedAsset {
  return {
    id: newAssetId(),
    organizationSlug,
    type: 'signage_draft',
    status: 'draft',
    title: draft.title,
    summary: draft.subtitle,
    body: formatSignageAssetBody(draft),
    sourceQuestion: meta.sourceQuestion,
    sourceMessageId: meta.sourceMessageId,
    createdAt: new Date().toISOString(),
    audience: draft.audience as MemoryAgentGeneratedAssetAudience | undefined,
    locationHint: draft.locationHint,
    expiresAt: draft.expiresAt,
  }
}

export function buildQrHandoffAsset(
  draft: MemoryAgentSignageDraft,
  organizationSlug: string,
  meta: { sourceQuestion: string; sourceMessageId?: string }
): MemoryAgentGeneratedAsset {
  return {
    id: newAssetId(),
    organizationSlug,
    type: 'qr_handoff',
    status: 'draft',
    title: `QR handoff · ${draft.title}`.slice(0, 120),
    summary: draft.qrLabel?.trim() || 'Scan to explore',
    body: formatQrHandoffBody(draft),
    sourceQuestion: meta.sourceQuestion,
    sourceMessageId: meta.sourceMessageId,
    createdAt: new Date().toISOString(),
    audience: 'guests',
  }
}

export function buildSignageDraftFromEventCard(
  event: MemoryAgentEventCard,
  organizationSlug: string,
  meta: { sourceQuestion: string; sourceMessageId?: string }
): MemoryAgentGeneratedAsset {
  const bodyParts: string[] = []
  if (event.summary?.trim()) bodyParts.push(event.summary.trim())
  if (event.startsAt) {
    const d = new Date(event.startsAt)
    if (!Number.isNaN(d.getTime())) {
      bodyParts.push(
        d.toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      )
    }
  }
  if (event.location?.trim()) bodyParts.push(event.location.trim())

  const draft: MemoryAgentSignageDraft = {
    title: event.title.slice(0, 80),
    body: bodyParts.join('\n\n').slice(0, 500) || event.title,
    cta: event.ctaLabel?.trim() || 'Learn more',
    audience: 'public',
    locationHint: event.location,
    sourceOutput: 'public',
  }
  return buildSignageDraftAsset(draft, organizationSlug, meta)
}

export function buildEventSummaryAsset(
  event: MemoryAgentEventCard,
  organizationSlug: string,
  meta: { sourceQuestion: string; sourceMessageId?: string }
): MemoryAgentGeneratedAsset {
  const body = formatEventCardSummaryText(event)
  return {
    id: newAssetId(),
    organizationSlug,
    type: 'public_output',
    status: 'draft',
    title: event.title.slice(0, 120),
    summary: event.summary?.slice(0, 220),
    body,
    sourceQuestion: meta.sourceQuestion,
    sourceMessageId: meta.sourceMessageId,
    createdAt: new Date().toISOString(),
    audience: 'public',
    channel: 'web',
    metadata: {
      eventCardId: event.id,
      sourceRecordId: event.sourceRecordId,
      source: event.source,
    },
  }
}

export const MEMORY_AGENT_ASSET_TYPE_LABELS: Record<MemoryAgentGeneratedAssetType, string> = {
  public_output: 'Public',
  staff_brief: 'Staff',
  leadership_insight: 'Leadership',
  signage_draft: 'Signage',
  qr_handoff: 'QR handoff',
}

export const MEMORY_AGENT_CHANNEL_LABELS: Record<MemoryAgentGeneratedAssetChannel, string> = {
  web: 'Web',
  lobby_signage: 'Lobby signage',
  qr_handoff: 'QR handoff',
  staff_brief: 'Staff brief',
  leadership: 'Leadership',
  report: 'Report',
}
