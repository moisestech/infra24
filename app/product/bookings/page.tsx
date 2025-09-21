'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Infra24Logo } from '@/components/ui/Infra24Logo';
import { 
  Calendar, 
  Clock, 
  Users, 
  QrCode, 
  CheckCircle,
  ArrowRight,
  Play,
  Settings,
  Smartphone,
  Zap,
  BarChart3,
  Shield
} from 'lucide-react';

export default function BookingsProductPage() {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent booking system with conflict detection and availability management'
    },
    {
      icon: QrCode,
      title: 'QR Check-ins',
      description: 'Seamless check-in process with QR codes and mobile integration'
    },
    {
      icon: Users,
      title: 'Participant Management',
      description: 'Track attendance, manage waitlists, and handle capacity limits'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive insights into booking patterns and resource utilization'
    }
  ];

  const useCases = [
    {
      title: 'Workshop Bookings',
      description: 'Manage workshop registrations with capacity limits and waitlists',
      icon: Users
    },
    {
      title: 'Equipment Reservations',
      description: 'Book equipment, tools, and resources with availability tracking',
      icon: Settings
    },
    {
      title: 'Space Management',
      description: 'Reserve studios, meeting rooms, and event spaces',
      icon: Calendar
    },
    {
      title: 'Event Registration',
      description: 'Handle event sign-ups with payment processing and confirmations',
      icon: CheckCircle
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Create Resources',
      description: 'Set up workshops, equipment, and spaces with availability rules',
      icon: Settings
    },
    {
      step: 2,
      title: 'Configure Booking Rules',
      description: 'Define capacity limits, booking windows, and cancellation policies',
      icon: Shield
    },
    {
      step: 3,
      title: 'Accept Bookings',
      description: 'Participants book resources with automatic confirmations',
      icon: Calendar
    },
    {
      step: 4,
      title: 'Manage & Track',
      description: 'Monitor attendance, handle check-ins, and generate reports',
      icon: BarChart3
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$79',
      period: '/month',
      description: 'Perfect for small organizations',
      features: [
        'Up to 10 Resources',
        '100 Bookings/Month',
        'Basic Analytics',
        'Email Support',
        'QR Check-ins'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$149',
      period: '/month',
      description: 'Ideal for growing organizations',
      features: [
        'Unlimited Resources',
        '1,000 Bookings/Month',
        'Advanced Analytics',
        'Custom Branding',
        'Priority Support',
        'API Access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Infra24Logo size="xl" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bookings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Streamline your organization's booking and reservation system. From workshops 
            and equipment to spaces and events, manage it all with intelligent scheduling 
            and seamless check-ins.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
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
            <div className="aspect-video bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Calendar className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Smart Booking Management</h3>
                <p className="text-purple-100">Interactive demo coming soon</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Smart Bookings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-purple-600" />
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
            Perfect for Every Booking Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon className="w-6 h-6 text-purple-600" />
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
                    <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-purple-600" />
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-purple-200 -translate-y-1/2"></div>
                    )}
                  </div>
                  <div className="mb-2">
                    <Badge className="bg-purple-600 text-white">Step {step.step}</Badge>
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

        {/* Mobile Features */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Mobile-First Experience
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our booking system is designed for mobile users first, ensuring 
                your community can easily book resources from anywhere, anytime.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Instant booking confirmations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">QR code check-ins</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Push notifications</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Offline booking support</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Native Mobile App
                </h3>
                <p className="text-gray-600 mb-6">
                  Download our mobile app for the best booking experience
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>✓ iOS and Android support</div>
                  <div>✓ Offline booking capabilities</div>
                  <div>✓ Push notifications</div>
                  <div>✓ Biometric authentication</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Flexible Pricing for Every Organization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Most Popular</Badge>
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
                    className={`w-full ${tier.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
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
            Ready to Streamline Your Bookings?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join organizations worldwide who trust Infra24 Bookings to manage 
            their resources efficiently and provide exceptional user experiences.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
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

