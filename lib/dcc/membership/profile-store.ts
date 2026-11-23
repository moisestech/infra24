import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { clerkMembershipCaptureConfig } from './clerk-event'
import type { OwnerPassport } from './profile-schema'

const PRIVATE_HEADERS = { 'Cache-Control': 'private, no-store, max-age=0' }
export { PRIVATE_HEADERS }

export type PassportBinding = { id: string; state: string }
export class MemberAccessError extends Error {
  constructor(public status: number, public code: string) { super(code) }
}
export async function memberPassportContext(): Promise<{
  db: ReturnType<typeof createClient>
  binding: PassportBinding
}> {
  // Never authorize based on a browser payload, claimed email or URL parameter.
  const { userId } = auth()
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
  const db = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data, error } = await db.from('dcc_platform_member_bindings')
    .select('id,state').eq('clerk_instance', config.instance)
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
  return { db, binding: { id: data.id, state: data.state } }
}

export function ownerPassportPayload(row: Record<string, any> | null) {
  return {
    displayName: typeof row?.display_name === 'string' ? row.display_name : '',
    summary: typeof row?.summary === 'string' ? row.summary : '',
    practices: Array.isArray(row?.practices) ? row.practices : [],
    interests: Array.isArray(row?.interests) ? row.interests : [],
    links: Array.isArray(row?.public_links) ? row.public_links : [],
    publication: row?.public_request_state === 'pending_review'
      ? 'pending_review' : row?.public_request_state === 'withdrawal_requested'
        ? 'withdrawal_requested' : 'private',
  }
}

export async function readOwnerPassport(
  db: ReturnType<typeof createClient>, binding: PassportBinding,
) {
  const { data, error } = await db.from('dcc_member_profile_drafts')
    .select('display_name,summary,practices,interests,public_links,public_request_state')
    .eq('binding_id', binding.id).maybeSingle()
  if (error) throw new MemberAccessError(503, 'profile_read_failed')
  return ownerPassportPayload(data)
}

/** Server-owned binding ID prevents IDOR even when the caller tampers with JSON. */
export async function saveOwnerPassport(
  db: ReturnType<typeof createClient>, binding: PassportBinding, draft: OwnerPassport,
) {
  const row = {
    binding_id: binding.id,
    display_name: draft.displayName,
    summary: draft.summary,
    practices: draft.practices,
    interests: draft.interests,
    public_links: draft.links,
    public_request_state: 'private',
    request_disclosure_version: null,
    public_requested_at: null,
    updated_at: new Date().toISOString(),
  }
  // Editing a private draft always resets any pending request. It never changes
  // already-approved Airtable publication; that requires a separate revocation
  // and cache-invalidation workflow, gated before live public publication.
  const { error } = await db.from('dcc_member_profile_drafts')
    .upsert(row, { onConflict: 'binding_id' })
  if (error) throw new MemberAccessError(503, 'profile_save_failed')
  return { saved: true as const, publication: 'private' as const }
}
