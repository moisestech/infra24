import { NextRequest, NextResponse } from 'next/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'

export const dynamic = 'force-dynamic'

// Fail closed until a tenant-scoped, parameterized analytics implementation
// replaces the legacy arbitrary SQL execution path.
export async function GET(request: NextRequest) {
  const orgId = new URL(request.url).searchParams.get('org_id')
  if (!orgId) return NextResponse.json({error:'Missing org_id parameter'},{status:400,headers:{'Cache-Control':'private, no-store'}})
  const access = await requireOrganizationStaff(orgId)
  if (!access.ok) return NextResponse.json({error:access.error},{status:access.status,headers:{'Cache-Control':'private, no-store'}})
  return NextResponse.json({error:'Booking analytics temporarily unavailable'},{status:503,headers:{'Cache-Control':'private, no-store'}})
}
