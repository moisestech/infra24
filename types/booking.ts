/**
 * Unified Booking System Types
 * 
 * This file contains all the standardized interfaces for the booking system
 * to ensure consistency across API endpoints, components, and database operations.
 * 
 * Date: December 26, 2024
 * Purpose: Resolve interface mismatches identified in audit
 */

// =============================================
// CORE RESOURCE TYPES
// =============================================

export type ResourceType = 'space' | 'equipment' | 'person' | 'workshop';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type OrganizationRole = 'member' | 'moderator' | 'org_admin' | 'super_admin';

// =============================================
// RESOURCE INTERFACES
// =============================================

export interface Resource {
  id: string;
  organization_id: string;
  type: ResourceType;
  title: string;
  description?: string;
  category?: string;
  capacity: number;
  duration_minutes?: number;
  price: number;
  currency: string;
  location?: string;
  requirements?: string[];
  availability_rules?: Record<string, any>;
  metadata?: Record<string, any>;
  is_active: boolean;
  is_bookable: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// =============================================
// BOOKING INTERFACES
// =============================================

export interface Booking {
  id: string;
  organization_id: string;
  resource_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  capacity: number;
  current_participants: number;
  price: number;
  currency: string;
  location?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by_clerk_id: string;
  updated_by_clerk_id: string;
}

// =============================================
// BOOKING PARTICIPANT INTERFACES
// =============================================

export interface BookingParticipant {
  id: string;
  booking_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  status: 'confirmed' | 'cancelled' | 'no_show';
  created_at: string;
  updated_at: string;
}

// =============================================
// ORGANIZATION INTERFACES
// =============================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  timezone: string;
  settings: Record<string, any>;
  theme: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================
// ORGANIZATION MEMBERSHIP INTERFACES
// =============================================

export interface OrganizationMembership {
  id: string;
  organization_id: string;
  clerk_user_id: string;
  role: OrganizationRole;
  is_active: boolean;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// API REQUEST/RESPONSE INTERFACES
// =============================================

export interface CreateResourceRequest {
  organizationId: string;
  title: string;
  description?: string;
  type: ResourceType;
  category?: string;
  capacity?: number;
  duration_minutes?: number;
  price?: number;
  currency?: string;
  location?: string;
  requirements?: string[];
  availability_rules?: Record<string, any>;
  metadata?: Record<string, any>;
  is_active?: boolean;
  is_bookable?: boolean;
}

export interface CreateBookingRequest {
  organizationId: string;
  resourceId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  price?: number;
  currency?: string;
  location?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface UpdateBookingRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: BookingStatus;
  capacity?: number;
  price?: number;
  currency?: string;
  location?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

// =============================================
// API RESPONSE INTERFACES
// =============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// =============================================
// COMPONENT PROP INTERFACES
// =============================================

export interface BookingFormProps {
  resources: Resource[];
  onSubmit: (booking: CreateBookingRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CreateBookingRequest>;
  isLoading?: boolean;
}

export interface ResourceCalendarProps {
  orgId: string;
  resources?: Resource[];
  bookings?: Booking[];
  onBookingCreate?: (booking: CreateBookingRequest) => Promise<void>;
  onBookingUpdate?: (booking: Booking) => Promise<void>;
  onBookingDelete?: (bookingId: string) => Promise<void>;
  isLoading?: boolean;
}

export interface ResourceListProps {
  resources: Resource[];
  onResourceSelect?: (resource: Resource) => void;
  onResourceEdit?: (resource: Resource) => void;
  onResourceDelete?: (resourceId: string) => void;
  isLoading?: boolean;
}

export interface BookingListProps {
  bookings: Booking[];
  onBookingEdit?: (booking: Booking) => void;
  onBookingCancel?: (bookingId: string) => void;
  onBookingComplete?: (bookingId: string) => void;
  isLoading?: boolean;
}

// =============================================
// UTILITY TYPES
// =============================================

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  resourceId: string;
  resourceTitle: string;
}

export interface BookingConflict {
  bookingId: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  conflictType: 'overlap' | 'capacity_exceeded' | 'resource_unavailable';
}

export interface ResourceAvailability {
  resourceId: string;
  date: string;
  availableSlots: TimeSlot[];
  conflicts: BookingConflict[];
}

// =============================================
// FILTER AND SEARCH INTERFACES
// =============================================

export interface ResourceFilters {
  type?: ResourceType;
  category?: string;
  is_active?: boolean;
  is_bookable?: boolean;
  capacity_min?: number;
  capacity_max?: number;
  price_min?: number;
  price_max?: number;
  location?: string;
}

export interface BookingFilters {
  resourceId?: string;
  userId?: string;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  organizationId?: string;
}

export interface SearchParams {
  query?: string;
  filters?: ResourceFilters | BookingFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// =============================================
// CALENDAR AND SCHEDULING INTERFACES
// =============================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  resourceTitle: string;
  resourceType: ResourceType;
  status: BookingStatus;
  color: string;
  extendedProps: {
    bookingId: string;
    userId: string;
    capacity: number;
    currentParticipants: number;
    location?: string;
    notes?: string;
  };
}

export interface CalendarView {
  type: 'resourceTimeGrid' | 'resourceDayGrid' | 'dayGrid' | 'timeGrid' | 'list';
  title: string;
  buttonText: string;
}

// =============================================
// ERROR HANDLING INTERFACES
// =============================================

export interface BookingError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// =============================================
// EXPORT ALL TYPES
// =============================================

// All types are already exported above
