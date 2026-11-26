import { NextResponse } from 'next/server'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'
import { decideFounderIdentity, founderDecision, identityError, identityRequest } from '@/lib/dcc/membership/identity-review'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const actor = requireDccSteward()
    const input = await identityRequest(request, founderDecision)
    return NextResponse.json(await decideFounderIdentity(input,actor), {headers:PRIVATE_HEADERS})
  } catch (error) { return identityError(error) }
}
