'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
// import { ClerkService } from '@/lib/clerk';
import { Badge } from '@/components/ui/Badge';
import { Search, MapPin, Users, Calendar, Mail, Globe, Instagram, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

interface ArtistProfile {
  id: string;
  name: string;
  studio_number: string | null;
  studio_type: 'Studio' | 'Associate' | 'Gallery';
  studio_location: string | null;
  bio: string | null;
  website_url: string | null;
  instagram_handle: string | null;
  email: string | null;
  phone: string | null;
  profile_image: string | null;
  is_active: boolean;
  is_claimed: boolean;
  claimed_by: string | null;
  claimed_at: string | null;
  year_started: number | null;
  year_ended: number | null;
  created_at: string;
  updated_at: string;
}

export default function ClaimArtistPage() {
  const { user, isLoaded } = useUser();
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArtists() {
      if (isLoaded && user) {
        try {
          const response = await fetch('/api/artists?status=unclaimed');
          if (response.ok) {
            const data = await response.json();
            setArtists(data);
          }
        } catch (error) {
          console.error('Error loading artists:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadArtists();
  }, [isLoaded, user]);

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (artist.studio_number && artist.studio_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleClaim = async (artistId: string, artistName: string) => {
    if (!user) return;

    setClaiming(artistId);
    setClaimError(null);
    setClaimSuccess(null);

    try {
      const response = await fetch('/api/artists/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artist_id: artistId,
          claim_reason: `I am ${artistName} and would like to claim my artist profile.`,
          supporting_evidence: `My email address (${user.emailAddresses[0]?.emailAddress}) and name (${user.firstName} ${user.lastName}) match this artist profile.`
        }),
      });

      if (response.ok) {
        setClaimSuccess(`Successfully submitted claim for ${artistName}. An administrator will review your request.`);
        // Remove the claimed artist from the list
        setArtists(artists.filter(artist => artist.id !== artistId));
      } else {
        const error = await response.json();
        setClaimError(error.error || 'Failed to submit claim request');
      }
    } catch (error) {
      console.error('Error claiming artist:', error);
      setClaimError('Failed to submit claim request. Please try again.');
    } finally {
      setClaiming(null);
    }
  };

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

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to claim your artist profile
          </h1>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Claim Your Artist Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Search for your artist profile and submit a claim request to take ownership
          </p>
        </div>

        {/* Success/Error Messages */}
        {claimSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
              <p className="text-green-800 dark:text-green-200">{claimSuccess}</p>
            </div>
          </div>
        )}

        {claimError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
              <p className="text-red-800 dark:text-red-200">{claimError}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for your name or studio number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Found {filteredArtists.length} unclaimed artist profile{filteredArtists.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Artist Image */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {artist.profile_image ? (
                  <img
                    src={artist.profile_image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    <Users className="w-12 h-12 mx-auto" />
                    <p className="text-sm mt-2">No Image</p>
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {artist.name}
                  </h3>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Unclaimed
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {artist.studio_number && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{artist.studio_location || `Studio ${artist.studio_number}`}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Badge className={`${getStudioTypeColor(artist.studio_type)} text-xs`}>
                      {artist.studio_type}
                    </Badge>
                  </div>

                  {artist.year_started && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {artist.year_started}
                        {artist.year_ended && artist.year_ended !== artist.year_started && ` - ${artist.year_ended}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex space-x-2 mb-4">
                  {artist.website_url && (
                    <a
                      href={artist.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {artist.instagram_handle && (
                    <a
                      href={`https://instagram.com/${artist.instagram_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-500"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}`}
                      className="text-gray-600 hover:text-gray-500"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => handleClaim(artist.id, artist.name)}
                  disabled={claiming === artist.id}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md transition-colors"
                >
                  {claiming === artist.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Claim This Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {searchTerm ? 'No matching artists found' : 'No unclaimed artists available'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search terms or contact an administrator if you believe your profile should be listed.'
                : 'All artist profiles have been claimed or there are no artists in your organization yet.'
              }
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
            How to Claim Your Profile
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Search for your name or studio number in the search bar above</li>
            <li>Review the artist profile to ensure it matches your information</li>
            <li>Click "Claim This Profile" to submit your claim request</li>
            <li>An administrator will review your request and approve or deny it</li>
            <li>Once approved, you'll be able to edit and manage your artist profile</li>
          </ol>
          <p className="mt-4 text-sm text-blue-700 dark:text-blue-300">
            If you can't find your profile or need assistance, please contact your organization administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
