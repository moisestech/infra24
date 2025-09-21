import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = supabaseAdmin
    
    // Get user's organization memberships
    const { data: memberships, error: membershipError } = await supabase
      .from('organization_memberships')
      .select('organization_id, role')
      .eq('user_id', userId)

    if (membershipError) {
      return NextResponse.json({ error: 'Failed to fetch memberships' }, { status: 500 })
    }

    const organizationIds = memberships?.map(m => m.organization_id) || []

    if (organizationIds.length === 0) {
      return NextResponse.json({ workshops: [] })
    }

    // Get workshops from user's organizations and shared workshops
    const { data: workshops, error } = await supabase
      .from('workshop_details')
      .select('*')
      .or(`organization_id.in.(${organizationIds.join(',')}),id.in.(select workshop_id from workshop_organization_sharing where target_organization_id.in.(${organizationIds.join(',')}) and is_active = true)`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching workshops:', error)
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 })
    }

    return NextResponse.json({ workshops })
  } catch (error) {
    console.error('Error in workshops GET:', error)
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
      organization_id,
      title,
      description,
      content,
      category,
      type = 'workshop',
      level = 'beginner',
      duration_minutes,
      max_participants,
      price = 0,
      instructor,
      prerequisites = [],
      materials = [],
      outcomes = [],
      is_shared = false,
      metadata = {}
    } = body

    const supabase = supabaseAdmin

    // Verify user has admin/staff role in the organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('user_id', userId)
      .eq('organization_id', organization_id)
      .single()

    if (membershipError || !membership || !['admin', 'staff'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Create the workshop
    const { data: workshop, error } = await supabase
      .from('workshops')
      .insert({
        organization_id,
        title,
        description,
        content,
        category,
        type,
        level,
        duration_minutes,
        max_participants,
        price,
        instructor,
        prerequisites,
        materials,
        outcomes,
        is_shared,
        metadata,
        created_by: userId
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workshop:', error)
      return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 })
    }

    return NextResponse.json({ workshop }, { status: 201 })
  } catch (error) {
    console.error('Error in workshops POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

