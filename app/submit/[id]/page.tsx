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
import { ArrowLeft, User, Shield, Clock, FileText } from 'lucide-react'

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
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const surveyId = params.id as string

  useEffect(() => {
    const loadSurveyData = async () => {
      try {
        setLoading(true)
        
        // Fetch survey data
        const surveyResponse = await fetch(`/api/surveys/${surveyId}`)
        if (!surveyResponse.ok) {
          throw new Error('Survey not found')
        }
        const surveyData = await surveyResponse.json()
        setSurvey(surveyData.survey)
        
        // Set organization data from the survey response
        if (surveyData.survey.organization) {
          setOrganization(surveyData.survey.organization)
        }
      } catch (err) {
        console.error('Error loading survey:', err)
        setError(err instanceof Error ? err.message : 'Failed to load survey')
      } finally {
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
            <CardContent className="p-8 text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Survey Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToOrg}
              className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {organization?.name || 'Organization'}
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {survey.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {survey.description}
              </p>
            </div>
          </div>

          {/* Sign In Required Card */}
          <Card className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Sign In Required
              </CardTitle>
              <CardDescription className="text-base">
                This survey requires authentication to ensure secure and personalized responses.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-800 dark:text-blue-200">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Why do we ask you to sign in?</span>
                </div>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
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
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <User className="w-5 h-5 mr-2" />
                    Sign In to Continue
                  </Button>
                </SignInButton>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Don't have an account? Sign up is quick and free.
                </p>
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

  // Show choice screen for anonymous vs authenticated submission
  const isAnonymousSubmission = typeof window !== 'undefined' && sessionStorage.getItem('anonymous_submission') === 'true'
  
  if (!requiresAuth && allowsAnonymous && !isSignedIn && !isAnonymousSubmission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToOrg}
              className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {organization?.name || 'Organization'}
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {survey.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {survey.description}
              </p>
            </div>
          </div>

          {/* Choice Card */}
          <Card className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                How would you like to participate?
              </CardTitle>
              <CardDescription className="text-base">
                You can take this survey either as a signed-in user or anonymously.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Authenticated Option */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Sign In & Participate
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Get the best experience with personalized features
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
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
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </SignInButton>
                  </div>
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Continue Anonymously
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Quick and easy - no account needed
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
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
                      className="border-gray-300 dark:border-gray-600"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SurveyNavigation 
        organization={organization!} 
        survey={survey}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Show anonymous submission notice */}
        {isAnonymousSubmission && !isSignedIn && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
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
                <Button size="sm" variant="outline" className="border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800">
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
