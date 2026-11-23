import { NextRequest, NextResponse } from 'next/server'
import { memberPassportContext, MemberAccessError, PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'
import { requestPublicPassportSchema, mayRequestPublicPassport } from '@/lib/dcc/membership/profile-schema'

export const dynamic = 'force-dynamic'
/** Request a review, not direct public artwork publication. */
export async function POST(request: NextRequest) {
  try {
    const { db, binding } = await memberPassportContext()
    if (!mayRequestPublicPassport(binding.state as 'active')) {
      return NextResponse.json({ error: 'verify_membership_first' }, { status: 409, headers: PRIVATE_HEADERS })
    }
    let payload: unknown
    try { payload = await request.json() } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400, headers: PRIVATE_HEADERS })
    }
    if (!requestPublicPassportSchema.safeParse(payload).success) {
      return NextResponse.json({ error: 'consent_required' }, { status: 400, headers: PRIVATE_HEADERS })
    }
    const { data: draft, error: readError } = await db.from('dcc_member_profile_drafts')
      .select('display_name,summary,practices,public_links')
      .eq('binding_id', binding.id).maybeSingle()
    if (readError) throw new MemberAccessError(503,'profile_read_failed')
    if (!draft?.display_name || !draft?.summary || !Array.isArray(draft?.practices) || draft.practices.length === 0) {
      return NextResponse.json({ error: 'complete_your_profile_first' }, { status: 409, headers: PRIVATE_HEADERS })
    }
    const { error } = await db.from('dcc_member_profile_drafts').update({
      public_request_state: 'pending_review',
      request_disclosure_version: 'dcc-public-profile-request-v1-2026-11-22',
      public_requested_at: new Date().toISOString(),
    }).eq('binding_id', binding.id)
    if (error) throw new MemberAccessError(503,'publication_request_failed')
    return NextResponse.json({ status: 'pending_review', public: false }, {
      status: 202, headers: PRIVATE_HEADERS,
    })
  } catch (e) {
    if (e instanceof MemberAccessError) {
      return NextResponse.json({ error: e.code }, { status: e.status, headers: PRIVATE_HEADERS })
    }
    return NextResponse.json({ error: 'request_unavailable' }, { status: 503, headers: PRIVATE_HEADERS })
  }
}
