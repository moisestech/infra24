'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProgressIndicator } from './ProgressIndicator'
import { FormField } from './FormField'
import { genericSurveySchema } from '@/lib/validation/survey-schemas'
import { SurveyThankYou } from './SurveyThankYou'
import toast from 'react-hot-toast'
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  Save,
  Lock,
  Eye,
  Zap
} from 'lucide-react'

interface ProfessionalSurveyFormProps {
  survey: {
    id: string
    title: string
    description: string
    form_schema: {
      questions: Array<{
        id: string
        question: string
        type: string
        required?: boolean
        options?: string[]
        validation?: any
      }>
    }
  }
  organization: {
    id: string
    name: string
    slug: string
  }
}

export function ProfessionalSurveyForm({ survey, organization }: ProfessionalSurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  const [autoSave, setAutoSave] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  
  const questions = survey.form_schema.questions
  const totalSteps = questions.length

  const form = useForm({
    resolver: zodResolver(genericSurveySchema),
    mode: 'onChange'
  })

  const { handleSubmit, formState: { errors, isValid }, watch, setValue, getValues } = form

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  // Auto-save functionality
  useEffect(() => {
    const subscription = watch((value) => {
      if (Object.keys(value).length > 0) {
        setAutoSave(true)
        // Auto-save to localStorage
        localStorage.setItem(`survey_${survey.id}_draft`, JSON.stringify(value))
        setTimeout(() => setAutoSave(false), 1000)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, survey.id])

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(`survey_${survey.id}_draft`)
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        Object.entries(parsedDraft).forEach(([key, value]) => {
          setValue(key, value)
        })
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [survey.id, setValue])

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      const completionTime = Date.now() - startTime
      
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId: survey.id,
          organizationId: organization.id,
          responses: data,
          metadata: {
            completionTime,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            steps: totalSteps,
            timePerStep: completionTime / totalSteps,
            timeSpent
          }
        }),
      })

      if (response.ok) {
        // Clear draft
        localStorage.removeItem(`survey_${survey.id}_draft`)
        setSubmitted(true)
        toast.success('Survey submitted successfully!')
      } else {
        throw new Error('Failed to submit survey')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <SurveyThankYou 
        organizationName={organization.name}
        onBackToOrg={() => window.location.href = `/o/${organization.slug}`}
      />
    )
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / totalSteps) * 100
  const estimatedTimeLeft = Math.max(0, Math.round((5 * totalSteps) - (timeSpent / 60)))

  return (
    <motion.div 
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Professional Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {survey.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {organization.name} • Digital Lab Initiative
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{estimatedTimeLeft} min left</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>Anonymous</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              <span>Secure</span>
            </div>
            {autoSave && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <Save className="h-4 w-4" />
                <span>Auto-saved</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Question {currentStep + 1} of {totalSteps}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>
      </div>

      <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800 overflow-hidden">
        <CardHeader className="pb-8 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {currentQuestion?.question}
            </motion.h2>
            
            {currentQuestion?.required && (
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">
                <Zap className="h-4 w-4 mr-2" />
                Required Question
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-10 py-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-10 min-h-[300px] flex items-center justify-center"
              >
                <div className="w-full max-w-2xl">
                  <FormField
                    label={currentQuestion.question}
                    error={errors[currentQuestion.id]?.message as string}
                    required={currentQuestion.required}
                  >
                    {currentQuestion.type === 'text' && (
                      <Input
                        {...form.register(currentQuestion.id)}
                        placeholder="Enter your answer"
                      />
                    )}
                    {currentQuestion.type === 'textarea' && (
                      <Textarea
                        {...form.register(currentQuestion.id)}
                        placeholder="Enter your answer"
                      />
                    )}
                    {currentQuestion.type === 'select' && (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentQuestion.options?.map((choice, index) => (
                            <SelectItem key={index} value={choice}>
                              {choice}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {currentQuestion.type === 'radio' && (
                      <div className="space-y-2">
                        {currentQuestion.options?.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`${currentQuestion.id}-${index}`}
                              value={choice}
                              {...form.register(currentQuestion.id)}
                            />
                            <label htmlFor={`${currentQuestion.id}-${index}`}>
                              {choice}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    {currentQuestion.type === 'checkbox' && (
                      <div className="space-y-2">
                        {currentQuestion.options?.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`${currentQuestion.id}-${index}`}
                              value={choice}
                              {...form.register(currentQuestion.id)}
                            />
                            <label htmlFor={`${currentQuestion.id}-${index}`}>
                              {choice}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    {currentQuestion.type === 'rating' && (
                      <div className="flex space-x-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <button
                            key={i}
                            type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                            onClick={() => form.setValue(currentQuestion.id, i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                    {currentQuestion.type === 'boolean' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={currentQuestion.id}
                          {...form.register(currentQuestion.id)}
                        />
                        <label htmlFor={currentQuestion.id}>
                          {currentQuestion.question}
                        </label>
                      </div>
                    )}
                  </FormField>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Professional Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-8 py-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 border-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Previous</span>
              </Button>

              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {currentStep + 1} / {totalSteps}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Questions
                  </div>
                </div>
                
                {currentStep === totalSteps - 1 ? (
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="px-10 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white flex items-center space-x-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="font-semibold">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Submit Survey</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center space-x-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="font-semibold">Next</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Professional Footer */}
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <Shield className="h-4 w-4" />
            <span>Secure & Anonymous</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Takes ~{Math.round(5 * totalSteps)} minutes</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <Eye className="h-4 w-4" />
            <span>Help improve Digital Lab</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Your privacy matters:</strong> All responses are anonymous and will be used solely to improve our Digital Lab services. 
            No personal information is collected or stored.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
