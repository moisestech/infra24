'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { BookingForm } from '@/components/booking/BookingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Calendar, Users, Clock, MapPin, X } from 'lucide-react';

interface Booking {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  capacity: number;
  current_participants: number;
  price: number;
  currency: string;
  location?: string;
  resource_type: 'workshop' | 'equipment' | 'space' | 'event';
  resource_id: string;
}

function OoliteBookingsPageContent() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (tenantId === 'oolite') {
      fetchBookings();
    }
  }, [tenantId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since we don't have the actual API set up yet
      const mockBookings: Booking[] = [
        {
          id: '1',
          title: 'AI Art Fundamentals Workshop',
          description: 'Learn the basics of AI-generated art and creative tools',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          capacity: 15,
          current_participants: 12,
          price: 50,
          currency: 'USD',
          location: 'Digital Lab',
          resource_type: 'workshop',
          resource_id: 'ai-art-fundamentals'
        },
        {
          id: '2',
          title: '3D Printer Session',
          description: 'Book time on our 3D printer for your project',
          start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          capacity: 1,
          current_participants: 1,
          price: 25,
          currency: 'USD',
          location: 'Fabrication Lab',
          resource_type: 'equipment',
          resource_id: '3d-printer-1'
        },
        {
          id: '3',
          title: 'Creative Coding Lab',
          description: 'Explore the intersection of programming and art',
          start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          capacity: 12,
          current_participants: 8,
          price: 40,
          currency: 'USD',
          location: 'Digital Lab',
          resource_type: 'workshop',
          resource_id: 'creative-coding'
        }
      ];
      
      setBookings(mockBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = () => {
    setShowBookingForm(true);
  };

  const handleBookingCreated = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    setShowBookingForm(false);
  };

  const handleBookingClick = (booking: Booking) => {
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
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
            <p className="text-gray-600">
              Manage workshops, equipment, and space bookings for Oolite Arts
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">
                      {bookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ${bookings.reduce((sum, b) => sum + (b.price * b.current_participants), 0)}
                    </p>
                  </div>
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form Modal */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Create New Booking</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBookingForm(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <BookingForm
                    organizationId="oolite"
                    onBookingCreated={handleBookingCreated}
                    onCancel={() => setShowBookingForm(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Booking Calendar */}
          <BookingCalendar
            organizationId="oolite"
            bookings={bookings}
            onBookingClick={handleBookingClick}
            onCreateBooking={handleCreateBooking}
            className="mb-8"
          />

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
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {selectedBooking.current_participants}/{selectedBooking.capacity} participants
                        </span>
                      </div>
                      
                      {selectedBooking.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{selectedBooking.location}</span>
                        </div>
                      )}
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
                      <Badge variant="default">
                        {selectedBooking.resource_type}
                      </Badge>
                    </div>
                    
                    <div className="text-lg font-semibold">
                      ${selectedBooking.price} {selectedBooking.currency}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">Edit</Button>
                      <Button size="sm" variant="outline">Cancel</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
