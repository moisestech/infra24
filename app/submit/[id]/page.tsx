'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { SurveyForm } from '@/components/survey/SurveyForm'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'
import { SurveyHeader } from '@/components/survey/SurveyNavigation'
import { Toaster } from '@/components/ui/Toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { ArrowLeft, User, Shield, Clock, FileText } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface Survey {
  id: string
  title: string
  description: string
  category: string
  form_schema: {
    title: string
    description: string
    questions: Array<{
      id: string
      question: string
      type: string
      required?: boolean
      options?: string[]
      placeholder?: string
      description?: string
    }>
  }
  submission_settings: {
    allow_anonymous: boolean
    require_authentication: boolean
    max_submissions_per_user: number
  }
}

interface Organization {
  id: string
  name: string
  slug: string
}

export default function SubmitPage() {
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
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()
  const { resolvedTheme } = useTheme()
  const [survey, setSurvey] = useState<Survey | null>(null)
  // Default to Oolite organization since we know this survey belongs to Oolite
  const [organization, setOrganization] = useState<Organization | null>({
    id: '73339522-c672-40ac-a464-e027e9c99d13',
    name: 'Oolite Arts',
    slug: 'oolite'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debug logging for current state
  console.log('Survey Page State Debug:', {
    surveyId: params.id,
    loading,
    error,
    hasSurvey: !!survey,
    hasOrganization: !!organization,
    surveyTitle: survey?.title,
    organizationSlug: organization?.slug,
    isSignedIn,
    isLoaded
  })

  // Organization theme colors (default to Oolite if no organization)
  const getThemeColors = () => {
    if (organization?.slug === 'oolite') {
      return {
        primary: '#47abc4',
        primaryLight: '#6bb8d1',
        primaryDark: '#3a8ba3',
        primaryAlpha: 'rgba(71, 171, 196, 0.1)',
        primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
        primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
      }
    }
    // Default theme colors
    return {
      primary: '#3b82f6',
      primaryLight: '#60a5fa',
      primaryDark: '#2563eb',
      primaryAlpha: 'rgba(59, 130, 246, 0.1)',
      primaryAlphaLight: 'rgba(59, 130, 246, 0.05)',
      primaryAlphaDark: 'rgba(59, 130, 246, 0.15)',
    }
  }

  const themeColors = getThemeColors()

  // Theme-aware styles
  const getThemeStyles = () => {
    if (resolvedTheme === 'dark') {
      return {
        background: `linear-gradient(135deg, ${themeColors.primaryAlphaDark} 0%, #1a1a1a 50%, ${themeColors.primaryAlphaDark} 100%)`,
        cardBg: '#2a2a2a',
        cardBorder: '#404040',
        textPrimary: '#ffffff',
        textSecondary: '#a0a0a0',
        buttonBg: themeColors.primary,
        buttonHover: themeColors.primaryLight,
      }
    } else {
      return {
        background: `linear-gradient(135deg, ${themeColors.primaryAlphaLight} 0%, #ffffff 50%, ${themeColors.primaryAlphaLight} 100%)`,
        cardBg: '#ffffff',
        cardBorder: '#e5e5e5',
        textPrimary: '#1a1a1a',
        textSecondary: '#666666',
        buttonBg: themeColors.primary,
        buttonHover: themeColors.primaryLight,
      }
    }
  }

  const themeStyles = getThemeStyles()

  const surveyId = params.id as string

  useEffect(() => {
    const loadSurveyData = async () => {
      try {
        console.log('Starting to load survey data for ID:', surveyId)
        setLoading(true)
        
        // Fetch survey data
        const surveyResponse = await fetch(`/api/surveys/${surveyId}`)
        console.log('Survey API response status:', surveyResponse.status)
        
        if (!surveyResponse.ok) {
          throw new Error('Survey not found')
        }
        const surveyData = await surveyResponse.json()
        console.log('Survey data received:', surveyData)
        
        setSurvey(surveyData.survey)
        console.log('Survey state set:', surveyData.survey)
        
        // Set organization data from the survey response
        if (surveyData.survey.organization) {
          setOrganization(surveyData.survey.organization)
          console.log('Organization state set:', surveyData.survey.organization)
        } else {
          console.log('No organization data in survey response')
        }
      } catch (err) {
        console.error('Error loading survey:', err)
        setError(err instanceof Error ? err.message : 'Failed to load survey')
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    if (surveyId) {
      loadSurveyData()
    }
  }, [surveyId])

  // Clear anonymous submission flag when user signs in
  useEffect(() => {
    if (isSignedIn && typeof window !== 'undefined') {
      sessionStorage.removeItem('anonymous_submission')
    }
  }, [isSignedIn])

  const handleBackToOrg = () => {
    if (organization) {
      router.push(`/o/${organization.slug}`)
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen"
        style={{ background: themeStyles.background }}
      >
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: themeColors.primary }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !survey) {
    return (
      <div 
        className="min-h-screen"
        style={{ background: themeStyles.background }}
      >
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card 
            style={{ 
              backgroundColor: themeStyles.cardBg, 
              borderColor: '#ef4444' 
            }}
          >
            <CardContent className="p-8 text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>
                Survey Not Found
              </h2>
              <p className="mb-6" style={{ color: themeStyles.textSecondary }}>
                {error || 'The survey you\'re looking for doesn\'t exist or has been removed.'}
              </p>
              <Button onClick={handleBackToOrg} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Check if authentication is required
  const requiresAuth = survey.submission_settings?.require_authentication || false
  const allowsAnonymous = survey.submission_settings?.allow_anonymous || false

  if (requiresAuth && !isSignedIn) {
    return (
      <div 
        className="min-h-screen"
        style={{ background: themeStyles.background }}
      >
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={handleBackToOrg}
                style={{ color: themeStyles.textSecondary }}
                className="hover:opacity-80"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {organization?.name || 'Organization'}
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2" style={{ color: themeStyles.textPrimary }}>
                {survey.title}
              </h1>
              <p className="text-lg" style={{ color: themeStyles.textSecondary }}>
                {survey.description}
              </p>
            </div>
          </div>

          {/* Sign In Required Card */}
          <Card 
            style={{ 
              backgroundColor: themeStyles.cardBg, 
              borderColor: themeColors.primary 
            }}
          >
            <CardHeader className="text-center">
              <div 
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: themeColors.primaryAlpha }}
              >
                <Shield className="w-8 h-8" style={{ color: themeColors.primary }} />
              </div>
              <CardTitle className="text-xl" style={{ color: themeStyles.textPrimary }}>
                Sign In Required
              </CardTitle>
              <CardDescription className="text-base" style={{ color: themeStyles.textSecondary }}>
                This survey requires authentication to ensure secure and personalized responses.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div 
                className="rounded-lg p-4"
                style={{ 
                  backgroundColor: themeColors.primaryAlpha,
                  borderColor: themeColors.primary,
                  border: '1px solid'
                }}
              >
                <div className="flex items-center justify-center space-x-2" style={{ color: themeColors.primary }}>
                  <User className="w-5 h-5" />
                  <span className="font-medium">Why do we ask you to sign in?</span>
                </div>
                <ul className="text-sm mt-2 space-y-1" style={{ color: themeStyles.textSecondary }}>
                  <li>• Save your progress and return later</li>
                  <li>• Track your submission status</li>
                  <li>• Receive updates about your response</li>
                  <li>• Ensure data security and privacy</li>
                </ul>
              </div>

              <div className="space-y-3">
                <SignInButton 
                  mode="modal"
                >
                  <Button 
                    size="lg" 
                    className="w-full text-white"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.primary
                    }}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Sign In to Continue
                  </Button>
                </SignInButton>
                
                <p className="text-xs" style={{ color: themeStyles.textSecondary }}>
                  Don't have an account? Sign up is quick and free.
                </p>
              </div>

              <div 
                className="pt-4"
                style={{ borderTop: `1px solid ${themeStyles.cardBorder}` }}
              >
                <div className="flex items-center justify-center space-x-4 text-sm" style={{ color: themeStyles.textSecondary }}>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    ~{survey.form_schema.questions.length * 2} minutes
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {survey.form_schema.questions.length} questions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show choice screen for anonymous vs authenticated submission
  const isAnonymousSubmission = typeof window !== 'undefined' && sessionStorage.getItem('anonymous_submission') === 'true'
  
  if (!requiresAuth && allowsAnonymous && !isSignedIn && !isAnonymousSubmission) {
    return (
      <div 
        className="min-h-screen"
        style={{ background: themeStyles.background }}
      >
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={handleBackToOrg}
                style={{ color: themeStyles.textSecondary }}
                className="hover:opacity-80"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {organization?.name || 'Organization'}
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2" style={{ color: themeStyles.textPrimary }}>
                {survey.title}
              </h1>
              <p className="text-lg" style={{ color: themeStyles.textSecondary }}>
                {survey.description}
              </p>
            </div>
          </div>

          {/* Choice Card */}
          <Card 
            style={{ 
              backgroundColor: themeStyles.cardBg, 
              borderColor: themeColors.primary 
            }}
          >
            <CardHeader className="text-center">
              <div 
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: themeColors.primaryAlpha }}
              >
                <User className="w-8 h-8" style={{ color: themeColors.primary }} />
              </div>
              <CardTitle className="text-xl" style={{ color: themeStyles.textPrimary }}>
                How would you like to participate?
              </CardTitle>
              <CardDescription className="text-base" style={{ color: themeStyles.textSecondary }}>
                You can take this survey either as a signed-in user or anonymously.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Authenticated Option */}
              <div 
                className="rounded-lg p-6"
                style={{ 
                  backgroundColor: themeColors.primaryAlpha,
                  borderColor: themeColors.primary,
                  border: '1px solid'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.primary }}>
                      Sign In & Participate
                    </h3>
                    <p className="text-sm mb-4" style={{ color: themeStyles.textSecondary }}>
                      Get the best experience with personalized features
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: themeStyles.textSecondary }}>
                      <li>• Save your progress and return later</li>
                      <li>• Track your submission status</li>
                      <li>• Receive updates about your response</li>
                      <li>• Access to your submission history</li>
                    </ul>
                  </div>
                  <div className="ml-6">
                    <SignInButton 
                      mode="modal"
                    >
                      <Button 
                        className="text-white"
                        style={{ 
                          backgroundColor: themeColors.primary,
                          borderColor: themeColors.primary
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </SignInButton>
                  </div>
                </div>
              </div>

              {/* Anonymous Option */}
              <div 
                className="rounded-lg p-6"
                style={{ 
                  backgroundColor: themeStyles.cardBg,
                  borderColor: themeStyles.cardBorder,
                  border: '1px solid'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>
                      Continue Anonymously
                    </h3>
                    <p className="text-sm mb-4" style={{ color: themeStyles.textSecondary }}>
                      Quick and easy - no account needed
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: themeStyles.textSecondary }}>
                      <li>• No sign-up required</li>
                      <li>• Complete the survey immediately</li>
                      <li>• Your responses remain anonymous</li>
                      <li>• Quick and straightforward process</li>
                    </ul>
                  </div>
                  <div className="ml-6">
                    <Button 
                      onClick={() => {
                        // Set a flag to indicate anonymous submission
                        sessionStorage.setItem('anonymous_submission', 'true')
                        // Reload the page to show the survey form
                        window.location.reload()
                      }}
                      variant="outline"
                      style={{ 
                        borderColor: themeStyles.cardBorder,
                        color: themeStyles.textPrimary
                      }}
                    >
                      Continue Anonymously
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    ~{survey.form_schema.questions.length * 2} minutes
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {survey.form_schema.questions.length} questions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render the actual survey form
  return (
    <div 
      className="min-h-screen"
      style={{ background: themeStyles.background }}
    >
      <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
      {(() => {
        console.log('SurveyNavigation Render Debug:', {
          organization,
          survey,
          hasOrganization: !!organization,
          hasSurvey: !!survey,
          organizationSlug: organization?.slug,
          surveyTitle: survey?.title,
          surveyId: survey?.id
        })
        return null
      })()}
      <SurveyNavigation 
        organization={organization!} 
        survey={survey}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Show anonymous submission notice */}
        {isAnonymousSubmission && !isSignedIn && (
          <div 
            className="mb-6 rounded-lg p-4"
            style={{ 
              backgroundColor: '#fef3c7',
              borderColor: '#f59e0b',
              border: '1px solid'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  You're taking this survey anonymously. Your responses will not be linked to an account.
                </span>
              </div>
              <SignInButton 
                mode="modal"
              >
                <Button 
                  size="sm" 
                  variant="outline" 
                  style={{ 
                    borderColor: '#f59e0b',
                    color: '#92400e'
                  }}
                >
                  Sign In Instead
                </Button>
              </SignInButton>
            </div>
          </div>
        )}
        
        <SurveyHeader 
          organization={organization!} 
          survey={survey}
        />
        
        <SurveyForm 
          survey={survey}
          organization={organization!}
        />
      </div>
      
      <Toaster />
    </div>
  )
}
