# API Service Architecture

This directory contains a comprehensive, scalable API service architecture built on top of Axios. It provides a clean separation of concerns, type safety, and reusable patterns for API interactions.

## Architecture Overview

```
lib/api/
├── client.ts              # Base Axios client with interceptors
├── services/
│   ├── surveys.ts         # Survey-specific API services
│   └── index.ts           # Generic CRUD services and other entities
├── hooks/
│   ├── useApi.ts          # Generic API hooks
│   └── useSurveys.ts      # Survey-specific hooks
├── examples/
│   └── refactored-admin-surveys.tsx  # Example of refactored component
└── README.md              # This file
```

## Key Features

### 1. **Centralized API Client** (`client.ts`)
- Axios instance with default configuration
- Request/response interceptors for auth, error handling
- Consistent error handling across all API calls
- Type-safe response wrappers

### 2. **Service Layer** (`services/`)
- **Generic CRUD Factory**: Create standardized CRUD operations for any entity
- **Specialized Services**: Custom services for complex operations (like surveys)
- **Type Safety**: Full TypeScript support with proper interfaces
- **Consistent API**: All services follow the same patterns

### 3. **React Hooks** (`hooks/`)
- **Generic Hooks**: `useApi`, `useApiMutation`, `usePaginatedApi`
- **Specialized Hooks**: Domain-specific hooks (e.g., `useSurveys`)
- **Loading States**: Built-in loading, error, and success states
- **Optimistic Updates**: Support for optimistic UI updates

### 4. **Error Handling**
- Centralized error handling with consistent error format
- Network error detection and user-friendly messages
- Automatic retry logic (configurable)
- Error boundaries integration

## Usage Examples

### Basic API Call

```typescript
import { useSurveys } from '@/lib/api/hooks/useSurveys';

function SurveysList() {
  const { data: surveys, loading, error, refetch } = useSurveys({
    organizationId: 'org-123',
    status: 'active'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {surveys?.map(survey => (
        <div key={survey.id}>{survey.name}</div>
      ))}
    </div>
  );
}
```

### Mutations

```typescript
import { useCreateSurvey } from '@/lib/api/hooks/useSurveys';

function CreateSurveyForm() {
  const { mutate: createSurvey, loading } = useCreateSurvey();

  const handleSubmit = async (formData) => {
    try {
      await createSurvey({
        name: formData.name,
        description: formData.description,
        organizationId: 'org-123',
        template_id: 'template-456'
      });
      // Success - survey created
    } catch (error) {
      // Error handling
      console.error('Failed to create survey:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Survey'}
      </button>
    </form>
  );
}
```

### Pagination

```typescript
import { usePaginatedSurveys } from '@/lib/api/hooks/useSurveys';

function PaginatedSurveysList() {
  const { 
    data: surveys, 
    loading, 
    hasMore, 
    loadMore, 
    refresh 
  } = usePaginatedSurveys('org-123', 10);

  return (
    <div>
      {surveys?.map(survey => (
        <div key={survey.id}>{survey.name}</div>
      ))}
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Direct API Service Usage

```typescript
import { surveyApi } from '@/lib/api/services/surveys';

// In a component or utility function
const fetchSurveyData = async () => {
  try {
    const surveys = await surveyApi.surveys.getAll({
      organizationId: 'org-123',
      status: 'active'
    });
    
    const templates = await surveyApi.templates.getAll({
      category: 'staff'
    });
    
    return { surveys, templates };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## Creating New Services

### 1. Generic CRUD Service

```typescript
// In services/index.ts
export interface MyEntity {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const myEntitiesApi = createCrudService<MyEntity>({
  endpoint: '/api/my-entities',
});
```

### 2. Custom Service

```typescript
// In services/my-entities.ts
import { apiClient, handleApiResponse, handleApiError } from '../client';

export const myEntitiesApi = {
  getAll: async (filters?: any) => {
    try {
      const response = await apiClient.get('/api/my-entities', { params: filters });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Custom method
  getWithSpecialLogic: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/my-entities/${id}/special`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
```

### 3. Custom Hooks

```typescript
// In hooks/useMyEntities.ts
import { useApi, useApiMutation } from './useApi';
import { myEntitiesApi } from '../services/my-entities';

export function useMyEntities(filters?: any) {
  return useApi(
    () => myEntitiesApi.getAll(filters),
    [JSON.stringify(filters)]
  );
}

export function useCreateMyEntity() {
  return useApiMutation<MyEntity, CreateMyEntityRequest>();
}
```

## Migration Guide

### From Direct Fetch Calls

**Before:**
```typescript
const [surveys, setSurveys] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/surveys?organizationId=${tenantId}`);
      if (!response.ok) throw new Error('Failed to fetch surveys');
      const data = await response.json();
      setSurveys(data.surveys);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchSurveys();
}, [tenantId]);
```

**After:**
```typescript
const { data: surveys, loading, error } = useSurveys({
  organizationId: tenantId
});
```

### Benefits of Migration

1. **Reduced Boilerplate**: 90% less code for API calls
2. **Consistent Error Handling**: All errors handled uniformly
3. **Type Safety**: Full TypeScript support
4. **Loading States**: Built-in loading and error states
5. **Caching**: Automatic request deduplication and caching
6. **Retry Logic**: Configurable retry for failed requests
7. **Optimistic Updates**: Support for optimistic UI updates

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000  # Optional, defaults to current origin
```

### Customizing the API Client

```typescript
// In client.ts, you can customize:
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  // Adjust timeout
  headers: {
    'Content-Type': 'application/json',
    // Add custom headers
  },
});

// Add custom interceptors
client.interceptors.request.use((config) => {
  // Add auth token, custom headers, etc.
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Best Practices

1. **Use Hooks for Components**: Prefer hooks over direct API calls in React components
2. **Type Everything**: Always define TypeScript interfaces for your data
3. **Handle Errors Gracefully**: Use the error states provided by hooks
4. **Optimize Dependencies**: Be careful with dependency arrays in hooks
5. **Use Pagination**: For large datasets, use paginated hooks
6. **Cache Strategically**: Consider what data should be cached and for how long
7. **Test API Services**: Write unit tests for your API services

## Testing

```typescript
// Example test for API service
import { surveyApi } from '@/lib/api/services/surveys';
import { apiClient } from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('Survey API', () => {
  it('should fetch surveys', async () => {
    const mockSurveys = [{ id: '1', name: 'Test Survey' }];
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockSurveys });

    const result = await surveyApi.surveys.getAll({ organizationId: 'org-123' });
    
    expect(result).toEqual(mockSurveys);
    expect(apiClient.get).toHaveBeenCalledWith('/api/surveys?organizationId=org-123');
  });
});
```

This architecture provides a solid foundation for scalable API interactions in your Next.js application. It's designed to grow with your application and handle complex scenarios while maintaining simplicity for basic use cases.

