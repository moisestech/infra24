'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

export default function OoliteImpactROIPage() {
  const [selectedMetric, setSelectedMetric] = useState('community-impact');
  const [selectedTimeframe, setSelectedTimeframe] = useState('12-months');

  const kpis = [
    {
      title: 'Community Engagement',
      value: '300+',
      change: '+150%',
      trend: 'up',
      description: 'Active participants in digital arts programs',
      icon: Users
    },
    {
      title: 'Revenue Generated',
      value: '$45,000',
      change: '+200%',
      trend: 'up',
      description: 'Workshop fees and program revenue',
      icon: DollarSign
    },
    {
      title: 'Staff Efficiency',
      value: '85%',
      change: '+40%',
      trend: 'up',
      description: 'Staff adoption of digital tools',
      icon: TrendingUp
    },
    {
      title: 'Program Completion',
      value: '92%',
      change: '+15%',
      trend: 'up',
      description: 'Workshop completion rate',
      icon: Target
    }
  ];

  const impactCategories = [
    {
      id: 'community-impact',
      title: 'Community Impact',
      description: 'Measuring social and cultural impact on the Miami arts community',
      metrics: [
        { name: 'Participants Served', current: 300, target: 250, unit: 'people' },
        { name: 'Workshops Conducted', current: 45, target: 30, unit: 'sessions' },
        { name: 'Community Partnerships', current: 8, target: 5, unit: 'organizations' },
        { name: 'Digital Literacy Rate', current: 78, target: 60, unit: '%' }
      ],
      achievements: [
        'Established partnerships with 8 local organizations',
        'Created accessible digital arts education for underserved communities',
        'Launched mentorship program connecting established and emerging artists',
        'Developed bilingual workshop materials for diverse community'
      ]
    },
    {
      id: 'economic-impact',
      title: 'Economic Impact',
      description: 'Financial benefits and cost savings for the organization and community',
      metrics: [
        { name: 'Revenue Generated', current: 45000, target: 25000, unit: '$' },
        { name: 'Cost Savings', current: 12000, target: 8000, unit: '$' },
        { name: 'Grant Funding', current: 60000, target: 40000, unit: '$' },
        { name: 'ROI Percentage', current: 180, target: 120, unit: '%' }
      ],
      achievements: [
        'Generated $45,000 in workshop fees and program revenue',
        'Reduced operational costs by $12,000 through digital automation',
        'Secured $60,000 in additional grant funding',
        'Achieved 180% return on investment'
      ]
    }
  ];

  const currentCategory = impactCategories.find(cat => cat.id === selectedMetric);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Impact & ROI Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive analysis of the Digital Arts Lab's impact on the community, 
            economic benefits, and return on investment for stakeholders.
          </p>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className={
                      kpi.trend === 'up' ? 'bg-green-100 text-green-800' :
                      kpi.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {kpi.change}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {kpi.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {kpi.value}
                  </p>
                  <p className="text-sm text-gray-600">
                    {kpi.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Impact Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Impact Categories
          </h2>
          <div className="flex justify-center gap-4 mb-8">
            {impactCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedMetric === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedMetric(category.id)}
                className="capitalize"
              >
                {category.title}
              </Button>
            ))}
          </div>

          {currentCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{currentCategory.title}</CardTitle>
                <CardDescription className="text-lg">
                  {currentCategory.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Metrics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Key Metrics
                    </h4>
                    <div className="space-y-4">
                      {currentCategory.metrics.map((metric, index) => {
                        const progress = (metric.current / metric.target) * 100;
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{metric.name}</span>
                              <span>{metric.current.toLocaleString()} / {metric.target.toLocaleString()} {metric.unit}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Key Achievements
                    </h4>
                    <div className="space-y-3">
                      {currentCategory.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ROI Summary */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Return on Investment Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Total Investment</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">$150,000</p>
              <p className="text-gray-600">Initial program setup and first year operations</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Total Returns</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">$270,000</p>
              <p className="text-gray-600">Revenue, cost savings, and grant funding</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ROI</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">180%</p>
              <p className="text-gray-600">Return on investment achieved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}