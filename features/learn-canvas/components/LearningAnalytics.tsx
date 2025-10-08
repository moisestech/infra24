'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Eye, 
  Target, 
  Award, 
  Heart, 
  Users, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';

interface LearningAnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalWorkshops: number;
  totalChapters: number;
  activityBreakdown: {
    concept_viewed: number;
    lesson_viewed: number;
    quiz_completed: number;
    project_passed: number;
    program_completed: number;
    workshop_liked: number;
  };
  workshopPerformance: Array<{
    workshop_slug: string;
    title: string;
    enrollments: number;
    completions: number;
    average_completion: number;
    likes: number;
  }>;
  userEngagement: Array<{
    period: string;
    active_users: number;
    new_enrollments: number;
    completions: number;
  }>;
  topLikedWorkshops: Array<{
    workshop_slug: string;
    title: string;
    likes: number;
  }>;
  completionRates: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

export function LearningAnalytics() {
  const [analytics, setAnalytics] = useState<LearningAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics/learning');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      console.log('Analytics API response:', data); // Debug log
      
      // Extract the analytics data from the response
      if (data.success && data.analytics) {
        setAnalytics(data.analytics);
      } else {
        throw new Error('Invalid analytics data structure');
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-black text-white">
        <div className="text-lg text-[#00ff00]">Loading analytics...</div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-64 bg-black text-white">
        <div className="text-red-400">Failed to load analytics: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-black text-white min-h-screen p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Learning Analytics</h2>
        <Button 
          onClick={fetchAnalytics}
          className="bg-[#00ff00] text-black hover:bg-[#00cc00] font-bold border-2 border-[#00ff00] hover:border-[#00cc00] transition-all duration-200 shadow-lg hover:shadow-[#00ff00]/25"
        >
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 hover:border-[#00ff00]/50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00ff00]">
              {analytics.totalUsers.toLocaleString()}
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              {analytics.activeUsers} active this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-[#00ff00]/50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300">Total Workshops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {analytics.totalWorkshops}
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              {analytics.totalChapters} total chapters
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-[#00ff00]/50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-magenta-400">
              {Object.values(analytics.activityBreakdown).reduce((a, b) => a + b, 0).toLocaleString()}
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Learning interactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-[#00ff00]/50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300">Avg Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {Math.round(analytics.workshopPerformance.reduce((acc, w) => acc + w.average_completion, 0) / Math.max(analytics.workshopPerformance.length, 1))}%
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Across all workshops
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Breakdown */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Activity Breakdown</CardTitle>
          <p className="text-sm text-zinc-400">Learning activities by type</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Concepts Viewed</span>
              </div>
              <span className="text-lg font-bold text-blue-400">
                {analytics.activityBreakdown.concept_viewed.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00ff00]" />
                <span className="text-sm font-medium text-white">Lessons Viewed</span>
              </div>
              <span className="text-lg font-bold text-[#00ff00]">
                {analytics.activityBreakdown.lesson_viewed.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Quizzes Completed</span>
              </div>
              <span className="text-lg font-bold text-purple-400">
                {analytics.activityBreakdown.quiz_completed.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Projects Passed</span>
              </div>
              <span className="text-lg font-bold text-yellow-400">
                {analytics.activityBreakdown.project_passed.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-white">Programs Completed</span>
              </div>
              <span className="text-lg font-bold text-red-400">
                {analytics.activityBreakdown.program_completed.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-white">Workshops Liked</span>
              </div>
              <span className="text-lg font-bold text-pink-400">
                {analytics.activityBreakdown.workshop_liked.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workshop Performance */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Workshop Performance</CardTitle>
          <p className="text-sm text-zinc-400">Enrollment and completion rates by workshop</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.workshopPerformance.slice(0, 8).map((workshop, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
                <div className="flex-1">
                  <h4 className="font-medium capitalize text-white">
                    {workshop.title.replace(/-/g, ' ')}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                    <span>{workshop.enrollments} enrollments</span>
                    <span>{workshop.completions} completions</span>
                    <span>{workshop.likes} likes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={workshop.average_completion} 
                    className="w-20 h-2 bg-zinc-700" 
                    style={{
                      '--progress-background': '#00ff00',
                      '--progress-foreground': '#00ff00'
                    } as React.CSSProperties}
                  />
                  <span className="text-sm font-semibold text-[#00ff00]">{Math.round(workshop.average_completion)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Engagement */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">User Engagement</CardTitle>
          <p className="text-sm text-zinc-400">Monthly engagement trends</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.userEngagement.map((period, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
                <div>
                  <div className="font-semibold text-white">{period.period}</div>
                  <div className="text-sm text-zinc-400">{period.active_users} active users</div>
                </div>
                <div>
                  <div className="font-semibold text-[#00ff00]">{period.new_enrollments}</div>
                  <div className="text-sm text-zinc-400">New enrollments</div>
                </div>
                <div>
                  <div className="font-semibold text-cyan-400">{period.completions}</div>
                  <div className="text-sm text-zinc-400">Completions</div>
                </div>
                <div>
                  <div className="font-semibold text-magenta-400">
                    {period.active_users > 0 ? Math.round((period.completions / period.active_users) * 100) : 0}%
                  </div>
                  <div className="text-sm text-zinc-400">Completion rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Liked Workshops */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Most Liked Workshops</CardTitle>
          <p className="text-sm text-zinc-400">Workshops with the most likes</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topLikedWorkshops.slice(0, 5).map((workshop, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-[#00ff00]/50 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="text-xs border-[#00ff00] text-[#00ff00]">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium capitalize text-white">
                    {workshop.title.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400 fill-current" />
                  <span className="font-semibold text-pink-400">{workshop.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate Distribution */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Completion Rate Distribution</CardTitle>
          <p className="text-sm text-zinc-400">How users are progressing through workshops</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.completionRates.map((range, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-white">{range.range}</span>
                    <span className="text-sm text-zinc-400">{range.count} users</span>
                  </div>
                  <Progress 
                    value={range.percentage} 
                    className="h-2 bg-zinc-700"
                    style={{
                      '--progress-background': '#00ff00',
                      '--progress-foreground': '#00ff00'
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 