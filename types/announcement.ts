import { LucideIcon } from 'lucide-react';
import { PatternType } from '@/components/patterns';

export type AnnouncementStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';

export type AnnouncementType = 'urgent' | 'event' | 'opportunity' | 'facility' | 'administrative';

export type AnnouncementSubType = 
  | 'closure' 
  | 'workshop' 
  | 'open_call' 
  | 'survey' 
  | 'maintenance' 
  | 'exhibition' 
  | 'critique' 
  | 'meeting' 
  | 'deadline' 
  | 'reminder';

export type VisualTemplate = 
  | 'minimal'      // Clean, typography-focused
  | 'dynamic'      // Asymmetric, energetic layout
  | 'gradient'     // Bold color transitions
  | 'geometric'    // Pattern-based backgrounds
  | 'pattern'      // Added pattern template
  | 'collage'      // Layered elements
  | 'cinematic'    // Movie poster style
  | 'editorial';   // Magazine-like layout

export type Visibility = 'internal' | 'external' | 'both';
export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface KeyPerson {
  name: string;
  role: string;
  asset?: string;
}

export interface Organization {
  name: string;
  asset?: string;
}

export interface Announcement {
  id: string;
  org_id: string;
  author_clerk_id: string;
  author_profile_id?: string;
  title: string;
  body?: string;
  media: any[];
  tags: string[];
  status: AnnouncementStatus;
  approval_notes?: string;
  approved_by_clerk_id?: string;
  approved_at?: string;
  scheduled_at?: string;
  published_at?: string;
  expires_at?: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementAudienceMemberType {
  announcement_id: string;
  member_type_id: string;
}

export interface AnnouncementAudienceTerm {
  announcement_id: string;
  term_id: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  body?: string;
  media?: any[];
  tags?: string[];
  scheduled_at?: string;
  expires_at?: string;
  priority?: number;
  audience_member_types?: string[];
  audience_terms?: string[];
}

export interface UpdateAnnouncementRequest {
  title?: string;
  body?: string;
  media?: any[];
  tags?: string[];
  status?: AnnouncementStatus;
  approval_notes?: string;
  scheduled_at?: string;
  expires_at?: string;
  priority?: number;
  audience_member_types?: string[];
  audience_terms?: string[];
}

// Extended announcement with user and organization data
export interface AnnouncementWithContext extends Announcement {
  created_by_user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  approved_by_user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
}

// Announcement creation/update payload
export interface CreateAnnouncementPayload {
  type: AnnouncementType;
  subType: AnnouncementSubType;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  additional_info?: string;
  primary_link?: string;
  visibility: Visibility;
  expires_at: string;
  key_people?: KeyPerson[];
  organizations?: Organization[];
  image?: string;
}

export interface UpdateAnnouncementPayload extends Partial<CreateAnnouncementPayload> {
  approval_status?: ApprovalStatus;
}

// Announcement filters
export interface AnnouncementFilters {
  organization_id?: string;
  type?: AnnouncementType;
  subType?: AnnouncementSubType;
  visibility?: Visibility;
  approval_status?: ApprovalStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
  created_by?: string;
}

// Announcement analytics
export interface AnnouncementAnalytics {
  announcement_id: string;
  organization_id: string;
  total_views: number;
  total_clicks: number;
  total_shares: number;
  engagement_rate: number;
  view_timeline: {
    date: string;
    views: number;
    clicks: number;
  }[];
  user_engagement: {
    user_id: string;
    user_name: string;
    user_role: string;
    views: number;
    clicks: number;
    last_interaction: Date;
  }[];
} 