"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import { OrganizationLogo } from "@/components/ui/OrganizationLogo"
import { 
  Clipboard, 
  Eye, 
  Clock, 
  Users, 
  Shield, 
  Link as LinkIcon,
  BarChart3,
  Settings,
  Plus,
  ExternalLink,
  Mail,
  Send
} from "lucide-react"
import toast from "react-hot-toast"

interface Survey {
  id: string
  title: string
  description: string
  category: string
  form_schema: {
    questions: Array<{
      id: string
      question: string
      type: string
      required?: boolean
      choices?: string[]
    }>
  }
  submission_settings: {
    allow_anonymous: boolean
    require_authentication: boolean
    max_submissions_per_user: number
  }
  created_at: string
}

interface Organization {
  id: string
  name: string
  slug: string
}

interface UserRole {
  role: string
  organization_id: string
}

export default function OrganizationSurveysPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingLink, setGeneratingLink] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [slug])

  const loadData = async () => {
    try {
      console.log('🔍 Loading organization surveys data for:', slug)
      
      // Load organization data
      const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        setOrganization(orgData.organization)
        console.log('✅ Organization loaded:', orgData.organization.name)
      }

      // Load surveys
      const surveysResponse = await fetch(`/api/organizations/by-slug/${slug}/surveys`)
      if (surveysResponse.ok) {
        const surveysData = await surveysResponse.json()
        setSurveys(surveysData.surveys || [])
        console.log('✅ Surveys loaded:', surveysData.surveys?.length || 0)
      }

      // Load user role (if authenticated)
      try {
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          const membership = userData.organizations?.find((org: any) => org.slug === slug)
          if (membership) {
            setUserRole({ role: membership.role, organization_id: membership.id })
            console.log('✅ User role loaded:', membership.role)
          }
        } else {
          console.log('ℹ️ User not authenticated (status:', userResponse.status, ')')
        }
      } catch (error) {
        console.log('ℹ️ User not authenticated or no role found:', error instanceof Error ? error.message : String(error))
      }

    } catch (error) {
      console.error('❌ Error loading data:', error)
      toast.error('Failed to load surveys data')
    } finally {
      setLoading(false)
    }
  }

  const generateMagicLink = async (surveyId: string) => {
    setGeneratingLink(surveyId)
    try {
      const response = await fetch('/api/magic-links/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId,
          organizationId: organization?.id,
          metadata: {
            generated_by: 'admin',
            source: 'surveys_page',
            timestamp: new Date().toISOString()
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const magicLink = `${window.location.origin}/survey/${surveyId}?token=${data.token}`
        
        // Copy to clipboard
        await navigator.clipboard.writeText(magicLink)
        toast.success('Magic link copied to clipboard!')
        console.log('✅ Magic link generated:', data.token)
      } else {
        throw new Error('Failed to generate magic link')
      }
    } catch (error) {
      console.error('❌ Error generating magic link:', error)
      toast.error('Failed to generate magic link')
    } finally {
      setGeneratingLink(null)
    }
  }

  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'super_admin'
  const isManager = userRole?.role === 'manager'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading surveys...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Organization Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">The organization you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <OrganizationLogo organizationSlug={organization.slug} variant="horizontal" size="md" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Survey & Feedback</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Help us improve our digital tools and services by participating in our surveys
                </p>
              </div>
            </div>
            
        {isAdmin && (
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Bulk Email
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </Button>
          </div>
        )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Admin Info Section */}
        {isAdmin && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Controls
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-300">
                  You have administrative access to manage surveys and generate magic links for staff distribution.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        )}

        {/* Surveys Grid */}
        <div className="grid gap-6">
          {surveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{survey.title}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {survey.description}
                      </CardDescription>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          ~{Math.ceil(survey.form_schema.questions.length * 2)} min
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {survey.submission_settings.allow_anonymous ? 'Anonymous' : 'Authenticated'}
                        </div>
                        <Badge variant="info" className="capitalize">
                          {survey.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/submit/${survey.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      
                      {isAdmin && (
                        <Button
                          size="sm"
                          onClick={() => generateMagicLink(survey.id)}
                          disabled={generatingLink === survey.id}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          {generatingLink === survey.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <LinkIcon className="w-4 h-4 mr-2" />
                              Generate Magic Link
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Survey Preview ({survey.form_schema.questions.length} questions)
                      </h4>
                      <div className="space-y-2">
                        {survey.form_schema.questions.slice(0, 3).map((question, qIndex) => (
                          <div key={question.id} className="text-sm text-gray-600 dark:text-gray-400">
                            {qIndex + 1}. {question.question}
                          </div>
                        ))}
                        {survey.form_schema.questions.length > 3 && (
                          <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                            ... and {survey.form_schema.questions.length - 3} more questions
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          How to Use Magic Links
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Generate a magic link for each survey</li>
                          <li>• Share the link via email, Slack, or other communication channels</li>
                          <li>• Staff can take surveys without creating accounts</li>
                          <li>• Responses are automatically collected and organized</li>
                          <li>• View results in the analytics dashboard</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {surveys.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Surveys Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are currently no surveys available for this organization.
            </p>
            {isAdmin && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Survey
              </Button>
            )}
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Questions about surveys? Contact your organization administrator.
          </p>
        </motion.div>
      </div>
    </div>
  )
}