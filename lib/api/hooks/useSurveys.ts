import { useApi, useApiMutation, usePaginatedApi } from './useApi';
import { surveyApi, Survey, SurveyTemplate, SurveyAnalytics, SurveyFilters, CreateSurveyRequest, UpdateSurveyRequest } from '../services/surveys';

// Hook for fetching survey templates
export function useSurveyTemplates(filters?: { category?: string; isPublic?: boolean }) {
  return useApi(
    () => surveyApi.templates.getAll(filters),
    [filters?.category, filters?.isPublic]
  );
}

// Hook for fetching surveys
export function useSurveys(filters: SurveyFilters) {
  return useApi(
    () => surveyApi.surveys.getAll(filters),
    [filters.organizationId, filters.status, filters.category, filters.search]
  );
}

// Hook for fetching a single survey
export function useSurvey(id: string) {
  return useApi(
    () => surveyApi.surveys.getById(id),
    [id]
  );
}

// Hook for fetching survey analytics
export function useSurveyAnalytics(id: string) {
  return useApi(
    () => surveyApi.surveys.getAnalytics(id),
    [id]
  );
}

// Hook for fetching survey responses
export function useSurveyResponses(id: string, filters?: { limit?: number; offset?: number }) {
  return useApi(
    () => surveyApi.surveys.getResponses(id, filters),
    [id, filters?.limit, filters?.offset]
  );
}

// Hook for fetching survey invitations
export function useSurveyInvitations(id: string) {
  return useApi(
    () => surveyApi.surveys.getInvitations(id),
    [id]
  );
}

// Hook for creating surveys
export function useCreateSurvey() {
  return useApiMutation<Survey, CreateSurveyRequest & { organizationId: string }>();
}

// Hook for updating surveys
export function useUpdateSurvey() {
  return useApiMutation<Survey, { id: string; updates: UpdateSurveyRequest }>();
}

// Hook for deleting surveys
export function useDeleteSurvey() {
  return useApiMutation<void, string>();
}

// Hook for submitting survey responses
export function useSubmitSurveyResponse() {
  return useApiMutation<any, { id: string; response: any }>();
}

// Hook for sending survey invitations
export function useSendSurveyInvitations() {
  return useApiMutation<any, { id: string; invitations: { emails: string[]; message?: string } }>();
}

// Hook for paginated surveys
export function usePaginatedSurveys(organizationId: string, limit: number = 10) {
  return usePaginatedApi<Survey>(
    async (page, pageLimit) => {
      const offset = (page - 1) * pageLimit;
      const result = await surveyApi.surveys.getAll({ 
        organizationId,
        // Add pagination parameters if your API supports them
      });
      
      // If your API doesn't support pagination, you'll need to implement client-side pagination
      // For now, we'll return all data and let the hook handle pagination
      return {
        data: result.surveys || result,
        total: result.surveys?.length || result.length || 0,
      };
    },
    1,
    limit
  );
}

// Hook for paginated survey responses
export function usePaginatedSurveyResponses(surveyId: string, limit: number = 10) {
  return usePaginatedApi<any>(
    async (page, pageLimit) => {
      const offset = (page - 1) * pageLimit;
      const result = await surveyApi.surveys.getResponses(surveyId, { 
        limit: pageLimit, 
        offset 
      });
      
      return {
        data: result.responses || result,
        total: result.total || result.length || 0,
      };
    },
    1,
    limit
  );
}

