'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { ResourceCalendar } from '@/components/booking/ResourceCalendar';
import { StreamlinedBookingModal } from '@/components/booking/StreamlinedBookingModal';
import { BookingConfirmationModal } from '@/components/booking/BookingConfirmationModal';
import { MobileBookingTypeSelector, BookingType } from '@/components/booking/BookingTypeSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, Clock, MapPin, X, Monitor, Building, GraduationCap, User, Globe } from 'lucide-react';
import { Resource, Booking, CreateBookingRequest } from '@/types/booking';
import { PageFooter } from '@/components/common/PageFooter';
import { useAuth, useUser } from '@clerk/nextjs';

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
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<LocalBooking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<LocalBooking | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Debug modal state changes
  React.useEffect(() => {
    console.log('🔍 Modal state changed: showBookingForm =', showBookingForm)
  }, [showBookingForm]);

  // Log current user information
  React.useEffect(() => {
    console.log('👤 Current User Info:', {
      isSignedIn,
      userId,
      userEmail: user?.emailAddresses?.[0]?.emailAddress,
      userName: user?.fullName || user?.firstName,
      hasUser: !!user
    });
  }, [isSignedIn, userId, user]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationBooking, setConfirmationBooking] = useState<any>(null);
  const [bookingType, setBookingType] = useState<BookingType>('equipment');
  const [preSelectedResource, setPreSelectedResource] = useState<string | null>(null);

  // Generate services based on booking type and available resources
  const getServicesForBookingType = (type: string) => {
    console.log('🔍 getServicesForBookingType: Called with type:', type)
    console.log('🔍 getServicesForBookingType: Available resources:', resources.length)
    console.log('🔍 getServicesForBookingType: Resources by type:', resources.map(r => ({ id: r.id, title: r.title, type: r.type })))
    
    const filteredResources = resources.filter(resource => resource.type === type);
    console.log('🔍 getServicesForBookingType: Filtered resources for type', type, ':', filteredResources.length)
    
    const services = filteredResources.map(resource => ({
      id: resource.id,
      name: resource.title,
      price: 0.00, // All services are free for now
      duration: resource.duration_minutes || 60, // Default to 60 minutes if not specified
      description: resource.description || `Book ${resource.title} for your project`
    }));
    
    console.log('🔍 getServicesForBookingType: Generated services:', services)
    return services;
  };

  const services = getServicesForBookingType(bookingType);
  
  // Fallback services if no resources are available
  const fallbackServices = [
    {
      id: 'fallback-1',
      name: `${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Booking`,
      price: 0.00,
      duration: 60,
      description: `Book ${bookingType} for your project`
    }
  ];
  
  const finalServices = services.length > 0 ? services : fallbackServices;

  // Sample staff data - in a real app, this would come from your API
  const staff = [
    { id: '1', name: 'Sarah Wilson', available: true },
    { id: '2', name: 'Mike Johnson', available: true },
    { id: '3', name: 'Alex Chen', available: false }
  ];

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
    const isActive = booking.status === 'confirmed' && 
           now >= booking.start_time && 
           now <= booking.end_time;
    
    if (isActive) {
      console.log('🟢 Active Booking Found:', {
        id: booking.id,
        title: booking.title,
        status: booking.status,
        start_time: booking.start_time,
        end_time: booking.end_time,
        current_time: now,
        is_within_time: now >= booking.start_time && now <= booking.end_time
      });
    }
    
    return isActive;
  };

  // Helper function to check if a resource is available now
  const isResourceAvailableNow = (resource: Resource, bookings: LocalBooking[]): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check if within business hours (9 AM - 6 PM, Monday-Friday)
    const isBusinessHours = currentHour >= 9 && currentHour < 18 && 
                           now.getDay() >= 1 && now.getDay() <= 5;
    
    if (!isBusinessHours) {
      console.log('🔴 Resource not available - outside business hours:', {
        resource: resource.title,
        current_hour: currentHour,
        current_day: now.getDay(),
        is_business_hours: isBusinessHours
      });
      return false;
    }
    
    // Check if resource has any active bookings
    const resourceBookings = bookings.filter(booking => booking.resource_id === resource.id);
    const hasActiveBooking = resourceBookings.some(booking => isBookingCurrentlyActive(booking));
    
    console.log('🔍 Resource Availability Check:', {
      resource: resource.title,
      resource_id: resource.id,
      total_bookings: resourceBookings.length,
      active_bookings: resourceBookings.filter(isBookingCurrentlyActive).length,
      is_available: !hasActiveBooking,
      current_time: now.toLocaleString()
    });
    
    return !hasActiveBooking;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting fetchBookings...');
      
      // Fetch real resources from database
      console.log('📦 Fetching resources from API...');
      const resourcesUrl = `/api/organizations/cf088ac1-39a5-4948-a72c-d8059c1ab739/resources`;
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
      const bookingsUrl = `/api/organizations/cf088ac1-39a5-4948-a72c-d8059c1ab739/bookings`;
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
      
      // Log resource information for debugging
      console.log('🔧 Available Resources:', realResources.map(r => ({
        id: r.id,
        title: r.title,
        type: r.type,
        is_bookable: r.is_bookable
      })));
      
      // Log detailed booking information for today and tomorrow
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayBookings = realBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate.toDateString() === today.toDateString();
      });
      
      const tomorrowBookings = realBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate.toDateString() === tomorrow.toDateString();
      });
      
      console.log('📅 Today\'s Bookings:', {
        date: today.toDateString(),
        total: todayBookings.length,
        confirmed: todayBookings.filter(b => b.status === 'confirmed').length,
        pending: todayBookings.filter(b => b.status === 'pending').length,
        bookings: todayBookings.map(b => ({
          id: b.id,
          title: b.title,
          status: b.status,
          start_time: b.start_time.toLocaleString(),
          end_time: b.end_time.toLocaleString()
        }))
      });
      
      console.log('📅 Tomorrow\'s Bookings:', {
        date: tomorrow.toDateString(),
        total: tomorrowBookings.length,
        confirmed: tomorrowBookings.filter(b => b.status === 'confirmed').length,
        pending: tomorrowBookings.filter(b => b.status === 'pending').length,
        bookings: tomorrowBookings.map(b => ({
          id: b.id,
          title: b.title,
          status: b.status,
          start_time: b.start_time.toLocaleString(),
          end_time: b.end_time.toLocaleString()
        }))
      });
      
      // Log detailed information about confirmed bookings
      const confirmedBookings = realBookings.filter(b => b.status === 'confirmed');
      console.log('✅ Confirmed Bookings Details:', {
        total_confirmed: confirmedBookings.length,
        bookings: confirmedBookings.map(b => {
          const now = new Date();
          const isCurrentlyActive = now >= b.start_time && now <= b.end_time;
          return {
            id: b.id,
            title: b.title,
            status: b.status,
            start_time: b.start_time.toLocaleString(),
            end_time: b.end_time.toLocaleString(),
            resource_id: b.resource_id,
            is_currently_active: isCurrentlyActive,
            current_time: now.toLocaleString(),
            time_until_start: b.start_time > now ? `${Math.round((b.start_time.getTime() - now.getTime()) / (1000 * 60))} minutes` : 'Already started',
            time_until_end: b.end_time > now ? `${Math.round((b.end_time.getTime() - now.getTime()) / (1000 * 60))} minutes` : 'Already ended'
          };
        })
      });
      
      // Log the specific confirmed booking that should be showing
      if (confirmedBookings.length > 0) {
        const confirmedBooking = confirmedBookings[0];
        const now = new Date();
        console.log('🔍 Detailed Confirmed Booking Analysis:', {
          booking_id: confirmedBooking.id,
          title: confirmedBooking.title,
          start_time: confirmedBooking.start_time.toLocaleString(),
          end_time: confirmedBooking.end_time.toLocaleString(),
          current_time: now.toLocaleString(),
          is_currently_active: now >= confirmedBooking.start_time && now <= confirmedBooking.end_time,
          start_time_utc: confirmedBooking.start_time.toISOString(),
          end_time_utc: confirmedBooking.end_time.toISOString(),
          current_time_utc: now.toISOString(),
          time_until_start_hours: Math.round((confirmedBooking.start_time.getTime() - now.getTime()) / (1000 * 60 * 60)),
          time_until_start_minutes: Math.round((confirmedBooking.start_time.getTime() - now.getTime()) / (1000 * 60))
        });
      }
      
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

  // Add test booking function for debugging
  useEffect(() => {
    if (typeof window !== 'undefined' && resources.length > 0) {
      (window as any).createTestBooking = async () => {
        const now = new Date();
        const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
        
        const testBooking = {
          resource_id: resources[0]?.id || 'test-resource',
          title: 'Test Booking - Current Time',
          description: 'Test booking for debugging Live Status',
          start_time: now.toISOString(),
          end_time: endTime.toISOString(),
          capacity: 1,
          location: 'Test Location',
          notes: 'Debug test booking',
          user_name: user?.fullName || 'Test User',
          user_email: user?.emailAddresses?.[0]?.emailAddress || 'test@example.com',
          metadata: {
            created_via: 'debug_test'
          }
        };
        
        console.log('🧪 Creating test booking:', testBooking);
        
        try {
          const response = await fetch(`/api/organizations/cf088ac1-39a5-4948-a72c-d8059c1ab739/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testBooking)
          });
          
          if (response.ok) {
            console.log('✅ Test booking created successfully');
            await fetchBookings(); // Refresh the data
          } else {
            console.error('❌ Failed to create test booking:', await response.text());
          }
        } catch (error) {
          console.error('❌ Error creating test booking:', error);
        }
      };
      
      // Add function to create a booking for tomorrow during business hours
      (window as any).createTomorrowBooking = async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0); // 10 AM tomorrow
        const endTime = new Date(tomorrow.getTime() + 60 * 60 * 1000); // 1 hour later
        
        const testBooking = {
          resource_id: resources[0]?.id || 'test-resource',
          title: 'Test Booking - Tomorrow 10 AM',
          description: 'Test booking for tomorrow during business hours',
          start_time: tomorrow.toISOString(),
          end_time: endTime.toISOString(),
          capacity: 1,
          location: 'Test Location',
          notes: 'Debug test booking for tomorrow',
          user_name: user?.fullName || 'Test User',
          user_email: user?.emailAddresses?.[0]?.emailAddress || 'test@example.com',
          metadata: {
            created_via: 'debug_test_tomorrow'
          }
        };
        
        console.log('🧪 Creating tomorrow test booking:', testBooking);
        
        try {
          const response = await fetch(`/api/organizations/cf088ac1-39a5-4948-a72c-d8059c1ab739/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testBooking)
          });
          
          if (response.ok) {
            console.log('✅ Tomorrow test booking created successfully');
            await fetchBookings(); // Refresh the data
          } else {
            console.error('❌ Failed to create tomorrow test booking:', await response.text());
          }
        } catch (error) {
          console.error('❌ Error creating tomorrow test booking:', error);
        }
      };
      
      console.log('🧪 Test booking functions available:');
      console.log('  - window.createTestBooking() - creates booking for right now');
      console.log('  - window.createTomorrowBooking() - creates booking for tomorrow 10 AM');
    }
  }, [resources, user, fetchBookings]);

  const handleCreateBooking = () => {
    console.log('🔍 handleCreateBooking: Opening modal with bookingType:', bookingType)
    console.log('🔍 handleCreateBooking: Available services:', finalServices)
    
    // Check if user is signed in
    if (!isSignedIn || !user) {
      console.log('❌ User not signed in, redirecting to sign in');
      alert('Please sign in to create a booking. You can sign in using your Google account.');
      // You could redirect to sign-in page here: window.location.href = '/sign-in';
      return;
    }
    
    setShowBookingForm(true);
  };

  const handleBookingTypeSelect = (type: BookingType) => {
    console.log('🔍 handleBookingTypeSelect: Selected type:', type)
    console.log('🔍 handleBookingTypeSelect: Current bookingType:', bookingType)
    console.log('🔍 handleBookingTypeSelect: Available resources:', resources.length)
    console.log('🔍 handleBookingTypeSelect: Setting showBookingForm to true')
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

  const handleBookingCreated = async (bookingData: any) => {
    try {
      console.log('🔄 Creating booking with streamlined modal data:', bookingData);
      
      // Check if user is signed in
      if (!isSignedIn || !user) {
        console.error('❌ User must be signed in to create bookings');
        alert('Please sign in to create a booking. You can sign in using your Google account.');
        return;
      }
      
      // Prepare booking data for API
      const startDateTime = new Date(bookingData.date);
      const [hours, minutes] = bookingData.startTime.split(':').map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + bookingData.duration);
      
      const apiBookingData = {
        resource_id: bookingData.service.id,
        title: bookingData.service.name,
        description: `Service: ${bookingData.service.name}${bookingData.staff ? ` | Staff: ${bookingData.staff.name}` : ''}`,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        capacity: 1,
        location: bookingData.service.name,
        notes: `Booked via streamlined booking system. Duration: ${bookingData.duration} minutes.`,
        user_name: user?.fullName || user?.firstName || 'Guest User',
        user_email: user?.emailAddresses?.[0]?.emailAddress || 'guest@example.com',
        metadata: {
          booking_type: bookingType,
          service_name: bookingData.service.name,
          duration_minutes: bookingData.duration,
          staff_preference: bookingData.staff?.name || 'No preference',
          created_via: 'streamlined_booking_modal'
        }
      };
      
      console.log('🔄 Sending booking to API:', apiBookingData);
      
      // Call the real booking API
      const response = await fetch(`/api/organizations/cf088ac1-39a5-4948-a72c-d8059c1ab739/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiBookingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to create booking');
      }
      
      const result = await response.json();
      console.log('✅ Booking created successfully:', result);
      
      // Close the booking form modal
      setShowBookingForm(false);
      
      // Show confirmation modal with booking details
      const booking = result.booking;
      setConfirmationBooking(booking);
      setShowConfirmationModal(true);
      
      // Refresh the bookings list
      await fetchBookings();
      
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      alert(`Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again or contact support if the issue persists.`);
    }
  };

  const handleBookingClick = (booking: LocalBooking) => {
    setSelectedBooking(booking);
  };

  // Generate available dates (next 30 days, excluding weekends and past dates)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    // Set to start of today to avoid timezone issues
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Only include future dates (not today or past)
      // Exclude weekends for demo (you can customize this logic)
      if (date > today && date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    console.log('🔍 generateAvailableDates: Generated', dates.length, 'available future dates')
    console.log('🔍 generateAvailableDates: First few dates:', dates.slice(0, 5).map(d => d.toDateString()))
    return dates;
  };

  // Generate available time slots based on existing bookings
  const generateAvailableSlots = () => {
    const slots = [];
    
    // Generate time slots from 9 AM to 6 PM (single day template)
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // For now, mark all slots as available
        // In a real implementation, you would check conflicts for the selected date
        slots.push({
          time: timeString,
          available: true, // Default to available
          duration: 30
        });
      }
    }
    
    console.log('🔍 generateAvailableSlots: Generated', slots.length, 'unique time slots')
    console.log('🔍 generateAvailableSlots: Available slots:', slots.filter(s => s.available).length)
    return slots;
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
            <MobileBookingTypeSelector
              selectedType={bookingType}
              onTypeSelect={handleBookingTypeSelect}
            />
            
            {/* Show message when no resources are available */}
            {resources.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Loading resources...</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Please wait while we load the available equipment, spaces, workshops, and people you can book.
                </p>
              </div>
            )}
            
            {/* Show available resources count */}
            {resources.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Ready to book!</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {resources.length} resources available across all categories.
                </p>
              </div>
            )}
          </div>

          {/* Live Availability Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Live Status</h2>
            {(() => {
              const currentlyBooked = bookings.filter(isBookingCurrentlyActive).length;
              const availableNow = resources.filter(resource => isResourceAvailableNow(resource, bookings)).length;
              
              console.log('📊 Live Status Calculation:', {
                total_bookings: bookings.length,
                confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
                currently_booked: currentlyBooked,
                total_resources: resources.length,
                available_now: availableNow,
                current_time: new Date().toLocaleString()
              });
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Currently Booked</p>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {currentlyBooked}
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
                            {availableNow}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {availableNow > 0 
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
              );
            })()}
          </div>

          {/* Streamlined Booking Modal */}
          {showBookingForm && (
            <>
              {console.log('🔍 Rendering StreamlinedBookingModal with:', {
                isOpen: showBookingForm,
                servicesCount: finalServices.length,
                services: finalServices,
                staffCount: staff.length,
                availableDatesCount: generateAvailableDates().length,
                availableSlotsCount: generateAvailableSlots().length
              })}
              <StreamlinedBookingModal
                isOpen={showBookingForm}
                onClose={() => setShowBookingForm(false)}
                onBookingCreate={handleBookingCreated}
                services={finalServices}
                staff={staff}
                availableDates={generateAvailableDates()}
                availableSlots={generateAvailableSlots()}
                bookingType={bookingType}
                onBookingTypeChange={setBookingType}
              />
            </>
          )}

          {/* Booking Confirmation Modal */}
          {showConfirmationModal && confirmationBooking && (
            <BookingConfirmationModal
              isOpen={showConfirmationModal}
              onClose={() => {
                setShowConfirmationModal(false);
                setConfirmationBooking(null);
              }}
              booking={confirmationBooking}
            />
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
              {isSignedIn ? 'Create Booking' : 'Sign In to Book'}
            </Button>
          </div>

          {/* Booking Calendar */}
          <div className="mb-8">
            <ResourceCalendar
              orgId="cf088ac1-39a5-4948-a72c-d8059c1ab739"
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
                  <div 
                    className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: ooliteColors.primaryAlpha }}
                  >
                    <Calendar className="w-8 h-8" style={{ color: ooliteColors.primary }} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Booking Policy</h3>
                  <p className="text-gray-600 dark:text-gray-400">Equipment can be booked up to 2 weeks in advance. Maximum 4 hours per session. Cancellations must be made 24 hours in advance.</p>
                </div>
                <div className="text-center">
                  <div 
                    className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: ooliteColors.primaryAlpha }}
                  >
                    <Users className="w-8 h-8" style={{ color: ooliteColors.primary }} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Safety First</h3>
                  <p className="text-gray-600 dark:text-gray-400">All users must complete safety training before using equipment. Follow all posted guidelines and ask staff for assistance when needed.</p>
                </div>
                <div className="text-center">
                  <div 
                    className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: ooliteColors.primaryAlpha }}
                  >
                    <Globe className="w-8 h-8" style={{ color: ooliteColors.primary }} />
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
