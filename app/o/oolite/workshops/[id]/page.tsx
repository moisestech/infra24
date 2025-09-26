'use client';

import React, { Suspense } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Clock, Users, Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getWorkshopById } from '@/lib/workshops/shared-workshops';

function WorkshopDetailPageContent() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const params = useParams();
  const workshopId = params.id as string;
  
  const workshop = getWorkshopById(workshopId);

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

  if (tenantId !== 'oolite') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible for Oolite Arts.</p>
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-gray-50">
          <UnifiedNavigation config={ooliteConfig} userRole="admin" />
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Workshop Not Found</h1>
              <p className="text-gray-600 mb-8">The workshop you're looking for doesn't exist.</p>
              <Link href="/o/oolite/workshops">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Workshops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/o/oolite/workshops">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workshops
              </Button>
            </Link>
          </div>

          {/* Workshop Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default">Digital Arts</Badge>
              <Badge variant="default">Workshop</Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{workshop.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{workshop.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {workshop.duration}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                0/{workshop.maxParticipants} participants
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Next session: TBD
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Instructor: {workshop.instructor}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Workshop Content</CardTitle>
                  <CardDescription>Detailed information about this workshop</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {workshop.description}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration */}
              <Card>
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Available Spots:</span>
                      <span className="font-semibold">
                        {workshop.maxParticipants}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <Badge variant="default">Beginner</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <Button className="w-full" disabled={false}>
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Basic computer skills
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Interest in digital arts
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      No prior experience required
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact the instructor or our team for more information.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Instructor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}

export default function WorkshopDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkshopDetailPageContent />
    </Suspense>
  );
}