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

export async function GET(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.courseId
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const { data: enrollments, error } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        courses (
          id,
          title,
          organization_id
        )
      `)
      .eq('course_id', courseId)
      .order('enrollment_date', { ascending: false })

    if (error) {
      console.error('Error fetching course enrollments:', error)
      return NextResponse.json({ error: 'Failed to fetch course enrollments' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: enrollments })
  } catch (error) {
    console.error('Get course enrollments API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.courseId
    const body = await request.json()
    const { organizationId } = body

    if (!courseId || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields: courseId, organizationId' }, { status: 400 })
    }

    // Check if user is a member of the organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied or not a member of this organization' }, { status: 403 })
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({ error: 'User is already enrolled in this course' }, { status: 409 })
    }

    // Check course capacity
    const { data: course } = await supabase
      .from('courses')
      .select('max_enrollments')
      .eq('id', courseId)
      .single()

    if (course && course.max_enrollments > 0) {
      const { data: enrollmentCount } = await supabase
        .from('course_enrollments')
        .select('id', { count: 'exact' })
        .eq('course_id', courseId)
        .eq('status', 'active')

      if (enrollmentCount && enrollmentCount.length >= course.max_enrollments) {
        return NextResponse.json({ error: 'Course is at maximum capacity' }, { status: 409 })
      }
    }

    // Create enrollment
    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        course_id: courseId,
        user_id: userId,
        organization_id: organizationId,
        enrollment_date: new Date().toISOString(),
        status: 'active',
        completion_percentage: 0,
        last_accessed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating course enrollment:', error)
      return NextResponse.json({ error: 'Failed to create course enrollment' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Create course enrollment API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.courseId
    const body = await request.json()
    const { 
      organizationId, 
      completionPercentage, 
      lastAccessedAt,
      status,
      completedLessons = []
    } = body

    if (!courseId || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields: courseId, organizationId' }, { status: 400 })
    }

    // Check if user is enrolled in the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ error: 'User is not enrolled in this course' }, { status: 404 })
    }

    // Update enrollment
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (completionPercentage !== undefined) {
      updateData.completion_percentage = completionPercentage
    }
    if (lastAccessedAt) {
      updateData.last_accessed_at = lastAccessedAt
    }
    if (status) {
      updateData.status = status
    }
    if (completedLessons.length > 0) {
      updateData.completed_lessons = completedLessons
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .update(updateData)
      .eq('id', enrollment.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating course enrollment:', error)
      return NextResponse.json({ error: 'Failed to update course enrollment' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update course enrollment API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
