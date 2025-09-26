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

// GET - Fetch event feedback
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventId = params.eventId
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    // Build query
    let query = supabase
      .from('event_feedback')
      .select('*')
      .eq('event_id', eventId)

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    query = query.order('created_at', { ascending: false })

    const { data: feedback, error: feedbackError } = await query

    if (feedbackError) {
      console.error('Error fetching event feedback:', feedbackError)
      return NextResponse.json({ error: 'Failed to fetch event feedback' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: feedback
    })

  } catch (error) {
    console.error('Get event feedback API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create event feedback
export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventId = params.eventId
    const body = await request.json()
    const { 
      sessionId,
      rating, 
      feedbackText,
      instructorRating,
      contentRating,
      venueRating,
      wouldRecommend,
      improvementSuggestions,
      favoriteAspects,
      anonymous = false
    } = body

    // Validate required fields
    if (!rating) {
      return NextResponse.json({ 
        error: 'Missing required fields: rating' 
      }, { status: 400 })
    }

    // Check if user already provided feedback for this event/session
    const { data: existingFeedback, error: existingError } = await supabase
      .from('event_feedback')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .eq('session_id', sessionId || null)
      .single()

    if (existingFeedback) {
      return NextResponse.json({ 
        error: 'Feedback already provided for this event/session' 
      }, { status: 409 })
    }

    // Create event feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('event_feedback')
      .insert({
        event_id: eventId,
        user_id: userId,
        session_id: sessionId,
        rating,
        feedback_text: feedbackText,
        instructor_rating: instructorRating,
        content_rating: contentRating,
        venue_rating: venueRating,
        would_recommend: wouldRecommend,
        improvement_suggestions: improvementSuggestions,
        favorite_aspects: favoriteAspects,
        anonymous
      })
      .select()
      .single()

    if (feedbackError) {
      console.error('Error creating event feedback:', feedbackError)
      return NextResponse.json({ error: 'Failed to create event feedback' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: feedback
    }, { status: 201 })

  } catch (error) {
    console.error('Create event feedback API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
