import { apiClient, handleApiResponse, handleApiError } from '../client';

// Generic CRUD service factory
export interface CrudServiceConfig<T, CreateT = Omit<T, 'id' | 'created_at' | 'updated_at'>, UpdateT = Partial<CreateT>> {
  endpoint: string;
  transformResponse?: (data: any) => T;
  transformCreate?: (data: CreateT) => any;
  transformUpdate?: (data: UpdateT) => any;
}

export function createCrudService<T, CreateT = Omit<T, 'id' | 'created_at' | 'updated_at'>, UpdateT = Partial<CreateT>>(
  config: CrudServiceConfig<T, CreateT, UpdateT>
) {
  const { endpoint, transformResponse, transformCreate, transformUpdate } = config;

  return {
    // Get all items
    getAll: async (filters?: Record<string, any>) => {
      try {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, value.toString());
            }
          });
        }
        
        const response = await apiClient.get(`${endpoint}?${params.toString()}`);
        const data = handleApiResponse(response);
        return transformResponse ? transformResponse(data) : data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // Get item by ID
    getById: async (id: string) => {
      try {
        const response = await apiClient.get(`${endpoint}/${id}`);
        const data = handleApiResponse(response);
        return transformResponse ? transformResponse(data) : data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // Create new item
    create: async (data: CreateT) => {
      try {
        const transformedData = transformCreate ? transformCreate(data) : data;
        const response = await apiClient.post(endpoint, transformedData);
        const result = handleApiResponse(response);
        return transformResponse ? transformResponse(result) : result;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // Update item
    update: async (id: string, data: UpdateT) => {
      try {
        const transformedData = transformUpdate ? transformUpdate(data) : data;
        const response = await apiClient.put(`${endpoint}/${id}`, transformedData);
        const result = handleApiResponse(response);
        return transformResponse ? transformResponse(result) : result;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // Delete item
    delete: async (id: string) => {
      try {
        const response = await apiClient.delete(`${endpoint}/${id}`);
        return handleApiResponse(response);
      } catch (error) {
        throw handleApiError(error);
      }
    },
  };
}

// Organizations API service
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  created_at: string;
  updated_at: string;
}

export const organizationsApi = createCrudService<Organization>({
  endpoint: '/api/organizations',
});

// Announcements API service
export interface Announcement {
  id: string;
  title: string;
  content: string;
  organization_id: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export const announcementsApi = createCrudService<Announcement>({
  endpoint: '/api/announcements',
});

// Artists API service
export interface Artist {
  id: string;
  name: string;
  email?: string;
  website?: string;
  bio?: string;
  avatar_url?: string;
  studio_number?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export const artistsApi = createCrudService<Artist>({
  endpoint: '/api/artists',
});

// Workshops API service
export interface Workshop {
  id: string;
  title: string;
  description: string;
  organization_id: string;
  instructor: string;
  duration: number;
  max_participants?: number;
  materials_needed?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const workshopsApi = createCrudService<Workshop>({
  endpoint: '/api/workshops',
});

// Export all API services
export const apiServices = {
  organizations: organizationsApi,
  announcements: announcementsApi,
  artists: artistsApi,
  workshops: workshopsApi,
};

