'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { SurveyForm } from '@/components/survey/SurveyForm'
import { SurveyNavigation, SurveyHeader } from '@/components/survey/SurveyNavigation'
import { Toaster } from '@/components/ui/Toast'

interface SurveyForm {
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
      choices?: string[]
      scale?: number
      labels?: {
        low: string
        high: string
      }
      placeholder?: string
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

function SurveyPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const surveyId = params.id as string
  const orgSlug = searchParams.get('org')
  
  const [survey, setSurvey] = useState<SurveyForm | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSurvey() {
      if (!surveyId) {
        setError('Survey ID is required')
        setLoading(false)
        return
      }

      try {
        // Get organization info if org slug is provided
        if (orgSlug) {
          const orgResponse = await fetch(`/api/organizations/by-slug/${orgSlug}`)
          if (orgResponse.ok) {
            const orgData = await orgResponse.json()
            setOrganization(orgData.organization)
          }
        }

        // Get survey details
        const surveyResponse = await fetch(`/api/surveys/${surveyId}`)
        if (surveyResponse.ok) {
          const surveyData = await surveyResponse.json()
          setSurvey(surveyData.survey)
          
          // Set survey start time for completion tracking
          ;(window as any).surveyStartTime = Date.now()
        } else {
          setError('Survey not found')
        }
      } catch (error) {
        console.error('Error loading survey:', error)
        setError('Failed to load survey')
      } finally {
        setLoading(false)
      }
    }

    loadSurvey()
  }, [surveyId, orgSlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading survey...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!survey || !organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Survey Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The requested survey could not be found.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SurveyNavigation organization={organization} survey={survey} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <SurveyHeader organization={organization} survey={survey} />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <SurveyForm survey={survey} organization={organization} />
          </div>
        </motion.div>
      </div>
      
      <Toaster />
    </div>
  )
}

export default function SurveyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyPageContent />
    </Suspense>
  )
}