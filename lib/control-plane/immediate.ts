import type { NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  resolveControlActor,
  getOrgBySlug,
  assertOrgRole,
  CONTROL_MUTATE_ROLES,
} from '@/lib/control-plane/auth'
import { logControlAction } from '@/lib/control-plane/audit'
import { commitMutation, MUTATION_ACTIONS, type ControlExecutionContext } from '@/lib/control-plane/execute'

/**
 * Session-only fast path for web admin. OpenClaw / service token must use propose + commit.
 */
export async function controlExecuteImmediate(
  supabase: SupabaseClient,
  request: NextRequest,
  body: {
    organization_slug: string
    action: string
    payload?: Record<string, unknown>
    correlation_id?: string | null
  }
): Promise<{ ok: boolean; error?: string; result?: unknown }> {
  const actor = await resolveControlActor(request, null)
  if (!actor || actor.channel !== 'session') {
    return { ok: false, error: 'Session required (use propose/commit for service token)' }
  }

  const org = await getOrgBySlug(supabase, body.organization_slug)
  if (!org) {
    return { ok: false, error: 'Organization not found' }
  }

  const role = await assertOrgRole(supabase, actor.clerkUserId, org.id, CONTROL_MUTATE_ROLES)
  if (!role) {
    return { ok: false, error: 'Forbidden' }
  }

  if (!MUTATION_ACTIONS.has(body.action)) {
    return { ok: false, error: 'Unsupported action for immediate execution' }
  }

  const ctx: ControlExecutionContext = {
    supabase,
    organizationId: org.id,
    organizationSlug: org.slug,
    actor,
    correlationId: body.correlation_id,
  }

  const payload = body.payload || {}

  try {
    const result = await commitMutation(body.action, ctx, payload)
    await logControlAction({
      supabase,
      organizationId: org.id,
      actorClerkId: actor.clerkUserId,
      channel: actor.channel,
      actionName: `${body.action}:immediate`,
      payload,
      success: true,
      resultMessage: JSON.stringify(result).slice(0, 500),
      correlationId: body.correlation_id,
    })
    return { ok: true, result }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed'
    await logControlAction({
      supabase,
      organizationId: org.id,
      actorClerkId: actor.clerkUserId,
      channel: actor.channel,
      actionName: `${body.action}:immediate_failed`,
      payload,
      success: false,
      resultMessage: msg,
      correlationId: body.correlation_id,
    })
    return { ok: false, error: msg }
  }
}
