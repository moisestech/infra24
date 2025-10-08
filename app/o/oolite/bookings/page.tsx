'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { ResourceCalendar } from '@/components/booking/ResourceCalendar';
import { BookingForm } from '@/components/booking/BookingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, Clock, MapPin, X, Monitor, Building, GraduationCap, User, Globe } from 'lucide-react';
import { Resource, Booking, CreateBookingRequest } from '@/types/booking';
import { PageFooter } from '@/components/common/PageFooter';

interface LocalBooking {
  id: string;
  resource_id: string;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_by_clerk_id: string;
}

function OoliteBookingsPageContent() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<LocalBooking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<LocalBooking | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingType, setBookingType] = useState<'equipment' | 'space' | 'workshop' | 'person'>('equipment');
  const [preSelectedResource, setPreSelectedResource] = useState<string | null>(null);

  // Oolite theme colors
  const ooliteColors = {
    primary: '#47abc4',
    primaryLight: '#6bb8d1',
    primaryDark: '#3a8ba3',
    primaryAlpha: 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
  };

  useEffect(() => {
    if (tenantId === 'oolite') {
      fetchBookings();
    }
  }, [tenantId]);

  // Handle URL parameters for booking type and pre-selection
  useEffect(() => {
    const type = searchParams.get('type') as 'equipment' | 'space' | 'workshop' | 'person';
    const equipment = searchParams.get('equipment');
    const space = searchParams.get('space');
    const workshop = searchParams.get('workshop');
    const person = searchParams.get('person');

    if (type && ['equipment', 'space', 'workshop', 'person'].includes(type)) {
      setBookingType(type);
    }

    if (equipment) {
      setPreSelectedResource(equipment);
      setBookingType('equipment');
    } else if (space) {
      setPreSelectedResource(space);
      setBookingType('space');
    } else if (workshop) {
      setPreSelectedResource(workshop);
      setBookingType('workshop');
    } else if (person) {
      setPreSelectedResource(person);
      setBookingType('person');
    }
  }, [searchParams]);

  // Helper function to check if a booking is currently active
  const isBookingCurrentlyActive = (booking: LocalBooking): boolean => {
    const now = new Date();
    return booking.status === 'confirmed' && 
           now >= booking.start_time && 
           now <= booking.end_time;
  };

  // Helper function to check if a resource is available now
  const isResourceAvailableNow = (resource: Resource, bookings: LocalBooking[]): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check if within business hours (9 AM - 6 PM, Monday-Friday)
    const isBusinessHours = currentHour >= 9 && currentHour < 18 && 
                           now.getDay() >= 1 && now.getDay() <= 5;
    
    if (!isBusinessHours) return false;
    
    // Check if resource has any active bookings
    const hasActiveBooking = bookings.some(booking => 
      booking.resource_id === resource.id && isBookingCurrentlyActive(booking)
    );
    
    return !hasActiveBooking;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting fetchBookings...');
      
      // Fetch real resources from database
      console.log('📦 Fetching resources from API...');
      const resourcesUrl = `/api/organizations/2133fe94-fb12-41f8-ab37-ea4acd4589f6/resources`;
      console.log('📦 Resources URL:', resourcesUrl);
      
      const resourcesResponse = await fetch(resourcesUrl);
      console.log('📦 Resources response status:', resourcesResponse.status);
      console.log('📦 Resources response ok:', resourcesResponse.ok);
      
      if (!resourcesResponse.ok) {
        const errorText = await resourcesResponse.text();
        console.error('📦 Resources API error:', errorText);
        throw new Error(`Failed to fetch resources: ${resourcesResponse.status} - ${errorText}`);
      }
      
      const resourcesData = await resourcesResponse.json();
      console.log('📦 Resources data:', resourcesData);
      const realResources: Resource[] = resourcesData.resources || [];
      console.log('📦 Parsed resources:', realResources);
      
      // Fetch real bookings from database
      console.log('📅 Fetching bookings from API...');
      const bookingsUrl = `/api/organizations/2133fe94-fb12-41f8-ab37-ea4acd4589f6/bookings`;
      console.log('📅 Bookings URL:', bookingsUrl);
      
      const bookingsResponse = await fetch(bookingsUrl);
      console.log('📅 Bookings response status:', bookingsResponse.status);
      console.log('📅 Bookings response ok:', bookingsResponse.ok);
      
      if (!bookingsResponse.ok) {
        const errorText = await bookingsResponse.text();
        console.error('📅 Bookings API error:', errorText);
        throw new Error(`Failed to fetch bookings: ${bookingsResponse.status} - ${errorText}`);
      }
      
      const bookingsData = await bookingsResponse.json();
      console.log('📅 Bookings data:', bookingsData);
      const realBookings: LocalBooking[] = (bookingsData.bookings || []).map((booking: any) => ({
        id: booking.id,
        title: booking.title || 'Untitled Booking',
        description: booking.description || '',
        start_time: new Date(booking.start_time),
        end_time: new Date(booking.end_time),
        status: booking.status,
        resource_id: booking.resource_id,
        created_by_clerk_id: booking.created_by_clerk_id
      }));
      console.log('📅 Parsed bookings:', realBookings);
      
      // Debug logging
      console.log('📊 Booking Stats Debug:');
      console.log(`- Total Resources: ${realResources.length}`);
      console.log(`- Total Bookings: ${realBookings.length}`);
      console.log(`- Currently Active Bookings: ${realBookings.filter(isBookingCurrentlyActive).length}`);
      console.log(`- Available Now: ${realResources.filter(resource => isResourceAvailableNow(resource, realBookings)).length}`);
      console.log(`- Current Time: ${new Date().toLocaleString()}`);
      
      setResources(realResources);
      setBookings(realBookings);
      console.log('✅ fetchBookings completed successfully');
    } catch (err) {
      console.error('❌ Error in fetchBookings:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : 'Unknown'
      });
    } finally {
      setLoading(false);
      console.log('🏁 fetchBookings finished (loading set to false)');
    }
  };

  const handleCreateBooking = () => {
    setShowBookingForm(true);
  };

  const handleBookingTypeSelect = (type: 'equipment' | 'space' | 'workshop' | 'person') => {
    setBookingType(type);
    setPreSelectedResource(null);
    setShowBookingForm(true);
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment': return <Monitor className="w-5 h-5" />;
      case 'space': return <Building className="w-5 h-5" />;
      case 'workshop': return <GraduationCap className="w-5 h-5" />;
      case 'person': return <User className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getBookingTypeDescription = (type: string) => {
    switch (type) {
      case 'equipment': return 'Book digital lab equipment like VR headsets, 3D printers, cameras, and more';
      case 'space': return 'Reserve collaborative workspaces, meeting rooms, and studio spaces';
      case 'workshop': return 'Join workshops, training sessions, and educational programs';
      case 'person': return 'Book time with artists, mentors, and specialists';
      default: return 'Create a new booking';
    }
  };

  const handleBookingCreated = async (booking: CreateBookingRequest) => {
    // Create a new booking with a temporary ID
    const newBooking: LocalBooking = {
      id: Date.now().toString(),
      resource_id: booking.resourceId,
      title: booking.title,
      description: booking.description,
      start_time: new Date(booking.startTime),
      end_time: new Date(booking.endTime),
      status: 'pending',
      created_by_clerk_id: 'temp-user'
    };
    setBookings(prev => [newBooking, ...prev]);
    setShowBookingForm(false);
  };

  const handleBookingClick = (booking: LocalBooking) => {
    setSelectedBooking(booking);
  };

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

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: ooliteColors.primaryAlpha }}>
                <Calendar className="w-8 h-8" style={{ color: ooliteColors.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Booking System
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Book time on our XR & Technology equipment, workshops, spaces, and connect with people
                </p>
              </div>
            </div>
          </div>

          {/* Booking Type Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What would you like to book?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  bookingType === 'equipment' 
                    ? 'ring-2' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: bookingType === 'equipment' ? ooliteColors.primaryAlpha : undefined
                }}
                onClick={() => handleBookingTypeSelect('equipment')}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: ooliteColors.primaryAlpha }}>
                      <Monitor className="w-8 h-8" style={{ color: ooliteColors.primary }} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Equipment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Book digital lab equipment like VR headsets, 3D printers, cameras, and more
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  bookingType === 'space' 
                    ? 'ring-2' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: bookingType === 'space' ? ooliteColors.primaryAlpha : undefined
                }}
                onClick={() => handleBookingTypeSelect('space')}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: ooliteColors.primaryAlpha }}>
                      <Building className="w-8 h-8" style={{ color: ooliteColors.primary }} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Spaces</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reserve collaborative workspaces, meeting rooms, and studio spaces
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  bookingType === 'workshop' 
                    ? 'ring-2' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: bookingType === 'workshop' ? ooliteColors.primaryAlpha : undefined
                }}
                onClick={() => handleBookingTypeSelect('workshop')}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: ooliteColors.primaryAlpha }}>
                      <GraduationCap className="w-8 h-8" style={{ color: ooliteColors.primary }} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Workshops</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Join workshops, training sessions, and educational programs
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  bookingType === 'person' 
                    ? 'ring-2' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: bookingType === 'person' ? ooliteColors.primaryAlpha : undefined
                }}
                onClick={() => handleBookingTypeSelect('person')}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: ooliteColors.primaryAlpha }}>
                      <User className="w-8 h-8" style={{ color: ooliteColors.primary }} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">People</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Book time with artists, mentors, and specialists
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Live Availability Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Live Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Currently Booked</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {bookings.filter(isBookingCurrentlyActive).length}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Resources in use right now</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Now</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {resources.filter(resource => isResourceAvailableNow(resource, bookings)).length}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {resources.filter(resource => isResourceAvailableNow(resource, bookings)).length > 0 
                          ? 'Ready to book immediately' 
                          : 'Check back during business hours (Mon-Fri, 9AM-6PM)'}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Form Modal */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create New Booking</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {getBookingTypeDescription(bookingType)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBookingForm(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <BookingForm
                    organizationId="2133fe94-fb12-41f8-ab37-ea4acd4589f6"
                    resources={resources}
                    onSubmit={handleBookingCreated}
                    onCancel={() => setShowBookingForm(false)}
                    bookingType={bookingType}
                    preSelectedResource={preSelectedResource}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Booking Actions */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Booking Calendar</h2>
            <Button 
              onClick={handleCreateBooking}
              className="text-white transition-colors"
              style={{ 
                backgroundColor: '#47abc4'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#3a9bb3'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#47abc4'}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Booking
            </Button>
          </div>

          {/* Booking Calendar */}
          <div className="mb-8">
            <ResourceCalendar
              orgId="2133fe94-fb12-41f8-ab37-ea4acd4589f6"
              onBookingCreate={handleBookingCreated}
            />
          </div>

          {/* Selected Booking Details */}
          {selectedBooking && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Detailed information about the selected booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">{selectedBooking.title}</h3>
                    {selectedBooking.description && (
                      <p className="text-gray-600 mb-4">{selectedBooking.description}</p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {new Date(selectedBooking.start_time).toLocaleString()} - 
                          {new Date(selectedBooking.end_time).toLocaleString()}
                        </span>
                      </div>
                      
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {selectedBooking.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className="text-white transition-colors"
                        style={{ 
                          backgroundColor: '#47abc4'
                        }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#3a9bb3'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#47abc4'}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="transition-colors"
                        style={{ 
                          borderColor: '#47abc4',
                          color: '#47abc4'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#f0f9ff';
                          (e.target as HTMLElement).style.borderColor = '#3a9bb3';
                          (e.target as HTMLElement).style.color = '#3a9bb3';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = 'transparent';
                          (e.target as HTMLElement).style.borderColor = '#47abc4';
                          (e.target as HTMLElement).style.color = '#47abc4';
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Policy Section */}
        <div className="mt-16">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white text-center">Lab Guidelines & Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Booking Policy</h3>
                  <p className="text-gray-600 dark:text-gray-400">Equipment can be booked up to 2 weeks in advance. Maximum 4 hours per session. Cancellations must be made 24 hours in advance.</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Safety First</h3>
                  <p className="text-gray-600 dark:text-gray-400">All users must complete safety training before using equipment. Follow all posted guidelines and ask staff for assistance when needed.</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Use</h3>
                  <p className="text-gray-600 dark:text-gray-400">Respect other users and maintain a collaborative environment. Clean up after yourself and report any equipment issues immediately.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Page Footer */}
          <PageFooter 
            organizationSlug="oolite"
            showGetStarted={true}
            showGuidelines={false}
            showTerms={true}
          />
        </div>
      </div>
    </TenantLayout>
  );
}

export default function OoliteBookingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OoliteBookingsPageContent />
    </Suspense>
  );
}
