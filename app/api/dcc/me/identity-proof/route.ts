import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { MemberAccessError, PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'
import { identityError, identityRequest, ownerIdentityCase, ownerProof, proveOwnerIdentity } from '@/lib/dcc/membership/identity-review'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const {userId} = await auth()
    if (!userId) throw new MemberAccessError(401,'sign_in_required')
    const {code} = await identityRequest(request,ownerProof)
    return NextResponse.json(await proveOwnerIdentity(userId,code), {headers:PRIVATE_HEADERS})
  } catch (error) { return identityError(error) }
}

export async function GET() {
  try {
    const {userId} = await auth()
    if (!userId) throw new MemberAccessError(401,'sign_in_required')
    return NextResponse.json(await ownerIdentityCase(userId), {headers:PRIVATE_HEADERS})
  } catch (error) { return identityError(error) }
}
