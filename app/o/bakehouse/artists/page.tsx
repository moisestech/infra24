'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { UnifiedNavigation, bakehouseConfig } from '@/components/navigation';
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
  Globe
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
  organizations: {
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

export default function BakehouseArtistsPage() {
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
        console.log('🔍 BakehouseArtistsPage: Loading data for bakehouse');
        
        // Load organization data
        const orgResponse = await fetch(`/api/organizations/by-slug/bakehouse`);
        console.log('🔍 BakehouseArtistsPage: Organization response status:', orgResponse.status);
        
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          console.log('🔍 BakehouseArtistsPage: Organization data:', orgData);
          setOrganization(orgData.organization);
          
          // Load artists for this organization
          const artistsUrl = `/api/artists?orgId=${orgData.organization.id}`;
          console.log('🔍 BakehouseArtistsPage: Fetching artists from:', artistsUrl);
          
          const artistsResponse = await fetch(artistsUrl);
          console.log('🔍 BakehouseArtistsPage: Artists response status:', artistsResponse.status);
          
          if (artistsResponse.ok) {
            const artistsData = await artistsResponse.json();
            console.log('🔍 BakehouseArtistsPage: Artists data:', artistsData);
            setArtists(artistsData.artists || []);
          } else {
            console.error('❌ BakehouseArtistsPage: Failed to fetch artists:', artistsResponse.status, artistsResponse.statusText);
          }
        } else {
          console.error('❌ BakehouseArtistsPage: Failed to fetch organization:', orgResponse.status, orgResponse.statusText);
        }
      } catch (error) {
        console.error('❌ BakehouseArtistsPage: Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (artist.bio && artist.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStudioType = !studioTypeFilter || artist.studio_type === studioTypeFilter;
    const matchesStudioNumber = !studioNumberFilter || artist.studio_location === studioNumberFilter;
    
    return matchesSearch && matchesStudioType && matchesStudioNumber;
  });

  const uniqueStudioTypes = [...new Set(artists.map(artist => artist.studio_type).filter(Boolean))];
  const uniqueStudioNumbers = [...new Set(artists.map(artist => artist.studio_location).filter(Boolean))];

  const getStudioTypeIcon = (studioType: string) => {
    const IconComponent = studioTypeIcons[studioType as keyof typeof studioTypeIcons] || User;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStudioTypeColor = (studioType: string) => {
    return studioTypeColors[studioType as keyof typeof studioTypeColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={bakehouseConfig} userRole="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <UnifiedNavigation config={bakehouseConfig} userRole="admin" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Artists & Members
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {organization?.name} - {artists.length} members
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Artist
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Studio Type Filter */}
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
            <Link 
              key={artist.id} 
              href={`/o/bakehouse/artists/${artist.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Artist Image */}
              <div className="relative">
                {artist.profile_image ? (
                  <img
                    src={artist.profile_image}
                    alt={artist.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Studio Type Badge */}
                {artist.studio_type && (
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getStudioTypeColor(artist.studio_type)} flex items-center space-x-1`}>
                      {getStudioTypeIcon(artist.studio_type)}
                      <span className="text-xs font-medium">
                        {artist.studio_type}
                      </span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {artist.name}
                </h3>
                
                {artist.studio_location && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Studio: {artist.studio_location}
                  </p>
                )}
                
                {artist.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {artist.bio}
                  </p>
                )}

                {/* Join Date */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Joined: {new Date(artist.created_at).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      View Profile →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {artists.length === 0 ? 'No artists found' : 'No artists match your filters'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {artists.length === 0 
                ? 'There are no artists registered for this organization yet.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {artists.length === 0 && (
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add First Artist
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
