import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { MemberAccessError, PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'

export const dynamic = 'force-dynamic'

/** Read-only queue of identity holds. No Clerk subjects, emails or raw CRM
 * candidates leave the server. Resolution is a separate reviewed operation. */
export async function GET() {
  try {
    requireDccSteward()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new MemberAccessError(503, 'identity_store_unavailable')
    const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
    const { data: holds, error } = await db.from('dcc_platform_member_bindings')
      .select('id,state,verified_at,updated_at')
      .eq('state', 'review_required')
      .order('updated_at', { ascending: true }).limit(50)
    if (error) throw new MemberAccessError(503, 'identity_store_unavailable')
    const ids = (holds ?? []).map(row => row.id)
    if (!ids.length) return NextResponse.json({ requests: [] }, { headers: PRIVATE_HEADERS })
    const { data: jobs, error: jobError } = await db.from('dcc_member_reconcile_jobs')
      .select('binding_id,status,audit_reason,started_at,finalized_at').in('binding_id', ids)
    if (jobError) throw new MemberAccessError(503, 'identity_store_unavailable')
    const lookup = new Map((jobs ?? []).map(job => [job.binding_id, job]))
    const allowedReasons = new Set([
      'clerk_verified_email_missing','invalid_verified_email','duplicate_external_binding',
      'bound_email_mismatch','legacy_people_email_collision',
      'external_binding_confirmation_failed','provider_outcome_uncertain',
    ])
    return NextResponse.json({ requests: (holds ?? []).map(row => {
      const job = lookup.get(row.id)
      return {
        requestId: row.id, state: 'review_required', verified: Boolean(row.verified_at),
        updatedAt: row.updated_at,
        reason: job && allowedReasons.has(job.audit_reason) ? job.audit_reason : 'manual_review',
        jobStatus: job?.status === 'review_required' ? 'review_required' : 'needs_inspection',
      }
    }) }, { headers: PRIVATE_HEADERS })
  } catch (error) {
    return NextResponse.json({ error: error instanceof MemberAccessError ? error.code : 'identity_queue_unavailable' }, {
      status: error instanceof MemberAccessError ? error.status : 503, headers: PRIVATE_HEADERS,
    })
  }
}
