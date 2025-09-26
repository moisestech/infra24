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
  Star,
  ExternalLink,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { EventMaterialsList } from '@/components/events/EventMaterialsList';
import { EventFeedbackForm } from '@/components/events/EventFeedbackForm';
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
  instructor_id?: string;
  prerequisites?: string[];
  learning_objectives?: string[];
  target_audience?: string;
  equipment_provided?: string[];
  materials_included?: string[];
}

export default function PublicEventPage() {
  const params = useParams();
  const slug = params.slug as string;
  const eventId = params.eventId as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
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
          <Link href={`/o/${slug}`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organization
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
          <Link href={`/o/${slug}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organization
            </Button>
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600 mb-4 text-lg">{event.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
            <Badge variant={event.event_type === 'workshop' ? 'default' : 'secondary'}>
              {event.event_type}
            </Badge>
            {event.featured && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {event.target_audience && (
                    <div>
                      <h3 className="font-semibold mb-2">Target Audience</h3>
                      <p className="text-gray-600">{event.target_audience}</p>
                    </div>
                  )}
                  
                  {event.learning_objectives && event.learning_objectives.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Learning Objectives</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {event.learning_objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.prerequisites && event.prerequisites.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Prerequisites</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {event.prerequisites.map((prerequisite, index) => (
                          <li key={index}>{prerequisite}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.equipment_provided && event.equipment_provided.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Equipment Provided</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {event.equipment_provided.map((equipment, index) => (
                          <li key={index}>{equipment}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.materials_included && event.materials_included.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Materials Included</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {event.materials_included.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="materials" className="mt-6">
              <EventMaterialsList
                eventId={eventId}
                organizationId={organizationId}
                maxItems={10}
              />
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-6 space-y-6">
              <EventFeedbackForm
                eventId={eventId}
                organizationId={organizationId}
                onFeedbackSubmitted={(feedback) => {
                  console.log('Feedback submitted:', feedback);
                  // You could show a success message here
                }}
              />
              
              <EventFeedbackDisplay
                eventId={eventId}
                organizationId={organizationId}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {event.price > 0 ? (
                  <div>
                    <div className="text-3xl font-bold">${event.price}</div>
                    <div className="text-sm text-gray-600">{event.currency}</div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-green-600">Free</div>
                )}
                
                <div className="text-sm text-gray-600">
                  {event.max_participants - event.current_participants} spots remaining
                </div>
                
                <Button className="w-full" size="lg">
                  Register Now
                </Button>
                
                <div className="text-xs text-gray-500">
                  Registration closes 24 hours before the event
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{formatDate(event.start_date)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{formatTime(event.start_date)} - {formatTime(event.end_date)}</span>
              </div>
              
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{event.current_participants} registered</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
