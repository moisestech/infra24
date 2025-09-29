'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation';
import { PageFooter } from '@/components/common/PageFooter';
import { useUser } from '@clerk/nextjs';
import { 
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Globe,
  Instagram,
  MapPin,
  User,
  Clock,
  DollarSign,
  Star,
  Award,
  Palette,
  Camera,
  Video,
  Music,
  BookOpen
} from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  bio?: string;
  profile_image?: string;
  studio_type?: string;
  studio_location?: string;
  website_url?: string;
  instagram_handle?: string;
  phone?: string;
  skills?: string[];
  mediums?: string[];
  location?: string;
  is_public: boolean;
  is_featured: boolean;
  metadata?: {
    residency_type?: string;
    year?: string;
    studio?: string;
    phone?: string;
    email?: string;
    instagram?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
  organization_id: string;
  organizations?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const artistId = params.id as string;
  const { user } = useUser();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    async function loadArtist() {
      try {
        setLoading(true);
        console.log('🔍 Loading artist:', artistId);
        
        // Load artist data
        const response = await fetch(`/api/artists/${artistId}`);
        console.log('🔍 Artist response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Artist data:', data);
          setArtist(data.artist);
        } else {
          console.error('❌ Failed to fetch artist:', response.status);
          setError('Artist not found');
        }
      } catch (error) {
        console.error('❌ Error loading artist:', error);
        setError('Failed to load artist');
      } finally {
        setLoading(false);
      }
    }

    if (artistId) {
      loadArtist();
    }
  }, [artistId]);

  const getResidencyTypeIcon = (residencyType?: string) => {
    switch (residencyType) {
      case 'Studio Resident':
        return <Palette className="h-5 w-5" />;
      case 'Live In Art Resident':
        return <User className="h-5 w-5" />;
      case 'Cinematic Resident':
        return <Video className="h-5 w-5" />;
      case 'Staff':
        return <Award className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getResidencyTypeColor = (residencyType?: string) => {
    switch (residencyType) {
      case 'Studio Resident':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Live In Art Resident':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Cinematic Resident':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Staff':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleBookArtist = () => {
    // Navigate to booking page with artist pre-selected
    router.push(`/o/${slug}/bookings?type=person&person=${artistId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artist Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The artist you are looking for does not exist.'}</p>
            <Link href={`/o/${slug}/artists`}>
              <Button 
                style={{ 
                  backgroundColor: ooliteColors.primary,
                  borderColor: ooliteColors.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = ooliteColors.primaryLight
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = ooliteColors.primary
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Artists
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/o/${slug}/artists`}>
            <Button 
              variant="outline"
              style={{ 
                borderColor: ooliteColors.primary,
                color: ooliteColors.primary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = ooliteColors.primaryAlpha
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Artists
            </Button>
          </Link>
        </div>

        {/* Artist Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: ooliteColors.primaryAlpha }}>
              <User className="w-8 h-8" style={{ color: ooliteColors.primary }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {artist.name}
              </h1>
              {artist.metadata?.residency_type && (
                <Badge className={getResidencyTypeColor(artist.metadata.residency_type)}>
                  <div className="flex items-center gap-1">
                    {getResidencyTypeIcon(artist.metadata.residency_type)}
                    {artist.metadata.residency_type}
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: ooliteColors.primary }} />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {artist.bio || 'No bio available for this artist.'}
                </p>
              </CardContent>
            </Card>

            {/* Skills & Mediums */}
            {(artist.skills && artist.skills.length > 0) || (artist.mediums && artist.mediums.length > 0) ? (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" style={{ color: ooliteColors.primary }} />
                    Skills & Mediums
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {artist.skills && artist.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {artist.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {artist.mediums && artist.mediums.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mediums</h4>
                      <div className="flex flex-wrap gap-2">
                        {artist.mediums.map((medium, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {medium}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {/* Studio Information */}
            {artist.metadata?.studio && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" style={{ color: ooliteColors.primary }} />
                    Studio Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>Studio: {artist.metadata.studio}</span>
                  </div>
                  {artist.metadata.year && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2">
                      <Clock className="h-4 w-4" />
                      <span>Year: {artist.metadata.year}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" style={{ color: ooliteColors.primary }} />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {artist.metadata?.email && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${artist.metadata.email}`} className="hover:underline">
                      {artist.metadata.email}
                    </a>
                  </div>
                )}
                {artist.metadata?.phone && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${artist.metadata.phone}`} className="hover:underline">
                      {artist.metadata.phone}
                    </a>
                  </div>
                )}
                {artist.metadata?.website && artist.metadata.website !== '-' && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={artist.metadata.website.startsWith('http') ? artist.metadata.website : `https://${artist.metadata.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
                {artist.metadata?.instagram && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Instagram className="h-4 w-4" />
                    <a 
                      href={`https://instagram.com/${artist.metadata.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {artist.metadata.instagram}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Book Artist */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: ooliteColors.primary }} />
                  Book Appointment
                </CardTitle>
                <CardDescription>
                  Schedule a meeting or consultation with {artist.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  style={{ 
                    backgroundColor: ooliteColors.primary,
                    borderColor: ooliteColors.primary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = ooliteColors.primaryLight
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ooliteColors.primary
                  }}
                  onClick={handleBookArtist}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  You'll be redirected to the booking system
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Page Footer */}
        <PageFooter 
          organizationSlug={slug}
          showGetStarted={true}
          showGuidelines={true}
          showTerms={true}
        />
      </div>
    </div>
  );
}