'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function OoliteDigitalBudgetPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedView, setSelectedView] = useState('overview');

  const budgetData = {
    2024: {
      total: 150000,
      categories: [
        { name: 'Equipment & Technology', amount: 45000, percentage: 30, trend: 'up' },
        { name: 'Staff & Training', amount: 60000, percentage: 40, trend: 'up' },
        { name: 'Programs & Workshops', amount: 25000, percentage: 17, trend: 'stable' },
        { name: 'Marketing & Outreach', amount: 12000, percentage: 8, trend: 'up' },
        { name: 'Facilities & Maintenance', amount: 8000, percentage: 5, trend: 'stable' }
      ],
      monthly: [
        { month: 'Jan', budget: 12500, actual: 11800, variance: -700 },
        { month: 'Feb', budget: 12500, actual: 13200, variance: 700 },
        { month: 'Mar', budget: 12500, actual: 12100, variance: -400 },
        { month: 'Apr', budget: 12500, actual: 12800, variance: 300 },
        { month: 'May', budget: 12500, actual: 11900, variance: -600 },
        { month: 'Jun', budget: 12500, actual: 13100, variance: 600 },
        { month: 'Jul', budget: 12500, actual: 12400, variance: -100 },
        { month: 'Aug', budget: 12500, actual: 12700, variance: 200 },
        { month: 'Sep', budget: 12500, actual: 12000, variance: -500 },
        { month: 'Oct', budget: 12500, actual: 12900, variance: 400 },
        { month: 'Nov', budget: 12500, actual: 12200, variance: -300 },
        { month: 'Dec', budget: 12500, actual: 12500, variance: 0 }
      ]
    }
  };

  const currentData = budgetData[2024];
  const totalSpent = currentData.monthly.reduce((sum, month) => sum + month.actual, 0);
  const totalBudget = currentData.monthly.reduce((sum, month) => sum + month.budget, 0);
  const variance = totalSpent - totalBudget;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Digital Arts Lab Budget
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive budget overview and financial tracking for the Digital Arts Lab program at Oolite Arts.
          </p>
          
          {/* Year Selector */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={selectedYear === '2024' ? 'default' : 'outline'}
              onClick={() => setSelectedYear('2024')}
            >
              2024
            </Button>
            <Button
              variant={selectedYear === '2025' ? 'default' : 'outline'}
              onClick={() => setSelectedYear('2025')}
              disabled
            >
              2025 (Projected)
            </Button>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${currentData.total.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalSpent.toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(currentData.total - totalSpent).toLocaleString()}
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Variance</p>
                  <p className={`text-2xl font-bold ${getVarianceColor(variance)}`}>
                    ${variance.toLocaleString()}
                  </p>
                </div>
                {variance >= 0 ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={selectedView === 'overview' ? 'default' : 'outline'}
            onClick={() => setSelectedView('overview')}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Category Overview
          </Button>
          <Button
            variant={selectedView === 'monthly' ? 'default' : 'outline'}
            onClick={() => setSelectedView('monthly')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Monthly Tracking
          </Button>
        </div>

        {/* Category Overview */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Budget by Category</CardTitle>
                <CardDescription>
                  Distribution of budget across different program areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTrendIcon(category.trend)}
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${category.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{category.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Progress</CardTitle>
                <CardDescription>
                  Visual representation of budget allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.categories.map((category, index) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category.name}</span>
                          <span>{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colors[index % colors.length]}`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Monthly Tracking */}
        {selectedView === 'monthly' && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Tracking</CardTitle>
              <CardDescription>
                Month-by-month comparison of budgeted vs actual spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Month</th>
                      <th className="text-right py-3 px-4">Budgeted</th>
                      <th className="text-right py-3 px-4">Actual</th>
                      <th className="text-right py-3 px-4">Variance</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.monthly.map((month, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium">{month.month}</td>
                        <td className="py-3 px-4 text-right">${month.budget.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">${month.actual.toLocaleString()}</td>
                        <td className={`py-3 px-4 text-right ${getVarianceColor(month.variance)}`}>
                          ${month.variance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {month.variance >= 0 ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              On Track
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Over Budget
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Insights */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Key Financial Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Strong Performance</h3>
                </div>
                <p className="text-gray-600">
                  The program is performing well within budget, with most categories showing positive trends and efficient resource utilization.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Strategic Investment</h3>
                </div>
                <p className="text-gray-600">
                  40% of the budget is allocated to staff and training, ensuring high-quality program delivery and continuous improvement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">Future Planning</h3>
                </div>
                <p className="text-gray-600">
                  Budget projections for 2025 show planned expansion of programs and technology investments to serve more community members.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}