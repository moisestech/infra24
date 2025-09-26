'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Clock,
  MapPin,
  GraduationCap,
  Eye,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'
import { createClient } from '@/lib/supabase'
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns'

interface WorkshopAnalytics {
  totalWorkshops: number
  totalRegistrations: number
  totalParticipants: number
  averageAttendance: number
  popularWorkshops: Array<{
    id: string
    title: string
    registrations: number
    attendance: number
    attendanceRate: number
  }>
  registrationTrends: Array<{
    date: string
    registrations: number
    workshops: number
  }>
  attendanceByWorkshop: Array<{
    workshopId: string
    title: string
    registered: number
    attended: number
    attendanceRate: number
  }>
  monthlyStats: Array<{
    month: string
    workshops: number
    registrations: number
    attendance: number
  }>
}

interface TimeRange {
  label: string
  value: string
  days: number
}

const timeRanges: TimeRange[] = [
  { label: 'Last 7 days', value: '7d', days: 7 },
  { label: 'Last 30 days', value: '30d', days: 30 },
  { label: 'Last 3 months', value: '3m', days: 90 },
  { label: 'Last 6 months', value: '6m', days: 180 },
  { label: 'Last year', value: '1y', days: 365 },
  { label: 'All time', value: 'all', days: 0 }
]

export default function WorkshopAnalyticsPage() {
  const [analytics, setAnalytics] = useState<WorkshopAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('all')
  const [workshops, setWorkshops] = useState<any[]>([])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  useEffect(() => {
    fetchAnalytics()
    fetchWorkshops()
  }, [selectedTimeRange, selectedWorkshop])

  const fetchWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('id, title, status')
        .eq('organization_id', 'caf2bc8b-8547-4c55-ac9f-5692e93bd831') // Oolite org ID
        .order('title')

      if (error) {
        console.error('Error fetching workshops:', error)
        return
      }

      setWorkshops(data || [])
    } catch (error) {
      console.error('Error fetching workshops:', error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      const timeRange = timeRanges.find(tr => tr.value === selectedTimeRange)
      const startDate = timeRange?.days ? subDays(new Date(), timeRange.days) : new Date('2020-01-01')
      const endDate = new Date()

      // Fetch workshop data
      const { data: workshopsData, error: workshopsError } = await supabase
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
            attended_at
          )
        `)
        .eq('organization_id', 'caf2bc8b-8547-4c55-ac9f-5692e93bd831')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      if (workshopsError) {
        console.error('Error fetching workshops:', workshopsError)
        return
      }

      // Filter by selected workshop if not 'all'
      let filteredWorkshops = workshopsData || []
      if (selectedWorkshop !== 'all') {
        filteredWorkshops = filteredWorkshops.filter(w => w.id === selectedWorkshop)
      }

      // Calculate analytics
      const totalWorkshops = filteredWorkshops.length
      const totalRegistrations = filteredWorkshops.reduce((sum, w) => sum + (w.workshop_registrations?.length || 0), 0)
      const totalParticipants = filteredWorkshops.reduce((sum, w) => 
        sum + (w.workshop_registrations?.filter((r: any) => r.attended_at)?.length || 0), 0
      )
      const averageAttendance = totalRegistrations > 0 ? (totalParticipants / totalRegistrations) * 100 : 0

      // Popular workshops
      const popularWorkshops = filteredWorkshops
        .map(w => ({
          id: w.id,
          title: w.title,
          registrations: w.workshop_registrations?.length || 0,
          attendance: w.workshop_registrations?.filter((r: any) => r.attended_at)?.length || 0,
          attendanceRate: w.workshop_registrations?.length > 0 
            ? (w.workshop_registrations.filter((r: any) => r.attended_at).length / w.workshop_registrations.length) * 100 
            : 0
        }))
        .sort((a, b) => b.registrations - a.registrations)
        .slice(0, 10)

      // Registration trends (mock data for now)
      const registrationTrends = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i)
        return {
          date: format(date, 'MMM dd'),
          registrations: Math.floor(Math.random() * 20) + 5,
          workshops: Math.floor(Math.random() * 3) + 1
        }
      })

      // Attendance by workshop
      const attendanceByWorkshop = filteredWorkshops
        .map(w => ({
          workshopId: w.id,
          title: w.title,
          registered: w.workshop_registrations?.length || 0,
          attended: w.workshop_registrations?.filter((r: any) => r.attended_at)?.length || 0,
          attendanceRate: w.workshop_registrations?.length > 0 
            ? (w.workshop_registrations.filter((r: any) => r.attended_at).length / w.workshop_registrations.length) * 100 
            : 0
        }))
        .sort((a, b) => b.registered - a.registered)

      // Monthly stats (mock data for now)
      const monthlyStats = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), 5 - i)
        return {
          month: format(date, 'MMM yyyy'),
          workshops: Math.floor(Math.random() * 10) + 5,
          registrations: Math.floor(Math.random() * 50) + 20,
          attendance: Math.floor(Math.random() * 40) + 15
        }
      })

      setAnalytics({
        totalWorkshops,
        totalRegistrations,
        totalParticipants,
        averageAttendance,
        popularWorkshops,
        registrationTrends,
        attendanceByWorkshop,
        monthlyStats
      })

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportAnalytics = () => {
    if (!analytics) return

    const csvData = [
      ['Metric', 'Value'],
      ['Total Workshops', analytics.totalWorkshops],
      ['Total Registrations', analytics.totalRegistrations],
      ['Total Participants', analytics.totalParticipants],
      ['Average Attendance Rate', `${analytics.averageAttendance.toFixed(1)}%`],
      [''],
      ['Workshop', 'Registrations', 'Attendance', 'Attendance Rate'],
      ...analytics.popularWorkshops.map(w => [
        w.title,
        w.registrations,
        w.attendance,
        `${w.attendanceRate.toFixed(1)}%`
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workshop-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Workshop Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive insights into workshop performance and engagement
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={exportAnalytics} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={fetchAnalytics} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Select value={selectedWorkshop} onValueChange={setSelectedWorkshop}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select workshop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workshops</SelectItem>
              {workshops.map((workshop) => (
                <SelectItem key={workshop.id} value={workshop.id}>
                  {workshop.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Workshops</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalWorkshops}</p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalRegistrations}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Participants</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalParticipants}</p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Attendance Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.averageAttendance.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Workshops */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Most Popular Workshops</CardTitle>
                <CardDescription>
                  Workshops ranked by total registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.popularWorkshops.map((workshop, index) => (
                    <div key={workshop.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{workshop.title}</h4>
                          <p className="text-sm text-gray-600">
                            {workshop.registrations} registrations • {workshop.attendance} attended
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {workshop.attendanceRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">attendance rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance by Workshop */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Attendance by Workshop</CardTitle>
                <CardDescription>
                  Detailed attendance breakdown for each workshop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Workshop</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Registered</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Attended</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Attendance Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.attendanceByWorkshop.map((workshop) => (
                        <tr key={workshop.workshopId} className="border-b">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{workshop.title}</div>
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600">{workshop.registered}</td>
                          <td className="py-3 px-4 text-right text-gray-600">{workshop.attended}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-medium ${
                              workshop.attendanceRate >= 80 ? 'text-green-600' :
                              workshop.attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {workshop.attendanceRate.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>
                  Workshop and registration trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.monthlyStats.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{month.month}</div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{month.workshops}</p>
                          <p className="text-gray-600">Workshops</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{month.registrations}</p>
                          <p className="text-gray-600">Registrations</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{month.attendance}</p>
                          <p className="text-gray-600">Attendance</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
