import type { SupabaseClient } from '@supabase/supabase-js'

import { isPublicHandoffAssetType } from '@/lib/memory-agent/generated-assets'
import type {
  MemoryAgentGeneratedAsset,
  MemoryAgentGeneratedAssetAudience,
  MemoryAgentGeneratedAssetChannel,
  MemoryAgentGeneratedAssetStatus,
  MemoryAgentGeneratedAssetType,
  MemoryAgentGeneratedAssetVisibility,
} from '@/types/memory-agent'

export type GeneratedAssetDbRow = {
  id: string
  organization_id: string
  organization_slug: string
  type: string
  status: string
  visibility: string
  channel: string | null
  title: string
  summary: string | null
  body: string
  bullets: unknown
  source_question: string
  source_message_id: string | null
  audience: string | null
  location_hint: string | null
  expires_at: string | null
  tags: unknown
  created_by: string | null
  approved_by: string | null
  metadata: unknown
  created_at: string
  updated_at: string
  approved_at: string | null
  published_at: string | null
}

const ASSET_TYPES: MemoryAgentGeneratedAssetType[] = [
  'public_output',
  'staff_brief',
  'leadership_insight',
  'signage_draft',
  'qr_handoff',
]

const ASSET_STATUSES: MemoryAgentGeneratedAssetStatus[] = [
  'draft',
  'review',
  'approved',
  'published',
  'archived',
]

const VIS: MemoryAgentGeneratedAssetVisibility[] = ['internal', 'public']

const CHANNELS: MemoryAgentGeneratedAssetChannel[] = [
  'web',
  'lobby_signage',
  'qr_handoff',
  'staff_brief',
  'leadership',
  'report',
]

function isAssetType(x: string): x is MemoryAgentGeneratedAssetType {
  return (ASSET_TYPES as string[]).includes(x)
}

function isAssetStatus(x: string): x is MemoryAgentGeneratedAssetStatus {
  return (ASSET_STATUSES as string[]).includes(x)
}

function isVisibility(x: string): x is MemoryAgentGeneratedAssetVisibility {
  return (VIS as string[]).includes(x)
}

function isChannel(x: string | null | undefined): x is MemoryAgentGeneratedAssetChannel {
  return x != null && (CHANNELS as string[]).includes(x)
}

function parseBullets(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const out = raw.filter((b): b is string => typeof b === 'string')
  return out.length ? out : undefined
}

export function mapGeneratedAssetRow(row: GeneratedAssetDbRow): MemoryAgentGeneratedAsset {
  const type = isAssetType(row.type) ? row.type : 'public_output'
  const status = isAssetStatus(row.status) ? row.status : 'draft'
  const visibility = isVisibility(row.visibility) ? row.visibility : 'internal'
  const channel = isChannel(row.channel) ? row.channel : undefined
  const audience =
    row.audience &&
    ['public', 'staff', 'leadership', 'guests', 'members', 'residents'].includes(row.audience)
      ? (row.audience as MemoryAgentGeneratedAssetAudience)
      : undefined

  return {
    id: row.id,
    organizationSlug: row.organization_slug,
    type,
    status,
    visibility,
    channel,
    title: row.title,
    summary: row.summary ?? undefined,
    body: row.body,
    bullets: parseBullets(row.bullets),
    sourceQuestion: row.source_question,
    sourceMessageId: row.source_message_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by ?? undefined,
    audience,
    locationHint: row.location_hint ?? undefined,
    expiresAt: row.expires_at ?? undefined,
    approvedAt: row.approved_at ?? undefined,
    publishedAt: row.published_at ?? undefined,
    approvedBy: row.approved_by ?? undefined,
    metadata:
      row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
        ? (row.metadata as Record<string, unknown>)
        : undefined,
  }
}

export function isAssetExpired(expiresAt: string | undefined | null): boolean {
  if (!expiresAt) return false
  const t = Date.parse(expiresAt)
  return Number.isFinite(t) && t < Date.now()
}

export type PublicHandoffGate =
  | { ok: true; row: GeneratedAssetDbRow }
  | {
      ok: false
      reason:
        | 'not_found'
        | 'internal'
        | 'not_public'
        | 'not_approved'
        | 'wrong_channel'
        | 'archived'
        | 'expired'
    }

function isLivePublicHandoffStatus(status: string): boolean {
  return status === 'approved' || status === 'published'
}

export function evaluatePublicHandoff(row: GeneratedAssetDbRow | null): PublicHandoffGate {
  if (!row) return { ok: false, reason: 'not_found' }
  if (!isPublicHandoffAssetType(row.type as MemoryAgentGeneratedAssetType)) {
    return { ok: false, reason: 'internal' }
  }
  if (row.status === 'archived') return { ok: false, reason: 'archived' }
  if (isAssetExpired(row.expires_at)) return { ok: false, reason: 'expired' }
  if (row.visibility !== 'public') return { ok: false, reason: 'not_public' }
  if (!isLivePublicHandoffStatus(row.status)) return { ok: false, reason: 'not_approved' }
  if (row.channel !== 'qr_handoff') return { ok: false, reason: 'wrong_channel' }
  return { ok: true, row }
}

export async function listGeneratedAssetsForOrg(
  supabase: SupabaseClient,
  organizationId: string
): Promise<{ data: MemoryAgentGeneratedAsset[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('memory_agent_generated_assets')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: new Error(error.message) }
  const rows = (data ?? []) as GeneratedAssetDbRow[]
  return { data: rows.map(mapGeneratedAssetRow), error: null }
}

export async function getGeneratedAssetByIdForOrg(
  supabase: SupabaseClient,
  organizationId: string,
  assetId: string
): Promise<{ data: GeneratedAssetDbRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('memory_agent_generated_assets')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('id', assetId)
    .maybeSingle()

  if (error) return { data: null, error: new Error(error.message) }
  return { data: (data as GeneratedAssetDbRow) ?? null, error: null }
}

export type InsertGeneratedAssetInput = {
  organizationId: string
  organizationSlug: string
  type: MemoryAgentGeneratedAssetType
  status?: MemoryAgentGeneratedAssetStatus
  visibility?: MemoryAgentGeneratedAssetVisibility
  channel?: MemoryAgentGeneratedAssetChannel | null
  title: string
  summary?: string | null
  body: string
  bullets?: string[] | null
  sourceQuestion: string
  sourceMessageId?: string | null
  audience?: string | null
  locationHint?: string | null
  expiresAt?: string | null
  tags?: unknown
  createdBy?: string | null
  metadata?: Record<string, unknown> | null
}

export function defaultVisibilityForType(
  type: MemoryAgentGeneratedAssetType
): MemoryAgentGeneratedAssetVisibility {
  if (type === 'staff_brief' || type === 'leadership_insight') return 'internal'
  return 'internal'
}

export async function insertGeneratedAsset(
  supabase: SupabaseClient,
  input: InsertGeneratedAssetInput
): Promise<{ data: MemoryAgentGeneratedAsset | null; error: Error | null }> {
  const visibility =
    input.visibility ??
    (input.type === 'staff_brief' || input.type === 'leadership_insight'
      ? 'internal'
      : defaultVisibilityForType(input.type))

  const row = {
    organization_id: input.organizationId,
    organization_slug: input.organizationSlug,
    type: input.type,
    status: input.status ?? 'draft',
    visibility,
    channel: input.channel ?? null,
    title: input.title,
    summary: input.summary ?? null,
    body: input.body,
    bullets: input.bullets ?? null,
    source_question: input.sourceQuestion,
    source_message_id: input.sourceMessageId ?? null,
    audience: input.audience ?? null,
    location_hint: input.locationHint ?? null,
    expires_at: input.expiresAt ?? null,
    tags: input.tags ?? null,
    created_by: input.createdBy ?? null,
    metadata: input.metadata ?? {},
  }

  const { data, error } = await supabase
    .from('memory_agent_generated_assets')
    .insert(row)
    .select('*')
    .single()

  if (error) return { data: null, error: new Error(error.message) }
  return { data: mapGeneratedAssetRow(data as GeneratedAssetDbRow), error: null }
}

export type PatchGeneratedAssetInput = {
  status?: MemoryAgentGeneratedAssetStatus
  visibility?: MemoryAgentGeneratedAssetVisibility
  channel?: MemoryAgentGeneratedAssetChannel | null
  expiresAt?: string | null
  title?: string
  body?: string
  summary?: string | null
  bullets?: string[] | null
  approvedBy?: string | null
  approvedAt?: string | null
  publishedAt?: string | null
}

export async function patchGeneratedAsset(
  supabase: SupabaseClient,
  organizationId: string,
  assetId: string,
  patch: PatchGeneratedAssetInput
): Promise<{ data: MemoryAgentGeneratedAsset | null; error: Error | null }> {
  const row: Record<string, unknown> = {}
  if (patch.status !== undefined) row.status = patch.status
  if (patch.visibility !== undefined) row.visibility = patch.visibility
  if (patch.channel !== undefined) row.channel = patch.channel
  if (patch.expiresAt !== undefined) row.expires_at = patch.expiresAt
  if (patch.title !== undefined) row.title = patch.title
  if (patch.body !== undefined) row.body = patch.body
  if (patch.summary !== undefined) row.summary = patch.summary
  if (patch.bullets !== undefined) row.bullets = patch.bullets
  if (patch.approvedBy !== undefined) row.approved_by = patch.approvedBy
  if (patch.approvedAt !== undefined) row.approved_at = patch.approvedAt
  if (patch.publishedAt !== undefined) row.published_at = patch.publishedAt

  if (Object.keys(row).length === 0) {
    const { data, error } = await getGeneratedAssetByIdForOrg(supabase, organizationId, assetId)
    if (error) return { data: null, error }
    if (!data) return { data: null, error: new Error('Not found') }
    return { data: mapGeneratedAssetRow(data), error: null }
  }

  const { data, error } = await supabase
    .from('memory_agent_generated_assets')
    .update(row)
    .eq('organization_id', organizationId)
    .eq('id', assetId)
    .select('*')
    .single()

  if (error) return { data: null, error: new Error(error.message) }
  return { data: mapGeneratedAssetRow(data as GeneratedAssetDbRow), error: null }
}
