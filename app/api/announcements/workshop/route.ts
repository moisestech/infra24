import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      orgId, 
      workshopId, 
      announcementTitle, 
      announcementContent,
      scheduledAt,
      expiresAt,
      priority = 'normal',
      visibility = 'public'
    } = body

    // Validate required fields
    if (!orgId || !workshopId || !announcementTitle) {
      return NextResponse.json({ 
        error: 'Missing required fields: orgId, workshopId, announcementTitle' 
      }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if user is admin
    if (!['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get workshop details
    const { data: workshop } = await supabase
      .from('workshops')
      .select(`
        id,
        title,
        description,
        capacity,
        registration_open_at,
        registration_close_at,
        resources!default_resource_id (
          id,
          title,
          type
        ),
        artist_profiles!instructor_profile_id (
          id,
          name
        )
      `)
      .eq('id', workshopId)
      .eq('organization_id', orgId)
      .single()

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Create announcement with workshop metadata
    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        organization_id: orgId,
        title: announcementTitle,
        content: announcementContent || `Join us for "${workshop.title}" - ${workshop.description}`,
        type: 'workshop',
        priority,
        visibility,
        scheduled_at: scheduledAt || null,
        expires_at: expiresAt || null,
        status: 'published',
        is_active: true,
        created_by: userId,
        updated_by: userId,
        metadata: {
          workshop_id: workshopId,
          workshop_title: workshop.title,
          workshop_capacity: workshop.capacity,
          workshop_instructor: workshop.artist_profiles?.name || null,
          workshop_resource: workshop.resources?.title || null,
          registration_open_at: workshop.registration_open_at,
          registration_close_at: workshop.registration_close_at,
          announcement_type: 'workshop_promotion'
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workshop announcement:', error)
      return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
    }

    return NextResponse.json({ 
      announcement,
      workshop: {
        id: workshop.id,
        title: workshop.title,
        description: workshop.description,
        capacity: workshop.capacity,
        instructor: workshop.artist_profiles?.name,
        resource: workshop.resources?.title
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create workshop announcement API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const workshopId = searchParams.get('workshopId')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query for workshop announcements
    let query = supabase
      .from('announcements')
      .select(`
        id,
        title,
        content,
        type,
        priority,
        visibility,
        scheduled_at,
        expires_at,
        status,
        is_active,
        created_at,
        metadata
      `)
      .eq('organization_id', orgId)
      .eq('type', 'workshop')
      .order('created_at', { ascending: false })

    // Filter by specific workshop if provided
    if (workshopId) {
      query = query.contains('metadata', { workshop_id: workshopId })
    }

    const { data: announcements, error } = await query

    if (error) {
      console.error('Error fetching workshop announcements:', error)
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
    }

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error('Get workshop announcements API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
