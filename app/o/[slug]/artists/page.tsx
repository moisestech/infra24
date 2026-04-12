'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { UnifiedNavigation, ooliteConfig } from '@/components/navigation';
import { PageFooter } from '@/components/common/PageFooter';
import { useUser } from '@clerk/nextjs';
import { useTenant } from '@/components/tenant/TenantProvider';
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';
import { resolveOrgPrimary, orgChromeFromPrimary } from '@/lib/org/org-chrome';
import { 
  Users, 
  Filter, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  Palette,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Instagram,
  ExternalLink
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
  created_at: string;
  updated_at: string;
  organization_id: string;
  metadata?: Record<string, any>;
  organizations?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

const studioTypeIcons = {
  'Studio Resident': Building2,
  'Live In Art Resident': User,
  'Cinematic Resident': Palette,
  'Staff': Briefcase
};

const studioTypeColors = {
  'Studio Resident': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Live In Art Resident': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Cinematic Resident': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'Staff': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
};

function residencyLabel(artist: Artist): string {
  const fromMeta =
    artist.metadata &&
    typeof artist.metadata.residency_type === 'string' &&
    artist.metadata.residency_type.trim();
  return (artist.studio_type || fromMeta || '').trim();
}

function studioNumberLabel(artist: Artist): string {
  const fromMeta =
    artist.metadata && typeof artist.metadata.studio === 'string' && artist.metadata.studio.trim();
  return (artist.studio_location || fromMeta || '').trim();
}

export default function ArtistsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useUser();
  const { tenantConfig } = useTenant();
  const { theme: orgTheme } = useOrganizationTheme();

  const orgPrimary = useMemo(
    () => resolveOrgPrimary(tenantConfig?.theme?.primaryColor, orgTheme?.colors?.primary),
    [tenantConfig?.theme?.primaryColor, orgTheme?.colors?.primary]
  );
  const chrome = useMemo(() => orgChromeFromPrimary(orgPrimary), [orgPrimary]);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [studioTypeFilter, setStudioTypeFilter] = useState('');
  const [studioNumberFilter, setStudioNumberFilter] = useState('');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        console.log('🔍 ArtistsPage: Loading data for slug:', slug);
        
        // Load organization data (public API)
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`, {
          cache: 'no-store',
        });
        console.log('🔍 ArtistsPage: Organization response status:', orgResponse.status);
        
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          console.log('🔍 ArtistsPage: Organization data:', orgData);
          const org = orgData.organization;
          if (!org?.id) {
            console.error('❌ ArtistsPage: Organization payload missing id', orgData);
            return;
          }
          setOrganization(org);
          
          const artistsUrl = `/api/artists?orgId=${encodeURIComponent(org.id)}`;
          console.log('🔍 ArtistsPage: Fetching artists from:', artistsUrl);
          
          const artistsResponse = await fetch(artistsUrl, { cache: 'no-store' });
          console.log('🔍 ArtistsPage: Artists response status:', artistsResponse.status);
          
          const contentType = artistsResponse.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            console.error(
              '❌ ArtistsPage: Artists response is not JSON (check Clerk middleware for /api/artists):',
              contentType
            );
            return;
          }
          
          if (artistsResponse.ok) {
            const artistsData = await artistsResponse.json();
            console.log('🔍 ArtistsPage: Artists data:', artistsData);
            setArtists(artistsData.artists || []);
          } else {
            console.error('❌ ArtistsPage: Failed to fetch artists:', artistsResponse.status, artistsResponse.statusText);
          }
        } else {
          console.error('❌ ArtistsPage: Failed to fetch organization:', orgResponse.status, orgResponse.statusText);
        }
      } catch (error) {
        console.error('❌ ArtistsPage: Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (artist.bio && artist.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    const typeLabel = residencyLabel(artist);
    const studioNum = studioNumberLabel(artist);
    const matchesStudioType = !studioTypeFilter || typeLabel === studioTypeFilter;
    const matchesStudioNumber = !studioNumberFilter || studioNum === studioNumberFilter;
    
    return matchesSearch && matchesStudioType && matchesStudioNumber;
  });

  const uniqueStudioTypes = Array.from(
    new Set(artists.map((a) => residencyLabel(a)).filter(Boolean))
  );
  const uniqueStudioNumbers = Array.from(
    new Set(artists.map((a) => studioNumberLabel(a)).filter(Boolean))
  );

  const getStudioTypeIcon = (studioType: string) => {
    const IconComponent = studioTypeIcons[studioType as keyof typeof studioTypeIcons] || User;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStudioTypeColor = (studioType: string) => {
    return studioTypeColors[studioType as keyof typeof studioTypeColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getFirstSentence = (text: string) => {
    if (!text) return '';
    const sentences = text.split(/[.!?]+/);
    return sentences[0] ? sentences[0].trim() + '.' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(2rem+150px)] pb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={ooliteConfig} userRole="admin" />
      <div className="max-w-7xl 4xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 4xl:px-12 pt-[calc(2rem+150px)] pb-8 4xl:pt-[calc(4rem+150px)] 4xl:pb-16">
        {/* Header */}
        <div className="mb-8 4xl:mb-16">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: chrome.iconTileBg }}>
              <Users className="w-8 h-8" style={{ color: chrome.text }} />
            </div>
            <div>
              <h1 className="text-3xl 4xl:text-6xl font-bold text-gray-900 dark:text-white mb-2 4xl:mb-4">
                Artists & Members
              </h1>
              <p className="text-lg 4xl:text-3xl text-gray-600 dark:text-gray-400">
                {organization?.name} - {artists.length} members
              </p>
            </div>
          </div>
          
          {/* Add Artist Button - Admin Only */}
          {user && (
            <div className="flex justify-end">
              <button 
                type="button"
                className="inline-flex items-center px-4 py-2 4xl:px-8 4xl:py-4 rounded-lg transition-colors text-sm 4xl:text-2xl"
                style={{ 
                  backgroundColor: chrome.solid,
                  borderColor: chrome.solid,
                  color: chrome.onSolid,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = chrome.solidHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = chrome.solid
                }}
              >
                <Plus className="h-4 w-4 4xl:h-8 4xl:w-8 mr-2" />
                Add Artist
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Residency Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={studioTypeFilter}
                onChange={(e) => setStudioTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Residency Types</option>
                {uniqueStudioTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Studio Number Filter */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={studioNumberFilter}
                onChange={(e) => setStudioNumberFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Studios</option>
                {uniqueStudioNumbers.map(number => (
                  <option key={number} value={number}>
                    Studio {number}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStudioTypeFilter('');
                setStudioNumberFilter('');
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtists.map((artist) => (
            <div 
              key={artist.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer group"
            >
              {/* Banner Image */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                {residencyLabel(artist) === 'Studio Resident' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                )}
                {residencyLabel(artist) === 'Live In Art Resident' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600"></div>
                )}
                {residencyLabel(artist) === 'Cinematic Resident' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                )}
                {residencyLabel(artist) === 'Staff' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                )}
                
                {/* Residency Type Badge */}
                {residencyLabel(artist) && (
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getStudioTypeColor(residencyLabel(artist))} flex items-center space-x-1`}>
                      {getStudioTypeIcon(residencyLabel(artist))}
                      <span className="text-xs font-medium">
                        {residencyLabel(artist)}
                      </span>
                    </Badge>
                  </div>
                )}

                {/* Avatar positioned like LinkedIn - bottom left over banner */}
                <div className="absolute -bottom-6 left-4">
                  {artist.profile_image ? (
                    <img
                      src={artist.profile_image}
                      alt={artist.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Artist Info */}
              <div className="pt-8 pb-4 px-4">
                {/* Name and Studio */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {artist.name}
                  </h3>
                  
                  {/* Studio Number */}
                  {studioNumberLabel(artist) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Studio {studioNumberLabel(artist)}
                    </p>
                  )}
                </div>
                
                {/* Bio Snippet */}
                {artist.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {getFirstSentence(artist.bio)}
                  </p>
                )}

                {/* Social Links and View Profile */}
                <div className="flex items-center justify-between">
                  {/* Social Links */}
                  <div className="flex items-center space-x-2">
                    {artist.metadata?.website && artist.metadata.website !== '-' && (
                      <a
                        href={artist.metadata.website.startsWith('http') ? artist.metadata.website : `https://${artist.metadata.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group/link"
                        onClick={(e) => e.stopPropagation()}
                        title="Visit Website"
                      >
                        <Globe className="h-4 w-4 text-gray-500 group-hover/link:text-gray-700 dark:text-gray-400 dark:group-hover/link:text-gray-200" />
                      </a>
                    )}
                    {artist.metadata?.instagram && (
                      <a
                        href={`https://instagram.com/${artist.metadata.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group/link"
                        onClick={(e) => e.stopPropagation()}
                        title="Follow on Instagram"
                      >
                        <Instagram className="h-4 w-4 text-gray-500 group-hover/link:text-gray-700 dark:text-gray-400 dark:group-hover/link:text-gray-200" />
                      </a>
                    )}
                  </div>

                  {/* View Profile Button - Smaller with icon */}
                  <Link href={`/o/${slug}/artists/${artist.id}`}>
                    <button 
                      type="button"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                      style={{ 
                        backgroundColor: chrome.solid,
                        color: chrome.onSolid,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = chrome.solidHover
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = chrome.solid
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No artists found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || studioTypeFilter || studioNumberFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by adding your first artist profile.'}
            </p>
          </div>
        )}

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

