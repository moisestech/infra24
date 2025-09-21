// Example of how to refactor the admin surveys page using the new API service
import React, { useState } from 'react';
import { useSurveys, useSurveyTemplates, useSurveyAnalytics, useCreateSurvey, useUpdateSurvey, useDeleteSurvey } from '../hooks/useSurveys';
import { surveyApi } from '../services/surveys';
import { useTenant } from '@/components/tenant/TenantProvider';

export default function RefactoredAdminSurveysPage() {
  const { tenantId } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

  // Use the new API hooks
  const { data: surveys, loading: surveysLoading, error: surveysError, refetch: refetchSurveys } = useSurveys({
    organizationId: tenantId || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchTerm || undefined,
  });

  const { data: templates, loading: templatesLoading, error: templatesError } = useSurveyTemplates();

  const { data: analytics, loading: analyticsLoading, error: analyticsError } = useSurveyAnalytics(
    selectedSurvey?.id || ''
  );

  // Mutation hooks
  const { mutate: createSurvey, loading: creatingSurvey } = useCreateSurvey();
  const { mutate: updateSurvey, loading: updatingSurvey } = useUpdateSurvey();
  const { mutate: deleteSurvey, loading: deletingSurvey } = useDeleteSurvey();

  // Event handlers
  const handleCreateSurvey = async (surveyData: any) => {
    try {
      await createSurvey((params) => surveyApi.surveys.create(params!), {
        ...surveyData,
        organizationId: tenantId || undefined,
      });
      refetchSurveys(); // Refresh the surveys list
    } catch (error) {
      console.error('Failed to create survey:', error);
    }
  };

  const handleUpdateSurvey = async (id: string, updates: any) => {
    try {
      await updateSurvey((params) => surveyApi.surveys.update(params!.id, params!.updates), { id, updates });
      refetchSurveys(); // Refresh the surveys list
    } catch (error) {
      console.error('Failed to update survey:', error);
    }
  };

  const handleDeleteSurvey = async (id: string) => {
    try {
      await deleteSurvey((params) => surveyApi.surveys.delete(params!), id);
      refetchSurveys(); // Refresh the surveys list
    } catch (error) {
      console.error('Failed to delete survey:', error);
    }
  };

  // Loading states
  const isLoading = surveysLoading || templatesLoading || creatingSurvey || updatingSurvey || deletingSurvey;
  const hasError = surveysError || templatesError || analyticsError;

  if (hasError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading data</h3>
          <p className="text-red-600 mt-1">
            {surveysError?.message || templatesError?.message || analyticsError?.message}
          </p>
          <button 
            onClick={() => {
              refetchSurveys();
              // You could also refetch templates and analytics here
            }}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Survey Management</h1>
        <button
          onClick={() => {
            // Open create survey modal
          }}
          disabled={creatingSurvey}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {creatingSurvey ? 'Creating...' : 'Create Survey'}
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search surveys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Surveys list */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading surveys...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {surveys?.surveys?.map((survey: any) => (
            <div key={survey.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{survey.name}</h3>
                  <p className="text-gray-600 mt-1">{survey.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      survey.status === 'active' ? 'bg-green-100 text-green-800' :
                      survey.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {survey.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSurvey(survey)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Analytics
                  </button>
                  <button
                    onClick={() => handleUpdateSurvey(survey.id, { status: 'active' })}
                    disabled={updatingSurvey}
                    className="text-green-600 hover:text-green-800 disabled:opacity-50"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleDeleteSurvey(survey.id)}
                    disabled={deletingSurvey}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics panel */}
      {selectedSurvey && (
        <div className="mt-8 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">Analytics for {selectedSurvey.name}</h2>
          {analyticsLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800">Total Responses</h3>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalResponses}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">Completion Rate</h3>
                <p className="text-2xl font-bold text-green-600">{analytics.completionRate}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800">Avg. Time</h3>
                <p className="text-2xl font-bold text-purple-600">{analytics.averageTime}m</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No analytics data available</p>
          )}
        </div>
      )}
    </div>
  );
}

