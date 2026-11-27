import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'

/**
 * Every service-role HTTP route must authorize the current Clerk subject
 * against its tenant BEFORE reading or mutating tenant data.
 * A client-provided organization ID is only a filter, never proof of access.
 */
export async function requireOrganizationStaff(orgId: string | null | undefined) {
  const { userId } = await auth()
  if (!userId) return { ok: false as const, status: 401, error: 'Sign in required' }
  if (!orgId || !/^[0-9a-f-]{36}$/i.test(orgId)) {
    return { ok: false as const, status: 400, error: 'A valid organization ID is required' }
  }

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('org_memberships')
    .select('role')
    .eq('org_id', orgId)
    .eq('clerk_user_id', userId)
    .eq('is_active', true)
    .maybeSingle()

  if (error) return { ok: false as const, status: 503, error: 'Authorization unavailable' }
  if (!data || !['org_admin', 'super_admin', 'moderator', 'admin', 'manager', 'owner'].includes(data.role)) {
    return { ok: false as const, status: 403, error: 'Organization staff access required' }
  }
  return { ok: true as const, db, userId, orgId }
}
