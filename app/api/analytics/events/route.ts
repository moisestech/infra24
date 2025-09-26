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

// GET - Fetch event analytics
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const eventType = searchParams.get('eventType')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Build date filter
    let dateFilter = ''
    if (dateFrom && dateTo) {
      dateFilter = `AND created_at >= '${dateFrom}' AND created_at <= '${dateTo}'`
    }

    // Build event type filter
    let eventTypeFilter = ''
    if (eventType) {
      eventTypeFilter = `AND event_type = '${eventType}'`
    }

    // Get event statistics
    const { data: eventStats, error: eventStatsError } = await supabase.rpc('get_event_analytics', {
      p_org_id: orgId,
      p_date_from: dateFrom,
      p_date_to: dateTo,
      p_event_type: eventType
    })

    if (eventStatsError) {
      console.error('Error fetching event analytics:', eventStatsError)
      // Fallback to manual queries if RPC function doesn't exist
      return await getEventAnalyticsFallback(orgId, dateFrom, dateTo, eventType)
    }

    // Get popular events
    const { data: popularEvents, error: popularEventsError } = await supabase
      .from('workshops')
      .select(`
        id,
        title,
        event_type,
        category,
        view_count,
        created_at
      `)
      .eq('organization_id', orgId)
      .order('view_count', { ascending: false })
      .limit(10)

    // Get event type distribution
    const { data: eventTypeDistribution, error: eventTypeError } = await supabase
      .from('workshops')
      .select('event_type')
      .eq('organization_id', orgId)

    // Get feedback analytics
    const { data: feedbackStats, error: feedbackError } = await supabase
      .from('event_feedback')
      .select(`
        rating,
        instructor_rating,
        content_rating,
        venue_rating,
        would_recommend,
        event_id,
        workshops!inner(organization_id)
      `)
      .eq('workshops.organization_id', orgId)

    // Process analytics data
    const analytics = {
      overview: eventStats || {
        total_events: 0,
        total_registrations: 0,
        average_rating: 0,
        completion_rate: 0
      },
      popularEvents: popularEvents || [],
      eventTypeDistribution: processEventTypeDistribution(eventTypeDistribution || []),
      feedbackAnalytics: processFeedbackAnalytics(feedbackStats || []),
      trends: await getEventTrends(orgId, dateFrom, dateTo)
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Get event analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getEventAnalyticsFallback(orgId: string, dateFrom?: string, dateTo?: string, eventType?: string) {
  try {
    // Build query
    let query = supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', orgId)

    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }
    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    const { data: events, error: eventsError } = await query

    if (eventsError) {
      throw eventsError
    }

    // Calculate basic statistics
    const totalEvents = events?.length || 0
    const totalRegistrations = events?.reduce((sum, event) => sum + (event.enrollment_count || 0), 0) || 0
    const averageRating = events?.reduce((sum, event) => sum + (event.average_rating || 0), 0) / totalEvents || 0

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total_events: totalEvents,
          total_registrations: totalRegistrations,
          average_rating: Math.round(averageRating * 100) / 100,
          completion_rate: 0 // Would need more complex calculation
        },
        popularEvents: events?.slice(0, 10) || [],
        eventTypeDistribution: processEventTypeDistribution(events || []),
        feedbackAnalytics: { average_rating: averageRating },
        trends: []
      }
    })
  } catch (error) {
    console.error('Fallback analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

function processEventTypeDistribution(events: any[]) {
  const distribution: { [key: string]: number } = {}
  events.forEach(event => {
    const type = event.event_type || 'workshop'
    distribution[type] = (distribution[type] || 0) + 1
  })
  return distribution
}

function processFeedbackAnalytics(feedback: any[]) {
  if (feedback.length === 0) {
    return {
      average_rating: 0,
      instructor_rating: 0,
      content_rating: 0,
      venue_rating: 0,
      recommendation_rate: 0,
      total_feedback: 0
    }
  }

  const totalFeedback = feedback.length
  const averageRating = feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / totalFeedback
  const instructorRating = feedback.reduce((sum, f) => sum + (f.instructor_rating || 0), 0) / totalFeedback
  const contentRating = feedback.reduce((sum, f) => sum + (f.content_rating || 0), 0) / totalFeedback
  const venueRating = feedback.reduce((sum, f) => sum + (f.venue_rating || 0), 0) / totalFeedback
  const recommendationRate = feedback.filter(f => f.would_recommend).length / totalFeedback

  return {
    average_rating: Math.round(averageRating * 100) / 100,
    instructor_rating: Math.round(instructorRating * 100) / 100,
    content_rating: Math.round(contentRating * 100) / 100,
    venue_rating: Math.round(venueRating * 100) / 100,
    recommendation_rate: Math.round(recommendationRate * 100),
    total_feedback: totalFeedback
  }
}

async function getEventTrends(orgId: string, dateFrom?: string, dateTo?: string) {
  try {
    // Get events grouped by month
    const { data: trends, error: trendsError } = await supabase
      .from('workshops')
      .select('created_at, event_type')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: true })

    if (trendsError) {
      console.error('Error fetching trends:', trendsError)
      return []
    }

    // Group by month
    const monthlyTrends: { [key: string]: { [key: string]: number } } = {}
    trends?.forEach(event => {
      const month = new Date(event.created_at).toISOString().substring(0, 7) // YYYY-MM
      if (!monthlyTrends[month]) {
        monthlyTrends[month] = {}
      }
      const type = event.event_type || 'workshop'
      monthlyTrends[month][type] = (monthlyTrends[month][type] || 0) + 1
    })

    return Object.entries(monthlyTrends).map(([month, types]) => ({
      month,
      ...types
    }))
  } catch (error) {
    console.error('Error processing trends:', error)
    return []
  }
}
