'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingDrawer } from '@/components/booking/BookingDrawer';
import { useUser } from '@clerk/nextjs';
import { 
  MapPin, 
  Calendar, 
  Mail, 
  Globe, 
  Instagram, 
  Facebook, 
  Twitter,
  ExternalLink,
  ArrowLeft,
  Star,
  Award,
  Palette,
  Camera,
  Music,
  Code,
  Building,
  Phone,
  Heart,
  Share2,
  BookOpen,
  Users,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface ArtistProfile {
  id: string;
  name: string;
  slug: string;
  bio: string;
  specialties: string[];
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  email?: string;
  phone?: string;
  studioNumber?: string;
  studioFloor?: string;
  avatar?: string;
  coverImage?: string;
  portfolio: {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    type: 'solo' | 'group' | 'juried';
  }[];
  exhibitions: {
    id: string;
    title: string;
    venue: string;
    date: string;
    type: 'solo' | 'group' | 'juried';
  }[];
  availability: {
    days: string[];
    hours: string;
    bookingUrl?: string;
  };
  rating: number;
  reviewCount: number;
  joinedDate: string;
  isActive: boolean;
}

export default function ArtistProfilePage() {
  const { slug } = useParams();
  const { user } = useUser();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        
        // Fetch artist data from API
        const response = await fetch(`/api/artists/${slug}`);
        if (!response.ok) {
          throw new Error('Artist not found');
        }
        
        const data = await response.json();
        const apiArtist = data.artist;
        
        // Transform API data to match our interface
        const transformedArtist: ArtistProfile = {
          id: apiArtist.id,
          name: apiArtist.name,
          slug: slug as string,
          bio: apiArtist.bio || 'No bio available',
          specialties: apiArtist.studio_type ? [apiArtist.studio_type] : [],
          website: undefined, // Not in current API
          instagram: undefined, // Not in current API
          email: undefined, // Not in current API
          phone: undefined, // Not in current API
          studioNumber: apiArtist.studio_number,
          studioFloor: '1st Floor', // Default, could be enhanced
          avatar: apiArtist.profile_image,
          coverImage: undefined, // Not in current API
          portfolio: [], // Not in current API
          exhibitions: [], // Not in current API
          availability: {
            days: ['Monday', 'Wednesday', 'Friday'], // Default
            hours: '10:00 AM - 6:00 PM', // Default
            bookingUrl: `/book/${apiArtist.id}`
          },
          rating: 4.5, // Default
          reviewCount: 0, // Default
          joinedDate: apiArtist.created_at,
          isActive: apiArtist.is_claimed
        };
        
        setArtist(transformedArtist);
      } catch (err) {
        setError('Failed to load artist profile');
        console.error('Error fetching artist:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArtist();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={bakehouseConfig} userRole="admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading artist profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={bakehouseConfig} userRole="admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artist Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The artist you are looking for does not exist.'}</p>
            <Link href="/o/bakehouse/map">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Studio Map
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'photography':
        return <Camera className="w-4 h-4" />;
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'digital art':
      case 'coding':
        return <Code className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation config={bakehouseConfig} userRole="admin" />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/o/bakehouse/map">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Studio Map
            </Button>
          </Link>
        </div>

        {/* Artist Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            {artist.coverImage && (
              <img 
                src={artist.coverImage} 
                alt={`${artist.name} cover`}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-white">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback className="text-2xl">
                    {artist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
                  <div className="flex items-center gap-4 text-lg">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span>{artist.rating}</span>
                      <span className="text-gray-300">({artist.reviewCount} reviews)</span>
                    </div>
                    {artist.studioNumber && (
                      <div className="flex items-center gap-1">
                        <Building className="w-5 h-5" />
                        <span>Studio {artist.studioNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artist.specialties.map((specialty, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {getSpecialtyIcon(specialty)}
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Recent Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artist.portfolio.map((work) => (
                    <div key={work.id} className="border rounded-lg overflow-hidden">
                      <img 
                        src={work.image} 
                        alt={work.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold mb-2">{work.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{work.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="default">{work.type}</Badge>
                          <span className="text-sm text-gray-500">{work.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exhibitions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Exhibitions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {artist.exhibitions.map((exhibition) => (
                    <div key={exhibition.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold mb-1">{exhibition.title}</h4>
                        <p className="text-sm text-gray-600">{exhibition.venue}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="mb-1">{exhibition.type}</Badge>
                        <p className="text-sm text-gray-500">{exhibition.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Contact & Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {artist.studioNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>Studio {artist.studioNumber}, {artist.studioFloor}</span>
                  </div>
                )}
                
                {artist.availability && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{artist.availability.days.join(', ')}</span>
                  </div>
                )}

                {artist.availability && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{artist.availability.hours}</span>
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setBookingDrawerOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Studio Visit
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {artist.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${artist.email}`} className="text-blue-600 hover:underline">
                      {artist.email}
                    </a>
                  </div>
                )}
                
                {artist.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${artist.phone}`} className="text-blue-600 hover:underline">
                      {artist.phone}
                    </a>
                  </div>
                )}

                {artist.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={artist.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {artist.instagram && (
                  <div className="flex items-center gap-2 text-sm">
                    <Instagram className="w-4 h-4 text-gray-500" />
                    <a 
                      href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {artist.instagram} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {artist.facebook && (
                  <div className="flex items-center gap-2 text-sm">
                    <Facebook className="w-4 h-4 text-gray-500" />
                    <a 
                      href={artist.facebook}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Facebook <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {artist.twitter && (
                  <div className="flex items-center gap-2 text-sm">
                    <Twitter className="w-4 h-4 text-gray-500" />
                    <a 
                      href={`https://twitter.com/${artist.twitter.replace('@', '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {artist.twitter} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Studio Info */}
            {artist.studioNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Studio Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Studio Number:</span>
                      <span className="font-medium">{artist.studioNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floor:</span>
                      <span className="font-medium">{artist.studioFloor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">{new Date(artist.joinedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={artist.isActive ? "default" : "secondary"}>
                        {artist.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Booking Drawer */}
        <BookingDrawer
          open={bookingDrawerOpen}
          onOpenChange={setBookingDrawerOpen}
          profile={{
            id: artist.id,
            name: artist.name,
            avatarUrl: artist.avatar || null,
            claimed: true, // Assuming artist profiles are claimed
            studioNumber: artist.studioNumber || '',
            specialties: artist.specialties,
            bio: artist.bio,
            website: artist.website
          }}
          orgSlug="bakehouse"
          currentUser={{
            id: user?.id || null,
            name: user?.fullName || null,
            email: user?.primaryEmailAddress?.emailAddress || null
          }}
          onBooked={() => {
            setBookingDrawerOpen(false);
            // Show success message or redirect
            console.log('Booking completed!');
          }}
        />
      </div>
    </div>
  );
}

