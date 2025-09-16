'use client';

import React, { useState } from 'react';
import Navigation from '@/components/ui/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InteractiveStudioMap } from '@/components/maps/InteractiveStudioMap';
import { ArtistListDrawer } from '@/components/maps/ArtistListDrawer';
import { BookingDrawer } from '@/components/booking/BookingDrawer';
import { useUser } from '@clerk/nextjs';
import { 
  MapPin, 
  Users, 
  Search, 
  Filter,
  Home,
  Palette,
  Camera,
  Music,
  Code,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Calendar,
  Award,
  Building,
  Paintbrush,
  Hammer,
  Scissors,
  Printer
} from 'lucide-react';

interface Studio {
  id: string;
  name: string;
  number: string;
  floor: number;
  type: 'painting' | 'sculpture' | 'mixed-media' | 'photography' | 'ceramics' | 'printmaking' | 'digital' | 'jewelry' | 'textiles';
  size: 'small' | 'medium' | 'large' | 'extra-large';
  status: 'occupied' | 'available' | 'maintenance' | 'reserved';
  description: string;
  equipment: string[];
  amenities: string[];
  monthlyRate: number;
  imageUrl?: string;
  currentArtist?: Artist;
}

interface Artist {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  bio: string;
  specialties: string[];
  joinDate: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  avatar?: string;
  isActive: boolean;
  studioId?: string;
  membershipType: 'resident' | 'associate' | 'visitor';
  portfolio: {
    title: string;
    description: string;
    imageUrl: string;
    year: number;
  }[];
  exhibitions: {
    title: string;
    venue: string;
    date: string;
    type: 'solo' | 'group' | 'juried';
  }[];
}

export default function BakehouseMapPage() {
  const { user } = useUser();
  const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);
  const [artistListDrawerOpen, setArtistListDrawerOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [artists, setArtists] = useState<any[]>([]);

  const handleStudioClick = (studio: any) => {
    console.log('Studio clicked:', studio);
    // Could open a detailed view or navigate to studio page
  };

  const handleBookArtist = (profile: any) => {
    setSelectedProfile(profile);
    setBookingDrawerOpen(true);
  };

  const handleArtistsLoaded = (loadedArtists: any[]) => {
    console.log('Artists loaded in map page:', loadedArtists);
    setArtists(loadedArtists);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bakehouse Art Complex Studio Map</h1>
          <p className="text-gray-600">
            Explore our artist studios and connect with resident artists and their work
          </p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by artist name or studio number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  size="sm"
                >
                  All Studios
                </Button>
                <Button
                  variant={filterType === 'occupied' ? 'default' : 'outline'}
                  onClick={() => setFilterType('occupied')}
                  size="sm"
                >
                  Occupied
                </Button>
                <Button
                  variant={filterType === 'available' ? 'default' : 'outline'}
                  onClick={() => setFilterType('available')}
                  size="sm"
                >
                  Available
                </Button>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setArtistListDrawerOpen(true)}
              >
                <Users className="w-4 h-4 mr-2" /> Browse All Artists
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <InteractiveStudioMap
              orgSlug="bakehouse"
              svgUrl="/maps/BAC_smart-map.svg"
              onStudioClick={handleStudioClick}
              onBookArtist={handleBookArtist}
              onArtistsLoaded={handleArtistsLoaded}
              searchTerm={searchTerm}
              filterType={filterType}
              className="h-[600px]"
            />
          </CardContent>
        </Card>

        {/* Booking Drawer */}
        <BookingDrawer
          open={bookingDrawerOpen}
          onOpenChange={setBookingDrawerOpen}
          profile={selectedProfile}
          orgSlug="bakehouse"
          currentUser={{
            id: user?.id || null,
            name: user?.fullName || null,
            email: user?.primaryEmailAddress?.emailAddress || null
          }}
          onBooked={() => {
            // Refresh data or show success message
            console.log('Booking completed!');
          }}
        />

        {/* Artist List Drawer */}
        <ArtistListDrawer
          open={artistListDrawerOpen}
          onOpenChange={setArtistListDrawerOpen}
          artists={artists}
          searchTerm={searchTerm}
          filterType={filterType}
          onSelectArtist={(artist) => {
            setSelectedProfile(artist);
            setArtistListDrawerOpen(false);
            setBookingDrawerOpen(true);
          }}
        />
      </div>
    </div>
  );
}