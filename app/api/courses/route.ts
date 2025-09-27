import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

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
    const organizationId = searchParams.get('organizationId')
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Check if user has access to this organization
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

    let query = supabase
      .from('courses')
      .select(`
        *,
        course_lessons (
          id,
          title,
          description,
          lesson_order,
          duration_minutes,
          is_published,
          created_at
        ),
        course_enrollments (
          id,
          user_id,
          enrollment_date,
          completion_percentage,
          last_accessed_at,
          status
        )
      `)
      .eq('organization_id', organizationId)

    if (category) {
      query = query.eq('category', category)
    }
    if (level) {
      query = query.eq('level', level)
    }
    if (published !== null && published !== undefined) {
      query = query.eq('published', published === 'true')
    }
    if (featured !== null && featured !== undefined) {
      query = query.eq('featured', featured === 'true')
    }

    query = query.order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(parseInt(limit))
    }
    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + (parseInt(limit || '10')) - 1)
    }

    const { data: courses, error: coursesError } = await query

    if (coursesError) {
      console.error('Error fetching courses:', coursesError)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: courses
    })

  } catch (error) {
    console.error('Get courses API error:', error)
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
      instructorId,
      prerequisites = [],
      learningObjectives = [],
      targetAudience,
      durationHours,
      maxEnrollments,
      price = 0,
      currency = 'USD',
      published = false,
      featured = false,
      featuredUntil,
      tags = [],
      externalLinks = {},
      certificationInfo,
      courseImage,
      courseVideo
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

    // Create course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        organization_id: organizationId,
        title,
        description,
        category,
        level,
        instructor_id: instructorId,
        prerequisites,
        learning_objectives: learningObjectives,
        target_audience: targetAudience,
        duration_hours: durationHours || 0,
        max_enrollments: maxEnrollments || 0,
        price,
        currency,
        published,
        featured,
        featured_until: featuredUntil,
        tags,
        external_links: externalLinks,
        certification_info: certificationInfo,
        course_image: courseImage,
        course_video: courseVideo,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single()

    if (courseError) {
      console.error('Error creating course:', courseError)
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: course
    }, { status: 201 })

  } catch (error) {
    console.error('Create course API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}