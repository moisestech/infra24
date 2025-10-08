/**
 * Booking Analytics Overview API
 * Provides comprehensive booking metrics and statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('org_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const resourceId = searchParams.get('resource_id')

    if (!orgId) {
      return NextResponse.json(
        { error: 'Missing org_id parameter' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Build date filter
    let dateFilter = ''
    if (startDate && endDate) {
      dateFilter = `AND b.start_time >= '${startDate}' AND b.start_time <= '${endDate}'`
    }

    // Build resource filter
    let resourceFilter = ''
    if (resourceId) {
      resourceFilter = `AND b.resource_id = '${resourceId}'`
    }

    // Get booking overview statistics
    const overviewQuery = `
      WITH booking_stats AS (
        SELECT 
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_bookings,
          COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_bookings,
          COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
          COUNT(CASE WHEN b.start_time > NOW() THEN 1 END) as upcoming_bookings,
          COUNT(CASE WHEN b.start_time < NOW() AND b.status = 'confirmed' THEN 1 END) as past_bookings,
          AVG(EXTRACT(EPOCH FROM (b.end_time - b.start_time))/60) as avg_duration_minutes,
          SUM(b.price) as total_revenue
        FROM bookings b
        WHERE b.org_id = '${orgId}'
        ${dateFilter}
        ${resourceFilter}
      ),
      resource_stats AS (
        SELECT 
          r.id,
          r.title,
          r.metadata->>'booking_type' as booking_type,
          COUNT(b.id) as booking_count,
          COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_count,
          COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_count,
          AVG(EXTRACT(EPOCH FROM (b.end_time - b.start_time))/60) as avg_duration,
          SUM(b.price) as total_revenue
        FROM resources r
        LEFT JOIN bookings b ON r.id = b.resource_id 
          AND b.org_id = '${orgId}'
          ${dateFilter.replace('b.start_time', 'b.start_time')}
        WHERE r.org_id = '${orgId}' AND r.is_active = true
        GROUP BY r.id, r.title, r.metadata->>'booking_type'
      ),
      host_stats AS (
        SELECT 
          b.metadata->>'host' as host_email,
          COUNT(*) as booking_count,
          COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_count,
          COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_count,
          AVG(EXTRACT(EPOCH FROM (b.end_time - b.start_time))/60) as avg_duration
        FROM bookings b
        WHERE b.org_id = '${orgId}'
        ${dateFilter}
        ${resourceFilter}
        AND b.metadata->>'host' IS NOT NULL
        GROUP BY b.metadata->>'host'
        ORDER BY booking_count DESC
      ),
      daily_stats AS (
        SELECT 
          DATE(b.start_time) as booking_date,
          COUNT(*) as daily_bookings,
          COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as daily_confirmed,
          COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as daily_cancelled
        FROM bookings b
        WHERE b.org_id = '${orgId}'
        ${dateFilter}
        ${resourceFilter}
        GROUP BY DATE(b.start_time)
        ORDER BY booking_date DESC
        LIMIT 30
      )
      SELECT 
        (SELECT row_to_json(booking_stats) FROM booking_stats) as overview,
        (SELECT json_agg(row_to_json(resource_stats)) FROM resource_stats) as resources,
        (SELECT json_agg(row_to_json(host_stats)) FROM host_stats) as hosts,
        (SELECT json_agg(row_to_json(daily_stats)) FROM daily_stats) as daily_trends
    `

    const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
      sql: overviewQuery 
    })

    if (error) {
      console.error('Error fetching booking analytics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch booking analytics' },
        { status: 500 }
      )
    }

    // Parse the results
    const result = data?.[0] || {}
    const analytics = {
      overview: result.overview || {},
      resources: result.resources || [],
      hosts: result.hosts || [],
      daily_trends: result.daily_trends || [],
      generated_at: new Date().toISOString(),
      filters: {
        org_id: orgId,
        start_date: startDate,
        end_date: endDate,
        resource_id: resourceId
      }
    }

    return NextResponse.json(analytics)

  } catch (error: any) {
    console.error('Error in booking analytics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



