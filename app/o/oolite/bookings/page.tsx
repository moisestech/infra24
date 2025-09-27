'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { ResourceCalendar } from '@/components/booking/ResourceCalendar';
import { BookingForm } from '@/components/booking/BookingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Calendar, Users, Clock, MapPin, X } from 'lucide-react';

interface Booking {
  id: string;
  resource_id: string;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_by_clerk_id: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'space' | 'equipment' | 'person';
  capacity: number;
  organization_id: string;
}

function OoliteBookingsPageContent() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
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
      
      // Mock resources data
      const mockResources: Resource[] = [
        {
          id: 'vr-quest-3',
          title: 'VR Headset - Oculus Quest 3',
          type: 'equipment',
          capacity: 1,
          organization_id: 'caf2bc8b-8547-4c55-ac9f-5692e93bd831'
        },
        {
          id: '3d-printer-prusa',
          title: '3D Printer - Prusa i3 MK3S+',
          type: 'equipment',
          capacity: 1,
          organization_id: 'caf2bc8b-8547-4c55-ac9f-5692e93bd831'
        },
        {
          id: 'ar-hololens-2',
          title: 'AR Development Station',
          type: 'equipment',
          capacity: 1,
          organization_id: 'caf2bc8b-8547-4c55-ac9f-5692e93bd831'
        },
        {
          id: 'mocap-system',
          title: 'Motion Capture System',
          type: 'equipment',
          capacity: 1,
          organization_id: 'caf2bc8b-8547-4c55-ac9f-5692e93bd831'
        },
        {
          id: 'workstation-rtx4090',
          title: 'High-End Workstation',
          type: 'equipment',
          capacity: 1,
          organization_id: 'caf2bc8b-8547-4c55-ac9f-5692e93bd831'
        }
      ];
      
      // Equipment booking mock data
      const mockBookings: Booking[] = [
        {
          id: '1',
          title: 'VR Headset - Oculus Quest 3',
          description: 'High-end VR headset for immersive experiences and 3D modeling',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          status: 'confirmed',
          resource_id: 'vr-quest-3',
          created_by_clerk_id: 'user_1'
        },
        {
          id: '2',
          title: '3D Printer - Prusa i3 MK3S+',
          description: 'Professional 3D printer for rapid prototyping and art creation',
          start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
          status: 'pending',
          resource_id: '3d-printer-prusa',
          created_by_clerk_id: 'user_2'
        },
        {
          id: '3',
          title: 'AR Development Station',
          description: 'Complete AR development setup with HoloLens 2 and development tools',
          start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
          status: 'confirmed',
          resource_id: 'ar-hololens-2',
          created_by_clerk_id: 'user_3'
        },
        {
          id: '4',
          title: 'Motion Capture System',
          description: 'Professional motion capture equipment for animation and VR development',
          start_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          status: 'pending',
          resource_id: 'mocap-system',
          created_by_clerk_id: 'user_4'
        },
        {
          id: '5',
          title: 'High-End Workstation',
          description: 'Powerful workstation with RTX 4090 for AI art generation and 3D rendering',
          start_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
          status: 'pending',
          resource_id: 'workstation-rtx4090',
          created_by_clerk_id: 'user_5'
        }
      ];
      
      setResources(mockResources);
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

  const handleBookingCreated = async (booking: Omit<Booking, 'id' | 'created_by_clerk_id'>) => {
    // Create a new booking with a temporary ID
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      created_by_clerk_id: 'temp-user'
    };
    setBookings(prev => [newBooking, ...prev]);
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
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Lab Equipment</h1>
            <p className="text-gray-600">
              Book time on our XR & Technology equipment and resources
            </p>
          </div>

          {/* Equipment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Equipment</p>
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
                    <p className="text-sm font-medium text-gray-600">Currently Booked</p>
                    <p className="text-2xl font-bold">
                      {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
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
                    <p className="text-sm font-medium text-gray-600">Available Now</p>
                    <p className="text-2xl font-bold">
                      {bookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
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
                    resources={resources}
                    onSubmit={handleBookingCreated}
                    onCancel={() => setShowBookingForm(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Booking Calendar */}
          <div className="mb-8">
            <ResourceCalendar
              orgId="caf2bc8b-8547-4c55-ac9f-5692e93bd831"
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
