import { LucideIcon } from 'lucide-react';
import { PatternType } from '@/components/patterns';

export type AnnouncementStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';

export type AnnouncementType = 
  | 'urgent' 
  | 'event' 
  | 'opportunity' 
  | 'facility' 
  | 'administrative'
  | 'attention_artists'
  | 'attention_public'
  | 'fun_fact'
  | 'promotion'
  | 'gala_announcement';

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
  | 'reminder'
  | 'general';

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

export type ImageLayoutType = 
  | 'hero'           // Large image as background with content overlay
  | 'split-left'     // Image on left (40%), content on right (60%)
  | 'split-right'    // Image on right (40%), content on left (60%)
  | 'card'           // Image as prominent card element with content flowing around it
  | 'masonry'        // Image and content in asymmetric grid layout
  | 'overlay'        // Image with semi-transparent overlay, content on top
  | 'side-panel'     // Narrow image panel on one side, full content area
  | 'background';    // Image as subtle background with strong content foreground

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
  // Extended fields from database schema
  location?: string;
  visibility?: 'internal' | 'external' | 'both';
  starts_at?: string;
  ends_at?: string;
  payload?: any;
  slug?: string;
  type?: AnnouncementType;
  sub_type?: AnnouncementSubType;
  template?: string;
  primary_link?: string;
  additional_info?: string;
  image_url?: string;
  people?: any[];
  external_orgs?: any[];
  style?: any;
  timezone?: string;
  is_all_day?: boolean;
  is_time_tbd?: boolean;
  rsvp_label?: string;
  rsvp_url?: string;
  event_state?: 'scheduled' | 'postponed' | 'canceled';
  image_layout?: ImageLayoutType;
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