'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { SurveyForm } from '@/components/survey/SurveyForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Clock, Users, BarChart3, FileText, Monitor } from 'lucide-react';

interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  responses: Record<string, any>;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Smart Sign Survey Configuration
const smartSignSurvey = {
  id: 'smart-sign-feedback-2024',
  title: 'Smart Sign System Feedback',
  description: 'Help us improve the Smart Sign system by sharing your experience and suggestions. This survey takes about 3-5 minutes to complete.',
  category: 'feedback',
  form_schema: {
    title: 'Smart Sign System Feedback',
    description: 'Help us improve the Smart Sign system by sharing your experience and suggestions. This survey takes about 3-5 minutes to complete.',
    questions: [
    {
      id: 'sign_visibility',
      type: 'rating' as const,
      question: 'How visible and noticeable is the Smart Sign?',
      description: 'Rate from 1 (not visible at all) to 5 (very visible)',
      required: true,
      scale: 5,
      labels: {
        low: 'Not visible at all',
        high: 'Very visible'
      }
    },
    {
      id: 'content_relevance',
      type: 'rating' as const,
      question: 'How relevant is the content displayed on the Smart Sign?',
      description: 'Rate from 1 (not relevant) to 5 (very relevant)',
      required: true,
      scale: 5,
      labels: {
        low: 'Not relevant',
        high: 'Very relevant'
      }
    },
    {
      id: 'content_freshness',
      type: 'rating' as const,
      question: 'How fresh and up-to-date is the content?',
      description: 'Rate from 1 (outdated) to 5 (always current)',
      required: true,
      scale: 5,
      labels: {
        low: 'Outdated',
        high: 'Always current'
      }
    },
    {
      id: 'sign_usage_frequency',
      type: 'radio' as const,
      question: 'How often do you look at the Smart Sign?',
      required: true,
      choices: [
        'Every time I pass by',
        'Most of the time',
        'Sometimes',
        'Rarely',
        'Never'
      ]
    },
    {
      id: 'useful_information',
      type: 'checkbox' as const,
      question: 'What information do you find most useful on the Smart Sign? (Select all that apply)',
      required: false,
      choices: [
        'Upcoming events',
        'Workshop schedules',
        'Artist announcements',
        'Studio availability',
        'Community news',
        'Weather updates',
        'Emergency information',
        'Other'
      ]
    },
    {
      id: 'content_preferences',
      type: 'select' as const,
      question: 'What type of content would you like to see more of?',
      required: false,
      choices: [
        'More event announcements',
        'More workshop information',
        'More artist spotlights',
        'More community updates',
        'More educational content',
        'More interactive elements',
        'Current content is good'
      ]
    },
    {
      id: 'sign_location',
      type: 'radio' as const,
      question: 'Is the Smart Sign location convenient for you?',
      required: true,
      choices: [
        'Very convenient',
        'Somewhat convenient',
        'Neutral',
        'Somewhat inconvenient',
        'Very inconvenient'
      ]
    },
    {
      id: 'technical_issues',
      type: 'boolean' as const,
      question: 'Have you noticed any technical issues with the Smart Sign?',
      description: 'Such as display problems, connectivity issues, or content not updating',
      required: false
    },
    {
      id: 'technical_issues_description',
      type: 'textarea' as const,
      question: 'If you noticed technical issues, please describe them:',
      required: false,
      placeholder: 'Describe any technical issues you\'ve observed...'
    },
    {
      id: 'improvement_suggestions',
      type: 'textarea' as const,
      question: 'What improvements would you suggest for the Smart Sign system?',
      description: 'Please share any ideas for better content, features, or functionality',
      required: false,
      placeholder: 'Share your improvement ideas...'
    },
    {
      id: 'overall_satisfaction',
      type: 'rating' as const,
      question: 'Overall, how satisfied are you with the Smart Sign system?',
      description: 'Rate from 1 (very dissatisfied) to 5 (very satisfied)',
      required: true,
      scale: 5,
      labels: {
        low: 'Very dissatisfied',
        high: 'Very satisfied'
      }
    },
    {
      id: 'additional_comments',
      type: 'textarea' as const,
      question: 'Any additional comments about the Smart Sign system?',
      required: false,
      placeholder: 'Share any additional thoughts...'
    }
  ]
  },
  submission_settings: {
    allow_anonymous: false,
    require_authentication: true,
    max_submissions_per_user: 1
  },
  submissionDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
  maxSubmissions: 50,
  currentSubmissions: 0
};

export default function SmartSignSurveyPage() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [userResponses, setUserResponses] = useState<SurveyResponse[]>([]);
  const [currentResponse, setCurrentResponse] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    if (tenantId === 'bakehouse') {
      fetchUserResponses();
    }
  }, [tenantId]);

  const fetchUserResponses = async () => {
    try {
      // Mock data for now - in real implementation, fetch from API
      const mockResponses: SurveyResponse[] = [
        {
          id: '1',
          surveyId: smartSignSurvey.id,
          userId: 'user-456',
          responses: {
            sign_visibility: 4,
            content_relevance: 4,
            content_freshness: 3,
            sign_usage_frequency: 'Most of the time',
            useful_information: ['Upcoming events', 'Workshop schedules', 'Artist announcements'],
            content_preferences: 'More artist spotlights',
            sign_location: 'Very convenient',
            technical_issues: false,
            improvement_suggestions: 'Maybe add more interactive elements',
            overall_satisfaction: 4,
            additional_comments: 'Great system overall!'
          },
          status: 'submitted',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setUserResponses(mockResponses);
      
      // Check if user has a draft or completed response
      const existingResponse = mockResponses.find(r => r.surveyId === smartSignSurvey.id);
      if (existingResponse) {
        setCurrentResponse(existingResponse.responses);
      }
    } catch (err) {
      console.error('Error fetching user responses:', err);
    }
  };

  const handleSubmitSurvey = async (responses: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      // Mock API call - in real implementation, submit to API
      console.log('Submitting survey responses:', responses);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const newResponse: SurveyResponse = {
        id: Date.now().toString(),
        surveyId: smartSignSurvey.id,
        userId: 'current-user',
        responses,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUserResponses(prev => [newResponse, ...prev]);
      setCurrentResponse(responses);
      setShowSurvey(false);
      
      // Show success message
      alert('Survey submitted successfully! Thank you for your feedback.');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (responses: Record<string, any>) => {
    setIsSaving(true);
    try {
      // Mock API call - in real implementation, save draft to API
      console.log('Saving draft responses:', responses);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentResponse(responses);
      
      // Show success message
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'under_review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (tenantId !== 'bakehouse') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible for Bakehouse Art Complex.</p>
        </div>
      </div>
    );
  }

  const hasCompletedSurvey = userResponses.some(r => 
    r.surveyId === smartSignSurvey.id && r.status === 'submitted'
  );

  const hasDraftSurvey = userResponses.some(r => 
    r.surveyId === smartSignSurvey.id && r.status === 'draft'
  );

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Sign Feedback</h1>
            <p className="text-gray-600">
              Help us improve the Smart Sign system with your feedback
            </p>
          </div>

          {/* Survey Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Survey Status</p>
                    <p className="text-2xl font-bold">
                      {hasCompletedSurvey ? 'Completed' : hasDraftSurvey ? 'Draft' : 'Not Started'}
                    </p>
                  </div>
                  <Monitor className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Deadline</p>
                    <p className="text-2xl font-bold">
                      {new Date(smartSignSurvey.submissionDeadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Responses</p>
                    <p className="text-2xl font-bold">{smartSignSurvey.currentSubmissions}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Survey Actions */}
          {!hasCompletedSurvey && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Take the Smart Sign Survey</CardTitle>
                <CardDescription>
                  Your feedback helps us improve the Smart Sign experience for all members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => setShowSurvey(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {hasDraftSurvey ? 'Continue Survey' : 'Start Survey'}
                  </Button>
                  {hasDraftSurvey && (
                    <Button variant="outline">
                      View Draft
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Survey Form Modal */}
          {showSurvey && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <SurveyForm
                    survey={smartSignSurvey}
                    organization={{
                      id: 'bakehouse',
                      name: 'Bakehouse Art Complex',
                      slug: 'bakehouse'
                    }}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSurvey(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User's Survey History */}
          <Card>
            <CardHeader>
              <CardTitle>Your Survey Responses</CardTitle>
              <CardDescription>
                Track the status of your survey submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userResponses.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No survey responses yet. Take a survey to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {userResponses.map((response) => (
                    <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(response.status)}
                        <div>
                          <h3 className="font-medium">Smart Sign System Feedback</h3>
                          <p className="text-sm text-gray-600">
                            {response.status === 'submitted' && response.submittedAt
                              ? `Submitted on ${new Date(response.submittedAt).toLocaleDateString()}`
                              : `Created on ${new Date(response.createdAt).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(response.status)}>
                          {response.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TenantLayout>
  );
}

