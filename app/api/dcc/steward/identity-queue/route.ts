import { NextResponse } from 'next/server'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { MemberAccessError, PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'
import { identityError, identityStore } from '@/lib/dcc/membership/identity-review'

export const dynamic = 'force-dynamic'
const reasons = new Set(['clerk_verified_email_missing','invalid_verified_email','duplicate_external_binding',
  'bound_email_mismatch','legacy_people_email_collision','external_binding_confirmation_failed','provider_outcome_uncertain'])

export async function GET() {
  try {
    requireDccSteward()
    const {db,instance} = identityStore()
    const {data,error} = await db.rpc('dcc_founder_identity_queue', {p_instance:instance})
    if (error) throw new MemberAccessError(503,'identity_store_unavailable')
    return NextResponse.json({requests:(data ?? []).map((row: {
      binding_id:string;verified:boolean;updated_at:string;audit_reason:string;job_status:string;
      stage:string;version:number;expires_at:string|null
    }) => ({
      requestId:row.binding_id,verified:row.verified,updatedAt:row.updated_at,
      reason:reasons.has(row.audit_reason)?row.audit_reason:'manual_review',
      jobStatus:row.job_status==='review_required'?'review_required':'needs_inspection',
      stage:row.stage,version:row.version,expiresAt:row.expires_at,
    }))},{headers:PRIVATE_HEADERS})
  } catch (error) { return identityError(error) }
}
