import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { isMemoryAgentDataConfigured } from '@/lib/memory-agent/config'
import { CONTROL_MUTATE_ROLES, CONTROL_READ_ROLES, assertOrgRole, getOrgBySlug } from '@/lib/control-plane/auth'
import { CHAT_MODEL, EMBED_MODEL } from '@/lib/memory-agent/openai-client'
import { mergeAssetMetadataForInsert } from '@/lib/memory-agent/save-asset-trace'
import {
  insertGeneratedAsset,
  listGeneratedAssetsForOrg,
} from '@/lib/memory-agent/memory-agent-generated-assets-repo'
import { createClient } from '@/lib/supabase/server'
import type {
  MemoryAgentGeneratedAssetType,
  MemoryAgentGeneratedAssetVisibility,
} from '@/types/memory-agent'

export const dynamic = 'force-dynamic'

const TYPES: MemoryAgentGeneratedAssetType[] = [
  'public_output',
  'staff_brief',
  'leadership_insight',
  'signage_draft',
  'qr_handoff',
]

function isType(x: unknown): x is MemoryAgentGeneratedAssetType {
  return typeof x === 'string' && (TYPES as string[]).includes(x)
}

function parseAssetPayload(raw: unknown): {
  type: MemoryAgentGeneratedAssetType
  title: string
  body: string
  summary?: string | null
  bullets?: string[] | null
  sourceQuestion: string
  sourceMessageId?: string | null
  audience?: string | null
  locationHint?: string | null
  expiresAt?: string | null
  status?: string
  visibility?: MemoryAgentGeneratedAssetVisibility
  metadata?: Record<string, unknown>
} | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (!isType(o.type)) return null
  if (typeof o.title !== 'string' || typeof o.body !== 'string' || typeof o.sourceQuestion !== 'string') {
    return null
  }
  const bullets = Array.isArray(o.bullets)
    ? o.bullets.filter((b): b is string => typeof b === 'string')
    : undefined
  const visibility =
    o.visibility === 'public' || o.visibility === 'internal' ? o.visibility : undefined
  const metadata =
    o.metadata && typeof o.metadata === 'object' && !Array.isArray(o.metadata)
      ? (o.metadata as Record<string, unknown>)
      : undefined
  return {
    type: o.type,
    title: o.title,
    body: o.body,
    summary: typeof o.summary === 'string' ? o.summary : undefined,
    bullets: bullets?.length ? bullets : undefined,
    sourceQuestion: o.sourceQuestion,
    sourceMessageId: typeof o.sourceMessageId === 'string' ? o.sourceMessageId : undefined,
    audience: typeof o.audience === 'string' ? o.audience : undefined,
    locationHint: typeof o.locationHint === 'string' ? o.locationHint : undefined,
    expiresAt: typeof o.expiresAt === 'string' ? o.expiresAt : undefined,
    status: typeof o.status === 'string' ? o.status : undefined,
    visibility,
    metadata,
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!isMemoryAgentDataConfigured(slug)) {
    return NextResponse.json({ ok: false, error: 'Memory Agent not configured for this org.' }, { status: 404 })
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const org = await getOrgBySlug(supabase, slug)
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found.' }, { status: 404 })
  }

  const role = await assertOrgRole(supabase, userId, org.id, CONTROL_READ_ROLES)
  if (!role) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await listGeneratedAssetsForOrg(supabase, org.id)
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, assets: data })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!isMemoryAgentDataConfigured(slug)) {
    return NextResponse.json({ ok: false, error: 'Memory Agent not configured for this org.' }, { status: 404 })
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const org = await getOrgBySlug(supabase, slug)
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found.' }, { status: 404 })
  }

  const role = await assertOrgRole(supabase, userId, org.id, CONTROL_MUTATE_ROLES)
  if (!role) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const parsed = parseAssetPayload(b.asset)
  if (!parsed) {
    return NextResponse.json({ ok: false, error: 'Invalid asset payload.' }, { status: 400 })
  }

  const visibility: MemoryAgentGeneratedAssetVisibility =
    parsed.type === 'staff_brief' || parsed.type === 'leadership_insight'
      ? 'internal'
      : parsed.visibility === 'public'
        ? 'public'
        : 'internal'

  const metadataMerged = mergeAssetMetadataForInsert(parsed.metadata ?? {}, {
    chatModel: CHAT_MODEL,
    embedModel: EMBED_MODEL,
  })

  const { data, error } = await insertGeneratedAsset(supabase, {
    organizationId: org.id,
    organizationSlug: slug,
    type: parsed.type,
    title: parsed.title,
    body: parsed.body,
    summary: parsed.summary,
    bullets: parsed.bullets,
    sourceQuestion: parsed.sourceQuestion,
    sourceMessageId: parsed.sourceMessageId,
    audience: parsed.audience,
    locationHint: parsed.locationHint,
    expiresAt: parsed.expiresAt,
    visibility,
    createdBy: userId,
    metadata: metadataMerged,
  })

  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message ?? 'Insert failed.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, asset: data })
}
