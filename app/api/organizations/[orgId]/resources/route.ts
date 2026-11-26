import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 Resources API: Starting GET request')
    console.log('🔍 Resources API: orgId =', params.orgId)
    
    const { data: resources, error } = await supabaseClient
      .from('resources')
      .select('*')
      .eq('org_id', params.orgId)
      .eq('is_bookable', true)
      .order('title')

    console.log('🔍 Resources API: Query result:', { resources, error })

    if (error) {
      console.error('❌ Resources API: Error fetching resources:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch resources',
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Resources API: Successfully fetched', resources?.length || 0, 'resources')
    
    return NextResponse.json({
      resources: resources || [],
      count: resources?.length || 0
    })

  } catch (err) {
    console.error('❌ Resources API: Unexpected error:', err)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
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
