'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface BookingCalendarProps {
  organizationId: string;
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
  onCreateBooking?: () => void;
  className?: string;
}

export function BookingCalendar({ 
  organizationId, 
  bookings, 
  onBookingClick, 
  onCreateBooking,
  className 
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-purple-100 text-purple-800';
      case 'equipment': return 'bg-orange-100 text-orange-800';
      case 'space': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.start_time);
    const isSameDate = bookingDate.toDateString() === selectedDate.toDateString();
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    const typeMatch = filterType === 'all' || booking.resource_type === filterType;
    
    return isSameDate && statusMatch && typeMatch;
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Calendar
            </CardTitle>
            <CardDescription>
              Manage and view bookings for {formatDate(selectedDate)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              →
            </Button>
            {onCreateBooking && (
              <Button size="sm" onClick={onCreateBooking}>
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="workshop">Workshop</option>
            <option value="equipment">Equipment</option>
            <option value="space">Space</option>
            <option value="event">Event</option>
          </select>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bookings found for this date</p>
              {onCreateBooking && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={onCreateBooking}
                >
                  Create First Booking
                </Button>
              )}
            </div>
          ) : (
            filteredBookings
              .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
              .map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onBookingClick?.(booking)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{booking.title}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <Badge className={getTypeColor(booking.resource_type)}>
                          {booking.resource_type}
                        </Badge>
                      </div>
                      
                      {booking.description && (
                        <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {booking.current_participants}/{booking.capacity}
                        </div>
                        
                        {booking.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.location}
                          </div>
                        )}
                        
                        {booking.price > 0 && (
                          <div className="font-medium">
                            ${booking.price} {booking.currency}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

