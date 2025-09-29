/**
 * Unified Workshop System Types
 * 
 * This file contains all the standardized interfaces for the workshop system
 * to ensure consistency across API endpoints, components, and database operations.
 * 
 * Date: December 26, 2024
 * Purpose: Match database schema and unify workshop interfaces
 */

// =============================================
// CORE WORKSHOP TYPES
// =============================================

export type WorkshopLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkshopType = 'workshop' | 'course' | 'event' | 'training';
export type WorkshopStatus = 'draft' | 'published' | 'archived';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

// =============================================
// WORKSHOP INTERFACES
// =============================================

export interface Workshop {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  type: WorkshopType;
  level: WorkshopLevel;
  status: WorkshopStatus;
  duration_minutes?: number;
  max_participants?: number;
  price: number;
  instructor?: string;
  prerequisites?: string[];
  materials?: string[];
  outcomes?: string[];
  is_active: boolean;
  is_public: boolean;
  is_shared: boolean;
  featured: boolean;
  image_url?: string;
  metadata?: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// WORKSHOP SESSION INTERFACES
// =============================================

export interface WorkshopSession {
  id: string;
  workshop_id: string;
  session_date: string;
  session_end_date?: string;
  location?: string;
  max_participants?: number;
  current_participants: number;
  is_active: boolean;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================================
// WORKSHOP BOOKING INTERFACES
// =============================================

export interface WorkshopBooking {
  id: string;
  workshop_id: string;
  user_id?: string;
  organization_id: string;
  booking_status: BookingStatus;
  registered_at: string;
  confirmed_at?: string;
  cancelled_at?: string;
  completed_at?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================================
// WORKSHOP FEEDBACK INTERFACES
// =============================================

export interface WorkshopFeedback {
  id: string;
  workshop_id: string;
  user_id?: string;
  organization_id: string;
  rating?: number;
  feedback_text?: string;
  would_recommend?: boolean;
  learned_something?: boolean;
  instructor_rating?: number;
  content_rating?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================================
// WORKSHOP SHARING INTERFACES
// =============================================

export interface WorkshopOrganizationSharing {
  id: string;
  workshop_id: string;
  source_organization_id: string;
  target_organization_id: string;
  is_active: boolean;
  shared_by: string;
  shared_at: string;
  expires_at?: string;
  notes?: string;
}

// =============================================
// REQUEST/RESPONSE INTERFACES
// =============================================

export interface CreateWorkshopRequest {
  title: string;
  description?: string;
  content?: string;
  category?: string;
  type?: WorkshopType;
  level?: WorkshopLevel;
  duration_minutes?: number;
  max_participants?: number;
  price?: number;
  instructor?: string;
  prerequisites?: string[];
  materials?: string[];
  outcomes?: string[];
  is_active?: boolean;
  is_public?: boolean;
  is_shared?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateWorkshopRequest extends Partial<CreateWorkshopRequest> {
  id: string;
}

export interface CreateWorkshopSessionRequest {
  workshop_id: string;
  session_date: string;
  session_end_date?: string;
  location?: string;
  max_participants?: number;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface CreateWorkshopBookingRequest {
  workshop_id: string;
  user_id?: string;
  organization_id: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface CreateWorkshopFeedbackRequest {
  workshop_id: string;
  user_id?: string;
  organization_id: string;
  rating?: number;
  feedback_text?: string;
  would_recommend?: boolean;
  learned_something?: boolean;
  instructor_rating?: number;
  content_rating?: number;
  metadata?: Record<string, any>;
}

// =============================================
// FILTER AND SEARCH INTERFACES
// =============================================

export interface WorkshopFilters {
  organization_id?: string;
  category?: string;
  type?: WorkshopType;
  level?: WorkshopLevel;
  is_active?: boolean;
  is_public?: boolean;
  is_shared?: boolean;
  instructor?: string;
  min_price?: number;
  max_price?: number;
  min_duration?: number;
  max_duration?: number;
}

export interface WorkshopSearchParams {
  query?: string;
  filters?: WorkshopFilters;
  sortBy?: 'title' | 'created_at' | 'updated_at' | 'price' | 'duration_minutes';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// =============================================
// COMPONENT PROPS INTERFACES
// =============================================

export interface WorkshopCardProps {
  workshop: Workshop;
  showActions?: boolean;
  onEdit?: (workshop: Workshop) => void;
  onDelete?: (workshop: Workshop) => void;
  onBook?: (workshop: Workshop) => void;
}

export interface WorkshopListProps {
  workshops: Workshop[];
  loading?: boolean;
  error?: string;
  onWorkshopSelect?: (workshop: Workshop) => void;
  onWorkshopEdit?: (workshop: Workshop) => void;
  onWorkshopDelete?: (workshop: Workshop) => void;
}

export interface WorkshopFormProps {
  workshop?: Workshop;
  onSubmit: (workshop: CreateWorkshopRequest | UpdateWorkshopRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface WorkshopSessionManagerProps {
  workshop: Workshop;
  sessions: WorkshopSession[];
  onSessionCreate: (session: CreateWorkshopSessionRequest) => void;
  onSessionUpdate: (sessionId: string, updates: Partial<WorkshopSession>) => void;
  onSessionDelete: (sessionId: string) => void;
}

// =============================================
// EXPORT ALL TYPES
// =============================================

// All types are already exported above
