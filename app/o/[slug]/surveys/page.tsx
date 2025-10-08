"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  MessageSquare,
  Filter,
  Search,
  Calendar,
  User,
  Building,
  BarChart3,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnifiedNavigation, ooliteConfig } from "@/components/navigation"
import { TenantProvider } from "@/components/tenant/TenantProvider"
import { PageFooter } from "@/components/common/PageFooter"

interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  banner_image?: string
}

interface Survey {
  id: string
  title: string
  description: string
  created_at: string
  survey_schema: {
    questions?: any[]
  }
  settings: {
    require_authentication?: boolean
  }
  template_id?: string
  survey_templates?: {
    id: string
    name: string
    template_schema: {
      sections: Array<{
        title: { en: string; es: string }
        questions: any[]
      }>
    }
  }
}

interface SurveySubmission {
  id: string
  surveyId: string
  surveyTitle: string
  organizationName: string
  organizationSlug: string
  status: 'draft' | 'submitted' | 'in_review' | 'accepted' | 'declined'
  submittedAt: string
  lastModified: string
  progress: number
  totalQuestions: number
  answeredQuestions: number
  canEdit: boolean
  canWithdraw: boolean
  hasMessages: boolean
  messageCount: number
}

export default function OrganizationSurveysPage() {
  const params = useParams()
  const slug = params.slug as string
  const { resolvedTheme } = useTheme()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<SurveySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('available')

  // Oolite theme colors
  const ooliteColors = {
    primary: '#47abc4',
    primaryLight: '#6bb8d1',
    primaryDark: '#3a8ba3',
    primaryAlpha: 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
    // Dark mode specific colors
    darkPrimary: '#2c5f6f',
    darkSecondary: '#1a1a1a',
    darkSurface: '#2a2a2a',
    darkBorder: '#404040',
  }

  // Theme-aware styles with proper dark mode support
  const getThemeStyles = () => {
    const isDark = resolvedTheme === 'dark'
    
    if (isDark) {
      return {
        background: `linear-gradient(135deg, ${ooliteColors.primaryAlphaDark} 0%, ${ooliteColors.darkSecondary} 50%, ${ooliteColors.primaryAlphaDark} 100%)`,
        headerBg: ooliteColors.darkSurface,
        headerBorder: ooliteColors.darkBorder,
        cardBg: ooliteColors.darkSurface,
        cardBorder: ooliteColors.darkBorder,
        textPrimary: '#ffffff',
        textSecondary: '#a0a0a0',
        buttonBg: ooliteColors.primary,
        buttonHover: ooliteColors.primaryLight,
        surfaceBg: ooliteColors.darkSurface,
        mutedBg: '#1a1a1a',
      }
    } else {
      return {
        background: `linear-gradient(135deg, ${ooliteColors.primaryAlphaLight} 0%, #ffffff 50%, ${ooliteColors.primaryAlphaLight} 100%)`,
        headerBg: '#ffffff',
        headerBorder: '#e5e5e5',
        cardBg: '#ffffff',
        cardBorder: '#e5e5e5',
        textPrimary: '#1a1a1a',
        textSecondary: '#666666',
        buttonBg: ooliteColors.primary,
        buttonHover: ooliteColors.primaryLight,
        surfaceBg: '#ffffff',
        mutedBg: '#f8fafc',
      }
    }
  }

  const themeStyles = getThemeStyles()

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data for slug:', params.slug)
        
        // Load organization data from announcements API
        const announcementsResponse = await fetch(`/api/organizations/by-slug/${params.slug}/announcements/public`)
        
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          setOrganization(announcementsData.organization)
        }

        // Load surveys
        const surveysResponse = await fetch(`/api/organizations/by-slug/${params.slug}/surveys`)
        
        if (surveysResponse.ok) {
          const surveysData = await surveysResponse.json()
          setSurveys(surveysData.surveys || [])
        }

        // Load user's survey submissions (mock data for now - in production this would be a real API)
        const mockSubmissions: SurveySubmission[] = [
          {
            id: '1',
            surveyId: 'survey-1',
            surveyTitle: 'Staff Digital Skills Assessment',
            organizationName: organization?.name || 'Oolite Arts',
            organizationSlug: params.slug as string,
            status: 'submitted',
            submittedAt: '2024-01-15T10:30:00Z',
            lastModified: '2024-01-15T10:30:00Z',
            progress: 100,
            totalQuestions: 12,
            answeredQuestions: 12,
            canEdit: false,
            canWithdraw: true,
            hasMessages: true,
            messageCount: 2
          },
          {
            id: '2',
            surveyId: 'survey-2',
            surveyTitle: 'Digital Lab Interest Survey',
            organizationName: organization?.name || 'Oolite Arts',
            organizationSlug: params.slug as string,
            status: 'draft',
            submittedAt: '',
            lastModified: '2024-01-20T09:15:00Z',
            progress: 60,
            totalQuestions: 15,
            answeredQuestions: 9,
            canEdit: true,
            canWithdraw: false,
            hasMessages: false,
            messageCount: 0
          }
        ]
        setSubmissions(mockSubmissions)
        setFilteredSubmissions(mockSubmissions)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      loadData()
    }
  }, [params.slug, organization?.name])

  // Filter submissions based on search and status
  useEffect(() => {
    let filtered = submissions

    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.surveyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter)
    }

    setFilteredSubmissions(filtered)
  }, [submissions, searchTerm, statusFilter])

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      in_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: Clock,
      submitted: FileText,
      in_review: Eye,
      accepted: CheckCircle,
      declined: XCircle
    }
    const Icon = icons[status as keyof typeof icons] || Clock
    return <Icon className="w-4 h-4" />
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not submitted'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSurveyStatus = (surveyId: string) => {
    const submission = submissions.find(s => s.surveyId === surveyId)
    return submission ? submission.status : 'available'
  }

  const getQuestionCount = (survey: Survey) => {
    // If survey has template, count questions from template sections
    if (survey.survey_templates?.template_schema?.sections) {
      return survey.survey_templates.template_schema.sections.reduce((total, section) => {
        return total + (section.questions?.length || 0)
      }, 0)
    }
    
    // Fallback to survey_schema questions
    return survey.survey_schema?.questions?.length || 0
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: themeStyles.background }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: ooliteColors.primary }}
          ></div>
          <p style={{ color: themeStyles.textSecondary }}>Loading surveys...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: themeStyles.background }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: themeStyles.textPrimary }}>Organization Not Found</h1>
          <p style={{ color: themeStyles.textSecondary }}>The organization you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <TenantProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Navigation */}
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />

      {/* Banner Background */}
      {organization?.banner_image && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${organization.banner_image})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" />
          <div className="relative z-10 flex items-end h-full">
            <div className="max-w-7xl mx-auto px-4 pb-8 w-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: ooliteColors.primaryAlpha }}>
                  <FileText className="w-8 h-8" style={{ color: ooliteColors.primary }} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Surveys
                  </h1>
                  <p className="text-lg text-white/90">
                    Discover and participate in surveys from {organization.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header (only show if no banner) */}
        {!organization?.banner_image && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: ooliteColors.primaryAlpha }}>
                <FileText className="w-8 h-8" style={{ color: ooliteColors.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Surveys
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Discover and participate in surveys from {organization.name}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Available Surveys</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{surveys.length}</p>
                </div>
                <FileText className="h-8 w-8" style={{ color: ooliteColors.primary }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {submissions.filter(s => s.status === 'draft').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Under Review</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {submissions.filter(s => s.status === 'in_review').length}
                  </p>
                </div>
                <Eye className="h-8 w-8" style={{ color: ooliteColors.primary }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {submissions.filter(s => s.status === 'accepted').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800">
              <TabsTrigger 
                value="available" 
                className="text-gray-900 dark:text-white"
                style={{
                  backgroundColor: activeTab === 'available' ? ooliteColors.primary : 'transparent',
                  color: activeTab === 'available' ? '#ffffff' : undefined
                }}
              >
                Available Surveys ({surveys.length})
              </TabsTrigger>
              <TabsTrigger 
                value="my-submissions" 
                className="text-gray-900 dark:text-white"
                style={{
                  backgroundColor: activeTab === 'my-submissions' ? ooliteColors.primary : 'transparent',
                  color: activeTab === 'my-submissions' ? '#ffffff' : undefined
                }}
              >
                My Submissions ({submissions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="mt-6">
              {surveys.length === 0 ? (
                <Card className="text-center py-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">No Surveys Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">
                      It looks like there are no surveys available for {organization.name} yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {surveys.map((survey) => {
                    const surveyStatus = getSurveyStatus(survey.id)
                    const submission = submissions.find(s => s.surveyId === survey.id)
                    
                    return (
                      <Card 
                        key={survey.id} 
                        className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-gray-900 dark:text-white">{survey.title}</CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-300">{survey.description}</CardDescription>
                            </div>
                            {surveyStatus !== 'available' && (
                              <Badge className={getStatusColor(surveyStatus)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(surveyStatus)}
                                  <span className="capitalize">{surveyStatus.replace('_', ' ')}</span>
                                </div>
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div>Questions: {getQuestionCount(survey)}</div>
                            <div>Created: {new Date(survey.created_at).toLocaleDateString()}</div>
                            <div>
                              {survey.settings?.require_authentication ? 'Auth Required' : 'Anonymous Allowed'}
                            </div>
                            {submission && (
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-xs">
                                  <span>Progress: {submission.answeredQuestions}/{submission.totalQuestions}</span>
                                  <span>{submission.progress}%</span>
                                </div>
                                <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${submission.progress}%`,
                                      backgroundColor: ooliteColors.primary
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <div 
                          className="p-6 border-t"
                          style={{ borderColor: themeStyles.cardBorder }}
                        >
                          <Button 
                            asChild
                            className="w-full"
                            style={{ 
                              backgroundColor: ooliteColors.primary, 
                              borderColor: ooliteColors.primary,
                              color: '#ffffff'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = ooliteColors.primaryLight
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = ooliteColors.primary
                            }}
                          >
                            <a href={`/submit/${survey.id}`} target="_blank" rel="noopener noreferrer">
                              {surveyStatus === 'draft' ? 'Continue Survey' : 
                               surveyStatus === 'submitted' ? 'View Submission' : 
                               'Take Survey'}
                            </a>
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-submissions" className="mt-6">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search surveys..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      style={{ 
                        backgroundColor: themeStyles.surfaceBg,
                        borderColor: themeStyles.cardBorder,
                        color: themeStyles.textPrimary
                      }}
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48" style={{ 
                    backgroundColor: themeStyles.surfaceBg,
                    borderColor: themeStyles.cardBorder,
                    color: themeStyles.textPrimary
                  }}>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent style={{ 
                    backgroundColor: themeStyles.surfaceBg,
                    borderColor: themeStyles.cardBorder
                  }}>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submissions List */}
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <Card 
                    key={submission.id} 
                    style={{ 
                      backgroundColor: themeStyles.cardBg,
                      borderColor: themeStyles.cardBorder
                    }}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div>
                              <h3 className="text-lg font-semibold" style={{ color: themeStyles.textPrimary }}>
                                {submission.surveyTitle}
                              </h3>
                              <p className="text-sm" style={{ color: themeStyles.textSecondary }}>
                                {submission.organizationName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 text-sm" style={{ color: themeStyles.textSecondary }}>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Submitted: {formatDate(submission.submittedAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Progress: {submission.answeredQuestions}/{submission.totalQuestions} questions</span>
                            </div>
                            {submission.hasMessages && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{submission.messageCount} messages</span>
                              </div>
                            )}
                          </div>

                          {submission.status === 'draft' && (
                            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${submission.progress}%`,
                                  backgroundColor: ooliteColors.primary
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-3">
                          <Badge className={getStatusColor(submission.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(submission.status)}
                              <span className="capitalize">{submission.status.replace('_', ' ')}</span>
                            </div>
                          </Badge>

                          <div className="flex space-x-2">
                            {submission.canEdit && (
                              <Button size="sm" variant="outline">
                                Continue
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            {submission.hasMessages && (
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Messages
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredSubmissions.length === 0 && (
                  <Card style={{ 
                    backgroundColor: themeStyles.cardBg,
                    borderColor: themeStyles.cardBorder
                  }}>
                    <CardContent className="p-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>
                        No submissions found
                      </h3>
                      <p style={{ color: themeStyles.textSecondary }}>
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try adjusting your filters to see more results.'
                          : 'You haven\'t submitted any surveys yet.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Page Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PageFooter 
              organizationSlug={slug}
              showGetStarted={true}
              showGuidelines={true}
              showTerms={true}
            />
          </motion.div>
        </motion.div>
      </div>
      </div>
    </TenantProvider>
  )
}