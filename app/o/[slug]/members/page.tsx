'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getTenantConfig } from '@/lib/tenant';
import { Users, UserCheck, Crown, Shield, User } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  contactEmail?: string;
  website?: string;
  address?: string;
  phone?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Member {
  id: string;
  name: string;
  email?: string;
  role: string;
  joinedAt: string;
  profileImage?: string;
  bio?: string;
  isActive: boolean;
}

interface ArtistProfile {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  studioNumber?: string;
  studioType?: string;
  yearStarted?: number;
  yearEnded?: number;
  isActive: boolean;
  isClaimed: boolean;
  specialties?: string[];
  mediums?: string[];
}

function MembersPageContent() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [artistProfiles, setArtistProfiles] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    async function loadData() {
      console.log('🔄 Members page: Starting loadData', { user: !!user, slug });
      
      try {
        // Get organization details from tenant config (fallback when DB is not available)
        console.log('🔍 Members page: Using tenant config for organization details');
        const tenantConfig = getTenantConfig(slug);
        if (tenantConfig) {
          setOrganization({
            id: tenantConfig.id,
            name: tenantConfig.name,
            slug: tenantConfig.slug,
            description: `${tenantConfig.name} is a community-driven organization.`,
            logo: tenantConfig.theme.logo,
            banner: tenantConfig.theme.banner,
            contactEmail: 'info@example.org',
            website: 'https://example.org',
            address: '123 Main St, City, State',
            phone: '(555) 123-4567',
            socialMedia: {
              facebook: 'https://facebook.com/example',
              instagram: 'https://instagram.com/example',
              twitter: 'https://twitter.com/example',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          setError(`Organization configuration not found for: ${slug}`);
        }

        // Get members and artist profiles (only if authenticated)
        if (user) {
          const usersResponse = await fetch(`/api/organizations/by-slug/${slug}/users`);
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setMembers(usersData.memberships || []);
            setArtistProfiles(usersData.artist_profiles || []);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load members data');
        console.error('❌ Members page: Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadData();
    }
  }, [isLoaded, user, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Members
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'org_admin':
        return <Crown className="h-4 w-4" />;
      case 'moderator':
      case 'staff':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'org_admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'moderator':
      case 'staff':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatRole = (role: string) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {organization?.name} Members
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with our community of artists, staff, and supporters
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Back to Organization
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {members.length + artistProfiles.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Staff Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {members.filter(m => ['super_admin', 'org_admin', 'moderator', 'staff'].includes(m.role)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Artists
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {artistProfiles.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sign In Prompt for Guest Users */}
        {!user && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Sign in to view member details
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Join our community to see detailed member profiles and connect with other artists
                </p>
                <Button onClick={() => router.push('/login')}>
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Members List */}
        {user && (
          <div className="space-y-8">
            {/* Staff Members */}
            {members.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Staff & Administrators
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <Card key={member.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={member.profileImage} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </h3>
                            <Badge className={`${getRoleColor(member.role)} flex items-center space-x-1 w-fit`}>
                              {getRoleIcon(member.role)}
                              <span>{formatRole(member.role)}</span>
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                        {member.bio && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                            {member.bio}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Artist Profiles */}
            {artistProfiles.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Artists
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artistProfiles.map((artist) => (
                    <Card key={artist.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={artist.profileImage} />
                            <AvatarFallback>
                              {artist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {artist.name}
                            </h3>
                            <Badge variant="default" className="flex items-center space-x-1 w-fit">
                              <User className="h-3 w-3" />
                              <span>Artist</span>
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {artist.studioNumber && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Studio {artist.studioNumber}
                          </p>
                        )}
                        {artist.bio && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                            {artist.bio}
                          </p>
                        )}
                        {artist.specialties && artist.specialties.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {artist.specialties.slice(0, 3).map((specialty, index) => (
                                <Badge key={index} variant="default" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {members.length === 0 && artistProfiles.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No members found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This organization doesn't have any members yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading members...</p>
        </div>
      </div>
    }>
      <MembersPageContent />
    </Suspense>
  );
}
