'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MousePointer,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface EmailMetrics {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  averageSendTime: number;
  totalEmails: number;
  successfulEmails: number;
  failedEmails: number;
}

interface EmailAlert {
  type: 'performance' | 'error' | 'delivery' | 'bounce';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface EmailTemplate {
  template: string;
  count: number;
  successRate: number;
}

interface EmailAnalyticsData {
  organizationId: string;
  organizationName: string;
  period: string;
  metrics: EmailMetrics;
  topTemplates: EmailTemplate[];
  recentEvents: any[];
}

interface EmailAnalyticsDashboardProps {
  organizationId?: string;
  className?: string;
}

export function EmailAnalyticsDashboard({ 
  organizationId, 
  className = '' 
}: EmailAnalyticsDashboardProps) {
  const [data, setData] = useState<EmailAnalyticsData | null>(null);
  const [alerts, setAlerts] = useState<EmailAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        period,
        ...(organizationId && { organizationId })
      });

      const response = await fetch(`/api/email/analytics?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch email analytics');
      }

      const result = await response.json();
      setData(result.data);
      setAlerts(result.alerts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [period, organizationId]);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading email analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Alert>
          <AlertDescription>
            No email analytics data available for the selected period.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { metrics, topTemplates, recentEvents } = data;

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'deliveryRate':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'openRate':
        return <Eye className="h-5 w-5 text-blue-600" />;
      case 'clickRate':
        return <MousePointer className="h-5 w-5 text-purple-600" />;
      case 'bounceRate':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'averageSendTime':
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <Mail className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMetricStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'deliveryRate':
        return value >= 95 ? 'excellent' : value >= 90 ? 'good' : 'poor';
      case 'openRate':
        return value >= 25 ? 'excellent' : value >= 15 ? 'good' : 'poor';
      case 'clickRate':
        return value >= 5 ? 'excellent' : value >= 2 ? 'good' : 'poor';
      case 'bounceRate':
        return value <= 1 ? 'excellent' : value <= 5 ? 'good' : 'poor';
      case 'averageSendTime':
        return value <= 500 ? 'excellent' : value <= 2000 ? 'good' : 'poor';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Analytics</h2>
          <p className="text-gray-600">
            {data.organizationName} • Last {period}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            {getMetricIcon('deliveryRate')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.deliveryRate.toFixed(1)}%</div>
            <Badge className={`mt-2 ${getStatusColor(getMetricStatus('deliveryRate', metrics.deliveryRate))}`}>
              {getMetricStatus('deliveryRate', metrics.deliveryRate)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            {getMetricIcon('openRate')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.openRate.toFixed(1)}%</div>
            <Badge className={`mt-2 ${getStatusColor(getMetricStatus('openRate', metrics.openRate))}`}>
              {getMetricStatus('openRate', metrics.openRate)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            {getMetricIcon('clickRate')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.clickRate.toFixed(1)}%</div>
            <Badge className={`mt-2 ${getStatusColor(getMetricStatus('clickRate', metrics.clickRate))}`}>
              {getMetricStatus('clickRate', metrics.clickRate)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            {getMetricIcon('bounceRate')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.bounceRate.toFixed(1)}%</div>
            <Badge className={`mt-2 ${getStatusColor(getMetricStatus('bounceRate', metrics.bounceRate))}`}>
              {getMetricStatus('bounceRate', metrics.bounceRate)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEmails.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">
              {metrics.successfulEmails} successful, {metrics.failedEmails} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Send Time</CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageSendTime}ms</div>
            <Badge className={`mt-2 ${getStatusColor(getMetricStatus('averageSendTime', metrics.averageSendTime))}`}>
              {getMetricStatus('averageSendTime', metrics.averageSendTime)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalEmails > 0 ? ((metrics.successfulEmails / metrics.totalEmails) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {metrics.successfulEmails} of {metrics.totalEmails} emails
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Performance issues and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <Badge className={`${getSeverityColor(alert.severity)} shrink-0`}>
                    {alert.severity}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Top Email Templates</CardTitle>
          <CardDescription>
            Most used templates and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTemplates.map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{template.template}</p>
                    <p className="text-sm text-gray-600">{template.count} emails sent</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {template.successRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">success rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Email Events</CardTitle>
          <CardDescription>
            Latest email activity and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    event.success ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{event.event_type}</p>
                    <p className="text-sm text-gray-600">{event.recipient}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{event.template}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}