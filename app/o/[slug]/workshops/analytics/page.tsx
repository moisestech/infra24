'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/contexts/ThemeContext'
import { useTenant } from '@/components/tenant/TenantProvider'
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Eye,
  FileText,
  GraduationCap
} from 'lucide-react'

interface WorkshopAnalytics {
  id: string
  title: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  has_learn_content: boolean
  learning_objectives?: string[]
  estimated_learn_time?: number
  learn_difficulty?: string
  instructor: string
  duration_minutes: number
  max_participants: number
  price: number
  created_at: string
  updated_at: string
  chapter_count?: number
  total_chapter_time?: number
  total_progress_records?: number
  completed_chapters?: number
  unique_users?: number
  completion_rate_percent?: number
}

interface SummaryStats {
  total_workshops: number
  published_workshops: number
  draft_workshops: number
  learn_canvas_enabled: number
  total_chapters: number
  active_users: number
}

export default function WorkshopAnalyticsPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user } = useUser()
  const { tenantConfig } = useTenant()
  const { theme } = useTheme()
  
  const [workshops, setWorkshops] = useState<WorkshopAnalytics[]>([])
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig
    }
  }

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        console.log('📊 Loading workshop analytics for slug:', slug)
        
        // Fetch organization data
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        if (!orgResponse.ok) {
          throw new Error('Failed to fetch organization')
        }
        
        const orgData = await orgResponse.json()
        const organizationId = orgData.organization.id
        
        // Fetch workshop analytics
        const analyticsResponse = await fetch(`/api/organizations/${organizationId}/workshops/analytics`)
        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch workshop analytics')
        }
        
        const analyticsData = await analyticsResponse.json()
        setWorkshops(analyticsData.workshops || [])
        setSummaryStats(analyticsData.summary || null)
        
        console.log('📊 Analytics data loaded:', analyticsData)
        
      } catch (error) {
        console.error('❌ Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [slug])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">✅ Published</Badge>
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">📝 Draft</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">🗄️ Archived</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">❓ Unknown</Badge>
    }
  }

  const getLearnCanvasBadge = (hasLearnContent: boolean) => {
    return hasLearnContent ? (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">🎓 Learn Canvas</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">📚 Traditional</Badge>
    )
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
          : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
      }`}>
        <div className="relative z-50">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className={`h-8 rounded w-1/3 mb-6 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`h-64 rounded mb-6 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
    }`}>
      <div className="relative z-50">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Workshop Analytics</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive overview of workshop performance and Learn Canvas integration
          </p>
        </div>

        {/* Summary Stats */}
        {summaryStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.total_workshops}</div>
                <p className="text-xs text-muted-foreground">
                  {summaryStats.published_workshops} published, {summaryStats.draft_workshops} draft
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learn Canvas</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.learn_canvas_enabled}</div>
                <p className="text-xs text-muted-foreground">
                  {summaryStats.total_chapters} total chapters
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.active_users}</div>
                <p className="text-xs text-muted-foreground">
                  Users with progress records
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Workshop Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Workshop Details</h2>
          
          {workshops.map((workshop) => (
            <Card key={workshop.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{workshop.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(workshop.status)}
                      {getLearnCanvasBadge(workshop.has_learn_content)}
                      {workshop.featured && (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          ⭐ Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>ID: {workshop.id}</div>
                    <div>Updated: {new Date(workshop.updated_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(workshop.duration_minutes / 60)} hours
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Capacity</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {workshop.max_participants} participants
                    </p>
                  </div>
                  
                  {workshop.has_learn_content && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Chapters</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workshop.chapter_count || 0} chapters
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">Completion</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workshop.completion_rate_percent || 0}% rate
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                {workshop.has_learn_content && workshop.learning_objectives && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Learning Objectives:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {workshop.learning_objectives.slice(0, 3).map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                      {workshop.learning_objectives.length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{workshop.learning_objectives.length - 3} more objectives
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
