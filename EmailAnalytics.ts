import { getSupabaseAdmin } from '@/lib/supabase';

export interface EmailAnalyticsEvent {
  eventType: string;
  organizationId: string;
  template: string;
  recipient: string;
  messageId?: string;
  success: boolean;
  error?: string;
  duration?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface EmailPerformanceMetrics {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  averageSendTime: number;
  totalEmails: number;
  successfulEmails: number;
  failedEmails: number;
}

export interface OrganizationEmailStats {
  organizationId: string;
  organizationName: string;
  period: string;
  metrics: EmailPerformanceMetrics;
  topTemplates: Array<{
    template: string;
    count: number;
    successRate: number;
  }>;
  recentEvents: EmailAnalyticsEvent[];
}

/**
 * Email Analytics Service
 * Handles email performance tracking and analytics
 */
export class EmailAnalytics {
  /**
   * Track email sent event
   */
  static async trackEmailSent(data: {
    messageId: string;
    recipient: string;
    template: string;
    organizationId: string;
    metadata?: Record<string, any>;
  }) {
    return this.trackEvent('email_sent', {
      ...data,
      success: true,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track email delivered event
   */
  static async trackEmailDelivered(data: {
    messageId: string;
    recipient: string;
    organizationId: string;
    metadata?: Record<string, any>;
  }) {
    return this.trackEvent('email_delivered', {
      ...data,
      success: true,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track email opened event
   */
  static async trackEmailOpened(data: {
    messageId: string;
    recipient: string;
    organizationId: string;
    metadata?: Record<string, any>;
  }) {
    return this.trackEvent('email_opened', {
      ...data,
      success: true,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track email clicked event
   */
  static async trackEmailClicked(data: {
    messageId: string;
    recipient: string;
    organizationId: string;
    link: string;
    metadata?: Record<string, any>;
  }) {
    return this.trackEvent('email_clicked', {
      ...data,
      success: true,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track email bounced event
   */
  static async trackEmailBounced(data: {
    messageId: string;
    recipient: string;
    organizationId: string;
    reason: string;
    metadata?: Record<string, any>;
  }) {
    return this.trackEvent('email_bounced', {
      ...data,
      success: false,
      error: data.reason,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track email failed event
   */
  static async trackEmailFailed(data: {
    messageId?: string;
    recipient: string;
    organizationId: string;
    reason: string;
    metadata?: Record<string, any>;
  }) {
    return this.trackEvent('email_failed', {
      ...data,
      success: false,
      error: data.reason,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track email scheduled event
   */
  static async trackEmailScheduled(data: {
    template: string;
    recipient: string;
    organizationId: string;
    scheduledAt: string;
    metadata?: Record<string, any>;
  }) {
    return this.trackEvent('email_scheduled', {
      ...data,
      success: true,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track email delivery delayed event
   */
  static async trackEmailDeliveryDelayed(data: {
    messageId: string;
    recipient: string;
    organizationId: string;
    reason: string;
    metadata?: Record<string, any>;
  }) {
    return this.trackEvent('email_delivery_delayed', {
      ...data,
      success: false,
      error: data.reason,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track generic email event
   */
  private static async trackEvent(eventType: string, data: Partial<EmailAnalyticsEvent>) {
    try {
      const event: EmailAnalyticsEvent = {
        eventType,
        organizationId: data.organizationId || '',
        template: data.template || '',
        recipient: data.recipient || '',
        messageId: data.messageId,
        success: data.success || false,
        error: data.error,
        duration: data.duration,
        metadata: data.metadata,
        timestamp: data.timestamp || new Date().toISOString()
      };

      // Store in database
      const supabaseAdmin = getSupabaseAdmin()
      const { error } = await supabaseAdmin
        .from('email_analytics')
        .insert(event);

      if (error) {
        console.error('Error storing email analytics event:', error);
      }

      // Track in PostHog if available
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture(`email_${eventType}`, {
          organization_id: event.organizationId,
          template: event.template,
          recipient: event.recipient,
          message_id: event.messageId,
          success: event.success,
          error: event.error,
          duration_ms: event.duration,
          ...event.metadata
        });
      }

      return event;
    } catch (error) {
      console.error('Error tracking email event:', error);
      throw error;
    }
  }

  /**
   * Get email performance metrics for an organization
   */
  static async getOrganizationEmailStats(
    organizationId: string,
    period: string = '30d'
  ): Promise<OrganizationEmailStats> {
    try {
      const dateFrom = this.getDateFromPeriod(period);
      
      // Get organization info
      const supabaseAdminOrg = getSupabaseAdmin()
      const { data: org } = await supabaseAdminOrg
        .from('organizations')
        .select('name')
        .eq('id', organizationId)
        .single();

      // Get email events for the period
      const supabaseAdminEvents = getSupabaseAdmin()
      const { data: events, error } = await supabaseAdminEvents
        .from('email_analytics')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('timestamp', dateFrom.toISOString())
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      // Calculate metrics
      const metrics = this.calculateMetrics(events || []);
      
      // Get top templates
      const topTemplates = this.getTopTemplates(events || []);
      
      // Get recent events (last 10)
      const recentEvents = (events || []).slice(0, 10);

      return {
        organizationId,
        organizationName: org?.name || 'Unknown Organization',
        period,
        metrics,
        topTemplates,
        recentEvents
      };
    } catch (error) {
      console.error('Error getting organization email stats:', error);
      throw error;
    }
  }

  /**
   * Get email performance metrics for all organizations
   */
  static async getAllOrganizationsEmailStats(period: string = '30d'): Promise<OrganizationEmailStats[]> {
    try {
      const dateFrom = this.getDateFromPeriod(period);
      
      // Get all organizations with email activity
      const supabaseAdminAll = getSupabaseAdmin()
      const { data: events, error } = await supabaseAdminAll
        .from('email_analytics')
        .select(`
          *,
          organizations (
            id,
            name
          )
        `)
        .gte('timestamp', dateFrom.toISOString())
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      // Group events by organization
      const orgEvents = new Map<string, any[]>();
      (events || []).forEach(event => {
        const orgId = event.organization_id;
        if (!orgEvents.has(orgId)) {
          orgEvents.set(orgId, []);
        }
        orgEvents.get(orgId)!.push(event);
      });

      // Calculate stats for each organization
      const stats: OrganizationEmailStats[] = [];
      for (const [orgId, orgEventList] of Array.from(orgEvents)) {
        const org = orgEventList[0]?.organizations;
        const metrics = this.calculateMetrics(orgEventList);
        const topTemplates = this.getTopTemplates(orgEventList);
        const recentEvents = orgEventList.slice(0, 10);

        stats.push({
          organizationId: orgId,
          organizationName: org?.name || 'Unknown Organization',
          period,
          metrics,
          topTemplates,
          recentEvents
        });
      }

      return stats;
    } catch (error) {
      console.error('Error getting all organizations email stats:', error);
      throw error;
    }
  }

  /**
   * Calculate email performance metrics from events
   */
  private static calculateMetrics(events: any[]): EmailPerformanceMetrics {
    const sentEvents = events.filter(e => e.event_type === 'email_sent');
    const deliveredEvents = events.filter(e => e.event_type === 'email_delivered');
    const openedEvents = events.filter(e => e.event_type === 'email_opened');
    const clickedEvents = events.filter(e => e.event_type === 'email_clicked');
    const bouncedEvents = events.filter(e => e.event_type === 'email_bounced');
    const failedEvents = events.filter(e => e.event_type === 'email_failed');

    const totalEmails = sentEvents.length;
    const successfulEmails = sentEvents.filter(e => e.success).length;
    const failedEmails = failedEvents.length;

    const deliveryRate = totalEmails > 0 ? (deliveredEvents.length / totalEmails) * 100 : 0;
    const openRate = deliveredEvents.length > 0 ? (openedEvents.length / deliveredEvents.length) * 100 : 0;
    const clickRate = openedEvents.length > 0 ? (clickedEvents.length / openedEvents.length) * 100 : 0;
    const bounceRate = totalEmails > 0 ? (bouncedEvents.length / totalEmails) * 100 : 0;

    const averageSendTime = sentEvents.length > 0 
      ? sentEvents.reduce((sum, e) => sum + (e.duration_ms || 0), 0) / sentEvents.length 
      : 0;

    return {
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      openRate: Math.round(openRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
      bounceRate: Math.round(bounceRate * 100) / 100,
      averageSendTime: Math.round(averageSendTime),
      totalEmails,
      successfulEmails,
      failedEmails
    };
  }

  /**
   * Get top email templates by usage
   */
  private static getTopTemplates(events: any[]): Array<{ template: string; count: number; successRate: number }> {
    const templateStats = new Map<string, { count: number; successful: number }>();

    events.forEach(event => {
      if (event.event_type === 'email_sent') {
        const template = event.template;
        if (!templateStats.has(template)) {
          templateStats.set(template, { count: 0, successful: 0 });
        }
        const stats = templateStats.get(template)!;
        stats.count++;
        if (event.success) {
          stats.successful++;
        }
      }
    });

    return Array.from(templateStats.entries())
      .map(([template, stats]) => ({
        template,
        count: stats.count,
        successRate: stats.count > 0 ? Math.round((stats.successful / stats.count) * 100 * 100) / 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  /**
   * Get date from period string
   */
  private static getDateFromPeriod(period: string): Date {
    const now = new Date();
    const periodMap: Record<string, number> = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const days = periodMap[period] || 30;
    return new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  }

  /**
   * Get email analytics dashboard data
   */
  static async getDashboardData(organizationId?: string, period: string = '30d') {
    try {
      if (organizationId) {
        return await this.getOrganizationEmailStats(organizationId, period);
      } else {
        return await this.getAllOrganizationsEmailStats(period);
      }
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  /**
   * Clean up old analytics data
   */
  static async cleanupOldData(daysToKeep: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const supabaseAdmin = getSupabaseAdmin();
      const { error } = await supabaseAdmin
        .from('email_analytics')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) {
        console.error('Error cleaning up old email analytics data:', error);
      } else {
        console.log(`Cleaned up email analytics data older than ${daysToKeep} days`);
      }
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }
}

