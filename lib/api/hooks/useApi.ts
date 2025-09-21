import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../client';

// Generic API state interface
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Generic API hook for GET requests
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error as ApiError 
      });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}

// Hook for mutations (POST, PUT, DELETE)
export function useApiMutation<T, P = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (apiCall: (params?: P) => Promise<T>, params?: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall(params);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setState({ 
        data: null, 
        loading: false, 
        error: apiError 
      });
      throw apiError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}

// Hook for paginated data
export interface PaginatedApiState<T> extends ApiState<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [state, setState] = useState<PaginatedApiState<T>>({
    data: [],
    loading: true,
    error: null,
    pagination: {
      page: initialPage,
      limit: initialLimit,
      total: 0,
      hasMore: false,
    },
  });

  const fetchPage = useCallback(async (page: number = state.pagination.page) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall(page, state.pagination.limit);
      const hasMore = (page * state.pagination.limit) < result.total;
      
      setState(prev => ({
        data: page === 1 ? result.data : [...(prev.data || []), ...result.data],
        loading: false,
        error: null,
        pagination: {
          page,
          limit: state.pagination.limit,
          total: result.total,
          hasMore,
        },
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev,
        loading: false, 
        error: error as ApiError 
      }));
    }
  }, [state.pagination.page, state.pagination.limit]);

  const loadMore = useCallback(() => {
    if (state.pagination.hasMore && !state.loading) {
      fetchPage(state.pagination.page + 1);
    }
  }, [state.pagination.hasMore, state.pagination.page, state.loading, fetchPage]);

  const refresh = useCallback(() => {
    setState(prev => ({ ...prev, pagination: { ...prev.pagination, page: 1 } }));
    fetchPage(1);
  }, [fetchPage]);

  useEffect(() => {
    fetchPage(1);
  }, []);

  return { ...state, loadMore, refresh, fetchPage };
}

