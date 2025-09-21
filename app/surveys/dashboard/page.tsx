'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Building
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'

interface SurveySubmission {
  id: string
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

export default function SurveyDashboard() {
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<SurveySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [organizationFilter, setOrganizationFilter] = useState('all')

  // Mock data - in production this would come from an API
  useEffect(() => {
    const mockSubmissions: SurveySubmission[] = [
      {
        id: '1',
        surveyTitle: 'Staff Digital Skills Assessment',
        organizationName: 'Oolite Arts',
        organizationSlug: 'oolite',
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
        surveyTitle: 'App Feedback Survey',
        organizationName: 'Bakehouse Art Complex',
        organizationSlug: 'bakehouse',
        status: 'in_review',
        submittedAt: '2024-01-10T14:20:00Z',
        lastModified: '2024-01-10T14:20:00Z',
        progress: 100,
        totalQuestions: 8,
        answeredQuestions: 8,
        canEdit: false,
        canWithdraw: true,
        hasMessages: false,
        messageCount: 0
      },
      {
        id: '3',
        surveyTitle: 'Digital Lab Interest Survey',
        organizationName: 'Oolite Arts',
        organizationSlug: 'oolite',
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
    setLoading(false)
  }, [])

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

    if (organizationFilter !== 'all') {
      filtered = filtered.filter(submission => submission.organizationSlug === organizationFilter)
    }

    setFilteredSubmissions(filtered)
  }, [submissions, searchTerm, statusFilter, organizationFilter])

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

  const organizations = Array.from(new Set(submissions.map(s => s.organizationSlug)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Survey Submissions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage your survey responses across organizations
              </p>
            </div>
          </div>
        </motion.div>

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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{submissions.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Under Review</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {submissions.filter(s => s.status === 'in_review').length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {submissions.filter(s => s.status === 'accepted').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search surveys or organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>

            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Filter by organization" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org} value={org}>
                    {submissions.find(s => s.organizationSlug === org)?.organizationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Submissions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All ({filteredSubmissions.length})
              </TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Drafts ({submissions.filter(s => s.status === 'draft').length})
              </TabsTrigger>
              <TabsTrigger value="submitted" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Submitted ({submissions.filter(s => s.status === 'submitted' || s.status === 'in_review').length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Completed ({submissions.filter(s => s.status === 'accepted').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <OrganizationLogo 
                              organizationSlug={submission.organizationSlug} 
                              size="sm" 
                              className="h-8 w-8"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {submission.surveyTitle}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {submission.organizationName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
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
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${submission.progress}%` }}
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
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No submissions found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm || statusFilter !== 'all' || organizationFilter !== 'all'
                          ? 'Try adjusting your filters to see more results.'
                          : 'You haven\'t submitted any surveys yet.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
