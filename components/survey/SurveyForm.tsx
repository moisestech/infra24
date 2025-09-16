'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Save, Send } from 'lucide-react';

interface SurveyQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'rating' | 'boolean';
  label: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface Survey {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  questions: SurveyQuestion[];
  status: 'draft' | 'active' | 'closed';
  submissionDeadline?: string;
  maxSubmissions?: number;
  currentSubmissions: number;
}

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (responses: Record<string, any>) => Promise<void>;
  onSaveDraft: (responses: Record<string, any>) => Promise<void>;
  initialResponses?: Record<string, any>;
  isSubmitting?: boolean;
  isSaving?: boolean;
}

export function SurveyForm({
  survey,
  onSubmit,
  onSaveDraft,
  initialResponses = {},
  isSubmitting = false,
  isSaving = false
}: SurveyFormProps) {
  const [responses, setResponses] = useState<Record<string, any>>(initialResponses);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isDraft, setIsDraft] = useState(false);

  const questionsPerStep = 3;
  const totalSteps = Math.ceil(survey.questions.length / questionsPerStep);
  const currentQuestions = survey.questions.slice(
    currentStep * questionsPerStep,
    (currentStep + 1) * questionsPerStep
  );

  useEffect(() => {
    // Check if this is a draft submission
    setIsDraft(Object.keys(initialResponses).length > 0);
  }, [initialResponses]);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    currentQuestions.forEach(question => {
      if (question.required && (!responses[question.id] || responses[question.id] === '')) {
        newErrors[question.id] = 'This field is required';
      }
      
      if (responses[question.id] && question.validation) {
        const value = responses[question.id];
        
        if (question.validation.minLength && value.length < question.validation.minLength) {
          newErrors[question.id] = `Minimum length is ${question.validation.minLength} characters`;
        }
        
        if (question.validation.maxLength && value.length > question.validation.maxLength) {
          newErrors[question.id] = `Maximum length is ${question.validation.maxLength} characters`;
        }
        
        if (question.validation.pattern && !new RegExp(question.validation.pattern).test(value)) {
          newErrors[question.id] = 'Invalid format';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = async () => {
    try {
      await onSaveDraft(responses);
      setIsDraft(true);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        await onSubmit(responses);
      } catch (error) {
        console.error('Error submitting survey:', error);
      }
    }
  };

  const renderQuestion = (question: SurveyQuestion) => {
    const value = responses[question.id] || '';
    const error = errors[question.id];

    switch (question.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <Input
              id={question.id}
              value={value}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <Textarea
              id={question.id}
              value={value}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
              rows={4}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <Select value={value} onValueChange={(val) => handleResponseChange(question.id, val)}>
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleResponseChange(question.id, [...currentValues, option]);
                      } else {
                        handleResponseChange(question.id, currentValues.filter(v => v !== option));
                      }
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleResponseChange(question.id, rating)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    value >= rating
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400 hover:border-blue-300'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                checked={value === true}
                onCheckedChange={(checked) => handleResponseChange(question.id, checked)}
              />
              <span className="text-sm text-gray-600">
                {value === true ? 'Yes' : 'No'}
              </span>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{survey.title}</CardTitle>
            <CardDescription className="mt-2">{survey.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isDraft && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Draft
              </Badge>
            )}
            <Badge className={
              survey.status === 'active' ? 'bg-green-100 text-green-800' :
              survey.status === 'closed' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }>
              {survey.status}
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Step Questions */}
        {currentQuestions.map((question) => (
          <div key={question.id} className="space-y-4">
            {renderQuestion(question)}
          </div>
        ))}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>

            {currentStep === totalSteps - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Survey
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
