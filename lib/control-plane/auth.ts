import { auth } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

export type ControlChannel = 'session' | 'service'

export interface ResolvedControlActor {
  clerkUserId: string
  channel: ControlChannel
}

/** Roles allowed to run mutating control actions */
export const CONTROL_MUTATE_ROLES = [
  'super_admin',
  'org_admin',
  'moderator',
  'admin',
  'staff',
  'manager',
] as const

/** Read-only control actions (e.g. resolver preview) */
export const CONTROL_READ_ROLES = [
  ...CONTROL_MUTATE_ROLES,
  'resident',
  'member',
  'viewer',
] as const

export async function resolveControlActor(
  request: NextRequest,
  bodyActorClerkId?: string | null
): Promise<ResolvedControlActor | null> {
  const authHeader = request.headers.get('authorization')
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  const serviceToken = process.env.INFRA24_CONTROL_SERVICE_TOKEN

  if (bearer && serviceToken && bearer === serviceToken) {
    const actor =
      bodyActorClerkId?.trim() ||
      request.headers.get('x-actor-clerk-id')?.trim() ||
      null
    if (!actor) return null
    return { clerkUserId: actor, channel: 'service' }
  }

  const { userId } = await auth()
  if (!userId) return null
  return { clerkUserId: userId, channel: 'session' }
}

/**
 * Service token: resolve actor from Clerk id (body or header), else `control_identities.telegram_user_id`
 * for this org. Browser session ignores telegram and uses Clerk session.
 */
export async function resolveControlActorForRequest(
  supabase: SupabaseClient,
  request: NextRequest,
  input: {
    organizationId: string
    actorClerkId?: string | null
    telegramUserId?: string | null
  }
): Promise<ResolvedControlActor | null> {
  const authHeader = request.headers.get('authorization')
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  const serviceToken = process.env.INFRA24_CONTROL_SERVICE_TOKEN

  if (bearer && serviceToken && bearer === serviceToken) {
    const fromBodyOrHeader =
      input.actorClerkId?.trim() || request.headers.get('x-actor-clerk-id')?.trim() || null
    if (fromBodyOrHeader) {
      return { clerkUserId: fromBodyOrHeader, channel: 'service' }
    }
    const tg = input.telegramUserId?.trim()
    if (tg) {
      const { data } = await supabase
        .from('control_identities')
        .select('clerk_user_id')
        .eq('telegram_user_id', tg)
        .eq('organization_id', input.organizationId)
        .maybeSingle()
      if (data?.clerk_user_id) {
        return { clerkUserId: data.clerk_user_id, channel: 'service' }
      }
    }
    return null
  }

  const { userId } = await auth()
  if (!userId) return null
  return { clerkUserId: userId, channel: 'session' }
}

export async function getOrgBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<{ id: string; slug: string; name: string } | null> {
  const { data } = await supabase.from('organizations').select('id, slug, name').eq('slug', slug).maybeSingle()
  return data || null
}

export async function assertOrgRole(
  supabase: SupabaseClient,
  clerkUserId: string,
  organizationId: string,
  allowedRoles: readonly string[]
): Promise<string | null> {
  const { data } = await supabase
    .from('org_memberships')
    .select('role')
    .eq('clerk_user_id', clerkUserId)
    .eq('org_id', organizationId)
    .eq('is_active', true)
    .maybeSingle()

  if (!data?.role) return null
  if (!allowedRoles.includes(data.role)) return null
  return data.role
}
