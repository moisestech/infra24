'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Infra24Logo } from '@/components/ui/Infra24Logo';
import { 
  Monitor, 
  FileText, 
  Calendar, 
  BarChart3, 
  Users, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Smartphone
} from 'lucide-react';

export default function ProductsPage() {
  const products = [
    {
      id: 'smartsign',
      name: 'SmartSign',
      description: 'Intelligent digital signage for announcements, events, and community engagement',
      icon: Monitor,
      color: 'blue',
      features: [
        'Dynamic content display',
        'Event scheduling',
        'Community engagement',
        'Analytics & insights'
      ],
      pricing: 'Starting at $99/month',
      popular: true,
      href: '/product/smartsign'
    },
    {
      id: 'submissions',
      name: 'Submissions',
      description: 'Streamline application and submission processes with powerful form management',
      icon: FileText,
      color: 'green',
      features: [
        'Dynamic form builder',
        'Submission management',
        'Analytics dashboard',
        'Secure & compliant'
      ],
      pricing: 'Starting at $49/month',
      popular: false,
      href: '/product/submissions'
    },
    {
      id: 'bookings',
      name: 'Bookings',
      description: 'Complete booking system for workshops, equipment, and space management',
      icon: Calendar,
      color: 'purple',
      features: [
        'Workshop scheduling',
        'Equipment booking',
        'Space management',
        'QR check-ins'
      ],
      pricing: 'Starting at $79/month',
      popular: false,
      href: '/product/bookings'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Comprehensive analytics and reporting for cultural organizations',
      icon: BarChart3,
      color: 'orange',
      features: [
        'KPI tracking',
        'Custom reports',
        'Data visualization',
        'Export capabilities'
      ],
      pricing: 'Starting at $59/month',
      popular: false,
      href: '/product/analytics'
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: 'Multi-Tenant Architecture',
      description: 'One platform, multiple organizations. Each tenant gets their own branded experience.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with data isolation and compliance built-in.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for performance with sub-2-second load times globally.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First',
      description: 'Designed for mobile with responsive interfaces and native app feel.'
    }
  ];

  const testimonials = [
    {
      name: 'Bakehouse Art Complex',
      role: 'Miami, FL',
      content: 'SmartSign has transformed how we communicate with our community. Setup was effortless and the results speak for themselves.',
      rating: 5
    },
    {
      name: 'Oolite Arts',
      role: 'Miami, FL',
      content: 'The booking system has streamlined our workshop management and the analytics help us make data-driven decisions.',
      rating: 5
    },
    {
      name: 'Edge Zones',
      role: 'Miami, FL',
      content: 'Infra24 has given us the tools to scale our digital presence while maintaining our unique brand identity.',
      rating: 5
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          accent: 'text-blue-600'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700',
          accent: 'text-green-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700',
          accent: 'text-purple-600'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-600',
          button: 'bg-orange-600 hover:bg-orange-700',
          accent: 'text-orange-600'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700',
          accent: 'text-gray-600'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Infra24Logo size="xl" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Infra24 Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive digital infrastructure solutions designed specifically for 
            cultural organizations, art spaces, and community centers.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View All Products
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Product Suite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => {
              const Icon = product.icon;
              const colors = getColorClasses(product.color);
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  {product.popular && (
                    <div className="absolute -top-3 left-6">
                      <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${colors.bg} rounded-lg`}>
                        <Icon className={`w-8 h-8 ${colors.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600">{product.pricing}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={product.href}>
                      <Button className={`w-full ${colors.button}`}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Infra24?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Cultural Organizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the cultural organizations already using Infra24 to streamline 
            their operations and engage their communities.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

