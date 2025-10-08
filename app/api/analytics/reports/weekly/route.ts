/**
 * Weekly Booking Reports API
 * Generates automated weekly booking summaries and reports
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('org_id')
    const weekStart = searchParams.get('week_start') // YYYY-MM-DD format

    if (!orgId) {
      return NextResponse.json(
        { error: 'Missing org_id parameter' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Calculate week start and end dates
    const startDate = weekStart ? new Date(weekStart) : getWeekStart(new Date())
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)
    endDate.setHours(23, 59, 59, 999)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Get organization details
    const { data: organization } = await supabaseAdmin
      .from('organizations')
      .select('name, slug')
      .eq('id', orgId)
      .single()

    // Weekly booking summary
    const weeklyQuery = `
      WITH weekly_bookings AS (
        SELECT 
          b.*,
          r.title as resource_title,
          r.metadata->>'booking_type' as booking_type,
          bp_artist.user_id as artist_email,
          bp_host.user_id as host_email
        FROM bookings b
        LEFT JOIN resources r ON b.resource_id = r.id
        LEFT JOIN booking_participants bp_artist ON b.id = bp_artist.booking_id AND bp_artist.status = 'registered'
        LEFT JOIN booking_participants bp_host ON b.id = bp_host.booking_id AND bp_host.status = 'confirmed'
        WHERE b.org_id = '${orgId}'
        AND b.start_time >= '${startDateStr}'
        AND b.start_time <= '${endDateStr}'
      ),
      daily_summary AS (
        SELECT 
          DATE(start_time) as booking_date,
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
          AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60) as avg_duration_minutes,
          SUM(price) as daily_revenue
        FROM weekly_bookings
        GROUP BY DATE(start_time)
        ORDER BY booking_date
      ),
      resource_summary AS (
        SELECT 
          resource_title,
          booking_type,
          COUNT(*) as booking_count,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_count,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
          AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60) as avg_duration,
          SUM(price) as total_revenue
        FROM weekly_bookings
        GROUP BY resource_title, booking_type
        ORDER BY booking_count DESC
      ),
      host_summary AS (
        SELECT 
          host_email,
          COUNT(*) as booking_count,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_count,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
          AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60) as avg_duration
        FROM weekly_bookings
        WHERE host_email IS NOT NULL
        GROUP BY host_email
        ORDER BY booking_count DESC
      ),
      weekly_totals AS (
        SELECT 
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
          AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60) as avg_duration_minutes,
          SUM(price) as total_revenue,
          COUNT(DISTINCT artist_email) as unique_artists,
          COUNT(DISTINCT host_email) as active_hosts
        FROM weekly_bookings
      )
      SELECT 
        (SELECT row_to_json(weekly_totals) FROM weekly_totals) as summary,
        (SELECT json_agg(row_to_json(daily_summary)) FROM daily_summary) as daily_breakdown,
        (SELECT json_agg(row_to_json(resource_summary)) FROM resource_summary) as resource_breakdown,
        (SELECT json_agg(row_to_json(host_summary)) FROM host_summary) as host_breakdown
    `

    const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
      sql: weeklyQuery 
    })

    if (error) {
      console.error('Error generating weekly report:', error)
      return NextResponse.json(
        { error: 'Failed to generate weekly report' },
        { status: 500 }
      )
    }

    const result = data?.[0] || {}
    const report = {
      organization: organization,
      period: {
        week_start: startDateStr,
        week_end: endDateStr,
        week_number: getWeekNumber(startDate)
      },
      summary: result.summary || {},
      daily_breakdown: result.daily_breakdown || [],
      resource_breakdown: result.resource_breakdown || [],
      host_breakdown: result.host_breakdown || [],
      generated_at: new Date().toISOString(),
      report_type: 'weekly_booking_summary'
    }

    return NextResponse.json(report)

  } catch (error: any) {
    console.error('Error in weekly reports API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}



