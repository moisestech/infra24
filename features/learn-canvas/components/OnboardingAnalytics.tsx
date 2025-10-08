'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OnboardingAnalytics {
  formCompletionRate: number;
  averageInterestsSelected: number;
  interestBreakdown: Record<string, number>;
  conversionToSignup: number;
  totalSubmissions: number;
  interestCombinations: Array<{
    interests: string[];
    count: number;
    percentage: number;
  }>;
  workshopPerformance: Record<string, number>;
  cohortAnalysis: Array<{
    period: string;
    size: number;
    retention: number;
    engagement: number;
  }>;
}

export function OnboardingAnalytics() {
  const [analytics, setAnalytics] = useState<OnboardingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics/onboarding');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
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
        <h2 className="text-3xl font-bold text-white">Onboarding Analytics</h2>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-[#00ff00] text-black rounded-lg hover:bg-[#00cc00] font-bold border-2 border-[#00ff00] hover:border-[#00cc00] transition-all duration-200 shadow-lg hover:shadow-[#00ff00]/25"
        >
          Refresh
        </button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {analytics.formCompletionRate.toFixed(1)}%
            </div>
            <Progress value={analytics.formCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Avg Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {analytics.averageInterestsSelected.toFixed(1)}
            </div>
            <p className="text-sm text-gray-500 mt-1">per user</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Signup Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {analytics.conversionToSignup.toFixed(1)}%
            </div>
            <Progress value={analytics.conversionToSignup} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {analytics.totalSubmissions.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Interest Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Interest Distribution</CardTitle>
          <p className="text-sm text-gray-500">Most popular interests among users</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.interestBreakdown)
              .sort(([,a], [,b]) => b - a)
              .map(([interest, count]) => {
                const percentage = (count / analytics.totalSubmissions) * 100;
                return (
                  <div key={interest} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{interest}</span>
                        <span className="text-sm text-gray-500">{count} users</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Interest Combinations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Interest Combinations</CardTitle>
          <p className="text-sm text-gray-500">Most common interest pairings</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.interestCombinations.slice(0, 8).map((combination, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-1">
                  {combination.interests.map((interest, i) => (
                    <Badge key={i} variant="default" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <div className="text-right">
                  <div className="font-semibold">{combination.count}</div>
                  <div className="text-sm text-gray-500">{combination.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workshop Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Workshop Performance by Interest</CardTitle>
          <p className="text-sm text-gray-500">Engagement rates for each workshop</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analytics.workshopPerformance)
              .sort(([,a], [,b]) => b - a)
              .map(([workshop, performance]) => (
                <div key={workshop} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">
                    {workshop.replace(/-/g, ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={performance} className="w-20 h-2" />
                    <span className="text-sm font-semibold">{performance}%</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Cohort Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cohort Analysis</CardTitle>
          <p className="text-sm text-gray-500">User retention and engagement by time period</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.cohortAnalysis.map((cohort, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">{cohort.period}</div>
                  <div className="text-sm text-gray-500">{cohort.size} users</div>
                </div>
                <div>
                  <div className="font-semibold text-green-600">{cohort.retention}%</div>
                  <div className="text-sm text-gray-500">Retention</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">{cohort.engagement}%</div>
                  <div className="text-sm text-gray-500">Engagement</div>
                </div>
                <div>
                  <div className="font-semibold text-purple-600">
                    {((cohort.retention + cohort.engagement) / 2).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">Avg Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual User Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Individual User Insights</CardTitle>
          <p className="text-sm text-gray-500">Key metrics for individual user analysis</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(analytics.averageInterestsSelected * 10) / 10}
              </div>
              <div className="text-sm text-gray-600">Average Interests per User</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(analytics.interestBreakdown).length}
              </div>
              <div className="text-sm text-gray-600">Unique Interest Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.interestCombinations.length}
              </div>
              <div className="text-sm text-gray-600">Interest Combinations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 