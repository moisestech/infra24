'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';
import { TipButton } from '@/components/ui/TipButton';
import { 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  Instagram, 
  Camera,
  Edit,
  Award,
  BookOpen,
  GraduationCap,
  Palette,
  Film,
  Music,
  Camera as CameraIcon,
  Users,
  Building2,
  UserCheck,
  UserPlus
} from 'lucide-react';

interface ArtistProfile {
  id: string;
  name: string;
  email: string | null;
  studio_number: string | null;
  studio_type: 'Studio' | 'Associate' | 'Gallery';
  studio_location: string | null;
  phone: string | null;
  bio: string | null;
  website_url: string | null;
  instagram_handle: string | null;
  profile_image: string | null;
  portfolio_images: string[] | null;
  achievements: string[] | null;
  awards: string[] | null;
  exhibitions: string[] | null;
  publications: string[] | null;
  education: string[] | null;
  specialties: string[] | null;
  media: string[] | null;
  year_started: number | null;
  year_ended: number | null;
  is_active: boolean;
  is_claimed: boolean;
  claimed_by_clerk_user_id: string | null;
  claimed_at: string | null;
  profile_type: 'artist' | 'staff';
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export default function ArtistProfilePage() {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'achievements' | 'contact'>('overview');

  useEffect(() => {
    async function loadArtist() {
      if (params.id) {
        try {
          const response = await fetch(`/api/artists/${params.id}`);
          if (response.ok) {
            const data = await response.json();
            setArtist(data);
          } else {
            setError('Artist not found');
          }
        } catch (error) {
          console.error('Error loading artist:', error);
          setError('Failed to load artist profile');
        } finally {
          setLoading(false);
        }
      }
    }

    loadArtist();
  }, [params.id]);

  const getStudioTypeColor = (type: string) => {
    switch (type) {
      case 'Studio':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Associate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Gallery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getClaimStatusColor = (isClaimed: boolean) => {
    return isClaimed 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  };

  const getMediaIcon = (media: string) => {
    switch (media.toLowerCase()) {
      case 'painting':
        return <Palette className="w-4 h-4" />;
      case 'sculpture':
        return <Building2 className="w-4 h-4" />;
      case 'photography':
        return <CameraIcon className="w-4 h-4" />;
      case 'video':
        return <Film className="w-4 h-4" />;
      case 'sound':
        return <Music className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Artist not found'}
          </h1>
          <a
            href="/artists"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Artists
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/artists"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            ← Back to Artists
          </a>
        </div>

        {/* Artist Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
            {/* Profile Image */}
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className="relative">
                {artist.profile_image ? (
                  <img
                    src={artist.profile_image}
                    alt={artist.name}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                {artist.is_claimed && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <UserCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {artist.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className={getStudioTypeColor(artist.studio_type)}>
                    {artist.studio_type}
                  </Badge>
                  <Badge className={getClaimStatusColor(artist.is_claimed)}>
                    {artist.is_claimed ? 'Claimed' : 'Unclaimed'}
                  </Badge>
                  {artist.studio_number && (
                    <Badge variant="default">
                      Studio {artist.studio_number}
                    </Badge>
                  )}
                </div>
                {artist.bio && (
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl">
                    {artist.bio}
                  </p>
                )}
              </div>
              
              <div className="mt-6 lg:mt-0">
                <div className="flex flex-col space-y-3">
                  {/* Tip Button */}
                  <TipButton
                    artistId={artist.id}
                    artistName={artist.name}
                    organizationId={artist.organization_id}
                    className="w-full"
                  />
                  
                  {/* Social Links */}
                  <div className="flex space-x-2">
                    {artist.website_url && (
                      <a
                        href={artist.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                    {artist.instagram_handle && (
                      <a
                        href={`https://instagram.com/${artist.instagram_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                    {artist.email && (
                      <a
                        href={`mailto:${artist.email}`}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Users },
                { id: 'portfolio', label: 'Portfolio', icon: Camera },
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'contact', label: 'Contact', icon: Mail }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Studio Information
                  </h3>
                  <div className="space-y-3">
                    {artist.studio_location && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-3" />
                        <span>{artist.studio_location}</span>
                      </div>
                    )}
                    {artist.year_started && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-3" />
                        <span>
                          {artist.year_started}
                          {artist.year_ended && artist.year_ended !== artist.year_started && ` - ${artist.year_ended}`}
                        </span>
                      </div>
                    )}
                    {artist.phone && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-3" />
                        <span>{artist.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Specialties & Media
                  </h3>
                  <div className="space-y-3">
                    {artist.specialties && artist.specialties.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {artist.specialties.map((specialty, index) => (
                            <Badge key={index} variant="default">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {artist.media && artist.media.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Media</h4>
                        <div className="flex flex-wrap gap-2">
                          {artist.media.map((media, index) => (
                            <Badge key={index} variant="default" className="flex items-center space-x-1">
                              {getMediaIcon(media)}
                              <span>{media}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div>
                {artist.portfolio_images && artist.portfolio_images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artist.portfolio_images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No portfolio images available
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                {artist.awards && artist.awards.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Awards & Recognition
                    </h3>
                    <ul className="space-y-2">
                      {artist.awards.map((award, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-400">
                          • {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {artist.exhibitions && artist.exhibitions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Exhibitions
                    </h3>
                    <ul className="space-y-2">
                      {artist.exhibitions.map((exhibition, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-400">
                          • {exhibition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {artist.publications && artist.publications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Publications
                    </h3>
                    <ul className="space-y-2">
                      {artist.publications.map((publication, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-400">
                          • {publication}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {artist.education && artist.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Education
                    </h3>
                    <ul className="space-y-2">
                      {artist.education.map((edu, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-400">
                          • {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(!artist.awards || artist.awards.length === 0) &&
                 (!artist.exhibitions || artist.exhibitions.length === 0) &&
                 (!artist.publications || artist.publications.length === 0) &&
                 (!artist.education || artist.education.length === 0) && (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No achievements information available
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                {artist.email && (
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                      <a
                        href={`mailto:${artist.email}`}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        {artist.email}
                      </a>
                    </div>
                  </div>
                )}

                {artist.phone && (
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                      <a
                        href={`tel:${artist.phone}`}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        {artist.phone}
                      </a>
                    </div>
                  </div>
                )}

                {artist.website_url && (
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</p>
                      <a
                        href={artist.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {artist.instagram_handle && (
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Instagram className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Instagram</p>
                      <a
                        href={`https://instagram.com/${artist.instagram_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        @{artist.instagram_handle}
                      </a>
                    </div>
                  </div>
                )}

                {!artist.email && !artist.phone && !artist.website_url && !artist.instagram_handle && (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No contact information available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Claim Profile Section */}
        {!artist.is_claimed && user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Claim This Profile
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200">
                  Are you {artist.name}? Claim this profile to manage your information and showcase your work.
                </p>
              </div>
              <a
                href={`/artists/claim/${artist.id}`}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Claim Profile
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
