'use client';

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import { OrganizationLogo } from "@/components/ui/OrganizationLogo"
import { ThemeBackground } from "@/components/theme/ThemeBackground"
import { useOrganizationTheme } from "@/components/carousel/OrganizationThemeContext"
import { 
  FileCheck, 
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
  logo_url?: string
}

export function ThemeAwareSurveysPage() {
  const params = useParams()
  const { theme, setOrganizationSlug } = useOrganizationTheme()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingLink, setGeneratingLink] = useState<string | null>(null)

  // Set organization slug in theme context
  useEffect(() => {
    if (params.slug && typeof params.slug === 'string') {
      setOrganizationSlug(params.slug)
    }
  }, [params.slug, setOrganizationSlug])

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Starting to load data for slug:', params.slug)
        
        // Load organization data from announcements API (which we know works)
        const announcementsResponse = await fetch(`/api/organizations/by-slug/${params.slug}/announcements/public`)
        console.log('Announcements response status:', announcementsResponse.status)
        
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          console.log('Announcements data:', announcementsData)
          setOrganization(announcementsData.organization)
        } else {
          console.error('Failed to load announcements:', announcementsResponse.statusText)
        }

        // Load surveys
        const surveysResponse = await fetch(`/api/organizations/by-slug/${params.slug}/surveys`)
        console.log('Surveys response status:', surveysResponse.status)
        
        if (surveysResponse.ok) {
          const surveysData = await surveysResponse.json()
          console.log('Surveys data:', surveysData)
          setSurveys(surveysData.surveys || [])
        } else {
          console.error('Failed to load surveys:', surveysResponse.statusText)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load surveys')
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    if (params.slug) {
      console.log('Slug available, calling loadData')
      loadData()
    } else {
      console.log('No slug available')
    }
  }, [params.slug])

  const generateMagicLink = async (surveyId: string) => {
    setGeneratingLink(surveyId)
    try {
      const response = await fetch(`/api/surveys/${surveyId}/magic-link`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        await navigator.clipboard.writeText(data.magicLink)
        toast.success('Magic link copied to clipboard!')
      } else {
        throw new Error('Failed to generate magic link')
      }
    } catch (error) {
      console.error('Error generating magic link:', error)
      toast.error('Failed to generate magic link')
    } finally {
      setGeneratingLink(null)
    }
  }

  const getThemeButtonStyle = () => {
    if (!theme) return {};
    
    return {
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
      borderColor: theme.colors.primary,
    };
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen transition-all duration-500 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(71, 171, 196, 0.05) 0%, #ffffff 50%, rgba(71, 171, 196, 0.05) 100%)'
        }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#47abc4' }}
          ></div>
          <p className="text-gray-600 dark:text-gray-400">Loading surveys...</p>
        </div>
      </div>
    )
  }

  if (!organization && !loading) {
    return (
      <ThemeBackground>
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
    <div 
      className="min-h-screen transition-all duration-500"
      style={{
        background: 'linear-gradient(135deg, rgba(71, 171, 196, 0.05) 0%, #ffffff 50%, rgba(71, 171, 196, 0.05) 100%)'
      }}
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <OrganizationLogo 
                organizationSlug={params.slug as string}
                size="lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Surveys
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and track your organization's surveys
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-2"
                style={getThemeButtonStyle()}
              >
                <Plus className="h-4 w-4" />
                Create Survey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {surveys.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No surveys yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first survey to start collecting responses from your community.
              </p>
              <Button
                className="flex items-center gap-2"
                style={getThemeButtonStyle()}
              >
                <Plus className="h-4 w-4" />
                Create Your First Survey
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {survey.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {survey.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {survey.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Survey Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <FileCheck className="h-4 w-4" />
                          <span>{survey.form_schema.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Settings */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {survey.submission_settings.allow_anonymous && (
                            <Badge variant="outline" className="text-xs">
                              Anonymous
                            </Badge>
                          )}
                          {survey.submission_settings.require_authentication && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Auth Required
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => generateMagicLink(survey.id)}
                          disabled={generatingLink === survey.id}
                          style={getThemeButtonStyle()}
                        >
                          {generatingLink === survey.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
