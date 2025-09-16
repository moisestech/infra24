'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function OoliteBudgetPrognosisPage() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedView, setSelectedView] = useState('projections');

  const prognosisData = {
    2025: {
      totalBudget: 180000,
      projectedRevenue: 45000,
      categories: [
        { 
          name: 'Equipment & Technology', 
          current: 45000, 
          projected: 55000, 
          growth: 22,
          trend: 'up',
          justification: 'Expansion of VR/AR capabilities and AI tools'
        },
        { 
          name: 'Staff & Training', 
          current: 60000, 
          projected: 70000, 
          growth: 17,
          trend: 'up',
          justification: 'Additional instructors for growing program demand'
        },
        { 
          name: 'Programs & Workshops', 
          current: 25000, 
          projected: 35000, 
          growth: 40,
          trend: 'up',
          justification: 'New workshop series and community partnerships'
        },
        { 
          name: 'Marketing & Outreach', 
          current: 12000, 
          projected: 15000, 
          growth: 25,
          trend: 'up',
          justification: 'Digital marketing and social media expansion'
        },
        { 
          name: 'Facilities & Maintenance', 
          current: 8000, 
          projected: 10000, 
          growth: 25,
          trend: 'up',
          justification: 'Equipment maintenance and space improvements'
        }
      ],
      quarterlyProjections: [
        { quarter: 'Q1 2025', budget: 45000, revenue: 10000, net: -35000 },
        { quarter: 'Q2 2025', budget: 45000, revenue: 12000, net: -33000 },
        { quarter: 'Q3 2025', budget: 45000, revenue: 15000, net: -30000 },
        { quarter: 'Q4 2025', budget: 45000, revenue: 8000, net: -37000 }
      ],
      risks: [
        {
          type: 'Medium',
          description: 'Potential delay in grant funding',
          impact: 'Could affect Q2 equipment purchases',
          mitigation: 'Diversified funding sources and flexible timeline'
        },
        {
          type: 'Low',
          description: 'Equipment maintenance costs',
          impact: 'May exceed projected maintenance budget',
          mitigation: 'Preventive maintenance schedule and vendor contracts'
        },
        {
          type: 'High',
          description: 'Staff recruitment challenges',
          impact: 'Could delay program expansion',
          mitigation: 'Early recruitment and competitive compensation packages'
        }
      ]
    }
  };

  const currentData = prognosisData[2025];
  const totalGrowth = currentData.categories.reduce((sum, cat) => sum + cat.growth, 0) / currentData.categories.length;

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <ArrowUp className="w-4 h-4 text-green-500" /> : 
      <ArrowDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Budget Prognosis & Projections
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Forward-looking financial analysis and projections for the Digital Arts Lab program growth and sustainability.
          </p>
          
          {/* Year Selector */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={selectedYear === '2025' ? 'default' : 'outline'}
              onClick={() => setSelectedYear('2025')}
            >
              2025 Projections
            </Button>
            <Button
              variant={selectedYear === '2026' ? 'default' : 'outline'}
              onClick={() => setSelectedYear('2026')}
              disabled
            >
              2026 Outlook
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projected Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${currentData.totalBudget.toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">Projected Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${currentData.projectedRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Growth</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalGrowth.toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Investment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(currentData.totalBudget - currentData.projectedRevenue).toLocaleString()}
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={selectedView === 'projections' ? 'default' : 'outline'}
            onClick={() => setSelectedView('projections')}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Category Projections
          </Button>
          <Button
            variant={selectedView === 'quarterly' ? 'default' : 'outline'}
            onClick={() => setSelectedView('quarterly')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Quarterly Outlook
          </Button>
          <Button
            variant={selectedView === 'risks' ? 'default' : 'outline'}
            onClick={() => setSelectedView('risks')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk Analysis
          </Button>
        </div>

        {/* Category Projections */}
        {selectedView === 'projections' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Budget Growth Projections</CardTitle>
                <CardDescription>
                  Year-over-year growth analysis by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentData.categories.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTrendIcon(category.trend)}
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          +{category.growth}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Current: ${category.current.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Projected: ${category.projected.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <strong>Rationale:</strong> {category.justification}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Visualization</CardTitle>
                <CardDescription>
                  Visual representation of projected budget growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.categories.map((category, index) => {
                    const maxValue = Math.max(...currentData.categories.map(c => c.projected));
                    const width = (category.projected / maxValue) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category.name}</span>
                          <span>${category.projected.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                            style={{ width: `${width}%` }}
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

        {/* Quarterly Outlook */}
        {selectedView === 'quarterly' && (
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Financial Outlook</CardTitle>
              <CardDescription>
                Month-by-month budget and revenue projections for 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Quarter</th>
                      <th className="text-right py-3 px-4">Budget</th>
                      <th className="text-right py-3 px-4">Projected Revenue</th>
                      <th className="text-right py-3 px-4">Net Position</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.quarterlyProjections.map((quarter, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium">{quarter.quarter}</td>
                        <td className="py-3 px-4 text-right">${quarter.budget.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">${quarter.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-red-600">
                          ${quarter.net.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="bg-orange-100 text-orange-800">
                            <Target className="w-3 h-3 mr-1" />
                            Investment Phase
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Analysis */}
        {selectedView === 'risks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.risks.map((risk, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Risk Assessment</CardTitle>
                    <Badge className={getRiskColor(risk.type)}>
                      {risk.type} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 text-sm">{risk.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Potential Impact</h4>
                      <p className="text-gray-600 text-sm">{risk.impact}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Mitigation Strategy</h4>
                      <p className="text-gray-600 text-sm">{risk.mitigation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Strategic Recommendations */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Strategic Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Revenue Diversification</h3>
                </div>
                <p className="text-gray-600">
                  Focus on expanding revenue streams through corporate partnerships, 
                  advanced workshop pricing, and grant opportunities to reduce dependency on core funding.
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
                  Prioritize technology investments that directly impact program capacity 
                  and quality, ensuring maximum return on investment for community impact.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">Risk Management</h3>
                </div>
                <p className="text-gray-600">
                  Implement proactive risk management strategies including 
                  diversified funding sources and flexible program timelines to ensure sustainability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}