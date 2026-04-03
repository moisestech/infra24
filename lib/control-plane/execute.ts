import type { NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  resolveControlActorForRequest,
  getOrgBySlug,
  assertOrgRole,
  CONTROL_MUTATE_ROLES,
  CONTROL_READ_ROLES,
  type ResolvedControlActor,
} from '@/lib/control-plane/auth'
import { logControlAction } from '@/lib/control-plane/audit'
import { createProposal, loadPendingProposal, markProposalCommitted } from '@/lib/control-plane/proposals'
import { resolvePlaylistForScreen } from '@/lib/display-plane/resolver'

export interface ProposeRequestBody {
  organization_slug: string
  action: string
  payload?: Record<string, unknown>
  correlation_id?: string | null
  /** Required when using service token (OpenClaw); optional for browser session */
  actor_clerk_id?: string | null
  /** Service token: map Telegram user to Clerk via control_identities when actor_clerk_id omitted */
  telegram_user_id?: string | null
  idempotency_key?: string | null
}

export interface CommitRequestBody {
  organization_slug: string
  proposal_id: string
  commit_token: string
  idempotency_key?: string | null
  /** When using service token, must match the actor on the proposal */
  actor_clerk_id?: string | null
  telegram_user_id?: string | null
}

export interface ControlExecutionContext {
  supabase: SupabaseClient
  organizationId: string
  organizationSlug: string
  actor: ResolvedControlActor
  correlationId?: string | null
}

type Ctx = ControlExecutionContext

const READ_ACTIONS = new Set([
  'display.resolver_preview',
  'display.screens_overview',
  'departments.list',
  'screen.list',
  'playlist.list',
  'audit.list_recent',
])

export const MUTATION_ACTIONS = new Set([
  'screen.create',
  'screen.patch',
  'screen.assign_playlist',
  'playlist.create',
  'playlist.add_announcement',
  'playlist.add_dynamic_feed',
  'playlist.add_media',
  'playlist.reorder_items',
  'playlist.add_artist_spotlight',
  'playlist.add_workshop_digest',
  'playlist.set_department_filter',
  'announcement.set_department',
  'announcement.publish',
  'announcement.create_draft',
])

function buildMutationPreview(action: string, payload: Record<string, unknown>): unknown {
  return {
    action,
    payload_summary: payload,
    message: 'Review and confirm to apply this change.',
  }
}

async function handleAction(
  action: string,
  ctx: Ctx,
  payload: Record<string, unknown>
): Promise<{ preview: unknown; result?: unknown }> {
  const p = payload || {}

  switch (action) {
    case 'display.resolver_preview': {
      const screenId = String(p.screen_id || '')
      if (!screenId) throw new Error('screen_id required')
      const resolved = await resolvePlaylistForScreen(ctx.supabase, screenId, {
        bypassDisplayToken: true,
      })
      if (!resolved) throw new Error('Screen not found')
      return { preview: resolved }
    }

    case 'departments.list': {
      const { data, error } = await ctx.supabase
        .from('departments')
        .select('id, name, slug, sort_order, is_active')
        .eq('organization_id', ctx.organizationId)
        .order('sort_order', { ascending: true })
      if (error) throw error
      return { preview: { departments: data || [] } }
    }

    case 'screen.list': {
      const { data, error } = await ctx.supabase
        .from('screens')
        .select('id, name, location, device_key, public_slug, status, settings, updated_at')
        .eq('organization_id', ctx.organizationId)
        .order('name', { ascending: true })
      if (error) throw error
      return { preview: { screens: data || [] } }
    }

    case 'playlist.list': {
      const { data, error } = await ctx.supabase
        .from('playlists')
        .select('id, name, description, status, metadata, updated_at')
        .eq('organization_id', ctx.organizationId)
        .order('name', { ascending: true })
      if (error) throw error
      return { preview: { playlists: data || [] } }
    }

    case 'display.screens_overview': {
      const { data: screens, error } = await ctx.supabase
        .from('screens')
        .select('id, name, device_key, public_slug, status')
        .eq('organization_id', ctx.organizationId)
        .order('name', { ascending: true })
      if (error) throw error
      const overview: unknown[] = []
      for (const s of screens || []) {
        const resolved = await resolvePlaylistForScreen(ctx.supabase, s.id, {
          bypassDisplayToken: true,
        })
        overview.push({
          screen_id: s.id,
          screen_name: s.name,
          device_key: s.device_key,
          public_slug: s.public_slug,
          status: s.status,
          playlist_id: resolved?.playlistId ?? null,
          playlist_name: resolved?.playlistName ?? null,
          slide_count: resolved?.slides?.length ?? 0,
          first_slide_title: resolved?.slides?.[0]?.title ?? null,
          resolved_at: resolved?.resolvedAt ?? null,
        })
      }
      return { preview: { screens: overview } }
    }

    case 'audit.list_recent': {
      const limit = Math.min(100, Math.max(1, Number(p.limit) || 40))
      const { data, error } = await ctx.supabase
        .from('control_action_logs')
        .select(
          'id, actor_clerk_id, channel, action_name, success, result_message, correlation_id, proposal_id, created_at'
        )
        .eq('organization_id', ctx.organizationId)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return { preview: { entries: data || [] } }
    }

    default:
      throw new Error(`Unknown action: ${action}`)
  }
}

export async function commitMutation(
  action: string,
  ctx: Ctx,
  payload: Record<string, unknown>
): Promise<unknown> {
  const p = payload || {}

  switch (action) {
    case 'screen.create': {
      const name = String(p.name || '').trim()
      const device_key = String(p.device_key || '').trim()
      if (!name || !device_key) throw new Error('name and device_key required')
      const settings: Record<string, unknown> = { ...((p.settings as object) || {}) }
      if (typeof p.display_token === 'string' && p.display_token.trim()) {
        settings.display_token = p.display_token.trim()
      }
      const { data, error } = await ctx.supabase
        .from('screens')
        .insert({
          organization_id: ctx.organizationId,
          name,
          device_key,
          public_slug: p.public_slug ? String(p.public_slug).trim() || null : null,
          location: p.location ? String(p.location) : null,
          status: 'active',
          settings,
        })
        .select('id')
        .single()
      if (error) throw error
      return { screen_id: data.id }
    }

    case 'screen.patch': {
      const screen_id = String(p.screen_id || '')
      if (!screen_id) throw new Error('screen_id required')
      const { data: row, error: gerr } = await ctx.supabase
        .from('screens')
        .select('id, settings, name, location, public_slug, status')
        .eq('id', screen_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (gerr || !row) throw new Error('Screen not found')
      const prev = (row.settings || {}) as Record<string, unknown>
      const patch = (p.settings as Record<string, unknown>) || {}
      const nextSettings = { ...prev, ...patch }
      if (typeof p.display_token === 'string') {
        if (p.display_token.trim()) nextSettings.display_token = p.display_token.trim()
        else delete nextSettings.display_token
      }
      const updates: Record<string, unknown> = { settings: nextSettings, updated_at: new Date().toISOString() }
      if (typeof p.name === 'string' && p.name.trim()) updates.name = p.name.trim()
      if (typeof p.location === 'string') updates.location = p.location
      if (typeof p.public_slug === 'string') updates.public_slug = p.public_slug.trim() || null
      if (typeof p.status === 'string') updates.status = p.status
      const { error } = await ctx.supabase.from('screens').update(updates).eq('id', screen_id)
      if (error) throw error
      return { screen_id, settings: nextSettings }
    }

    case 'screen.assign_playlist': {
      const screen_id = String(p.screen_id || '')
      const playlist_id = String(p.playlist_id || '')
      if (!screen_id || !playlist_id) throw new Error('screen_id and playlist_id required')
      const { data: scrOk } = await ctx.supabase
        .from('screens')
        .select('id')
        .eq('id', screen_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!scrOk) throw new Error('Screen not found in organization')
      const { data: plOk } = await ctx.supabase
        .from('playlists')
        .select('id')
        .eq('id', playlist_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!plOk) throw new Error('Playlist not found in organization')
      const priority = typeof p.priority === 'number' ? p.priority : 0
      await ctx.supabase.from('screen_assignments').delete().eq('screen_id', screen_id)
      const { error } = await ctx.supabase.from('screen_assignments').insert({
        organization_id: ctx.organizationId,
        screen_id,
        playlist_id,
        priority,
      })
      if (error) throw error
      return { ok: true, screen_id, playlist_id, priority }
    }

    case 'playlist.create': {
      const name = String(p.name || '').trim()
      if (!name) throw new Error('name required')
      const { data, error } = await ctx.supabase
        .from('playlists')
        .insert({
          organization_id: ctx.organizationId,
          name,
          description: p.description ? String(p.description) : null,
          status: (p.status as string) || 'draft',
          metadata: (p.metadata as object) || {},
        })
        .select('id')
        .single()
      if (error) throw error
      return { playlist_id: data.id }
    }

    case 'playlist.add_announcement': {
      const playlist_id = String(p.playlist_id || '')
      const announcement_id = String(p.announcement_id || '')
      if (!playlist_id || !announcement_id) throw new Error('playlist_id and announcement_id required')
      const { data: plRow } = await ctx.supabase
        .from('playlists')
        .select('id')
        .eq('id', playlist_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!plRow) throw new Error('Playlist not found in organization')
      const { data: annRow } = await ctx.supabase
        .from('announcements')
        .select('id')
        .eq('id', announcement_id)
        .or(`org_id.eq.${ctx.organizationId},organization_id.eq.${ctx.organizationId}`)
        .maybeSingle()
      if (!annRow) throw new Error('Announcement not found in organization')
      let order_index = typeof p.order_index === 'number' ? p.order_index : null
      if (order_index === null) {
        const { data: rows } = await ctx.supabase
          .from('playlist_items')
          .select('order_index')
          .eq('playlist_id', playlist_id)
          .order('order_index', { ascending: false })
          .limit(1)
        order_index = rows?.[0]?.order_index != null ? rows[0].order_index + 1 : 0
      }
      const duration =
        typeof p.duration_seconds === 'number' ? p.duration_seconds : 12
      const { data, error } = await ctx.supabase
        .from('playlist_items')
        .insert({
          organization_id: ctx.organizationId,
          playlist_id,
          order_index,
          duration_seconds: duration,
          item_kind: 'announcement',
          announcement_id,
        })
        .select('id')
        .single()
      if (error) throw error
      return { playlist_item_id: data.id }
    }

    case 'playlist.add_media': {
      const playlist_id = String(p.playlist_id || '')
      const media_url = String(p.media_url || '').trim()
      if (!playlist_id || !media_url) throw new Error('playlist_id and media_url required')
      const { data: plRow } = await ctx.supabase
        .from('playlists')
        .select('id')
        .eq('id', playlist_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!plRow) throw new Error('Playlist not found in organization')
      let order_index = typeof p.order_index === 'number' ? p.order_index : null
      if (order_index === null) {
        const { data: rows } = await ctx.supabase
          .from('playlist_items')
          .select('order_index')
          .eq('playlist_id', playlist_id)
          .order('order_index', { ascending: false })
          .limit(1)
        order_index = rows?.[0]?.order_index != null ? rows[0].order_index + 1 : 0
      }
      const duration =
        typeof p.duration_seconds === 'number' ? p.duration_seconds : 12
      const { data, error } = await ctx.supabase
        .from('playlist_items')
        .insert({
          organization_id: ctx.organizationId,
          playlist_id,
          order_index,
          duration_seconds: duration,
          item_kind: 'media',
          media_url,
          title_override: p.title_override ? String(p.title_override) : null,
        })
        .select('id')
        .single()
      if (error) throw error
      return { playlist_item_id: data.id }
    }

    case 'playlist.reorder_items': {
      const playlist_id = String(p.playlist_id || '')
      const raw = p.item_ids
      if (!playlist_id || !Array.isArray(raw)) throw new Error('playlist_id and item_ids array required')
      const item_ids = (raw as unknown[]).map((x) => String(x))
      const { data: plRow } = await ctx.supabase
        .from('playlists')
        .select('id')
        .eq('id', playlist_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!plRow) throw new Error('Playlist not found in organization')
      const { data: rows, error: qerr } = await ctx.supabase
        .from('playlist_items')
        .select('id')
        .eq('playlist_id', playlist_id)
        .eq('organization_id', ctx.organizationId)
      if (qerr) throw qerr
      const existing = new Set((rows || []).map((r) => r.id))
      if (item_ids.length !== existing.size || !item_ids.every((id) => existing.has(id))) {
        throw new Error('item_ids must be a permutation of all playlist item ids')
      }
      for (let i = 0; i < item_ids.length; i++) {
        const { error } = await ctx.supabase
          .from('playlist_items')
          .update({ order_index: 10000 + i })
          .eq('id', item_ids[i])
          .eq('playlist_id', playlist_id)
        if (error) throw error
      }
      for (let i = 0; i < item_ids.length; i++) {
        const { error } = await ctx.supabase
          .from('playlist_items')
          .update({ order_index: i })
          .eq('id', item_ids[i])
          .eq('playlist_id', playlist_id)
        if (error) throw error
      }
      return { playlist_id, order: item_ids }
    }

    case 'playlist.add_workshop_digest': {
      const playlist_id = String(p.playlist_id || '')
      if (!playlist_id) throw new Error('playlist_id required')
      const { data: plRow } = await ctx.supabase
        .from('playlists')
        .select('id')
        .eq('id', playlist_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!plRow) throw new Error('Playlist not found in organization')
      let order_index = typeof p.order_index === 'number' ? p.order_index : null
      if (order_index === null) {
        const { data: ordRows } = await ctx.supabase
          .from('playlist_items')
          .select('order_index')
          .eq('playlist_id', playlist_id)
          .order('order_index', { ascending: false })
          .limit(1)
        order_index = ordRows?.[0]?.order_index != null ? ordRows[0].order_index + 1 : 0
      }
      const duration =
        typeof p.duration_seconds === 'number' ? p.duration_seconds : 12
      const { data, error } = await ctx.supabase
        .from('playlist_items')
        .insert({
          organization_id: ctx.organizationId,
          playlist_id,
          order_index,
          duration_seconds: duration,
          item_kind: 'workshop_digest',
          payload: (p.payload as object) || {},
        })
        .select('id')
        .single()
      if (error) throw error
      return { playlist_item_id: data.id }
    }

    case 'playlist.add_artist_spotlight': {
      const playlist_id = String(p.playlist_id || '')
      const artist_profile_id = String(p.artist_profile_id || '')
      if (!playlist_id || !artist_profile_id) throw new Error('playlist_id and artist_profile_id required')
      const { data: plRow } = await ctx.supabase
        .from('playlists')
        .select('id')
        .eq('id', playlist_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!plRow) throw new Error('Playlist not found in organization')
      const { data: art } = await ctx.supabase
        .from('artist_profiles')
        .select('id')
        .eq('id', artist_profile_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!art) throw new Error('Artist profile not found in organization')
      let order_index = typeof p.order_index === 'number' ? p.order_index : null
      if (order_index === null) {
        const { data: ordRows } = await ctx.supabase
          .from('playlist_items')
          .select('order_index')
          .eq('playlist_id', playlist_id)
          .order('order_index', { ascending: false })
          .limit(1)
        order_index = ordRows?.[0]?.order_index != null ? ordRows[0].order_index + 1 : 0
      }
      const duration =
        typeof p.duration_seconds === 'number' ? p.duration_seconds : 12
      const { data, error } = await ctx.supabase
        .from('playlist_items')
        .insert({
          organization_id: ctx.organizationId,
          playlist_id,
          order_index,
          duration_seconds: duration,
          item_kind: 'artist_spotlight',
          artist_profile_id,
          title_override: p.title_override ? String(p.title_override) : null,
        })
        .select('id')
        .single()
      if (error) throw error
      return { playlist_item_id: data.id }
    }

    case 'playlist.add_dynamic_feed': {
      const playlist_id = String(p.playlist_id || '')
      if (!playlist_id) throw new Error('playlist_id required')
      const { data: plRow } = await ctx.supabase
        .from('playlists')
        .select('id')
        .eq('id', playlist_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (!plRow) throw new Error('Playlist not found in organization')
      let order_index = typeof p.order_index === 'number' ? p.order_index : null
      if (order_index === null) {
        const { data: rows } = await ctx.supabase
          .from('playlist_items')
          .select('order_index')
          .eq('playlist_id', playlist_id)
          .order('order_index', { ascending: false })
          .limit(1)
        order_index = rows?.[0]?.order_index != null ? rows[0].order_index + 1 : 0
      }
      const duration =
        typeof p.duration_seconds === 'number' ? p.duration_seconds : 12
      const { data, error } = await ctx.supabase
        .from('playlist_items')
        .insert({
          organization_id: ctx.organizationId,
          playlist_id,
          order_index,
          duration_seconds: duration,
          item_kind: 'dynamic_announcements',
        })
        .select('id')
        .single()
      if (error) throw error
      return { playlist_item_id: data.id }
    }

    case 'playlist.set_department_filter': {
      const playlist_id = String(p.playlist_id || '')
      if (!playlist_id) throw new Error('playlist_id required')
      const department_ids = Array.isArray(p.department_ids)
        ? (p.department_ids as unknown[]).map(String)
        : []
      const { data: pl, error: gerr } = await ctx.supabase
        .from('playlists')
        .select('metadata')
        .eq('id', playlist_id)
        .eq('organization_id', ctx.organizationId)
        .maybeSingle()
      if (gerr || !pl) throw new Error('Playlist not found')
      const meta = { ...(pl.metadata as object), department_ids }
      const { error } = await ctx.supabase.from('playlists').update({ metadata: meta }).eq('id', playlist_id)
      if (error) throw error
      return { playlist_id, metadata: meta }
    }

    case 'announcement.set_department': {
      const announcement_id = String(p.announcement_id || '')
      if (!announcement_id) throw new Error('announcement_id required')
      const department_id = p.department_id ? String(p.department_id) : null
      const { error } = await ctx.supabase
        .from('announcements')
        .update({ department_id })
        .eq('id', announcement_id)
        .or(`org_id.eq.${ctx.organizationId},organization_id.eq.${ctx.organizationId}`)
      if (error) throw error
      return { announcement_id, department_id }
    }

    case 'announcement.publish': {
      const announcement_id = String(p.announcement_id || '')
      if (!announcement_id) throw new Error('announcement_id required')
      const { error } = await ctx.supabase
        .from('announcements')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', announcement_id)
        .or(`org_id.eq.${ctx.organizationId},organization_id.eq.${ctx.organizationId}`)
      if (error) throw error
      return { announcement_id, status: 'published' }
    }

    case 'announcement.create_draft': {
      const title = String(p.title || '').trim()
      const body = String(p.body ?? p.content ?? '').trim()
      if (!title || !body) throw new Error('title and body required')
      const department_id = p.department_id ? String(p.department_id) : null
      if (department_id) {
        const { data: dept } = await ctx.supabase
          .from('departments')
          .select('id')
          .eq('id', department_id)
          .eq('organization_id', ctx.organizationId)
          .maybeSingle()
        if (!dept) throw new Error('department_id not in organization')
      }
      const tags = Array.isArray(p.tags) ? (p.tags as unknown[]).map(String) : []
      const { data, error } = await ctx.supabase
        .from('announcements')
        .insert({
          org_id: ctx.organizationId,
          author_clerk_id: ctx.actor.clerkUserId,
          title,
          body,
          status: 'draft',
          priority: typeof p.priority === 'number' ? p.priority : 0,
          tags,
          visibility: typeof p.visibility === 'string' ? p.visibility : 'internal',
          scheduled_at: typeof p.scheduled_at === 'string' ? p.scheduled_at : null,
          expires_at: typeof p.expires_at === 'string' ? p.expires_at : null,
          published_at: null,
          image_url: typeof p.image_url === 'string' ? p.image_url : null,
          image_layout: typeof p.image_layout === 'string' ? p.image_layout : null,
          department_id,
        })
        .select('id')
        .single()
      if (error) throw error
      return { announcement_id: data.id }
    }

    default:
      throw new Error(`Unknown mutation: ${action}`)
  }
}

export async function controlPropose(
  supabase: SupabaseClient,
  request: NextRequest,
  body: ProposeRequestBody
): Promise<{
  ok: boolean
  error?: string
  preview?: unknown
  proposal_id?: string | null
  commit_token?: string | null
  expires_at?: string | null
}> {
  const org = await getOrgBySlug(supabase, body.organization_slug)
  if (!org) {
    return { ok: false, error: 'Organization not found' }
  }

  const actor = await resolveControlActorForRequest(supabase, request, {
    organizationId: org.id,
    actorClerkId: body.actor_clerk_id,
    telegramUserId: body.telegram_user_id,
  })
  if (!actor) {
    return { ok: false, error: 'Unauthorized' }
  }

  const isRead = READ_ACTIONS.has(body.action)
  const roles = isRead ? CONTROL_READ_ROLES : CONTROL_MUTATE_ROLES
  const role = await assertOrgRole(supabase, actor.clerkUserId, org.id, roles)
  if (!role) {
    await logControlAction({
      supabase,
      organizationId: org.id,
      actorClerkId: actor.clerkUserId,
      channel: actor.channel,
      actionName: body.action,
      payload: body.payload,
      success: false,
      resultMessage: 'Forbidden',
      correlationId: body.correlation_id,
    })
    return { ok: false, error: 'Forbidden' }
  }

  const ctx: Ctx = {
    supabase,
    organizationId: org.id,
    organizationSlug: org.slug,
    actor,
    correlationId: body.correlation_id,
  }

  const payload = body.payload || {}

  try {
    if (isRead) {
      const { preview } = await handleAction(body.action, ctx, payload)
      await logControlAction({
        supabase,
        organizationId: org.id,
        actorClerkId: actor.clerkUserId,
        channel: actor.channel,
        actionName: body.action,
        payload,
        success: true,
        correlationId: body.correlation_id,
      })
      return {
        ok: true,
        preview,
        proposal_id: null,
        commit_token: null,
        expires_at: null,
      }
    }

    if (!MUTATION_ACTIONS.has(body.action)) {
      return { ok: false, error: `Unknown or unsupported action: ${body.action}` }
    }

    const preview = buildMutationPreview(body.action, payload)

    const proposal = await createProposal({
      supabase,
      organizationId: org.id,
      actorClerkId: actor.clerkUserId,
      actorChannel: actor.channel,
      actionName: body.action,
      payload,
      preview,
      correlationId: body.correlation_id,
      idempotencyKey: body.idempotency_key,
    })

    await logControlAction({
      supabase,
      organizationId: org.id,
      actorClerkId: actor.clerkUserId,
      channel: actor.channel,
      actionName: `${body.action}:proposed`,
      payload,
      success: true,
      correlationId: body.correlation_id,
      proposalId: proposal.id,
    })

    return {
      ok: true,
      preview,
      proposal_id: proposal.id,
      commit_token: proposal.commitToken,
      expires_at: proposal.expiresAt,
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    await logControlAction({
      supabase,
      organizationId: org.id,
      actorClerkId: actor.clerkUserId,
      channel: actor.channel,
      actionName: body.action,
      payload,
      success: false,
      resultMessage: msg,
      correlationId: body.correlation_id,
    })
    return { ok: false, error: msg }
  }
}

export async function controlCommit(
  supabase: SupabaseClient,
  request: NextRequest,
  body: CommitRequestBody
): Promise<{ ok: boolean; error?: string; result?: unknown }> {
  const org = await getOrgBySlug(supabase, body.organization_slug)
  if (!org) {
    return { ok: false, error: 'Organization not found' }
  }

  const actor = await resolveControlActorForRequest(supabase, request, {
    organizationId: org.id,
    actorClerkId: body.actor_clerk_id,
    telegramUserId: body.telegram_user_id,
  })
  if (!actor) {
    return { ok: false, error: 'Unauthorized' }
  }

  const role = await assertOrgRole(supabase, actor.clerkUserId, org.id, CONTROL_MUTATE_ROLES)
  if (!role) {
    return { ok: false, error: 'Forbidden' }
  }

  const proposal = await loadPendingProposal(supabase, body.proposal_id, org.id)
  if (!proposal) {
    return { ok: false, error: 'Proposal not found or already processed' }
  }

  if (proposal.actor_clerk_id !== actor.clerkUserId) {
    return { ok: false, error: 'Proposal belongs to another actor' }
  }

  if (proposal.commit_token !== body.commit_token) {
    return { ok: false, error: 'Invalid commit token' }
  }

  if (new Date(proposal.expires_at).getTime() < Date.now()) {
    return { ok: false, error: 'Proposal expired' }
  }

  const ctx: Ctx = {
    supabase,
    organizationId: org.id,
    organizationSlug: org.slug,
    actor,
    correlationId: null,
  }

  const payload = (proposal.payload || {}) as Record<string, unknown>
  const action = proposal.action_name as string

  try {
    const result = await commitMutation(action, ctx, payload)
    await markProposalCommitted(supabase, proposal.id)
    await logControlAction({
      supabase,
      organizationId: org.id,
      actorClerkId: actor.clerkUserId,
      channel: actor.channel,
      actionName: `${action}:committed`,
      payload,
      success: true,
      resultMessage: JSON.stringify(result).slice(0, 500),
      proposalId: proposal.id,
    })
    return { ok: true, result }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Commit failed'
    await logControlAction({
      supabase,
      organizationId: org.id,
      actorClerkId: actor.clerkUserId,
      channel: actor.channel,
      actionName: `${action}:commit_failed`,
      payload,
      success: false,
      resultMessage: msg,
      proposalId: proposal.id,
    })
    return { ok: false, error: msg }
  }
}
