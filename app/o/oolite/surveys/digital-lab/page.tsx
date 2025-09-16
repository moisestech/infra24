'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { OoliteNavigation } from '@/components/tenant/OoliteNavigation';
import { SurveyForm } from '@/components/survey/SurveyForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, BarChart3, FileText } from 'lucide-react';

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

// Digital Lab Survey Configuration
const digitalLabSurvey = {
  id: 'digital-lab-feedback-2024',
  title: 'Digital Lab Experience Survey',
  description: 'Help us improve the Digital Lab by sharing your experience and feedback. This survey takes about 5-10 minutes to complete.',
  organizationId: 'oolite',
  status: 'active' as const,
  submissionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  maxSubmissions: 100,
  currentSubmissions: 0,
  questions: [
    {
      id: 'experience_level',
      type: 'select' as const,
      label: 'What is your experience level with digital arts?',
      description: 'This helps us tailor our programs to your needs',
      required: true,
      options: [
        'Complete beginner',
        'Some experience',
        'Intermediate',
        'Advanced',
        'Professional'
      ]
    },
    {
      id: 'lab_usage_frequency',
      type: 'radio' as const,
      label: 'How often do you use the Digital Lab?',
      required: true,
      options: [
        'Daily',
        'Weekly',
        'Monthly',
        'Occasionally',
        'This is my first time'
      ]
    },
    {
      id: 'equipment_rating',
      type: 'rating' as const,
      label: 'How would you rate the equipment and technology available?',
      description: 'Rate from 1 (poor) to 5 (excellent)',
      required: true
    },
    {
      id: 'staff_support_rating',
      type: 'rating' as const,
      label: 'How would you rate the staff support and guidance?',
      description: 'Rate from 1 (poor) to 5 (excellent)',
      required: true
    },
    {
      id: 'workshop_quality',
      type: 'rating' as const,
      label: 'How would you rate the quality of workshops offered?',
      description: 'Rate from 1 (poor) to 5 (excellent)',
      required: true
    },
    {
      id: 'booking_system',
      type: 'rating' as const,
      label: 'How easy is it to book equipment and workshops?',
      description: 'Rate from 1 (very difficult) to 5 (very easy)',
      required: true
    },
    {
      id: 'favorite_equipment',
      type: 'checkbox' as const,
      label: 'Which equipment do you use most often? (Select all that apply)',
      required: false,
      options: [
        '3D Printers',
        'Laser Cutters',
        'CNC Machines',
        'Digital Cameras',
        'Video Equipment',
        'Audio Equipment',
        'VR/AR Headsets',
        'Computers/Workstations',
        'Software (Adobe, Blender, etc.)',
        'Other'
      ]
    },
    {
      id: 'improvement_suggestions',
      type: 'textarea' as const,
      label: 'What improvements would you like to see in the Digital Lab?',
      description: 'Please share any suggestions for equipment, programs, or services',
      required: false,
      validation: {
        maxLength: 500
      }
    },
    {
      id: 'workshop_topics',
      type: 'textarea' as const,
      label: 'What workshop topics would you like to see offered?',
      description: 'Help us plan future programming',
      required: false,
      validation: {
        maxLength: 300
      }
    },
    {
      id: 'community_engagement',
      type: 'boolean' as const,
      label: 'Would you be interested in participating in a Digital Lab community group?',
      description: 'This could include peer learning, project collaborations, and networking',
      required: false
    },
    {
      id: 'additional_comments',
      type: 'textarea' as const,
      label: 'Any additional comments or feedback?',
      required: false,
      validation: {
        maxLength: 1000
      }
    }
  ]
};

export default function DigitalLabSurveyPage() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [userResponses, setUserResponses] = useState<SurveyResponse[]>([]);
  const [currentResponse, setCurrentResponse] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    if (tenantId === 'oolite') {
      fetchUserResponses();
    }
  }, [tenantId]);

  const fetchUserResponses = async () => {
    try {
      // Mock data for now - in real implementation, fetch from API
      const mockResponses: SurveyResponse[] = [
        {
          id: '1',
          surveyId: digitalLabSurvey.id,
          userId: 'user-123',
          responses: {
            experience_level: 'Intermediate',
            lab_usage_frequency: 'Weekly',
            equipment_rating: 4,
            staff_support_rating: 5,
            workshop_quality: 4,
            booking_system: 4,
            favorite_equipment: ['3D Printers', 'Computers/Workstations'],
            improvement_suggestions: 'More VR equipment would be great',
            workshop_topics: 'Advanced 3D modeling techniques',
            community_engagement: true,
            additional_comments: 'Overall great experience!'
          },
          status: 'submitted',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setUserResponses(mockResponses);
      
      // Check if user has a draft or completed response
      const existingResponse = mockResponses.find(r => r.surveyId === digitalLabSurvey.id);
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
        surveyId: digitalLabSurvey.id,
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

  if (tenantId !== 'oolite') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible for Oolite Arts.</p>
        </div>
      </div>
    );
  }

  const hasCompletedSurvey = userResponses.some(r => 
    r.surveyId === digitalLabSurvey.id && r.status === 'submitted'
  );

  const hasDraftSurvey = userResponses.some(r => 
    r.surveyId === digitalLabSurvey.id && r.status === 'draft'
  );

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <OoliteNavigation />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Lab Survey</h1>
            <p className="text-gray-600">
              Share your experience and help us improve the Digital Lab
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
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Deadline</p>
                    <p className="text-2xl font-bold">
                      {new Date(digitalLabSurvey.submissionDeadline).toLocaleDateString()}
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
                    <p className="text-2xl font-bold">{digitalLabSurvey.currentSubmissions}</p>
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
                <CardTitle>Take the Digital Lab Survey</CardTitle>
                <CardDescription>
                  Your feedback helps us improve the Digital Lab experience for everyone
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
                    survey={digitalLabSurvey}
                    onSubmit={handleSubmitSurvey}
                    onSaveDraft={handleSaveDraft}
                    initialResponses={currentResponse}
                    isSubmitting={isSubmitting}
                    isSaving={isSaving}
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
                          <h3 className="font-medium">Digital Lab Experience Survey</h3>
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
