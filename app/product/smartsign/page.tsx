'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Infra24Logo } from '@/components/ui/Infra24Logo';
import { 
  Monitor, 
  Calendar, 
  Users, 
  BarChart3, 
  Zap, 
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  Settings,
  Smartphone,
  Tv
} from 'lucide-react';

export default function SmartSignProductPage() {
  const features = [
    {
      icon: Monitor,
      title: 'Digital Signage',
      description: 'Dynamic content display with real-time updates'
    },
    {
      icon: Calendar,
      title: 'Event Scheduling',
      description: 'Automated event announcements and calendar integration'
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'Interactive displays that connect with your audience'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track engagement and optimize your messaging'
    }
  ];

  const benefits = [
    'Reduce manual announcement updates by 90%',
    'Increase event attendance by 25%',
    'Improve community engagement metrics',
    'Streamline communication workflows',
    'Professional, modern appearance',
    'Cost-effective digital transformation'
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small organizations',
      features: [
        '1 Digital Display',
        'Basic Content Management',
        'Event Scheduling',
        'Email Support',
        'Standard Templates'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$199',
      period: '/month',
      description: 'Ideal for growing organizations',
      features: [
        'Up to 3 Digital Displays',
        'Advanced Content Management',
        'Custom Branding',
        'Analytics Dashboard',
        'Priority Support',
        'API Access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$399',
      period: '/month',
      description: 'For large organizations with multiple locations',
      features: [
        'Unlimited Displays',
        'Multi-location Management',
        'Custom Integrations',
        'Advanced Analytics',
        'Dedicated Support',
        'White-label Options'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Infra24Logo size="xl" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            SmartSign
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your organization's communication with intelligent digital signage. 
            Display announcements, events, and community updates with professional, 
            automated content management.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
            <Button size="lg" variant="outline">
              <Settings className="w-5 h-5 mr-2" />
              Try Free
            </Button>
          </div>
        </div>

        {/* Hero Image/Video Placeholder */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Tv className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">SmartSign in Action</h3>
                <p className="text-blue-100">Interactive demo coming soon</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Modern Organizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
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

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose SmartSign?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                SmartSign isn't just digital signage—it's a complete communication 
                platform designed specifically for cultural organizations, art spaces, 
                and community centers.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mobile-First Design
                </h3>
                <p className="text-gray-600 mb-6">
                  Manage your displays from anywhere with our intuitive mobile app
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>✓ Real-time content updates</div>
                  <div>✓ Remote display management</div>
                  <div>✓ Instant emergency announcements</div>
                  <div>✓ Offline content caching</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
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
                    className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
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
            Ready to Transform Your Communication?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join organizations like Bakehouse Art Complex, Oolite Arts, and Edge Zones 
            who are already using SmartSign to engage their communities.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
