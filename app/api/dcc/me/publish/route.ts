import { NextRequest, NextResponse } from 'next/server'
import { memberPassportContext, MemberAccessError, PRIVATE_HEADERS, requireOwnerMutationOrigin } from '@/lib/dcc/membership/profile-store'
import { requestPublicPassportSchema, mayRequestPublicPassport } from '@/lib/dcc/membership/profile-schema'

export const dynamic = 'force-dynamic'
/** Request a review, not direct public artwork publication. */
export async function POST(request: NextRequest) {
  try {
    requireOwnerMutationOrigin(request)
    const { db, binding } = await memberPassportContext()
    if (!mayRequestPublicPassport(binding.state as 'active')) {
      return NextResponse.json({ error: 'verify_membership_first' }, { status: 409, headers: PRIVATE_HEADERS })
    }
    let payload: unknown
    try { payload = await request.json() } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400, headers: PRIVATE_HEADERS })
    }
    const parsed = requestPublicPassportSchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json({ error: 'consent_required' }, { status: 400, headers: PRIVATE_HEADERS })
    }
    const { data, error } = await db.rpc('dcc_request_owner_publication', {
      p_binding: binding.id, p_revision: parsed.data.revision,
      p_disclosure: parsed.data.disclosureVersion,
    })
    if (error) throw new MemberAccessError(503, 'publication_request_failed')
    if (data === null) throw new MemberAccessError(409, 'profile_revision_conflict')
    if (typeof data !== 'number' || data <= parsed.data.revision)
      throw new MemberAccessError(503, 'publication_request_failed')
    return NextResponse.json({ status: 'pending_review', public: false, revision: data }, {
      status: 202, headers: PRIVATE_HEADERS,
    })
  } catch (e) {
    if (e instanceof MemberAccessError) {
      return NextResponse.json({ error: e.code }, { status: e.status, headers: PRIVATE_HEADERS })
    }
    return NextResponse.json({ error: 'request_unavailable' }, { status: 503, headers: PRIVATE_HEADERS })
  }
}
