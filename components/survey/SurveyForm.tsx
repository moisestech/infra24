'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FormField } from './FormField'
import { ProgressIndicator } from './ProgressIndicator'
import { SurveyThankYou } from './SurveyThankYou'
import { SurveyProgress } from './SurveyProgress'
import { SurveyDraftManager } from './SurveyDraftManager'
import { EnhancedFormField } from './EnhancedFormField'
import { FileUploader } from './FileUploader'
import { ReactSelectField } from './ReactSelectField'
import { Button } from '@/components/ui/button'
import { getSchemaForSurvey } from '@/lib/validation/survey-schemas'
import { cn } from '@/lib/utils'

interface SurveyFormProps {
  survey: {
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
  organization: {
    id: string
    name: string
    slug: string
  }
}

export function SurveyForm({ survey, organization }: SurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  
  const form = useForm({
    resolver: zodResolver(getSchemaForSurvey(survey.category)),
    mode: 'onChange'
  })

  const { formState: { errors, isValid } } = form

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`survey_draft_${survey.id}`)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        if (parsedData.data) {
          form.reset(parsedData.data)
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error)
      }
    }
  }, [survey.id, form])

  // Track form data for auto-save
  const formData = form.watch()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    const loadingToast = toast.loading('Submitting your survey...')
    
    try {
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey.id,
          organizationId: organization.id,
          responses: data,
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            completionTime: Date.now() - (window as any).surveyStartTime
          }
        })
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success('Survey submitted successfully!')
        
        // Clear saved data
        localStorage.removeItem(`survey_${survey.id}`)
        
        setSubmitted(true)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to submit survey. Please try again.')
      console.error('Survey submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    const currentQuestion = survey.form_schema.questions[currentStep]
    const fieldName = currentQuestion.id
    
    // Validate current step
    if (currentQuestion.required && !form.getValues(fieldName)) {
      toast.error('Please answer this question before continuing')
      return
    }
    
    setCurrentStep(prev => Math.min(prev + 1, survey.form_schema.questions.length - 1))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const renderQuestion = (question: any, index: number) => {
    const fieldName = question.id as string
    const fieldError = (errors as any)[fieldName]?.message as string
    const currentValue = String(form.watch(fieldName) || '')

    return (
      <EnhancedFormField
        key={fieldName}
        label={question.question}
        error={fieldError}
        required={question.required}
        description={question.description}
        helpText={question.helpText}
        characterLimit={question.characterLimit}
        wordLimit={question.wordLimit}
        currentValue={currentValue}
        showCharacterCount={question.showCharacterCount}
        showWordCount={question.showWordCount}
        acceptedFormats={question.acceptedFormats}
        maxFileSize={question.maxFileSize}
        examples={question.examples}
      >
        {question.type === 'single_choice' && question.choices && (
          <ReactSelectField
            name={fieldName}
            label=""
            options={question.choices.map((choice: string) => ({ value: choice, label: choice }))}
            placeholder="Select an option..."
            isSearchable={false}
            isClearable={true}
            required={question.required}
            helpText={question.helpText}
            examples={question.examples}
          />
        )}

        {question.type === 'multiple_choice' && question.choices && (
          <ReactSelectField
            name={fieldName}
            label=""
            options={question.choices.map((choice: string) => ({ value: choice, label: choice }))}
            placeholder="Select one or more options..."
            isMulti={true}
            isSearchable={false}
            isClearable={true}
            required={question.required}
            helpText={question.helpText}
            examples={question.examples}
          />
        )}

        {question.type === 'rating' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              {Array.from({ length: question.scale || 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => form.setValue(fieldName, i + 1)}
                  className={cn(
                    "w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg font-semibold transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2",
                    form.watch(fieldName) === i + 1
                      ? "border-blue-600 bg-blue-600 text-white shadow-xl transform scale-110"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            {question.labels && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
                <span>{question.labels.low}</span>
                <span>{question.labels.high}</span>
              </div>
            )}
            {form.watch(fieldName) && (
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  Selected: {form.watch(fieldName)} out of {question.scale || 5}
                </div>
              </div>
            )}
          </div>
        )}

        {question.type === 'open' && (
          <div className="space-y-3">
            <textarea
              {...form.register(fieldName)}
              placeholder={question.placeholder || "Please share your thoughts..."}
              rows={6}
              maxLength={question.characterLimit}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>
        )}

        {question.type === 'file_upload' && (
          <FileUploader
            onFileSelect={setUploadedFiles}
            acceptedTypes={question.acceptedFormats}
            maxFileSize={question.maxFileSize}
            maxFiles={question.maxFiles}
          />
        )}
      </EnhancedFormField>
    )
  }

  if (submitted) {
    return (
      <SurveyThankYou 
        organizationName={organization.name}
        onBackToOrg={() => window.location.href = `/o/${organization.slug}`}
      />
    )
  }

  const stepLabels = survey.form_schema.questions.map((q: any, index: number) => 
    q.stepLabel || `Question ${index + 1}`
  )

  return (
    <div className="space-y-8">
      {/* Enhanced Progress with Draft Management */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {survey.form_schema.title}
          </h2>
          <SurveyDraftManager 
            surveyId={survey.id}
            formData={formData}
          />
        </div>
        
        <SurveyProgress 
          currentStep={currentStep}
          totalSteps={survey.form_schema.questions.length}
          stepLabels={stepLabels}
        />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderQuestion(survey.form_schema.questions[currentStep], currentStep)}
        </motion.div>
      </AnimatePresence>

      {/* Sticky Footer Actions */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 -mx-4 -mb-8">
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 text-sm font-medium"
          >
            ← Previous
          </Button>
          
          <div className="flex items-center space-x-3">
            <SurveyDraftManager 
              surveyId={survey.id}
              formData={formData}
            />
            
            {currentStep === survey.form_schema.questions.length - 1 ? (
              <Button 
                type="button"
                onClick={form.handleSubmit(onSubmit)} 
                disabled={isSubmitting}
                className="px-8 py-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Survey ✓'
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Next →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}