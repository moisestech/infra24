import { apiClient, handleApiResponse, handleApiError } from '../client';

// Types for survey-related data
export interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template_schema: any;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Survey {
  id: string;
  name: string;
  description: string;
  organization_id: string;
  template_id: string;
  status: 'draft' | 'active' | 'closed';
  settings: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyAnalytics {
  totalResponses: number;
  completionRate: number;
  averageTime: number;
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

export interface CreateSurveyRequest {
  name: string;
  description: string;
  template_id: string;
  settings?: any;
}

export interface UpdateSurveyRequest {
  name?: string;
  description?: string;
  status?: 'draft' | 'active' | 'closed';
  settings?: any;
}

export interface SurveyFilters {
  organizationId?: string;
  status?: string;
  category?: string;
  search?: string;
}

// Survey Templates API
export const surveyTemplatesApi = {
  // Get all survey templates
  getAll: async (filters?: { category?: string; isPublic?: boolean }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
      
      const response = await apiClient.get(`/api/surveys/templates?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get a specific survey template
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/surveys/templates/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create a new survey template
  create: async (template: Omit<SurveyTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await apiClient.post('/api/surveys/templates', template);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Surveys API
export const surveysApi = {
  // Get all surveys for an organization
  getAll: async (filters: SurveyFilters) => {
    try {
      const params = new URLSearchParams();
      if (filters.organizationId) params.append('organizationId', filters.organizationId);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      
      const response = await apiClient.get(`/api/surveys?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get a specific survey
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/surveys/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create a new survey
  create: async (survey: CreateSurveyRequest & { organizationId: string }) => {
    try {
      const response = await apiClient.post('/api/surveys', survey);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update a survey
  update: async (id: string, updates: UpdateSurveyRequest) => {
    try {
      const response = await apiClient.put(`/api/surveys/${id}`, updates);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete a survey
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`/api/surveys/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get survey analytics
  getAnalytics: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/surveys/${id}/analytics`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get survey responses
  getResponses: async (id: string, filters?: { limit?: number; offset?: number }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      
      const response = await apiClient.get(`/api/surveys/${id}/responses?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Submit a survey response
  submitResponse: async (id: string, response: any) => {
    try {
      const apiResponse = await apiClient.post(`/api/surveys/${id}/responses`, response);
      return handleApiResponse(apiResponse);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get survey invitations
  getInvitations: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/surveys/${id}/invitations`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Send survey invitations
  sendInvitations: async (id: string, invitations: { emails: string[]; message?: string }) => {
    try {
      const response = await apiClient.post(`/api/surveys/${id}/invitations`, invitations);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Export all survey-related APIs
export const surveyApi = {
  templates: surveyTemplatesApi,
  surveys: surveysApi,
};

