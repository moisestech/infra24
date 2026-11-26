import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params: pendingParams }: { params: Promise<{ orgId: string }> }
) {
  const params = await pendingParams
  try {
    const access = await requireOrganizationStaff(params.orgId)
    const headers = { 'Cache-Control': 'private, no-store' }
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status, headers })
    const { data: resources, error } = await access.db.from('resources')
      .select('*').eq('org_id', access.orgId).eq('is_bookable', true).order('title')
    if (error) return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 503, headers })
    return NextResponse.json({ resources: resources || [], count: resources?.length || 0 }, { headers })

  } catch {
    console.error('❌ Resources API: Unexpected error:', err)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params: pendingParams }: { params: Promise<{ orgId: string }> }
) {
  const params = await pendingParams
  try {
    const access = await requireOrganizationStaff(params.orgId)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status, headers: { 'Cache-Control': 'private, no-store' } })
    const body = await request.json()
    const { title, description, type, capacity, is_bookable } = body
    if (typeof title !== 'string' || !title.trim() || !['space','equipment','person','other'].includes(type)) {
      return NextResponse.json({ error: 'Invalid resource' }, { status: 400 })
    }
    if (capacity !== undefined && (!Number.isInteger(capacity) || capacity < 1)) {
      return NextResponse.json({ error: 'Invalid capacity' }, { status: 400 })
    }
    const { data: resource, error } = await access.db.from('resources')
      .insert({ org_id: access.orgId, title: title.trim(), type,
        description: typeof description === 'string' ? description : '',
        capacity: capacity ?? 1, is_bookable: is_bookable === true })
      .select().single()
    if (error) return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
    return NextResponse.json({ resource, message: 'Resource created successfully' }, { status: 201, headers: { 'Cache-Control': 'private, no-store' } })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
