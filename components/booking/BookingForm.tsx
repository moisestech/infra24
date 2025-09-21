'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, Users, MapPin, User, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Artist {
  id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  mediums?: string[];
}

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'workshop' | 'equipment' | 'space' | 'event';
  capacity: number;
  price: number;
  currency: string;
  location?: string;
  duration_minutes?: number;
  requirements?: string[];
}

interface BookingFormProps {
  organizationId: string;
  resourceId?: string;
  onBookingCreated?: (booking: any) => void;
  onCancel?: () => void;
  className?: string;
}

export function BookingForm({ 
  organizationId, 
  resourceId, 
  onBookingCreated, 
  onCancel,
  className 
}: BookingFormProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    resource_id: resourceId || '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    capacity: 1,
    location: '',
    requirements: [] as string[],
    notes: '',
    instructor_id: '',
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  });

  useEffect(() => {
    fetchData();
  }, [organizationId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from Supabase
      const resourcesResponse = await fetch(`/api/organizations/${organizationId}/resources`);
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json();
        setResources(resourcesData.resources || []);
      } else {
        console.error('Failed to fetch resources:', resourcesResponse.statusText);
        // Fallback to empty array
        setResources([]);
      }

      const artistsResponse = await fetch(`/api/organizations/${organizationId}/artists`);
      if (artistsResponse.ok) {
        const artistsData = await artistsResponse.json();
        setArtists(artistsData.artists || []);
      } else {
        console.error('Failed to fetch artists:', artistsResponse.statusText);
        // Fallback to empty array
        setArtists([]);
      }
      
      // Set selected resource if resourceId is provided
      if (resourceId) {
        const resource = resources.find((r: Resource) => r.id === resourceId);
        if (resource) {
          setSelectedResource(resource);
          setFormData(prev => ({
            ...prev,
            resource_id: resource.id,
            title: resource.title,
            capacity: resource.capacity,
            location: resource.location || '',
            requirements: resource.requirements || []
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error
      setResources([]);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceChange = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedResource(resource);
      setFormData(prev => ({
        ...prev,
        resource_id: resource.id,
        title: resource.title,
        capacity: resource.capacity,
        location: resource.location || '',
        requirements: resource.requirements || []
      }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    if (!startTime) return '';
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    return end.toISOString().slice(0, 16);
  };

  const handleStartTimeChange = (startTime: string) => {
    setFormData(prev => ({
      ...prev,
      start_time: startTime,
      end_time: selectedResource?.duration_minutes 
        ? calculateEndTime(startTime, selectedResource.duration_minutes)
        : prev.end_time
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.resource_id || !formData.title || !formData.start_time || !formData.end_time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      // For now, simulate booking creation with mock data
      const mockBooking = {
        id: `booking-${Date.now()}`,
        organization_id: organizationId,
        user_id: 'mock-user-id',
        resource_type: selectedResource?.type || 'workshop',
        resource_id: formData.resource_id,
        title: formData.title,
        description: formData.description,
        start_time: formData.start_time,
        end_time: formData.end_time,
        status: 'pending',
        capacity: formData.capacity,
        current_participants: 0,
        price: selectedResource?.price || 0,
        currency: selectedResource?.currency || 'USD',
        location: formData.location,
        requirements: formData.requirements,
        notes: formData.notes,
        metadata: {
          instructor_id: formData.instructor_id,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onBookingCreated?.(mockBooking);
      alert('Booking created successfully! (Mock data - Supabase integration pending)');
      
      // TODO: Replace with actual API call once Supabase tables are set up
      /*
      const response = await fetch(`/api/organizations/${organizationId}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resource_type: selectedResource?.type || 'workshop',
          resource_id: formData.resource_id,
          title: formData.title,
          description: formData.description,
          start_time: formData.start_time,
          end_time: formData.end_time,
          capacity: formData.capacity,
          location: formData.location,
          requirements: formData.requirements,
          notes: formData.notes,
          metadata: {
            instructor_id: formData.instructor_id,
            contact_name: formData.contact_name,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone
          }
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        onBookingCreated?.(booking.booking);
        alert('Booking created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
      */
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle>Create New Booking</CardTitle>
        <CardDescription>
          Book a workshop, equipment, or space for your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resource Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource *
            </label>
            <select
              value={formData.resource_id}
              onChange={(e) => handleResourceChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a resource...</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.title} ({resource.type}) - ${resource.price} {resource.currency}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Resource Info */}
          {selectedResource && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{selectedResource.title}</h3>
                  {selectedResource.description && (
                    <p className="text-gray-600 text-sm">{selectedResource.description}</p>
                  )}
                </div>
                <Badge variant="default">{selectedResource.type}</Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>Capacity: {selectedResource.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{selectedResource.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedResource.location || 'TBD'}</span>
                </div>
                <div className="font-semibold">
                  ${selectedResource.price} {selectedResource.currency}
                </div>
              </div>

              {selectedResource.requirements && selectedResource.requirements.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedResource.requirements.map((req, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="number"
              min="1"
              max={selectedResource?.capacity || 1}
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Instructor Selection */}
          {selectedResource?.type === 'workshop' && artists.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor
              </label>
              <select
                value={formData.instructor_id}
                onChange={(e) => handleInputChange('instructor_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an instructor...</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => handleInputChange('contact_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes or special requirements..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
