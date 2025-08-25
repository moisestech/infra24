export interface Analytics {
  id: string;
  organization_id: string;
  announcement_id?: string;
  user_id?: string;
  event_type: AnalyticsEventType;
  event_data: Record<string, any>;
  timestamp: Date;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
}

export type AnalyticsEventType = 
  | 'announcement_view'
  | 'announcement_click'
  | 'announcement_share'
  | 'user_login'
  | 'user_logout'
  | 'announcement_create'
  | 'announcement_edit'
  | 'announcement_delete'
  | 'user_register'
  | 'page_view'
  | 'search_query'
  | 'filter_used'
  | 'carousel_interaction'
  | 'mobile_access'
  | 'qr_code_scan';

export interface EngagementMetrics {
  organization_id: string;
  date: string;
  total_views: number;
  total_clicks: number;
  total_shares: number;
  unique_users: number;
  total_sessions: number;
  avg_session_duration: number;
  bounce_rate: number;
  top_announcements: {
    announcement_id: string;
    title: string;
    views: number;
    clicks: number;
    engagement_rate: number;
  }[];
  user_activity: {
    role: string;
    count: number;
    percentage: number;
  }[];
  device_breakdown: {
    device_type: string;
    count: number;
    percentage: number;
  }[];
}

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
  device_breakdown: {
    device_type: string;
    views: number;
    percentage: number;
  }[];
  referrer_breakdown: {
    source: string;
    views: number;
    percentage: number;
  }[];
}

export interface OrganizationAnalytics {
  organization_id: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  start_date: Date;
  end_date: Date;
  total_announcements: number;
  total_views: number;
  total_clicks: number;
  total_shares: number;
  unique_users: number;
  total_sessions: number;
  avg_session_duration: number;
  bounce_rate: number;
  user_retention_rate: number;
  content_engagement_rate: number;
  mobile_usage_percentage: number;
  top_performing_content: AnnouncementAnalytics[];
  user_activity_breakdown: {
    role: string;
    active_users: number;
    total_actions: number;
    avg_actions_per_user: number;
  }[];
  growth_metrics: {
    new_users: number;
    new_announcements: number;
    engagement_growth: number;
  };
}

// Helper functions for analytics
export function calculateEngagementRate(views: number, clicks: number, shares: number): number {
  if (views === 0) return 0;
  return ((clicks + shares) / views) * 100;
}

export function calculateBounceRate(sessions: number, single_page_sessions: number): number {
  if (sessions === 0) return 0;
  return (single_page_sessions / sessions) * 100;
}

export function calculateRetentionRate(returning_users: number, total_users: number): number {
  if (total_users === 0) return 0;
  return (returning_users / total_users) * 100;
}
