'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Calendar,
  Users,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Award,
  BookOpen,
  FileText,
  Clock,
  Target,
  Eye
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    total_events: number
    total_registrations: number
    average_rating: number
    completion_rate: number
  }
  popularEvents: Array<{
    id: string
    title: string
    event_type: string
    category: string
    view_count: number
  }>
  eventTypeDistribution: { [key: string]: number }
  feedbackAnalytics: {
    average_rating: number
    instructor_rating: number
    content_rating: number
    venue_rating: number
    recommendation_rate: number
    total_feedback: number
  }
  trends: Array<{
    month: string
    [key: string]: any
  }>
}

export function EnhancedAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [eventType, setEventType] = useState('all')

  const OOLITE_ORG_ID = '73339522-c672-40ac-a464-e027e9c99d13'

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange, eventType])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        orgId: OOLITE_ORG_ID,
        dateFrom: getDateFrom(dateRange),
        dateTo: new Date().toISOString()
      })

      if (eventType !== 'all') {
        params.append('eventType', eventType)
      }

      const response = await fetch(`/api/analytics/events?${params}`)
      if (response.ok) {
        const result = await response.json()
        setAnalyticsData(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateFrom = (range: string) => {
    const now = new Date()
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      workshop: 'bg-blue-500',
      exhibition: 'bg-green-500',
      performance: 'bg-purple-500',
      meeting: 'bg-orange-500',
      lecture: 'bg-red-500',
      seminar: 'bg-yellow-500',
      conference: 'bg-indigo-500',
      networking: 'bg-pink-500',
      social: 'bg-teal-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-300">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enhanced Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive insights into events, content, and user engagement
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="exhibition">Exhibitions</SelectItem>
              <SelectItem value="performance">Performances</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="lecture">Lectures</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Events
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.total_events}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Registrations
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.total_registrations}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.average_rating.toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.completion_rate.toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Feedback Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Rating</span>
                <span className="text-lg font-bold">
                  {analyticsData.feedbackAnalytics.average_rating.toFixed(1)}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Instructor Rating</span>
                <span className="text-lg font-bold">
                  {analyticsData.feedbackAnalytics.instructor_rating.toFixed(1)}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Content Rating</span>
                <span className="text-lg font-bold">
                  {analyticsData.feedbackAnalytics.content_rating.toFixed(1)}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Venue Rating</span>
                <span className="text-lg font-bold">
                  {analyticsData.feedbackAnalytics.venue_rating.toFixed(1)}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recommendation Rate</span>
                <span className="text-lg font-bold">
                  {analyticsData.feedbackAnalytics.recommendation_rate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Feedback</span>
                <span className="text-lg font-bold">
                  {analyticsData.feedbackAnalytics.total_feedback}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Event Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analyticsData.eventTypeDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(type)}`}></div>
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                  <span className="text-sm font-bold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popular Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.popularEvents.slice(0, 5).map((event, index) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {event.category} • {event.event_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{event.view_count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trends Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Event Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Event trends chart would be displayed here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Integration with charting library (Chart.js, Recharts, etc.) needed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
