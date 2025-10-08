'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Infra24Logo } from '@/components/ui/Infra24Logo';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle,
  ArrowRight,
  Play,
  Settings,
  Download,
  Filter,
  Eye,
  Zap
} from 'lucide-react';

export default function AnalyticsProductPage() {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Dashboards',
      description: 'Live insights into your organization\'s performance and engagement'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Identify patterns and trends in your data with advanced analytics'
    },
    {
      icon: Users,
      title: 'Audience Insights',
      description: 'Understand your community with detailed demographic and behavior data'
    },
    {
      icon: Calendar,
      title: 'Event Analytics',
      description: 'Track event performance, attendance, and engagement metrics'
    }
  ];

  const metrics = [
    {
      title: 'Engagement Metrics',
      description: 'Track how your community interacts with your content and events',
      icon: Users,
      examples: ['Page views', 'Event attendance', 'Social media engagement', 'Newsletter opens']
    },
    {
      title: 'Financial Analytics',
      description: 'Monitor revenue, donations, and financial performance',
      icon: TrendingUp,
      examples: ['Revenue tracking', 'Donation analytics', 'Cost analysis', 'ROI measurement']
    },
    {
      title: 'Operational Insights',
      description: 'Optimize your operations with data-driven insights',
      icon: Settings,
      examples: ['Resource utilization', 'Staff performance', 'Process efficiency', 'Capacity planning']
    },
    {
      title: 'Community Growth',
      description: 'Measure and understand your community expansion',
      icon: BarChart3,
      examples: ['Member growth', 'Retention rates', 'Geographic expansion', 'Demographic trends']
    }
  ];

  const reportTypes = [
    {
      title: 'Executive Summary',
      description: 'High-level overview for board members and stakeholders',
      frequency: 'Monthly',
      icon: Eye
    },
    {
      title: 'Operational Report',
      description: 'Detailed metrics for day-to-day operations',
      frequency: 'Weekly',
      icon: Settings
    },
    {
      title: 'Financial Report',
      description: 'Comprehensive financial performance analysis',
      frequency: 'Monthly',
      icon: TrendingUp
    },
    {
      title: 'Community Report',
      description: 'Engagement and growth metrics for your community',
      frequency: 'Bi-weekly',
      icon: Users
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$59',
      period: '/month',
      description: 'Perfect for small organizations',
      features: [
        'Basic Dashboards',
        '5 Custom Reports',
        'Email Reports',
        'Standard Support',
        'Data Export'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$119',
      period: '/month',
      description: 'Ideal for growing organizations',
      features: [
        'Advanced Dashboards',
        'Unlimited Reports',
        'Custom Metrics',
        'Priority Support',
        'API Access',
        'White-label Reports'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$249',
      period: '/month',
      description: 'For large organizations with complex needs',
      features: [
        'Custom Dashboards',
        'Advanced Analytics',
        'Custom Integrations',
        'Dedicated Support',
        'Data Warehouse',
        'Predictive Analytics'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Infra24Logo size="xl" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your organization's data into actionable insights. Track performance, 
            understand your community, and make data-driven decisions with comprehensive 
            analytics and reporting.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
            <Button size="lg" variant="outline">
              <Settings className="w-5 h-5 mr-2" />
              Try Free
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
              <div className="text-center text-white">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Data-Driven Insights</h3>
                <p className="text-orange-100">Interactive demo coming soon</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Analytics Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Metrics Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Track What Matters Most
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {metric.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {metric.description}
                        </p>
                        <div className="space-y-1">
                          {metric.examples.map((example, exampleIndex) => (
                            <div key={exampleIndex} className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{example}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Report Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Automated Reporting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((report, index) => {
              const Icon = report.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {report.description}
                    </p>
                    <Badge variant="default" className="text-xs">
                      {report.frequency}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Data Export & Integration */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Export & Integrate
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Export your data in multiple formats and integrate with your existing 
                tools and workflows for seamless data management.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">CSV, Excel, PDF exports</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">API access for custom integrations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Automated report scheduling</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">White-label reporting</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <Download className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Flexible Data Access
                </h3>
                <p className="text-gray-600 mb-6">
                  Access your data however you need it
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>✓ Real-time API endpoints</div>
                  <div>✓ Scheduled data exports</div>
                  <div>✓ Custom report builder</div>
                  <div>✓ Third-party integrations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Analytics Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-orange-500' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make Data-Driven Decisions?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join organizations worldwide who trust Infra24 Analytics to transform 
            their data into actionable insights and drive better outcomes.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

