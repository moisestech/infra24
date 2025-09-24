'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { ThemeButton } from '@/components/theme/ThemeButton'
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
        description?: string
        tools?: Array<{
          id: string
          name: string
        }>
        dependsOn?: string
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  
  const form = useForm({
    resolver: zodResolver(getSchemaForSurvey(survey.category)),
    mode: 'onChange'
  })

  const { formState: { errors, isValid } } = form

  // Initialize current step from URL query parameter
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10)
      if (stepNumber >= 0 && stepNumber < survey.form_schema.questions.length) {
        console.log('📍 Initializing step from URL:', stepNumber)
        setCurrentStep(stepNumber)
      }
    }
  }, [searchParams, survey.form_schema.questions.length])

  // Update URL when step changes
  const updateStepInURL = (step: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('step', step.toString())
    router.replace(url.pathname + url.search, { scroll: false })
  }

  // Debug logging for form validation
  useEffect(() => {
    console.log('🔍 Form Debug:', {
      currentStep,
      currentQuestion: survey.form_schema.questions[currentStep],
      formValues: form.getValues(),
      errors,
      isValid,
      formState: form.formState
    })
  }, [currentStep, form.getValues(), errors, isValid, survey.form_schema.questions])

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
    
    // Clear step parameter from URL since form is being submitted
    const url = new URL(window.location.href)
    url.searchParams.delete('step')
    router.replace(url.pathname + url.search, { scroll: false })
    
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
    
    console.log('🚀 Next Step Debug:', {
      currentQuestion,
      fieldName,
      questionType: currentQuestion.type,
      formValues: form.getValues()
    })
    
    // Validate current step based on question type
    if (currentQuestion.required) {
      if (currentQuestion.type === 'multi_tool_rating') {
        // For multi-tool rating, check if all tools have been rated
        const allToolsRated = currentQuestion.tools?.every((tool: any) => {
          const toolFieldName = `${fieldName}_${tool.id}`
          const value = form.getValues(toolFieldName)
          console.log(`🔍 Checking tool ${tool.name}: ${toolFieldName} = ${value}`)
          return value !== undefined && value !== null && value !== ''
        })
        
        if (!allToolsRated || !currentQuestion.tools) {
          console.log('❌ Not all tools rated or tools undefined')
          toast.error('Please rate all tool categories before continuing')
          return
        }
        console.log('✅ All tools rated')
      } else if (currentQuestion.type === 'conditional_text_areas') {
        // For conditional text areas, check if at least one text area has content
        const previousQuestion = survey.form_schema.questions[currentStep - 1]
        const selectedWorkflows = form.watch(previousQuestion?.id) || []
        
        if (selectedWorkflows.length === 0) {
          console.log('❌ No workflows selected')
          toast.error('Please go back and select your workflows first')
          return
        }
        
        const hasContent = selectedWorkflows.some((_: any, index: number) => {
          const textFieldName = `${fieldName}_${index}`
          const value = form.getValues(textFieldName)
          return value && value.trim() !== ''
        })
        
        if (!hasContent) {
          console.log('❌ No content in any text area')
          toast.error('Please provide feedback for at least one workflow')
          return
        }
        console.log('✅ At least one text area has content')
      } else {
        // For other question types, check the main field
        if (!form.getValues(fieldName)) {
          console.log('❌ Main field not filled:', fieldName)
          toast.error('Please answer this question before continuing')
          return
        }
        console.log('✅ Main field filled:', fieldName)
      }
    }
    
    const nextStepNumber = Math.min(currentStep + 1, survey.form_schema.questions.length - 1)
    setCurrentStep(nextStepNumber)
    updateStepInURL(nextStepNumber)
  }

  const prevStep = () => {
    const prevStepNumber = Math.max(currentStep - 1, 0)
    setCurrentStep(prevStepNumber)
    updateStepInURL(prevStepNumber)
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

        {question.type === 'text' && (
          <div className="space-y-3">
            <input
              {...form.register(fieldName)}
              type="text"
              placeholder={question.placeholder || "Please enter your response..."}
              maxLength={question.characterLimit}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
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

        {question.type === 'multi_tool_rating' && (
          <div className="space-y-6">
            {question.tools && question.tools.map((tool: any, toolIndex: number) => (
              <div key={toolIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {tool.name}
                </h4>
                <div className="flex items-center justify-center space-x-3">
                  {Array.from({ length: question.scale || 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const fieldKey = `${fieldName}_${tool.id}`
                        console.log('🎯 Setting field value:', fieldKey, 'to', i + 1)
                        form.setValue(fieldKey, i + 1)
                        console.log('📝 Form values after set:', form.getValues())
                      }}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2",
                        form.watch(`${fieldName}_${tool.id}`) === i + 1
                          ? "border-blue-600 bg-blue-600 text-white shadow-xl transform scale-110"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                {question.labels && (
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium mt-2">
                    <span>{question.labels.low}</span>
                    <span>{question.labels.high}</span>
                  </div>
                )}
                {form.watch(`${fieldName}_${tool.id}`) && (
                  <div className="text-center mt-2">
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                      Selected: {form.watch(`${fieldName}_${tool.id}`)} out of {question.scale || 5}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {question.type === 'conditional_text_areas' && (
          <div className="space-y-6">
            {(() => {
              // Get the selected workflows from the previous question
              const previousQuestion = survey.form_schema.questions[currentStep - 1]
              const selectedWorkflows = form.watch(previousQuestion?.id) || []
              
              console.log('🔍 Conditional Text Areas Debug:', {
                previousQuestion: previousQuestion?.id,
                selectedWorkflows,
                currentStep
              })
              
              if (!selectedWorkflows || selectedWorkflows.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Please go back and select your workflows first.</p>
                  </div>
                )
              }
              
              return selectedWorkflows.map((workflow: any, index: number) => {
                // Handle both string and object formats from ReactSelect
                const workflowText = typeof workflow === 'string' ? workflow : workflow?.label || workflow?.value || 'Unknown workflow'
                const workflowDisplay = typeof workflow === 'string' ? workflow : workflow?.label || workflow?.value || 'Unknown workflow'
                
                return (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {workflowDisplay}
                    </h4>
                    <textarea
                      {...form.register(`${fieldName}_${index}`)}
                      placeholder={`Where do you lose time or get blocked with ${workflowText.toLowerCase()}?`}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )
              })
            })()}
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
        organizationSlug={organization.slug}
        onBackToOrg={() => window.location.href = `/o/${organization.slug}`}
      />
    )
  }

  const stepLabels = survey.form_schema.questions.map((q: any, index: number) => 
    q.stepLabel || `Question ${index + 1}`
  )

  return (
    <FormProvider {...form}>
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
      </div>

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
            {currentStep === survey.form_schema.questions.length - 1 ? (
              <ThemeButton 
                type="button"
                onClick={form.handleSubmit(onSubmit)} 
                disabled={isSubmitting}
                variant="primary"
                className="px-8 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Survey ✓'
                )}
              </ThemeButton>
            ) : (
              <ThemeButton
                type="button"
                onClick={nextStep}
                variant="primary"
                className="px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Next →
              </ThemeButton>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}