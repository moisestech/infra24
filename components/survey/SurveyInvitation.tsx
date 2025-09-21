'use client'

import React from 'react'
import { Users, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'

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
    }>
  }
  submission_settings: {
    allow_anonymous: boolean
    require_authentication: boolean
    max_submissions_per_user: number
  }
}

interface SurveyInvitationProps {
  organizationSlug: string
  surveys: SurveyForm[]
  userRole?: string
}

export function SurveyInvitation({ organizationSlug, surveys, userRole }: SurveyInvitationProps) {
  const handleTakeSurvey = (survey: SurveyForm) => {
    // Navigate to the submit page (Submittable-style)
    window.location.href = `/submit/${survey.id}?org=${organizationSlug}`
  }

  if (surveys.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Staff Survey & Feedback
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help us improve our digital tools and services by participating in our surveys
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {surveys.map((survey) => (
          <Card key={survey.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{survey.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {survey.description}
                  </CardDescription>
                </div>
                <Badge variant="default" className="ml-2">
                  {survey.category.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Survey Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    ~{survey.form_schema.questions.length * 2} min
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {survey.submission_settings.allow_anonymous ? 'Anonymous' : 'Named'}
                  </div>
                </div>

                {/* Action Button - User can take survey directly */}
                <Button
                  onClick={() => handleTakeSurvey(survey)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Take Survey
                </Button>

                {/* Survey Preview */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Survey Preview ({survey.form_schema.questions.length} questions)
                  </h4>
                  <div className="space-y-2">
                    {survey.form_schema.questions.slice(0, 3).map((question, index) => (
                      <div key={question.id} className="text-xs text-gray-600 dark:text-gray-400">
                        {index + 1}. {question.question}
                      </div>
                    ))}
                    {survey.form_schema.questions.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ... and {survey.form_schema.questions.length - 3} more questions
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                About These Surveys
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Help us improve our digital tools and services</li>
                <li>• Your feedback directly influences our Digital Lab program</li>
                <li>• Surveys are anonymous and take just a few minutes</li>
                <li>• No account required - just click and participate</li>
                <li>• For admin features, visit the Surveys & Feedback page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
