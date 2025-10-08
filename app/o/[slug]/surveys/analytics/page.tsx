'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Mail,
  Eye,
  Download,
  Filter,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Organization {
  id: string
  name: string
  slug: string
}

interface SurveyAnalytics {
  surveyId: string
  surveyTitle: string
  totalResponses: number
  completionRate: number
  averageTime: number
  responseBreakdown: {
    completed: number
    partial: number
    abandoned: number
  }
  questionAnalytics: QuestionAnalytics[]
  distributionStats: {
    totalSent: number
    opened: number
    clicked: number
  }
  timeSeries: {
    date: string
    responses: number
  }[]
}

interface QuestionAnalytics {
  questionId: string
  questionText: string
  questionType: string
  responseCount: number
  analytics: {
    // For multiple choice
    choices?: Array<{
      option: string
      count: number
      percentage: number
    }>
    // For rating questions
    averageRating?: number
    ratingDistribution?: Array<{
      rating: number
      count: number
    }>
    // For open text
    wordCloud?: Array<{
      word: string
      count: number
    }>
    commonThemes?: Array<{
      theme: string
      count: number
      examples: string[]
    }>
  }
}

export default function SurveyAnalyticsPage() {
  const params = useParams()
  const slug = params.slug as string
  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  }

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [surveys, setSurveys] = useState<any[]>([])
  const [selectedSurvey, setSelectedSurvey] = useState<string>('')
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    loadData()
  }, [slug])

  useEffect(() => {
    if (selectedSurvey) {
      loadAnalytics(selectedSurvey)
    }
  }, [selectedSurvey, dateRange])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load organization data
      const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        setOrganization(orgData.organization)
      }

      // Load surveys
      const surveysResponse = await fetch(`/api/organizations/by-slug/${slug}/surveys`)
      if (surveysResponse.ok) {
        const surveysData = await surveysResponse.json()
        setSurveys(surveysData.surveys || [])
        if (surveysData.surveys?.length > 0) {
          setSelectedSurvey(surveysData.surveys[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async (surveyId: string) => {
    try {
      const response = await fetch(`/api/surveys/${surveyId}/analytics?dateRange=${dateRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`
    }
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <TenantProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </TenantProvider>
    )
  }

  return (
    <TenantProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4">
              <OrganizationLogo organizationSlug={slug} size="lg" className="h-12 w-12" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Survey Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive insights into survey performance and responses
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
              
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </motion.div>

          {/* Survey Selector */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Select Survey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a survey to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    {surveys.map((survey) => (
                      <SelectItem key={survey.id} value={survey.id}>
                        {survey.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>

          {analytics && (
            <>
              {/* Overview Stats */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Responses</p>
                        <p className="text-3xl font-bold">{analytics.totalResponses}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Completion Rate</p>
                        <p className="text-3xl font-bold">{formatPercentage(analytics.completionRate)}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Avg. Time</p>
                        <p className="text-3xl font-bold">{formatDuration(analytics.averageTime)}</p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Email Opens</p>
                        <p className="text-3xl font-bold">{analytics.distributionStats.opened}</p>
                      </div>
                      <Eye className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Detailed Analytics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="distribution">Distribution</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Response Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <PieChart className="h-5 w-5 mr-2" />
                            Response Breakdown
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                                <span>Completed</span>
                              </div>
                              <span className="font-semibold">{analytics.responseBreakdown.completed}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                                <span>Partial</span>
                              </div>
                              <span className="font-semibold">{analytics.responseBreakdown.partial}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                                <span>Abandoned</span>
                              </div>
                              <span className="font-semibold">{analytics.responseBreakdown.abandoned}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Distribution Stats */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Mail className="h-5 w-5 mr-2" />
                            Email Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span>Total Sent</span>
                              <span className="font-semibold">{analytics.distributionStats.totalSent}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Opened</span>
                              <span className="font-semibold">{analytics.distributionStats.opened}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Clicked</span>
                              <span className="font-semibold">{analytics.distributionStats.clicked}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Open Rate</span>
                              <span className="font-semibold">
                                {formatPercentage(analytics.distributionStats.opened / analytics.distributionStats.totalSent)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="questions" className="mt-6">
                    <div className="space-y-6">
                      {analytics.questionAnalytics.map((question, index) => (
                        <Card key={question.questionId}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {index + 1}. {question.questionText}
                                </CardTitle>
                                <CardDescription>
                                  {question.questionType} • {question.responseCount} responses
                                </CardDescription>
                              </div>
                              <Badge variant="default">
                                {question.questionType}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {question.questionType === 'multiple_choice' && question.analytics.choices && (
                              <div className="space-y-3">
                                {question.analytics.choices.map((choice, choiceIndex) => (
                                  <div key={choiceIndex} className="flex items-center justify-between">
                                    <span className="flex-1">{choice.option}</span>
                                    <div className="flex items-center space-x-3 w-32">
                                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full" 
                                          style={{ width: `${choice.percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-medium w-12 text-right">
                                        {choice.count} ({formatPercentage(choice.percentage / 100)})
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {question.questionType === 'rating' && question.analytics.averageRating && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-blue-600">
                                    {question.analytics.averageRating.toFixed(1)}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Average Rating
                                  </div>
                                </div>
                                {question.analytics.ratingDistribution && (
                                  <div className="space-y-2">
                                    {question.analytics.ratingDistribution.map((rating, ratingIndex) => (
                                      <div key={ratingIndex} className="flex items-center space-x-3">
                                        <span className="w-8 text-sm">{rating.rating}</span>
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                          <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: `${(rating.count / Math.max(...question.analytics.ratingDistribution!.map(r => r.count))) * 100}%` }}
                                          ></div>
                                        </div>
                                        <span className="w-8 text-sm text-right">{rating.count}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {question.questionType === 'open_text' && question.analytics.commonThemes && (
                              <div className="space-y-4">
                                <h4 className="font-semibold">Common Themes</h4>
                                <div className="space-y-3">
                                  {question.analytics.commonThemes.map((theme, themeIndex) => (
                                    <div key={themeIndex} className="border rounded-lg p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{theme.theme}</span>
                                        <Badge variant="default">{theme.count} mentions</Badge>
                                      </div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Examples: {theme.examples.slice(0, 2).join(', ')}
                                        {theme.examples.length > 2 && ` (+${theme.examples.length - 2} more)`}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="distribution" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Distribution Performance</CardTitle>
                        <CardDescription>
                          Track how your survey invitations are performing
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                              {formatPercentage(analytics.distributionStats.opened / analytics.distributionStats.totalSent)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Open Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {formatPercentage(analytics.distributionStats.clicked / analytics.distributionStats.totalSent)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Click Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                              {formatPercentage(analytics.totalResponses / analytics.distributionStats.clicked)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Activity className="h-5 w-5 mr-2" />
                          Response Timeline
                        </CardTitle>
                        <CardDescription>
                          Track survey responses over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-500">
                          Timeline chart would be implemented here
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </TenantProvider>
  )
}
