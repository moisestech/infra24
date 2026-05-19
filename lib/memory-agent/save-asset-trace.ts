import type {
  MemoryAgentContextInspector,
  MemoryAgentGeneratedAssetType,
  MemoryAgentMode,
} from '@/types/memory-agent'

/** Keys the server accepts on POST `asset.metadata` (defensive allowlist). */
export const MEMORY_AGENT_ASSET_METADATA_KEYS = [
  'generatedBy',
  'sourceMode',
  'sourceQuestion',
  'createdFromMessageId',
  'assetType',
  'selectedRecordCount',
  'allowedArtistIds',
  'totalCandidateCount',
  'baseTotalCount',
  'contextCharacterCount',
  'promptVersion',
  'outputTypes',
] as const

const PROMPT_VERSION = 'memory-agent-json-v1'

/**
 * Lightweight trace packet stored in `metadata` JSON (no new DB columns).
 * Safe to claim: question, mode, coarse retrieval counts, message id — not full prompt text.
 */
export function buildSaveAssetTraceMetadata(input: {
  sourceMode: MemoryAgentMode
  assetType: MemoryAgentGeneratedAssetType
  sourceQuestion: string
  sourceMessageId?: string
  contextInspector?: MemoryAgentContextInspector
  /** Coarse labels for what the assistant message contained (e.g. public, staff, leadership, signage). */
  outputKinds?: string[]
}): Record<string, unknown> {
  const out: Record<string, unknown> = {
    generatedBy: 'memory-agent',
    sourceMode: input.sourceMode,
    sourceQuestion: input.sourceQuestion.trim().slice(0, 500),
    assetType: input.assetType,
    promptVersion: PROMPT_VERSION,
  }
  if (input.sourceMessageId) {
    out.createdFromMessageId = input.sourceMessageId
  }
  const r = input.contextInspector?.retrieval
  if (r) {
    out.selectedRecordCount = r.selectedCount
    if (typeof r.totalCandidateCount === 'number') out.totalCandidateCount = r.totalCandidateCount
    if (typeof r.baseTotalCount === 'number') out.baseTotalCount = r.baseTotalCount
    if (Array.isArray(r.allowedArtistIds) && r.allowedArtistIds.length) {
      out.allowedArtistIds = r.allowedArtistIds
        .filter((id): id is string => typeof id === 'string')
        .slice(0, 64)
        .map((id) => id.slice(0, 64))
    }
  }
  const cc = input.contextInspector?.contextPreview?.characterCount
  if (typeof cc === 'number' && Number.isFinite(cc)) {
    out.contextCharacterCount = Math.min(cc, 2_000_000)
  }
  const kinds =
    input.outputKinds?.length &&
    input.outputKinds.every((k) => typeof k === 'string' && k.length <= 48)
      ? input.outputKinds.slice(0, 12)
      : [input.assetType]
  out.outputTypes = kinds
  return out
}

/** Strip unknown keys and oversized values before merge with server-only fields. */
export function sanitizeClientAssetMetadata(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const o = raw as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const key of MEMORY_AGENT_ASSET_METADATA_KEYS) {
    if (!(key in o)) continue
    const v = o[key]
    switch (key) {
      case 'generatedBy':
      case 'sourceMode':
      case 'assetType':
      case 'promptVersion':
        if (typeof v === 'string' && v.length <= 200) out[key] = v
        break
      case 'sourceQuestion':
        if (typeof v === 'string') out[key] = v.slice(0, 500)
        break
      case 'createdFromMessageId':
        if (typeof v === 'string' && v.length <= 200) out[key] = v
        break
      case 'selectedRecordCount':
      case 'totalCandidateCount':
      case 'baseTotalCount':
      case 'contextCharacterCount':
        if (typeof v === 'number' && Number.isFinite(v)) out[key] = Math.min(Math.max(0, v), 10_000_000)
        break
      case 'allowedArtistIds':
        if (Array.isArray(v)) {
          const ids = v
            .filter((x): x is string => typeof x === 'string')
            .slice(0, 64)
            .map((s) => s.slice(0, 64))
          if (ids.length) out[key] = ids
        }
        break
      case 'outputTypes':
        if (Array.isArray(v)) {
          const parts = v
            .filter((x): x is string => typeof x === 'string')
            .slice(0, 12)
            .map((s) => s.slice(0, 48))
          if (parts.length) out[key] = parts
        }
        break
      default:
        break
    }
  }
  return out
}

const METADATA_JSON_MAX_BYTES = 12_000

export function mergeAssetMetadataForInsert(
  clientMeta: Record<string, unknown>,
  serverMeta: Record<string, unknown>
): Record<string, unknown> {
  const merged = { ...sanitizeClientAssetMetadata(clientMeta), ...serverMeta }
  let s = JSON.stringify(merged)
  if (s.length <= METADATA_JSON_MAX_BYTES) return merged
  const slim = { ...merged }
  delete slim.sourceQuestion
  s = JSON.stringify(slim)
  if (s.length <= METADATA_JSON_MAX_BYTES) return slim
  return { ...serverMeta, generatedBy: 'memory-agent', traceTruncated: true }
}
