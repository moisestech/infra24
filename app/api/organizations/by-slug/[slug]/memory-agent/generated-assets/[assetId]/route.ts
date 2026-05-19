import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { isMemoryAgentDataConfigured } from '@/lib/memory-agent/config'
import { isPublicHandoffAssetType } from '@/lib/memory-agent/generated-assets'
import { CONTROL_MUTATE_ROLES, assertOrgRole, getOrgBySlug } from '@/lib/control-plane/auth'
import {
  evaluatePublicHandoff,
  getGeneratedAssetByIdForOrg,
  mapGeneratedAssetRow,
  patchGeneratedAsset,
} from '@/lib/memory-agent/memory-agent-generated-assets-repo'
import { createClient } from '@/lib/supabase/server'
import type {
  MemoryAgentGeneratedAssetChannel,
  MemoryAgentGeneratedAssetStatus,
  MemoryAgentGeneratedAssetType,
  MemoryAgentGeneratedAssetVisibility,
} from '@/types/memory-agent'

export const dynamic = 'force-dynamic'

const STATUSES: MemoryAgentGeneratedAssetStatus[] = [
  'draft',
  'review',
  'approved',
  'published',
  'archived',
]

function isStatus(x: unknown): x is MemoryAgentGeneratedAssetStatus {
  return typeof x === 'string' && (STATUSES as string[]).includes(x)
}

function isVis(x: unknown): x is MemoryAgentGeneratedAssetVisibility {
  return x === 'internal' || x === 'public'
}

function isChan(x: unknown): x is MemoryAgentGeneratedAssetChannel {
  return (
    typeof x === 'string' &&
    ['web', 'lobby_signage', 'qr_handoff', 'staff_brief', 'leadership', 'report'].includes(x)
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; assetId: string }> }
) {
  const { slug, assetId } = await params
  if (!isMemoryAgentDataConfigured(slug)) {
    return NextResponse.json({ ok: false, reason: 'not_found' as const }, { status: 404 })
  }

  const supabase = createClient()
  const org = await getOrgBySlug(supabase, slug)
  if (!org) {
    return NextResponse.json({ ok: false, reason: 'not_found' as const }, { status: 404 })
  }

  const { data: row, error } = await getGeneratedAssetByIdForOrg(supabase, org.id, assetId)
  if (error) {
    return NextResponse.json({ ok: false, reason: 'not_found' as const }, { status: 500 })
  }
  if (!row) {
    return NextResponse.json({ ok: false, reason: 'not_found' as const }, { status: 404 })
  }

  const gate = evaluatePublicHandoff(row)
  if (!gate.ok) {
    const status =
      gate.reason === 'internal' ||
      gate.reason === 'not_public' ||
      gate.reason === 'not_approved' ||
      gate.reason === 'wrong_channel'
        ? 403
        : 404
    return NextResponse.json({ ok: false, reason: gate.reason }, { status })
  }

  return NextResponse.json({ ok: true, asset: mapGeneratedAssetRow(gate.row) })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; assetId: string }> }
) {
  const { slug, assetId } = await params
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

  const { data: existing, error: loadErr } = await getGeneratedAssetByIdForOrg(supabase, org.id, assetId)
  if (loadErr) {
    return NextResponse.json({ ok: false, error: loadErr.message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const assetType = existing.type as MemoryAgentGeneratedAssetType

  if (body.makePublicHandoff === true) {
    if (!isPublicHandoffAssetType(assetType)) {
      return NextResponse.json({ ok: false, error: 'Only public handoff types can be published.' }, { status: 400 })
    }
    const now = new Date().toISOString()
    const { data, error } = await patchGeneratedAsset(supabase, org.id, assetId, {
      visibility: 'public',
      channel: 'qr_handoff',
      status: 'approved',
      approvedAt: now,
      approvedBy: userId,
    })
    if (error || !data) {
      return NextResponse.json({ ok: false, error: error?.message ?? 'Update failed.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, asset: data })
  }

  const patch: Parameters<typeof patchGeneratedAsset>[3] = {}

  if (body.status !== undefined) {
    if (!isStatus(body.status)) {
      return NextResponse.json({ ok: false, error: 'Invalid status.' }, { status: 400 })
    }
    patch.status = body.status
  }
  if (body.visibility !== undefined) {
    if (!isVis(body.visibility)) {
      return NextResponse.json({ ok: false, error: 'Invalid visibility.' }, { status: 400 })
    }
    if (body.visibility === 'public' && !isPublicHandoffAssetType(assetType)) {
      return NextResponse.json({ ok: false, error: 'Cannot set public visibility for this asset type.' }, { status: 400 })
    }
    patch.visibility = body.visibility
  }
  if (body.channel !== undefined) {
    if (body.channel !== null && !isChan(body.channel)) {
      return NextResponse.json({ ok: false, error: 'Invalid channel.' }, { status: 400 })
    }
    patch.channel = body.channel === null ? null : body.channel
  }
  if (body.expiresAt !== undefined) {
    if (body.expiresAt === null) {
      patch.expiresAt = null
    } else if (typeof body.expiresAt === 'string') {
      patch.expiresAt = body.expiresAt
    } else {
      return NextResponse.json({ ok: false, error: 'Invalid expiresAt.' }, { status: 400 })
    }
  }

  const { data, error } = await patchGeneratedAsset(supabase, org.id, assetId, patch)
  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message ?? 'Update failed.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, asset: data })
}
