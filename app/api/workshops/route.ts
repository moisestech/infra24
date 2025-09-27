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
    const orgId = searchParams.get('orgId')
    const category = searchParams.get('category')
    const eventType = searchParams.get('eventType')
    const eventCategory = searchParams.get('eventCategory')
    const isActive = searchParams.get('isActive')
    const isPublic = searchParams.get('isPublic')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Check if user has access to this organization
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
      .from('workshops')
      .select(`
        *,
        event_materials (
          id,
          title,
          description,
          file_url,
          file_type,
          created_at
        ),
        event_feedback (
          id,
          rating,
          feedback_text,
          created_at
        )
      `)
      .eq('organization_id', orgId)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    if (eventCategory) {
      query = query.eq('event_category', eventCategory)
    }

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true')
    }

    if (isPublic !== null && isPublic !== undefined) {
      query = query.eq('is_public', isPublic === 'true')
    }

    if (featured !== null && featured !== undefined) {
      query = query.eq('featured', featured === 'true')
    }

    // Apply pagination
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + (parseInt(limit || '10')) - 1)
    }

    // Order by creation date
    query = query.order('created_at', { ascending: false })

    const { data: workshops, error: workshopsError } = await query

    if (workshopsError) {
      console.error('Error fetching workshops:', workshopsError)
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: workshops
    })

  } catch (error) {
    console.error('Get workshops API error:', error)
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
      category, 
      level,
      eventType = 'workshop',
      eventCategory,
      instructorId,
      prerequisites = [],
      learningObjectives = [],
      targetAudience,
      durationMinutes, 
      maxParticipants,
      minParticipants = 1,
      price = 0,
      currency = 'USD',
      registrationDeadline,
      cancellationPolicy,
      refundPolicy,
      equipmentProvided = [],
      materialsIncluded = [],
      externalLinks = {},
      tags = [],
      featured = false,
      featuredUntil,
      isActive = true,
      isPublic = true,
      isSeries = false,
      seriesId
    } = body

    // Validate required fields
    if (!organizationId || !title || !description || !category || !level) {
      return NextResponse.json({ 
        error: 'Missing required fields: organizationId, title, description, category, level' 
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

    // Create event/workshop
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .insert({
        organization_id: organizationId,
        title,
        description,
        category,
        level,
        event_type: eventType,
        event_category: eventCategory,
        instructor_id: instructorId,
        prerequisites,
        learning_objectives: learningObjectives,
        target_audience: targetAudience,
        duration_minutes: durationMinutes || 60,
        max_participants: maxParticipants || 10,
        min_participants: minParticipants,
        price,
        currency,
        registration_deadline: registrationDeadline,
        cancellation_policy: cancellationPolicy,
        refund_policy: refundPolicy,
        equipment_provided: equipmentProvided,
        materials_included: materialsIncluded,
        external_links: externalLinks,
        tags,
        featured,
        featured_until: featuredUntil,
        is_active: isActive,
        is_public: isPublic,
        is_series: isSeries,
        series_id: seriesId,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single()

    if (workshopError) {
      console.error('Error creating workshop:', workshopError)
      return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: workshop
    }, { status: 201 })

  } catch (error) {
    console.error('Create workshop API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}