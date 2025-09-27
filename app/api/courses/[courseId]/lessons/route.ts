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

export async function GET(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await params
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const { data: lessons, error } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('lesson_order', { ascending: true })

    if (error) {
      console.error('Error fetching course lessons:', error)
      return NextResponse.json({ error: 'Failed to fetch course lessons' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: lessons })
  } catch (error) {
    console.error('Get course lessons API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await params
    const body = await request.json()
    const { 
      organizationId, 
      title, 
      description, 
      content, 
      lessonOrder,
      durationMinutes = 0,
      isPublished = false,
      lessonType = 'video',
      videoUrl,
      audioUrl,
      attachments = [],
      quizData,
      assignmentData
    } = body

    if (!courseId || !organizationId || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user is admin of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership || !['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get the next lesson order if not provided
    let finalLessonOrder = lessonOrder
    if (!finalLessonOrder) {
      const { data: lastLesson } = await supabase
        .from('course_lessons')
        .select('lesson_order')
        .eq('course_id', courseId)
        .order('lesson_order', { ascending: false })
        .limit(1)
        .single()
      
      finalLessonOrder = lastLesson ? lastLesson.lesson_order + 1 : 1
    }

    const { data, error } = await supabase
      .from('course_lessons')
      .insert({
        course_id: courseId,
        organization_id: organizationId,
        title,
        description,
        content,
        lesson_order: finalLessonOrder,
        duration_minutes: durationMinutes,
        is_published: isPublished,
        lesson_type: lessonType,
        video_url: videoUrl,
        audio_url: audioUrl,
        attachments,
        quiz_data: quizData,
        assignment_data: assignmentData,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating course lesson:', error)
      return NextResponse.json({ error: 'Failed to create course lesson' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Create course lesson API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}