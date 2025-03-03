import { LucideIcon } from 'lucide-react';
import { PatternType } from '@/components/patterns';

export type AnnouncementType = 
  | 'urgent'
  | 'facility'
  | 'event'
  | 'opportunity'
  | 'administrative';

export type AnnouncementSubType = 
  // Urgent subtypes
  | 'closure'
  | 'weather'
  | 'safety'
  | 'parking'
  // Facility subtypes
  | 'maintenance'
  | 'cleaning'
  | 'storage'
  | 'renovation'
  // Event subtypes
  | 'exhibition'
  | 'workshop'
  | 'talk'
  | 'social'
  | 'performance'
  | 'open_studios'
  // Opportunity subtypes
  | 'open_call'
  | 'job'
  | 'commission'
  | 'residency'
  | 'funding'
  // Administrative subtypes
  | 'survey'
  | 'document'
  | 'deadline'
  | 'policy';

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
  type: AnnouncementType;
  subType: AnnouncementSubType;
  template: 'pattern' | 'standard';
  patternType?: PatternType;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  additional_info?: string;
  primary_link?: string;
  visibility: 'internal' | 'external' | 'both';
  expires_at: string;
  key_people?: {
    name: string;
    role: string;
  }[];
  organizations?: {
    name: string;
    asset?: string;
  }[];
  visual_style?: {
    accent_color?: string;
    background_pattern?: string;
    typography_style?: string;
  };
} 