'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Eye,
  GraduationCap,
  Clock,
  BarChart3
} from 'lucide-react'

interface AnalyticsWidgetProps {
  organizationId?: string
  timeRange?: '7d' | '30d' | '3m' | '6m' | '1y' | 'all'
  compact?: boolean
  showTrends?: boolean
}

interface QuickStats {
  totalWorkshops: number
  totalRegistrations: number
  totalParticipants: number
  averageAttendance: number
  thisWeekRegistrations: number
  lastWeekRegistrations: number
  registrationGrowth: number
}

export function WorkshopAnalyticsWidget({ 
  organizationId = 'caf2bc8b-8547-4c55-ac9f-5692e93bd831',
  timeRange = '30d',
  compact = false,
  showTrends = true
}: AnalyticsWidgetProps) {
  const [stats, setStats] = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuickStats()
  }, [organizationId, timeRange])

  const fetchQuickStats = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/analytics/workshops?timeRange=${timeRange}&organizationId=${organizationId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const { data } = await response.json()
      
      // Calculate this week vs last week for growth
      const thisWeek = data.registrationTrends?.slice(-7).reduce((sum: number, day: any) => sum + day.registrations, 0) || 0
      const lastWeek = data.registrationTrends?.slice(-14, -7).reduce((sum: number, day: any) => sum + day.registrations, 0) || 0
      const growth = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0

      setStats({
        totalWorkshops: data.totalWorkshops,
        totalRegistrations: data.totalRegistrations,
        totalParticipants: data.totalParticipants,
        averageAttendance: data.averageAttendance,
        thisWeekRegistrations: thisWeek,
        lastWeekRegistrations: lastWeek,
        registrationGrowth: growth
      })

    } catch (error) {
      console.error('Error fetching quick stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        <CardContent className={compact ? 'p-0' : 'p-6'}>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        <CardContent className={compact ? 'p-0' : 'p-6'}>
          <div className="text-center text-gray-500">
            <BarChart3 className="w-8 h-8 mx-auto mb-2" />
            <p>No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalWorkshops}</div>
          <div className="text-sm text-gray-600">Workshops</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalRegistrations}</div>
          <div className="text-sm text-gray-600">Registrations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalParticipants}</div>
          <div className="text-sm text-gray-600">Participants</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.averageAttendance.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Attendance</div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Workshop Analytics</span>
        </CardTitle>
        <CardDescription>
          Performance overview for the last {timeRange === '7d' ? '7 days' : 
          timeRange === '30d' ? '30 days' : 
          timeRange === '3m' ? '3 months' : 
          timeRange === '6m' ? '6 months' : 
          timeRange === '1y' ? 'year' : 'all time'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalWorkshops}</div>
            <div className="text-sm text-gray-600">Total Workshops</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</div>
            <div className="text-sm text-gray-600">Total Registrations</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.averageAttendance.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Avg Attendance</div>
          </div>
        </div>

        {showTrends && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">This Week's Registrations</h4>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeekRegistrations}</p>
              </div>
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${
                  stats.registrationGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${stats.registrationGrowth < 0 ? 'rotate-180' : ''}`} />
                  <span className="text-sm font-medium">
                    {Math.abs(stats.registrationGrowth).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">vs last week</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Mini analytics widget for dashboard cards
 */
export function MiniAnalyticsWidget({ organizationId }: { organizationId?: string }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Workshop Stats</h3>
        <BarChart3 className="w-4 h-4 text-gray-400" />
      </div>
      <WorkshopAnalyticsWidget 
        organizationId={organizationId}
        timeRange="30d"
        compact={true}
        showTrends={false}
      />
    </div>
  )
}
