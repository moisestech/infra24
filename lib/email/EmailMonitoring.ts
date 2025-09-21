import { supabaseAdmin } from '@/lib/supabase';

export interface EmailPerformanceMetrics {
  sendTime: number;
  deliveryTime?: number;
  openTime?: number;
  clickTime?: number;
  bounceTime?: number;
  errorTime?: number;
}

export interface EmailMonitoringData {
  messageId: string;
  organizationId: string;
  template: string;
  recipient: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: string;
  performance: EmailPerformanceMetrics;
  metadata?: Record<string, any>;
}

export interface MonitoringAlert {
  type: 'performance' | 'error' | 'delivery' | 'bounce';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  organizationId: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

/**
 * Email Monitoring Service
 * Handles performance monitoring and alerting for email operations
 */
export class EmailMonitoring {
  private static performanceThresholds = {
    sendTime: 2000, // 2 seconds
    deliveryRate: 95, // 95%
    bounceRate: 5, // 5%
    errorRate: 5 // 5%
  };

  /**
   * Start monitoring an email operation
   */
  static async startEmailMonitoring(data: {
    messageId: string;
    organizationId: string;
    template: string;
    recipient: string;
    metadata?: Record<string, any>;
  }): Promise<EmailMonitoringData> {
    const startTime = Date.now();
    
    const monitoringData: EmailMonitoringData = {
      messageId: data.messageId,
      organizationId: data.organizationId,
      template: data.template,
      recipient: data.recipient,
      startTime,
      success: false,
      performance: {
        sendTime: 0
      },
      metadata: data.metadata
    };

    // Store initial monitoring data
    await this.storeMonitoringData(monitoringData);
    
    return monitoringData;
  }

  /**
   * Complete email monitoring with results
   */
  static async completeEmailMonitoring(
    messageId: string,
    success: boolean,
    error?: string,
    performance?: Partial<EmailPerformanceMetrics>
  ): Promise<void> {
    const endTime = Date.now();
    
    try {
      // Get existing monitoring data
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('email_monitoring')
        .select('*')
        .eq('message_id', messageId)
        .single();

      if (fetchError || !existing) {
        console.error('Error fetching monitoring data:', fetchError);
        return;
      }

      const duration = endTime - existing.start_time;
      const updatedData: EmailMonitoringData = {
        ...existing,
        endTime,
        duration,
        success,
        error,
        performance: {
          ...existing.performance,
          ...performance
        }
      };

      // Update monitoring data
      await this.storeMonitoringData(updatedData);

      // Check for performance issues and generate alerts
      await this.checkPerformanceAndAlert(updatedData);

    } catch (error) {
      console.error('Error completing email monitoring:', error);
    }
  }

  /**
   * Track email delivery event
   */
  static async trackEmailDelivery(
    messageId: string,
    deliveryTime: number
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('email_monitoring')
        .update({
          performance: {
            delivery_time: deliveryTime
          },
          updated_at: new Date().toISOString()
        })
        .eq('message_id', messageId);

      if (error) {
        console.error('Error tracking email delivery:', error);
      }
    } catch (error) {
      console.error('Error tracking email delivery:', error);
    }
  }

  /**
   * Track email open event
   */
  static async trackEmailOpen(
    messageId: string,
    openTime: number
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('email_monitoring')
        .update({
          performance: {
            open_time: openTime
          },
          updated_at: new Date().toISOString()
        })
        .eq('message_id', messageId);

      if (error) {
        console.error('Error tracking email open:', error);
      }
    } catch (error) {
      console.error('Error tracking email open:', error);
    }
  }

  /**
   * Track email click event
   */
  static async trackEmailClick(
    messageId: string,
    clickTime: number
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('email_monitoring')
        .update({
          performance: {
            click_time: clickTime
          },
          updated_at: new Date().toISOString()
        })
        .eq('message_id', messageId);

      if (error) {
        console.error('Error tracking email click:', error);
      }
    } catch (error) {
      console.error('Error tracking email click:', error);
    }
  }

  /**
   * Track email bounce event
   */
  static async trackEmailBounce(
    messageId: string,
    bounceTime: number,
    reason: string
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('email_monitoring')
        .update({
          success: false,
          error: reason,
          performance: {
            bounce_time: bounceTime
          },
          updated_at: new Date().toISOString()
        })
        .eq('message_id', messageId);

      if (error) {
        console.error('Error tracking email bounce:', error);
      }

      // Generate bounce alert
      await this.generateAlert({
        type: 'bounce',
        severity: 'medium',
        message: `Email bounced: ${reason}`,
        organizationId: '', // Will be filled from monitoring data
        timestamp: new Date().toISOString(),
        metadata: { messageId, reason, bounceTime }
      });

    } catch (error) {
      console.error('Error tracking email bounce:', error);
    }
  }

  /**
   * Get performance metrics for an organization
   */
  static async getOrganizationPerformanceMetrics(
    organizationId: string,
    period: string = '30d'
  ): Promise<{
    averageSendTime: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    errorRate: number;
    totalEmails: number;
    performanceIssues: number;
  }> {
    try {
      const dateFrom = this.getDateFromPeriod(period);
      
      const { data: monitoringData, error } = await supabaseAdmin
        .from('email_monitoring')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', dateFrom.toISOString());

      if (error) {
        throw error;
      }

      const emails = monitoringData || [];
      const totalEmails = emails.length;
      const successfulEmails = emails.filter(e => e.success).length;
      const failedEmails = emails.filter(e => !e.success).length;
      const bouncedEmails = emails.filter(e => e.performance?.bounce_time).length;
      const openedEmails = emails.filter(e => e.performance?.open_time).length;
      const clickedEmails = emails.filter(e => e.performance?.click_time).length;

      const averageSendTime = emails.length > 0 
        ? emails.reduce((sum, e) => sum + (e.performance?.send_time || 0), 0) / emails.length 
        : 0;

      const deliveryRate = totalEmails > 0 ? (successfulEmails / totalEmails) * 100 : 0;
      const openRate = successfulEmails > 0 ? (openedEmails / successfulEmails) * 100 : 0;
      const clickRate = openedEmails > 0 ? (clickedEmails / openedEmails) * 100 : 0;
      const bounceRate = totalEmails > 0 ? (bouncedEmails / totalEmails) * 100 : 0;
      const errorRate = totalEmails > 0 ? (failedEmails / totalEmails) * 100 : 0;

      // Count performance issues
      const performanceIssues = emails.filter(e => 
        e.performance?.send_time > this.performanceThresholds.sendTime
      ).length;

      return {
        averageSendTime: Math.round(averageSendTime),
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        totalEmails,
        performanceIssues
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw error;
    }
  }

  /**
   * Get recent alerts for an organization
   */
  static async getRecentAlerts(
    organizationId: string,
    limit: number = 10
  ): Promise<MonitoringAlert[]> {
    try {
      const { data: alerts, error } = await supabaseAdmin
        .from('email_alerts')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (alerts || []).map(alert => ({
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        organizationId: alert.organization_id,
        metadata: alert.metadata,
        timestamp: alert.created_at
      }));
    } catch (error) {
      console.error('Error getting recent alerts:', error);
      throw error;
    }
  }

  /**
   * Store monitoring data in database
   */
  private static async storeMonitoringData(data: EmailMonitoringData): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('email_monitoring')
        .upsert({
          message_id: data.messageId,
          organization_id: data.organizationId,
          template: data.template,
          recipient: data.recipient,
          start_time: data.startTime,
          end_time: data.endTime,
          duration: data.duration,
          success: data.success,
          error: data.error,
          performance: data.performance,
          metadata: data.metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing monitoring data:', error);
      }
    } catch (error) {
      console.error('Error storing monitoring data:', error);
    }
  }

  /**
   * Check performance and generate alerts if needed
   */
  private static async checkPerformanceAndAlert(data: EmailMonitoringData): Promise<void> {
    const alerts: MonitoringAlert[] = [];

    // Check send time performance
    if (data.performance.sendTime > this.performanceThresholds.sendTime) {
      alerts.push({
        type: 'performance',
        severity: 'medium',
        message: `Email send time exceeded threshold: ${data.performance.sendTime}ms > ${this.performanceThresholds.sendTime}ms`,
        organizationId: data.organizationId,
        timestamp: new Date().toISOString(),
        metadata: { messageId: data.messageId, sendTime: data.performance.sendTime }
      });
    }

    // Check for errors
    if (!data.success && data.error) {
      alerts.push({
        type: 'error',
        severity: 'high',
        message: `Email failed: ${data.error}`,
        organizationId: data.organizationId,
        timestamp: new Date().toISOString(),
        metadata: { messageId: data.messageId, error: data.error }
      });
    }

    // Store alerts
    for (const alert of alerts) {
      await this.generateAlert(alert);
    }
  }

  /**
   * Generate and store an alert
   */
  private static async generateAlert(alert: MonitoringAlert): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('email_alerts')
        .insert({
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          organization_id: alert.organizationId,
          metadata: alert.metadata,
          created_at: alert.timestamp
        });

      if (error) {
        console.error('Error generating alert:', error);
      }
    } catch (error) {
      console.error('Error generating alert:', error);
    }
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
   * Clean up old monitoring data
   */
  static async cleanupOldData(daysToKeep: number = 90): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      // Clean up monitoring data
      const { error: monitoringError } = await supabaseAdmin
        .from('email_monitoring')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (monitoringError) {
        console.error('Error cleaning up old monitoring data:', monitoringError);
      }

      // Clean up alerts
      const { error: alertsError } = await supabaseAdmin
        .from('email_alerts')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (alertsError) {
        console.error('Error cleaning up old alerts:', alertsError);
      }

      console.log(`Cleaned up email monitoring data older than ${daysToKeep} days`);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  /**
   * Get monitoring dashboard data
   */
  static async getDashboardData(organizationId?: string, period: string = '30d') {
    try {
      if (organizationId) {
        const metrics = await this.getOrganizationPerformanceMetrics(organizationId, period);
        const alerts = await this.getRecentAlerts(organizationId, 10);
        
        return {
          metrics,
          alerts,
          organizationId
        };
      } else {
        // Get data for all organizations
        const { data: orgs } = await supabaseAdmin
          .from('organizations')
          .select('id, name');

        const dashboardData = [];
        for (const org of orgs || []) {
          const metrics = await this.getOrganizationPerformanceMetrics(org.id, period);
          const alerts = await this.getRecentAlerts(org.id, 5);
          
          dashboardData.push({
            organizationId: org.id,
            organizationName: org.name,
            metrics,
            alerts
          });
        }

        return dashboardData;
      }
    } catch (error) {
      console.error('Error getting monitoring dashboard data:', error);
      throw error;
    }
  }
}

