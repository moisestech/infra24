import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'
import { subDays, subWeeks, subMonths, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    const workshopId = searchParams.get('workshopId')
    const organizationId = searchParams.get('organizationId') || 'caf2bc8b-8547-4c55-ac9f-5692e93bd831'

    const supabase = createClient()

    // Calculate date range
    let startDate: Date
    switch (timeRange) {
      case '7d':
        startDate = subDays(new Date(), 7)
        break
      case '30d':
        startDate = subDays(new Date(), 30)
        break
      case '3m':
        startDate = subMonths(new Date(), 3)
        break
      case '6m':
        startDate = subMonths(new Date(), 6)
        break
      case '1y':
        startDate = subMonths(new Date(), 12)
        break
      default:
        startDate = new Date('2020-01-01')
    }

    // Build query
    let query = supabase
      .from('workshops')
      .select(`
        id,
        title,
        status,
        created_at,
        max_participants,
        workshop_registrations (
          id,
          status,
          registered_at,
          attended_at,
          user_id
        )
      `)
      .eq('organization_id', organizationId)
      .gte('created_at', startDate.toISOString())

    // Filter by specific workshop if provided
    if (workshopId && workshopId !== 'all') {
      query = query.eq('id', workshopId)
    }

    const { data: workshops, error: workshopsError } = await query

    if (workshopsError) {
      console.error('Error fetching workshops:', workshopsError)
      return NextResponse.json({ error: 'Failed to fetch workshop data' }, { status: 500 })
    }

    // Calculate analytics
    const totalWorkshops = workshops?.length || 0
    const totalRegistrations = workshops?.reduce((sum, w) => sum + (w.workshop_registrations?.length || 0), 0) || 0
    const totalParticipants = workshops?.reduce((sum, w) => 
      sum + (w.workshop_registrations?.filter((r: any) => r.attended_at)?.length || 0), 0
    ) || 0
    const averageAttendance = totalRegistrations > 0 ? (totalParticipants / totalRegistrations) * 100 : 0

    // Popular workshops
    const popularWorkshops = workshops
      ?.map(w => ({
        id: w.id,
        title: w.title,
        registrations: w.workshop_registrations?.length || 0,
        attendance: w.workshop_registrations?.filter((r: any) => r.attended_at)?.length || 0,
        attendanceRate: w.workshop_registrations?.length > 0 
          ? (w.workshop_registrations.filter((r: any) => r.attended_at).length / w.workshop_registrations.length) * 100 
          : 0
      }))
      .sort((a, b) => b.registrations - a.registrations)
      .slice(0, 10) || []

    // Registration trends (last 7 days)
    const registrationTrends = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const dayRegistrations = workshops?.reduce((sum, w) => {
        return sum + (w.workshop_registrations?.filter((r: any) => {
          const regDate = new Date(r.registered_at)
          return regDate >= dayStart && regDate <= dayEnd
        }).length || 0)
      }, 0) || 0

      registrationTrends.push({
        date: format(date, 'MMM dd'),
        registrations: dayRegistrations,
        workshops: workshops?.filter(w => {
          const createdDate = new Date(w.created_at)
          return createdDate >= dayStart && createdDate <= dayEnd
        }).length || 0
      })
    }

    // Attendance by workshop
    const attendanceByWorkshop = workshops
      ?.map(w => ({
        workshopId: w.id,
        title: w.title,
        registered: w.workshop_registrations?.length || 0,
        attended: w.workshop_registrations?.filter((r: any) => r.attended_at)?.length || 0,
        attendanceRate: w.workshop_registrations?.length > 0 
          ? (w.workshop_registrations.filter((r: any) => r.attended_at).length / w.workshop_registrations.length) * 100 
          : 0
      }))
      .sort((a, b) => b.registered - a.registered) || []

    // Monthly stats (last 6 months)
    const monthlyStats = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

      const monthWorkshops = workshops?.filter(w => {
        const createdDate = new Date(w.created_at)
        return createdDate >= monthStart && createdDate <= monthEnd
      }).length || 0

      const monthRegistrations = workshops?.reduce((sum, w) => {
        return sum + (w.workshop_registrations?.filter((r: any) => {
          const regDate = new Date(r.registered_at)
          return regDate >= monthStart && regDate <= monthEnd
        }).length || 0)
      }, 0) || 0

      const monthAttendance = workshops?.reduce((sum, w) => {
        return sum + (w.workshop_registrations?.filter((r: any) => {
          const attendedDate = r.attended_at ? new Date(r.attended_at) : null
          return attendedDate && attendedDate >= monthStart && attendedDate <= monthEnd
        }).length || 0)
      }, 0) || 0

      monthlyStats.push({
        month: format(date, 'MMM yyyy'),
        workshops: monthWorkshops,
        registrations: monthRegistrations,
        attendance: monthAttendance
      })
    }

    // User engagement metrics
    const uniqueUsers = new Set()
    workshops?.forEach(w => {
      w.workshop_registrations?.forEach((r: any) => {
        if (r.user_id) uniqueUsers.add(r.user_id)
      })
    })

    const engagementMetrics = {
      totalUniqueUsers: uniqueUsers.size,
      averageRegistrationsPerUser: uniqueUsers.size > 0 ? totalRegistrations / uniqueUsers.size : 0,
      repeatParticipants: Array.from(uniqueUsers).filter(userId => {
        const userRegistrations = workshops?.reduce((sum, w) => {
          return sum + (w.workshop_registrations?.filter((r: any) => r.user_id === userId).length || 0)
        }, 0) || 0
        return userRegistrations > 1
      }).length
    }

    return NextResponse.json({
      success: true,
      data: {
        totalWorkshops,
        totalRegistrations,
        totalParticipants,
        averageAttendance,
        popularWorkshops,
        registrationTrends,
        attendanceByWorkshop,
        monthlyStats,
        engagementMetrics,
        timeRange,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
