import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { clerkMembershipCaptureConfig } from './clerk-event'
import type { OwnerPassport } from './profile-schema'

export type MemberDb = SupabaseClient<any>

const PRIVATE_HEADERS = { 'Cache-Control': 'private, no-store, max-age=0' }
export { PRIVATE_HEADERS }

export function requireOwnerMutationOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin || origin !== new URL(request.url).origin)
    throw new MemberAccessError(403, 'origin_not_allowed')
}
export type PassportBinding = { id: string; state: string; airtablePersonId: string | null }
export class MemberAccessError extends Error {
  constructor(public status: number, public code: string) { super(code) }
}
export async function memberPassportContext(): Promise<{
  db: MemberDb
  binding: PassportBinding
}> {
  // Never authorize based on a browser payload, claimed email or URL parameter.
  const { userId } = await auth()
  if (!userId) throw new MemberAccessError(401, 'sign_in_required')
  if (process.env.DCC_MEMBER_PROFILE_ENABLED !== 'true') {
    throw new MemberAccessError(503, 'profile_not_enabled')
  }
  let config: ReturnType<typeof clerkMembershipCaptureConfig>
  try { config = clerkMembershipCaptureConfig(process.env) }
  catch { throw new MemberAccessError(503, 'membership_not_configured') }
  if (!config.enabled) throw new MemberAccessError(503, 'membership_not_enabled')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new MemberAccessError(503, 'store_unavailable')
  const db: MemberDb = createClient<any>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data, error } = await db.from('dcc_platform_member_bindings')
    .select('id,state,airtable_person_id').eq('clerk_instance', config.instance)
    .eq('clerk_user_id', userId).maybeSingle()
  if (error) throw new MemberAccessError(503, 'store_unavailable')
  if (!data) throw new MemberAccessError(409, 'membership_pending_sync')
  if (['withdrawn','suspended','deleted'].includes(data.state)) {
    throw new MemberAccessError(403, 'membership_restricted')
  }
  if (data.state === 'pending_verification') {
    throw new MemberAccessError(409, 'verify_account_first')
  }
  if (data.state === 'review_required') {
    throw new MemberAccessError(409, 'identity_review_required')
  }
  return { db, binding: { id: data.id, state: data.state, airtablePersonId: data.airtable_person_id ?? null } }
}

export function ownerPassportPayload(row: Record<string, any> | null) {
  return {
    revision: typeof row?.revision === 'number' ? row.revision : 0,
    displayName: typeof row?.display_name === 'string' ? row.display_name : '',
    summary: typeof row?.summary === 'string' ? row.summary : '',
    practices: Array.isArray(row?.practices) ? row.practices : [],
    interests: Array.isArray(row?.interests) ? row.interests : [],
    links: Array.isArray(row?.public_links) ? row.public_links : [],
    publication: row?.public_request_state === 'pending_review'
      ? 'pending_review' : row?.public_request_state === 'review_processing'
        ? 'review_processing' : row?.public_request_state === 'withdrawal_requested'
        ? 'withdrawal_requested' : 'private',
  }
}

export async function readOwnerPassport(
  db: MemberDb, binding: PassportBinding,
) {
  const { data, error } = await db.from('dcc_member_profile_drafts')
    .select('display_name,summary,practices,interests,public_links,public_request_state,revision')
    .eq('binding_id', binding.id).maybeSingle()
  if (error) throw new MemberAccessError(503, 'profile_read_failed')
  return ownerPassportPayload(data)
}

/** Server-owned binding ID prevents IDOR even when the caller tampers with JSON. */
export async function saveOwnerPassport(
  db: MemberDb, binding: PassportBinding, draft: OwnerPassport, revision: number,
) {
  const { data, error } = await db.rpc('dcc_save_owner_passport', {
    p_binding: binding.id, p_revision: revision, p_display_name: draft.displayName,
    p_summary: draft.summary, p_practices: draft.practices,
    p_interests: draft.interests, p_links: draft.links,
  })
  if (error) throw new MemberAccessError(503, 'profile_save_failed')
  if (data === null) throw new MemberAccessError(409, 'profile_revision_conflict')
  if (typeof data !== 'number' || data <= revision)
    throw new MemberAccessError(503, 'profile_save_failed')
  return { saved: true as const, publication: 'private' as const, revision: data }
}
