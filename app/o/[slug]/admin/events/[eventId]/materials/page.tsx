'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  File, 
  MessageSquare, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { EventMaterialsManager } from '@/components/events/EventMaterialsManager';
import { EventFeedbackDisplay } from '@/components/events/EventFeedbackDisplay';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_category?: string;
  start_date: string;
  end_date: string;
  location?: string;
  max_participants: number;
  current_participants: number;
  price: number;
  currency: string;
  featured: boolean;
  is_public: boolean;
  created_at: string;
}

export default function EventMaterialsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const eventId = params.eventId as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string>('');

  // Fetch event details
  const fetchEvent = async () => {
    try {
      setLoading(true);
      
      // First get organization ID from slug
      const orgResponse = await fetch(`/api/organizations?slug=${slug}`);
      if (orgResponse.ok) {
        const orgData = await orgResponse.json();
        setOrganizationId(orgData.data.id);
        
        // Then fetch event details
        const eventResponse = await fetch(`/api/workshops/${eventId}`);
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setEvent(eventData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [slug, eventId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The requested event could not be found.</p>
          <Link href={`/o/${slug}/admin/events`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/o/${slug}/admin/events`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600 mb-4">{event.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(event.start_date)}
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(event.start_date)} - {formatTime(event.end_date)}
              </div>
              
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.current_participants}/{event.max_participants} participants
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={event.event_type === 'workshop' ? 'default' : 'info'}>
              {event.event_type}
            </Badge>
            {event.featured && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {event.is_public ? (
              <Badge className="bg-green-100 text-green-800">Public</Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">Private</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <File className="w-4 h-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="materials" className="mt-6">
          <EventMaterialsManager
            eventId={eventId}
            organizationId={organizationId}
            onMaterialUploaded={(material) => {
              console.log('Material uploaded:', material);
            }}
            onMaterialDeleted={(materialId) => {
              console.log('Material deleted:', materialId);
            }}
          />
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-6">
          <EventFeedbackDisplay
            eventId={eventId}
            organizationId={organizationId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
