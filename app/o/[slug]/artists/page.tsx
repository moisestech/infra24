'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { OrganizationLogo } from '@/components/ui/OrganizationLogo';
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
  Award
} from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  bio?: string;
  profile_image?: string;
  studio_number?: string;
  studio_type?: string;
  is_claimed: boolean;
  claimed_by_clerk_user_id?: string;
  member_type_id?: string;
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
  Studio: Building2,
  Associate: User,
  Gallery: Palette,
  Staff: Briefcase
};

const studioTypeColors = {
  Studio: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  Associate: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  Gallery: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  Staff: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
};

export default function ArtistsPage() {
  const params = useParams();
  const slug = params.slug as string;
  
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
        // Load organization data
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`);
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          setOrganization(orgData.organization);
          
          // Load artists for this organization
          const artistsResponse = await fetch(`/api/artists?orgId=${orgData.organization.id}`);
          if (artistsResponse.ok) {
            const artistsData = await artistsResponse.json();
            setArtists(artistsData.artists || []);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (artist.bio && artist.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStudioType = !studioTypeFilter || artist.studio_type === studioTypeFilter;
    const matchesStudioNumber = !studioNumberFilter || artist.studio_number === studioNumberFilter;
    
    return matchesSearch && matchesStudioType && matchesStudioNumber;
  });

  const uniqueStudioTypes = [...new Set(artists.map(artist => artist.studio_type).filter(Boolean))];
  const uniqueStudioNumbers = [...new Set(artists.map(artist => artist.studio_number).filter(Boolean))];

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
      <div className="max-w-7xl 4xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 4xl:px-12 py-8 4xl:py-16">
        {/* Header */}
        <div className="mb-8 4xl:mb-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {organization && (
                <div className="mr-4 4xl:mr-8">
                  <OrganizationLogo
                    organizationSlug={organization.slug}
                    size="lg"
                    className="h-12 w-12 4xl:h-24 4xl:w-24"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl 4xl:text-6xl font-bold text-gray-900 dark:text-white mb-2 4xl:mb-4">
                  Artists & Members
                </h1>
                <p className="text-lg 4xl:text-3xl text-gray-600 dark:text-gray-400">
                  {organization?.name} - {artists.length} members
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 4xl:space-x-8">
              <button className="inline-flex items-center px-4 py-2 4xl:px-8 4xl:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm 4xl:text-2xl">
                <Plus className="h-4 w-4 4xl:h-8 4xl:w-8 mr-2" />
                Add Artist
              </button>
            </div>
          </div>
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

            {/* Studio Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={studioTypeFilter}
                onChange={(e) => setStudioTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
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
            <div key={artist.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                
                {artist.studio_number && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Studio: {artist.studio_number}
                  </p>
                )}
                
                {artist.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {artist.bio}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(artist.created_at).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
      </div>
    </div>
  );
}

