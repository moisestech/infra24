/**
 * Standardized API Response Utilities
 * 
 * This module provides consistent response formats across all API endpoints
 * to ensure predictable client-side handling and better error management.
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: ApiResponse['meta']
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta
  }
}

/**
 * Create a paginated API response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    message,
    meta: {
      page,
      limit,
      total,
      hasMore: (page * limit) < total
    }
  }
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  error: string,
  status: number = 400
): { response: ApiResponse; status: number } {
  return {
    response: {
      success: false,
      error
    },
    status
  }
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(
  errors: Record<string, string[]>
): { response: ApiResponse; status: number } {
  return {
    response: {
      success: false,
      error: 'Validation failed',
      data: { errors }
    },
    status: 422
  }
}

/**
 * Common HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  CONFLICT: 'Resource conflict',
  INVALID_INPUT: 'Invalid input provided'
} as const
