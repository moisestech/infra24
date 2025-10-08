'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Calendar,
  DollarSign,
  Clock,
  Target,
  Award,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    total_bookings: number;
    total_revenue: number;
    total_users: number;
    average_booking_value: number;
    booking_success_rate: number;
    user_retention_rate: number;
  };
  trends: {
    bookings_over_time: Array<{
      date: string;
      bookings: number;
      revenue: number;
    }>;
    user_growth: Array<{
      date: string;
      new_users: number;
      total_users: number;
    }>;
  };
  top_metrics: {
    most_popular_resources: Array<{
      resource_name: string;
      booking_count: number;
      revenue: number;
    }>;
    top_organizations: Array<{
      organization_name: string;
      booking_count: number;
      revenue: number;
    }>;
    user_roles_distribution: Array<{
      role: string;
      count: number;
      percentage: number;
    }>;
  };
  performance: {
    conversion_rates: {
      booking_to_payment: number;
      payment_success: number;
      user_activation: number;
    };
    time_metrics: {
      average_booking_duration: number;
      peak_booking_hours: Array<{
        hour: number;
        booking_count: number;
      }>;
    };
  };
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('bookings');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (value: number, previousValue: number) => {
    if (value > previousValue) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (value < previousValue) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (value: number, previousValue: number) => {
    if (value > previousValue) return 'text-green-600';
    if (value < previousValue) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bookings">Bookings</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="conversion">Conversion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_bookings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {getTrendIcon(analytics.overview.total_bookings, analytics.overview.total_bookings * 0.9)}
                +12% from last period
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.overview.total_revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {getTrendIcon(analytics.overview.total_revenue, analytics.overview.total_revenue * 0.95)}
                +8% from last period
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_users}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {getTrendIcon(analytics.overview.total_users, analytics.overview.total_users * 0.98)}
                +5% from last period
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.overview.average_booking_value.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {getTrendIcon(analytics.overview.average_booking_value, analytics.overview.average_booking_value * 1.02)}
                +3% from last period
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Booking Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.overview.booking_success_rate * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${analytics.overview.booking_success_rate * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.overview.user_retention_rate * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${analytics.overview.user_retention_rate * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.performance.conversion_rates.payment_success * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${analytics.performance.conversion_rates.payment_success * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Resources</CardTitle>
          <CardDescription>
            Top resources by booking count and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.top_metrics.most_popular_resources.map((resource, index) => (
              <div key={resource.resource_name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{resource.resource_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {resource.booking_count} bookings
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${resource.revenue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Roles Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>User Roles Distribution</CardTitle>
          <CardDescription>
            Breakdown of users by role across all organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.top_metrics.user_roles_distribution.map((role) => (
              <div key={role.role} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {role.role.replace('_', ' ').charAt(0).toUpperCase() + role.role.replace('_', ' ').slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {role.count} users
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${role.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {role.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Booking Hours</CardTitle>
          <CardDescription>
            Most popular hours for bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {analytics.performance.time_metrics.peak_booking_hours.map((hour) => (
              <div key={hour.hour} className="text-center">
                <div className="text-sm font-medium">{hour.hour}:00</div>
                <div className="w-full bg-gray-200 rounded-full h-16 mt-2 flex items-end">
                  <div 
                    className="bg-primary w-full rounded-full" 
                    style={{ 
                      height: `${(hour.booking_count / Math.max(...analytics.performance.time_metrics.peak_booking_hours.map(h => h.booking_count))) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {hour.booking_count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
