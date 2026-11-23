import { NextRequest, NextResponse } from 'next/server'
import { memberPassportContext, MemberAccessError, PRIVATE_HEADERS,
  readOwnerPassport, saveOwnerPassport } from '@/lib/dcc/membership/profile-store'
import { ownerPassportSchema, mayEditOwnerPassport } from '@/lib/dcc/membership/profile-schema'

export const dynamic = 'force-dynamic'
function failure(error: unknown) {
  if (error instanceof MemberAccessError) {
    return NextResponse.json({ error: error.code }, { status: error.status, headers: PRIVATE_HEADERS })
  }
  return NextResponse.json({ error: 'request_unavailable' }, { status: 503, headers: PRIVATE_HEADERS })
}
export async function GET() {
  try {
    const { db, binding } = await memberPassportContext()
    return NextResponse.json({
      membership: binding.state === 'active' ? 'active' : 'pending_reconciliation',
      profile: await readOwnerPassport(db, binding),
      publicPublication: 'review_required',
    }, { headers: PRIVATE_HEADERS })
  } catch (e) { return failure(e) }
}
export async function PATCH(request: NextRequest) {
  try {
    const { db, binding } = await memberPassportContext()
    if (!mayEditOwnerPassport(binding.state as 'active' | 'pending_reconciliation')) {
      return NextResponse.json({ error: 'edit_not_allowed' }, { status: 403, headers: PRIVATE_HEADERS })
    }
    if (Number(request.headers.get('content-length') || '0') > 16000) {
      return NextResponse.json({ error: 'too_large' }, { status: 413, headers: PRIVATE_HEADERS })
    }
    const raw = await request.text()
    if (raw.length > 16000) return NextResponse.json({ error: 'too_large' }, { status: 413, headers: PRIVATE_HEADERS })
    let payload: unknown
    try { payload = JSON.parse(raw) } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400, headers: PRIVATE_HEADERS })
    }
    const parsed = ownerPassportSchema.safeParse(payload)
    if (!parsed.success) return NextResponse.json({ error: 'invalid_profile' }, { status: 400, headers: PRIVATE_HEADERS })
    const result = await saveOwnerPassport(db, binding, parsed.data)
    return NextResponse.json(result, { headers: PRIVATE_HEADERS })
  } catch (e) { return failure(e) }
}
