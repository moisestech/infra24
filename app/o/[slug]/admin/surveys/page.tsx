'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Download, 
  Eye, 
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface SurveyAnalytics {
  surveyId: string;
  title: string;
  totalResponses: number;
  completionRate: number;
  averageRating: number;
  responseBreakdown: {
    status: string;
    count: number;
    percentage: number;
  }[];
  questionAnalytics: {
    questionId: string;
    question: string;
    type: string;
    responses: any[];
    summary: any;
  }[];
  timeSeries: {
    date: string;
    responses: number;
  }[];
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  userName: string;
  responses: Record<string, any>;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSurveysPage() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      fetchSurveys();
    }
  }, [tenantId]);

  useEffect(() => {
    if (selectedSurvey) {
      fetchSurveyAnalytics(selectedSurvey);
      fetchSurveyResponses(selectedSurvey);
    }
  }, [selectedSurvey]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      // Mock data - in real implementation, fetch from API
      const mockSurveys = [
        {
          id: 'digital-lab-feedback-2024',
          title: 'Digital Lab Experience Survey',
          description: 'Feedback on Digital Lab equipment, staff, and programs',
          status: 'active',
          totalResponses: 24,
          completionRate: 85,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'smart-sign-feedback-2024',
          title: 'Smart Sign System Feedback',
          description: 'Feedback on Smart Sign visibility, content, and functionality',
          status: 'active',
          totalResponses: 18,
          completionRate: 72,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setSurveys(mockSurveys);
      if (mockSurveys.length > 0) {
        setSelectedSurvey(mockSurveys[0].id);
      }
    } catch (err) {
      console.error('Error fetching surveys:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyAnalytics = async (surveyId: string) => {
    try {
      // Mock analytics data - in real implementation, fetch from API
      const mockAnalytics: SurveyAnalytics = {
        surveyId,
        title: surveys.find(s => s.id === surveyId)?.title || 'Survey',
        totalResponses: 24,
        completionRate: 85,
        averageRating: 4.2,
        responseBreakdown: [
          { status: 'submitted', count: 20, percentage: 83 },
          { status: 'draft', count: 4, percentage: 17 },
          { status: 'under_review', count: 0, percentage: 0 }
        ],
        questionAnalytics: [
          {
            questionId: 'equipment_rating',
            question: 'How would you rate the equipment and technology available?',
            type: 'rating',
            responses: [1, 2, 3, 4, 5, 4, 5, 4, 3, 5, 4, 4, 5, 4, 3, 4, 5, 4, 4, 5],
            summary: { average: 4.1, distribution: { 1: 0, 2: 0, 3: 3, 4: 12, 5: 5 } }
          },
          {
            questionId: 'lab_usage_frequency',
            question: 'How often do you use the Digital Lab?',
            type: 'radio',
            responses: ['Weekly', 'Daily', 'Weekly', 'Monthly', 'Weekly', 'Daily', 'Weekly', 'Occasionally', 'Weekly', 'Daily'],
            summary: { distribution: { 'Daily': 3, 'Weekly': 5, 'Monthly': 1, 'Occasionally': 1 } }
          }
        ],
        timeSeries: [
          { date: '2024-01-01', responses: 2 },
          { date: '2024-01-02', responses: 5 },
          { date: '2024-01-03', responses: 8 },
          { date: '2024-01-04', responses: 12 },
          { date: '2024-01-05', responses: 15 },
          { date: '2024-01-06', responses: 18 },
          { date: '2024-01-07', responses: 24 }
        ]
      };
      
      setAnalytics(mockAnalytics);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchSurveyResponses = async (surveyId: string) => {
    try {
      // Mock responses data - in real implementation, fetch from API
      const mockResponses: SurveyResponse[] = [
        {
          id: '1',
          surveyId,
          userId: 'user-123',
          userName: 'John Doe',
          responses: {
            equipment_rating: 4,
            lab_usage_frequency: 'Weekly',
            staff_support_rating: 5
          },
          status: 'submitted',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          surveyId,
          userId: 'user-456',
          userName: 'Jane Smith',
          responses: {
            equipment_rating: 5,
            lab_usage_frequency: 'Daily',
            staff_support_rating: 4
          },
          status: 'submitted',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setResponses(mockResponses);
    } catch (err) {
      console.error('Error fetching responses:', err);
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
        return <AlertCircle className="w-4 h-4 text-red-600" />;
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

  if (isLoading || loading) {
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

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Analytics</h1>
            <p className="text-gray-600">
              View and analyze survey responses and insights
            </p>
          </div>

          {/* Survey Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Survey</CardTitle>
              <CardDescription>
                Choose a survey to view its analytics and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select a survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id}>
                      {survey.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {analytics && (
            <>
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Responses</p>
                        <p className="text-2xl font-bold">{analytics.totalResponses}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold">{analytics.completionRate}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                        <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Response Status</p>
                        <p className="text-2xl font-bold">
                          {analytics.responseBreakdown.find(r => r.status === 'submitted')?.count || 0}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Response Breakdown */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Response Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of responses by status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.responseBreakdown.map((breakdown) => (
                      <div key={breakdown.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(breakdown.status)}
                          <span className="capitalize">{breakdown.status.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${breakdown.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {breakdown.count} ({breakdown.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Question Analytics */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Question Analytics</CardTitle>
                  <CardDescription>
                    Detailed analysis of individual questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analytics.questionAnalytics.map((question) => (
                      <div key={question.questionId} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{question.question}</h3>
                        <div className="text-sm text-gray-600 mb-4">
                          Type: {question.type} | Responses: {question.responses.length}
                        </div>
                        
                        {question.type === 'rating' && question.summary && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Average Rating:</span>
                              <span className="font-medium">{question.summary.average.toFixed(1)}/5</span>
                            </div>
                            <div className="space-y-1">
                              {Object.entries(question.summary.distribution).map(([rating, count]) => (
                                <div key={rating} className="flex items-center gap-2">
                                  <span className="w-4 text-sm">{rating}</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ 
                                        width: `${(count as number / question.responses.length) * 100}%` 
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm w-8 text-right">{count as number}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {question.type === 'radio' && question.summary && (
                          <div className="space-y-2">
                            {Object.entries(question.summary.distribution).map(([option, count]) => (
                              <div key={option} className="flex items-center gap-2">
                                <span className="w-32 text-sm">{option}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ 
                                      width: `${(count as number / question.responses.length) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm w-8 text-right">{count as number}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Individual Responses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Individual Responses</CardTitle>
                      <CardDescription>
                        View and manage individual survey responses
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {responses.map((response) => (
                      <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(response.status)}
                          <div>
                            <h3 className="font-medium">{response.userName}</h3>
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
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </TenantLayout>
  );
}
