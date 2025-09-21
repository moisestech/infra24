'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';

interface AnalyticsData {
  bookings?: {
    total: number;
    totalParticipants: number;
    totalRevenue: number;
    completionRate: number;
    byStatus: Record<string, number>;
    byResourceType: Record<string, number>;
  };
  submissions?: {
    total: number;
    byStatus: Record<string, number>;
    approvalRate: number;
    avgReviewTimeDays: number;
    byForm: Record<string, number>;
  };
  users?: {
    totalActive: number;
  };
  timeSeries: Array<{
    date: string;
    bookings: number;
    participants: number;
    revenue: number;
    submissions: number;
  }>;
}

interface AnalyticsDashboardProps {
  organizationId: string;
  className?: string;
}

export function AnalyticsDashboard({ organizationId, className }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [organizationId, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await fetch(
        `/api/organizations/${organizationId}/analytics?start_date=${startDate}&end_date=${endDate}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={fetchAnalytics}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    subtitle 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ComponentType<any>; 
    trend?: number; 
    subtitle?: string; 
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Key performance indicators and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={analytics.bookings?.total || 0}
          icon={Calendar}
          subtitle="All time bookings"
        />
        <StatCard
          title="Total Participants"
          value={analytics.bookings?.totalParticipants || 0}
          icon={Users}
          subtitle="People engaged"
        />
        <StatCard
          title="Revenue"
          value={`$${analytics.bookings?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          subtitle="Total earnings"
        />
        <StatCard
          title="Active Users"
          value={analytics.users?.totalActive || 0}
          icon={Users}
          subtitle="Engaged users"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Completion Rate"
          value={`${analytics.bookings?.completionRate || 0}%`}
          icon={CheckCircle}
          subtitle="Booking completion"
        />
        <StatCard
          title="Total Submissions"
          value={analytics.submissions?.total || 0}
          icon={BarChart3}
          subtitle="Forms submitted"
        />
        <StatCard
          title="Approval Rate"
          value={`${analytics.submissions?.approvalRate || 0}%`}
          icon={CheckCircle}
          subtitle="Submission approval"
        />
        <StatCard
          title="Avg Review Time"
          value={`${analytics.submissions?.avgReviewTimeDays || 0} days`}
          icon={Clock}
          subtitle="Time to review"
        />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Status Breakdown */}
        {analytics.bookings?.byStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Booking Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.bookings.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="capitalize">
                        {status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resource Type Breakdown */}
        {analytics.bookings?.byResourceType && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Resource Type Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.bookings.byResourceType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="capitalize">
                        {type}
                      </Badge>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Time Series Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
          <CardDescription>
            Daily bookings, participants, and submissions for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">
                {analytics.timeSeries.length} data points available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

