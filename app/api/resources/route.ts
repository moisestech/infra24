import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('organizationId')
    const type = searchParams.get('type')
    const isBookable = searchParams.get('isBookable')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Check if user is member of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query
    let query = supabase
      .from('resources')
      .select('*')
      .eq('organization_id', orgId)

    if (type) {
      query = query.eq('type', type)
    }

    if (isBookable !== null) {
      query = query.eq('is_bookable', isBookable === 'true')
    }

    const { data: resources, error: resourcesError } = await query.order('title', { ascending: true })

    if (resourcesError) {
      console.error('Error fetching resources:', resourcesError)
      return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: resources
    })

  } catch (error) {
    console.error('Resources API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      organizationId, 
      title, 
      description, 
      type, 
      capacity = 1, 
      isBookable = true,
      metadata = {}
    } = body

    // Validate required fields
    if (!organizationId || !title || !type) {
      return NextResponse.json({ 
        error: 'Missing required fields: organizationId, title, type' 
      }, { status: 400 })
    }

    // Validate type
    const validTypes = ['space', 'equipment', 'person', 'other']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      }, { status: 400 })
    }

    // Check if user is admin of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Create resource
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .insert({
        organization_id: organizationId,
        title,
        description,
        type,
        capacity,
        is_bookable: isBookable,
        metadata,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single()

    if (resourceError) {
      console.error('Error creating resource:', resourceError)
      return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: resource
    }, { status: 201 })

  } catch (error) {
    console.error('Create resource API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
