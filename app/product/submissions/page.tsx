'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Infra24Logo } from '@/components/ui/Infra24Logo';
import { 
  FileText, 
  Users, 
  BarChart3, 
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Calendar,
  ArrowRight,
  Play,
  Settings,
  Database,
  Shield,
  Zap
} from 'lucide-react';

export default function SubmissionsProductPage() {
  const features = [
    {
      icon: FileText,
      title: 'Dynamic Form Builder',
      description: 'Create custom forms with drag-and-drop interface'
    },
    {
      icon: Users,
      title: 'Submission Management',
      description: 'Review, approve, and track all submissions in one place'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Gain insights into submission patterns and trends'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with data protection compliance'
    }
  ];

  const useCases = [
    {
      title: 'Artist Applications',
      description: 'Streamline artist residency and exhibition applications',
      icon: Users
    },
    {
      title: 'Workshop Registration',
      description: 'Manage workshop sign-ups and participant information',
      icon: Calendar
    },
    {
      title: 'Grant Applications',
      description: 'Collect and review grant proposals efficiently',
      icon: FileText
    },
    {
      title: 'Community Feedback',
      description: 'Gather feedback through surveys and forms',
      icon: BarChart3
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Create Form',
      description: 'Build custom forms with our intuitive form builder',
      icon: Settings
    },
    {
      step: 2,
      title: 'Collect Submissions',
      description: 'Share forms and collect responses automatically',
      icon: Database
    },
    {
      step: 3,
      title: 'Review & Approve',
      description: 'Review submissions with built-in approval workflows',
      icon: Eye
    },
    {
      step: 4,
      title: 'Analyze Results',
      description: 'Gain insights with comprehensive analytics',
      icon: BarChart3
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for small organizations',
      features: [
        'Up to 5 Forms',
        '100 Submissions/Month',
        'Basic Analytics',
        'Email Support',
        'Standard Templates'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing organizations',
      features: [
        'Unlimited Forms',
        '1,000 Submissions/Month',
        'Advanced Analytics',
        'Custom Branding',
        'Priority Support',
        'API Access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large organizations with complex needs',
      features: [
        'Unlimited Everything',
        'Advanced Workflows',
        'Custom Integrations',
        'Dedicated Support',
        'White-label Options',
        'SSO Integration'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Infra24Logo size="xl" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Submissions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Streamline your application and submission processes with our powerful 
            form builder and management system. From artist applications to workshop 
            registrations, handle it all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
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
            <div className="aspect-video bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
              <div className="text-center text-white">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Submission Management Made Simple</h3>
                <p className="text-green-100">Interactive demo coming soon</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Manage Submissions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-green-600" />
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

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perfect for Cultural Organizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {useCase.title}
                        </h3>
                        <p className="text-gray-600">
                          {useCase.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Workflow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple 4-Step Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-green-200 -translate-y-1/2"></div>
                    )}
                  </div>
                  <div className="mb-2">
                    <Badge className="bg-green-600 text-white">Step {step.step}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Flexible Pricing for Every Organization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-green-500' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white">Most Popular</Badge>
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
                    className={`w-full ${tier.popular ? 'bg-green-600 hover:bg-green-700' : ''}`}
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
            Ready to Streamline Your Submissions?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join organizations worldwide who trust Infra24 Submissions to manage 
            their application processes efficiently and professionally.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
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

