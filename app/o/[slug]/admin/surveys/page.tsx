'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
// Using custom implementations instead of missing shadcn components
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  BarChart3, 
  Download,
  Send,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
// New API service imports
import { 
  useSurveys, 
  useSurveyTemplates, 
  useSurveyAnalytics,
  useCreateSurvey,
  useUpdateSurvey,
  useDeleteSurvey
} from '@/lib/api/hooks/useSurveys';
import { surveyApi } from '@/lib/api/services/surveys';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  is_anonymous: boolean;
  language_default: string;
  languages_supported: string[];
  opens_at: string | null;
  closes_at: string | null;
  max_responses: number | null;
  max_responses_per_user: number;
  response_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  template_id: string | null;
  survey_templates?: {
    name: string;
    category: string;
  };
}

interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  is_public: boolean;
  created_at: string;
}

interface SurveyAnalytics {
  survey: any;
  overview: {
    totalResponses: number;
    completedResponses: number;
    inProgressResponses: number;
    completionRate: number;
    avgCompletionTime: number;
    maxResponses: number | null;
  };
  invitations: {
    totalInvitations: number;
    sentInvitations: number;
    completedInvitations: number;
    completionRate: number;
  };
  responsesByRole: Record<string, number>;
  dailyCounts: Record<string, number>;
  recentResponses: any[];
}

export default function AdminSurveysPage() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('surveys');

  // Use the new API hooks
  const { 
    data: surveysData, 
    loading: surveysLoading, 
    error: surveysError, 
    refetch: refetchSurveys 
  } = useSurveys({
    organizationId: tenantId || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchTerm || undefined,
  });

  const { 
    data: templatesData, 
    loading: templatesLoading, 
    error: templatesError 
  } = useSurveyTemplates();

  const { 
    data: analytics, 
    loading: analyticsLoading, 
    error: analyticsError 
  } = useSurveyAnalytics(selectedSurvey?.id || '');

  // Mutation hooks
  const { mutate: createSurvey, loading: creatingSurvey } = useCreateSurvey();
  const { mutate: updateSurvey, loading: updatingSurvey } = useUpdateSurvey();
  const { mutate: deleteSurvey, loading: deletingSurvey } = useDeleteSurvey();

  // Extract data from API responses
  const surveys = surveysData?.surveys || [];
  const templates = templatesData?.templates || [];

  // Event handlers
  const handleCreateSurvey = async (surveyData: any) => {
    try {
      await createSurvey({
        ...surveyData,
        organizationId: tenantId,
      });
      refetchSurveys(); // Refresh the surveys list
    } catch (error) {
      console.error('Failed to create survey:', error);
    }
  };

  const handleUpdateSurvey = async (id: string, updates: any) => {
    try {
      await updateSurvey(
        (params?: { id: string; updates: any }) => {
          if (!params) throw new Error('Missing parameters');
          return surveyApi.surveys.update(params.id, params.updates);
        },
        { id, updates }
      );
      refetchSurveys(); // Refresh the surveys list
    } catch (error) {
      console.error('Failed to update survey:', error);
    }
  };

  const handleDeleteSurvey = async (id: string) => {
    try {
      await deleteSurvey(
        (params?: string) => {
          if (!params) throw new Error('Missing survey ID');
          return surveyApi.surveys.delete(params);
        },
        id
      );
      refetchSurveys(); // Refresh the surveys list
    } catch (error) {
      console.error('Failed to delete survey:', error);
    }
  };

  // Combined loading and error states
  const loading = surveysLoading || templatesLoading || creatingSurvey || updatingSurvey || deletingSurvey;
  const hasError = surveysError || templatesError || analyticsError;

  const getStatusBadge = (survey: Survey) => {
    // Use the status field directly
    const status = survey.status;

    const variants = {
      draft: 'info',
      active: 'success',
      closed: 'error',
      archived: 'warning'
    } as const;

    const icons = {
      draft: <Edit className="w-3 h-3" />,
      active: <CheckCircle className="w-3 h-3" />,
      closed: <XCircle className="w-3 h-3" />,
      archived: <AlertCircle className="w-3 h-3" />
    };

    return (
      <Badge variant="default">
        {icons[status as keyof typeof icons]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const filteredSurveys = surveys.filter((survey: Survey) => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || 
                           survey.survey_templates?.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Surveys</h2>
          <p className="text-gray-600">
            {error || surveysError?.message || templatesError?.message || analyticsError?.message}
          </p>
          <button 
            onClick={() => {
              refetchSurveys();
            }}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Management</h1>
        <p className="text-gray-600">
          Create and manage surveys for {tenantConfig?.name || 'your organization'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Custom Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('surveys')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'surveys'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Surveys
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {activeTab === 'surveys' && (
          <div className="space-y-6">
          {/* Filters and Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <Input
                    placeholder="Search surveys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                  />
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="archived">Archived</option>
                  </select>
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="staff">Staff</option>
                    <option value="resident">Resident</option>
                    <option value="public">Public</option>
                    <option value="feedback">Feedback</option>
                    <option value="assessment">Assessment</option>
                  </select>
                </div>
                <Button
                  onClick={() => {
                    // TODO: Open create survey modal
                    console.log('Create survey clicked');
                  }}
                  disabled={creatingSurvey}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {creatingSurvey ? 'Creating...' : 'Create Survey'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Surveys Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Surveys ({filteredSurveys.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSurveys.map((survey: Survey) => (
                      <tr key={survey.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium">{survey.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {survey.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(survey)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="default">
                            {survey.survey_templates?.category || 'Custom'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            {survey.response_count}
                            {survey.max_responses && (
                              <span className="text-gray-400">/ {survey.max_responses}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div>{new Date(survey.created_at).toLocaleDateString()}</div>
                            <div className="text-gray-500">
                              {new Date(survey.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedSurvey(survey)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateSurvey(survey.id, { status: 'active' })}
                              disabled={updatingSurvey}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateSurvey(survey.id, { status: 'active' })}
                              disabled={updatingSurvey}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => handleDeleteSurvey(survey.id)}
                              disabled={deletingSurvey}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Survey Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map((template: any) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="default">{template.category}</Badge>
                            {template.is_public && (
                              <Badge variant="default">Public</Badge>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
          {selectedSurvey ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSurvey.title} - Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading analytics...</p>
                    </div>
                  ) : analytics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {analytics.overview.totalResponses}
                        </div>
                        <div className="text-sm text-gray-600">Total Responses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {analytics.overview.completionRate}%
                        </div>
                        <div className="text-sm text-gray-600">Completion Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(analytics.overview.avgCompletionTime / 60)}m
                        </div>
                        <div className="text-sm text-gray-600">Avg. Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {analytics.invitations.totalInvitations}
                        </div>
                        <div className="text-sm text-gray-600">Invitations Sent</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No analytics data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Survey</h3>
                <p className="text-gray-600">
                  Choose a survey from the list to view its analytics and insights.
                </p>
              </CardContent>
            </Card>
          )}
          </div>
        )}
      </div>
    </div>
  );
}