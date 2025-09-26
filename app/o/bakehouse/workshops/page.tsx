'use client';

import React from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import { getWorkshopsForOrganization, getWorkshopCategories } from '@/lib/workshops/shared-workshops';

export default function BakehouseWorkshopsPage() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const workshops = getWorkshopsForOrganization('bakehouse');
  const categories = getWorkshopCategories();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (tenantId !== 'bakehouse') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible for Bakehouse Art Complex.</p>
        </div>
      </div>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={bakehouseConfig} userRole="admin" />
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
          <div className="container mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Bakehouse Digital Arts Workshops
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Comprehensive workshop series covering AI, 3D printing, creative coding, and more. 
                Join our community of digital artists and creators.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  View All Workshops
                </Button>
                <Button size="lg" variant="outline">
                  Register Interest
                </Button>
              </div>
            </div>

            {/* Workshop Categories */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Workshop Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => {
                  const count = workshops.filter(w => w.category === category).length;
                  const colors = [
                    'bg-red-100 text-red-800',
                    'bg-orange-100 text-orange-800', 
                    'bg-yellow-100 text-yellow-800',
                    'bg-pink-100 text-pink-800'
                  ];
                  return (
                    <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{category}</h3>
                        <Badge className={colors[index % colors.length]}>{count} workshops</Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Featured Workshops */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Featured Workshops
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {workshops.map((workshop) => (
                  <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">{workshop.title}</CardTitle>
                        <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <CardDescription>{workshop.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Workshop Details */}
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {workshop.duration}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            0/{workshop.maxParticipants || 'N/A'} participants
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Next: TBD
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="default" className="text-xs">
                            Digital Arts
                          </Badge>
                        </div>

                        {/* Level and Availability */}
                        <div className="flex justify-between items-center">
                          <Badge variant="default">Beginner</Badge>
                          <span className="text-sm text-gray-600">
                            {workshop.maxParticipants || 'N/A'} spots available
                          </span>
                        </div>

                        {/* Action Button */}
                        <Link href={`/o/bakehouse/workshops/${workshop.id}`}>
                          <Button className="w-full">
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Start Your Digital Arts Journey?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join our community of digital artists and creators. All skill levels welcome.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Browse All Workshops
                </Button>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}

