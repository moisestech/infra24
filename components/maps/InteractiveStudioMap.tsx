'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  Star,
  ExternalLink,
  BookOpen,
  User
} from 'lucide-react';

// Types
interface StudioProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  claimed: boolean;
  studioNumber: string;
  specialties?: string[];
  bio?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
  };
}

interface StudioShape {
  id: string;
  code: string;
  x: number;
  y: number;
  width: number;
  height: number;
  profile?: StudioProfile;
}

interface InteractiveStudioMapProps {
  orgSlug: string;
  svgUrl: string;
  onStudioClick: (studio: StudioShape) => void;
  onBookArtist: (profile: StudioProfile) => void;
  onViewProfile?: (profile: StudioProfile) => void;
  onArtistsLoaded?: (artists: StudioProfile[]) => void;
  searchTerm?: string;
  filterType?: string;
  className?: string;
}

// Studio Hover Card Component
const StudioHoverCard: React.FC<{
  studio: StudioShape;
  onBook: (profile: StudioProfile) => void;
  onViewProfile?: (profile: StudioProfile) => void;
  hoverTimeout: NodeJS.Timeout | null;
  setHoverTimeout: (timeout: NodeJS.Timeout | null) => void;
  setHoveredStudio: (studioId: string | null) => void;
}> = ({ studio, onBook, onViewProfile, hoverTimeout, setHoverTimeout, setHoveredStudio }) => {
  // Check if this is the Garden area
  const isGarden = studio.code === 'Garden';
  
  if (!studio.profile && !isGarden) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute z-50 pointer-events-auto"
        style={{
          left: studio.x + studio.width / 2,
          top: studio.y - 10,
          transform: 'translateX(-50%) translateY(-100%)'
        }}
        onMouseEnter={() => {
          // Clear any existing timeout when hovering over the card
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
          }
        }}
        onMouseLeave={() => {
          // Set a timeout to hide the hover after 1 second
          const timeout = setTimeout(() => {
            setHoveredStudio(null);
          }, 1000);
          setHoverTimeout(timeout);
        }}
      >
        <Card className="w-80 sm:w-96 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Studio {studio.code}</h3>
              <p className="text-base text-gray-600 mb-4">Available for assignment</p>
              <Button size="lg" variant="outline" className="w-full">
                <User className="w-6 h-6 mr-2" />
                Claim Studio
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Garden area special case
  if (isGarden) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute z-50 pointer-events-auto"
        style={{
          left: studio.x + studio.width / 2,
          top: studio.y - 10,
          transform: 'translateX(-50%) translateY(-100%)'
        }}
        onMouseEnter={() => {
          // Clear any existing timeout when hovering over the card
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
          }
        }}
        onMouseLeave={() => {
          // Set a timeout to hide the hover after 1 second
          const timeout = setTimeout(() => {
            setHoveredStudio(null);
          }, 1000);
          setHoverTimeout(timeout);
        }}
      >
        <Card className="w-80 sm:w-96 shadow-xl border-0 bg-green-50/95 backdrop-blur-sm border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">Garden</h3>
              <p className="text-base text-green-700 mb-4">Outdoor creative space</p>
              <div className="text-sm text-green-600">
                Perfect for outdoor installations, performances, and community events
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const profile = studio.profile!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-50 pointer-events-auto"
      style={{
        left: studio.x + studio.width / 2,
        top: studio.y - 10,
        transform: 'translateX(-50%) translateY(-100%)'
      }}
      onMouseEnter={() => {
        // Clear any existing timeout when hovering over the card
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
        }
      }}
      onMouseLeave={() => {
        // Set a timeout to hide the hover after 1 second
        const timeout = setTimeout(() => {
          setHoveredStudio(null);
        }, 1000);
        setHoverTimeout(timeout);
      }}
    >
      <Card className="w-80 sm:w-96 shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
        {/* Background Banner */}
        <div 
          className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 relative"
          style={{
            backgroundImage: profile?.avatarUrl ? `url(${profile.avatarUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="absolute inset-0 bg-blue-500/80"></div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-24 h-24 -mt-12 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatarUrl || undefined} />
              <AvatarFallback className="text-lg">
                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 truncate mb-1">{profile.name}</h3>
              <p className="text-base text-gray-600 mb-3">Studio {profile.studioNumber}</p>
              
              {/* Website URL */}
              {profile.website && (
                <div className="mb-3">
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {profile.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  </a>
                </div>
              )}
              
              {profile.specialties && profile.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="default" className="text-sm">
                      {specialty}
                    </Badge>
                  ))}
                  {profile.specialties.length > 3 && (
                    <Badge variant="default" className="text-sm">
                      +{profile.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={() => onBook(profile)}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Book Visit
                </Button>
                {onViewProfile && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => onViewProfile(profile)}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Interactive Studio Map Component
export const InteractiveStudioMap: React.FC<InteractiveStudioMapProps> = ({
  orgSlug,
  svgUrl,
  onStudioClick,
  onBookArtist,
  onViewProfile,
  onArtistsLoaded,
  searchTerm = '',
  filterType = 'all',
  className = ''
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [studioShapes, setStudioShapes] = useState<StudioShape[]>([]);
  const [profiles, setProfiles] = useState<Record<string, StudioProfile>>({});
  const [hoveredStudio, setHoveredStudio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const supabase = useMemo(() => 
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), []
  );

  // Parse SVG and extract studio shapes
  const parseSVG = (svgText: string): StudioShape[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const shapes: StudioShape[] = [];

    // Find all rect elements with studio IDs
    const rects = doc.querySelectorAll('rect[id*="Studio"]');
    
    rects.forEach((rect) => {
      const id = rect.getAttribute('id');
      if (id && id.includes('Studio')) {
        const x = parseFloat(rect.getAttribute('x') || '0');
        const y = parseFloat(rect.getAttribute('y') || '0');
        const width = parseFloat(rect.getAttribute('width') || '0');
        const height = parseFloat(rect.getAttribute('height') || '0');
        
        // Extract studio number from ID (e.g., "Studio 5" -> "5", "Studio A" -> "A")
        let studioNumber = id.replace('Studio ', '').trim();
        
        // Handle special cases like "Studio 1_2" -> "1_2"
        if (studioNumber.includes('_')) {
          studioNumber = studioNumber;
        }
        
        shapes.push({
          id: id,
          code: studioNumber,
          x,
          y,
          width,
          height
        });
      }
    });

    return shapes;
  };

  // Load artist profiles from Supabase
  const loadProfiles = async (orgSlug: string): Promise<Record<string, StudioProfile>> => {
    try {
      // First get the organization ID
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', orgSlug)
        .single();

      if (orgError || !org) {
        console.warn('Organization not found:', orgSlug);
        return {};
      }

      // Get artist profiles for this organization
      const { data: artists, error: artistsError } = await supabase
        .from('artist_profiles')
        .select(`
          id,
          name,
          profile_image,
          studio_number,
          studio_type,
          bio,
          specialties,
          website_url,
          instagram_handle,
          is_active
        `)
        .eq('organization_id', org.id)
        .eq('is_active', true)
        .not('studio_number', 'is', null);

      if (artistsError) {
        console.warn('Failed to load artist profiles:', artistsError);
        return {};
      }

      console.log('Loaded artists:', artists);

      // Convert to the expected format
      const profileMap: Record<string, StudioProfile> = {};
      artists?.forEach((artist) => {
        if (artist.studio_number) {
          // Create multiple keys for different studio number formats
          const studioNumber = artist.studio_number;
          profileMap[studioNumber] = {
            id: artist.id,
            name: artist.name,
            avatarUrl: artist.profile_image,
            claimed: true, // If they have a studio number, they're claimed
            studioNumber: artist.studio_number,
            specialties: artist.specialties || [],
            bio: artist.bio,
            website: artist.website_url,
            socialMedia: {
              instagram: artist.instagram_handle
            }
          };

          // Also create entries for common variations
          if (studioNumber.includes(',')) {
            // Handle cases like "1,15" - create entries for both
            const numbers = studioNumber.split(',').map((n: string) => n.trim());
            numbers.forEach((num: string) => {
              profileMap[num] = profileMap[studioNumber];
            });
          }
        }
      });

      console.log('Profile map created:', profileMap);
      return profileMap;
    } catch (error) {
      console.error('Error loading profiles:', error);
      return {};
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);
        
        // Load SVG content
        const response = await fetch(svgUrl);
        const svgText = await response.text();
        setSvgContent(svgText);
        
        // Parse studio shapes from SVG
        const shapes = parseSVG(svgText);
        setStudioShapes(shapes);
        
        // Load artist profiles
        const profileData = await loadProfiles(orgSlug);
        setProfiles(profileData);
        
        // Notify parent component of loaded artists
        if (onArtistsLoaded) {
          const artistsList = Object.values(profileData);
          onArtistsLoaded(artistsList);
        }
        
        // Merge profiles with shapes
        const shapesWithProfiles = shapes.map(shape => {
          // Try to find a matching profile using various matching strategies
          let profile = profileData[shape.code];
          
          if (!profile) {
            // Try different variations of the studio code
            const codeVariations = [
              shape.code,
              shape.code.replace(/^Studio\s*/i, ''), // Remove "Studio" prefix
              shape.code.replace(/^A-/, ''), // Remove "A-" prefix
              shape.code.replace(/^B-/, ''), // Remove "B-" prefix
              shape.code.replace(/^C-/, ''), // Remove "C-" prefix
              shape.code.replace(/^D-/, ''), // Remove "D-" prefix
              shape.code.replace(/^E-/, ''), // Remove "E-" prefix
              shape.code.replace(/^F-/, ''), // Remove "F-" prefix
              shape.code.replace(/^G-/, ''), // Remove "G-" prefix
              shape.code.replace(/^H-/, ''), // Remove "H-" prefix
              shape.code.replace(/^I-/, ''), // Remove "I-" prefix
              shape.code.replace(/^J-/, ''), // Remove "J-" prefix
              shape.code.replace(/^K-/, ''), // Remove "K-" prefix
              shape.code.replace(/^L-/, ''), // Remove "L-" prefix
              shape.code.replace(/^M-/, ''), // Remove "M-" prefix
              shape.code.replace(/^N-/, ''), // Remove "N-" prefix
              shape.code.replace(/^O-/, ''), // Remove "O-" prefix
              shape.code.replace(/^P-/, ''), // Remove "P-" prefix
              shape.code.replace(/^Q-/, ''), // Remove "Q-" prefix
              shape.code.replace(/^R-/, ''), // Remove "R-" prefix
              shape.code.replace(/^S-/, ''), // Remove "S-" prefix
              shape.code.replace(/^T-/, ''), // Remove "T-" prefix
              shape.code.replace(/^U-/, ''), // Remove "U-" prefix
              shape.code.replace(/^V-/, ''), // Remove "V-" prefix
              shape.code.replace(/^W-/, ''), // Remove "W-" prefix
              shape.code.replace(/^X-/, ''), // Remove "X-" prefix
              shape.code.replace(/^Y-/, ''), // Remove "Y-" prefix
              shape.code.replace(/^Z-/, ''), // Remove "Z-" prefix
              `A-${shape.code}`, // Add "A-" prefix
              `B-${shape.code}`, // Add "B-" prefix
              `C-${shape.code}`, // Add "C-" prefix
              `D-${shape.code}`, // Add "D-" prefix
              `E-${shape.code}`, // Add "E-" prefix
              `F-${shape.code}`, // Add "F-" prefix
              `G-${shape.code}`, // Add "G-" prefix
              `H-${shape.code}`, // Add "H-" prefix
              `I-${shape.code}`, // Add "I-" prefix
              `J-${shape.code}`, // Add "J-" prefix
              `K-${shape.code}`, // Add "K-" prefix
              `L-${shape.code}`, // Add "L-" prefix
              `M-${shape.code}`, // Add "M-" prefix
              `N-${shape.code}`, // Add "N-" prefix
              `O-${shape.code}`, // Add "O-" prefix
              `P-${shape.code}`, // Add "P-" prefix
              `Q-${shape.code}`, // Add "Q-" prefix
              `R-${shape.code}`, // Add "R-" prefix
              `S-${shape.code}`, // Add "S-" prefix
              `T-${shape.code}`, // Add "T-" prefix
              `U-${shape.code}`, // Add "U-" prefix
              `V-${shape.code}`, // Add "V-" prefix
              `W-${shape.code}`, // Add "W-" prefix
              `X-${shape.code}`, // Add "X-" prefix
              `Y-${shape.code}`, // Add "Y-" prefix
              `Z-${shape.code}`, // Add "Z-" prefix
              `Studio ${shape.code}`, // Add "Studio" prefix
              `Studio A-${shape.code}`, // Add "Studio A-" prefix
              `Studio B-${shape.code}`, // Add "Studio B-" prefix
              `Studio C-${shape.code}`, // Add "Studio C-" prefix
              `Studio D-${shape.code}`, // Add "Studio D-" prefix
              `Studio E-${shape.code}`, // Add "Studio E-" prefix
              `Studio F-${shape.code}`, // Add "Studio F-" prefix
              `Studio G-${shape.code}`, // Add "Studio G-" prefix
              `Studio H-${shape.code}`, // Add "Studio H-" prefix
              `Studio I-${shape.code}`, // Add "Studio I-" prefix
              `Studio J-${shape.code}`, // Add "Studio J-" prefix
              `Studio K-${shape.code}`, // Add "Studio K-" prefix
              `Studio L-${shape.code}`, // Add "Studio L-" prefix
              `Studio M-${shape.code}`, // Add "Studio M-" prefix
              `Studio N-${shape.code}`, // Add "Studio N-" prefix
              `Studio O-${shape.code}`, // Add "Studio O-" prefix
              `Studio P-${shape.code}`, // Add "Studio P-" prefix
              `Studio Q-${shape.code}`, // Add "Studio Q-" prefix
              `Studio R-${shape.code}`, // Add "Studio R-" prefix
              `Studio S-${shape.code}`, // Add "Studio S-" prefix
              `Studio T-${shape.code}`, // Add "Studio T-" prefix
              `Studio U-${shape.code}`, // Add "Studio U-" prefix
              `Studio V-${shape.code}`, // Add "Studio V-" prefix
              `Studio W-${shape.code}`, // Add "Studio W-" prefix
              `Studio X-${shape.code}`, // Add "Studio X-" prefix
              `Studio Y-${shape.code}`, // Add "Studio Y-" prefix
              `Studio Z-${shape.code}`, // Add "Studio Z-" prefix
            ];
            
            // Try each variation
            for (const variation of codeVariations) {
              if (profileData[variation]) {
                profile = profileData[variation];
                console.log(`Matched studio ${shape.code} with profile using variation: ${variation}`);
                break;
              }
            }
          }
          
          return {
            ...shape,
            profile
          };
        });
        
        console.log('Shapes with profiles:', shapesWithProfiles);
        setStudioShapes(shapesWithProfiles);
        
      } catch (error) {
        console.error('Error initializing map:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeMap();
  }, [orgSlug, svgUrl, supabase]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleStudioClick = (studio: StudioShape) => {
    onStudioClick(studio);
  };

  const handleBookArtist = (profile: StudioProfile) => {
    onBookArtist(profile);
  };

  const handleViewProfile = (profile: StudioProfile) => {
    if (onViewProfile) {
      onViewProfile(profile);
    } else {
      // Fallback: navigate to artist profile page
      window.open(`/o/${orgSlug}/artists/${profile.id}`, '_blank');
    }
  };

  // Filter studios based on search term and filter type
  const filteredStudios = useMemo(() => {
    return studioShapes.filter(studio => {
      // Filter by type (occupied/available)
      const isOccupied = !!studio.profile;
      if (filterType === 'occupied' && !isOccupied) return false;
      if (filterType === 'available' && isOccupied) return false;
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const studioMatches = studio.code.toLowerCase().includes(searchLower);
        const artistMatches = studio.profile?.name.toLowerCase().includes(searchLower);
        const specialtyMatches = studio.profile?.specialties?.some(s => 
          s.toLowerCase().includes(searchLower)
        );
        
        return studioMatches || artistMatches || specialtyMatches;
      }
      
      return true;
    });
  }, [studioShapes, searchTerm, filterType]);

  // Check if a studio should be highlighted
  const isStudioHighlighted = (studio: StudioShape) => {
    if (!searchTerm) return false;
    const searchLower = searchTerm.toLowerCase();
    return studio.code.toLowerCase().includes(searchLower) ||
           studio.profile?.name.toLowerCase().includes(searchLower) ||
           studio.profile?.specialties?.some(s => s.toLowerCase().includes(searchLower));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Studio Status</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
            <span className="text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full border border-white"></div>
            <span className="text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white shadow-sm"></div>
            <span className="text-gray-700">Search Match</span>
          </div>
        </div>
      </div>

      {/* SVG Background */}
      <div 
        className="w-full h-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      
      {/* Interactive Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {studioShapes.map((studio) => {
          const isHighlighted = isStudioHighlighted(studio);
          const isFiltered = filteredStudios.includes(studio);
          
          return (
            <div
              key={studio.id}
              className={`absolute cursor-pointer pointer-events-auto transition-all duration-200 ${
                !isFiltered ? 'opacity-30' : ''
              }`}
              style={{
                left: studio.x,
                top: studio.y,
                width: studio.width,
                height: studio.height,
              }}
              onMouseEnter={() => {
                // Clear any existing timeout
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                }
                setHoveredStudio(studio.id);
              }}
              onMouseLeave={() => {
                // Set a timeout to hide the hover after 1 second
                const timeout = setTimeout(() => {
                  setHoveredStudio(null);
                }, 1000);
                setHoverTimeout(timeout);
              }}
              onTouchStart={() => {
                // For mobile devices, show tooltip on touch
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
                setHoveredStudio(studio.id);
              }}
              onClick={() => handleStudioClick(studio)}
            >
              {/* Studio highlight overlay */}
              <div 
                className={`w-full h-full transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-yellow-400/40 border-2 border-yellow-500 shadow-lg scale-105'
                    : hoveredStudio === studio.id 
                      ? studio.code === 'Garden'
                        ? 'bg-green-500/30 border-2 border-green-600 shadow-md scale-102'
                        : studio.profile
                          ? 'bg-blue-500/30 border-2 border-blue-600 shadow-md scale-102'
                          : 'bg-gray-500/30 border-2 border-gray-600 shadow-md scale-102'
                      : studio.code === 'Garden'
                        ? 'bg-green-500/20 border-2 border-green-500 shadow-sm'
                        : studio.profile 
                          ? 'bg-blue-500/20 border-2 border-blue-500 shadow-sm' 
                          : 'bg-gray-400/15 border-2 border-gray-400'
                }`}
              />
              
              {/* Studio Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className={`text-xs font-bold px-1 py-0.5 rounded shadow-sm ${
                  studio.width < 30 || studio.height < 20
                    ? 'text-[8px]'
                    : 'text-[10px]'
                } ${
                  isHighlighted
                    ? 'bg-yellow-400 text-yellow-900 shadow-lg'
                    : studio.code === 'Garden'
                      ? 'bg-green-600 text-white shadow-md'
                      : studio.profile
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-600 text-white'
                }`}>
                  {studio.code}
                </span>
              </div>

              {/* Occupancy Indicator */}
              {studio.profile && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"></div>
                </div>
              )}
              
              {/* Garden Indicator */}
              {studio.code === 'Garden' && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full border border-white shadow-sm"></div>
                </div>
              )}
              
              {/* Vacancy Indicator */}
              {!studio.profile && studio.code !== 'Garden' && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full border border-white"></div>
                </div>
              )}

              {/* Hover Tooltip */}
              {hoveredStudio === studio.id && studio.profile && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                  <div className="bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl border max-w-xs sm:max-w-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={studio.profile.avatarUrl || ''} alt={studio.profile.name} />
                        <AvatarFallback className="text-sm">
                          {studio.profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-base">{studio.profile.name}</div>
                        <div className="text-gray-300 text-sm">Studio {studio.code}</div>
                      </div>
                    </div>
                    
                    {/* Website URL */}
                    {studio.profile.website && (
                      <div className="mb-3">
                        <a
                          href={studio.profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {studio.profile.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                        </a>
                      </div>
                    )}
                    
                    {studio.profile.specialties && studio.profile.specialties.length > 0 && (
                      <div className="mb-3">
                        <div className="text-gray-300 text-sm mb-2">Specialties:</div>
                        <div className="flex flex-wrap gap-1">
                          {studio.profile.specialties.slice(0, 3).map((specialty, idx) => (
                            <span key={idx} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                              {specialty}
                            </span>
                          ))}
                          {studio.profile.specialties.length > 3 && (
                            <span className="text-gray-400 text-sm">+{studio.profile.specialties.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProfile(studio.profile!)}
                        className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm"
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        onClick={() => handleBookArtist(studio.profile!)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        <BookOpen className="w-4 h-4" />
                        Book Visit
                      </button>
                    </div>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}

              {/* Vacant Studio Tooltip */}
              {hoveredStudio === studio.id && !studio.profile && studio.code !== 'Garden' && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                  <div className="bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl border">
                    <div className="font-semibold text-base">Studio {studio.code}</div>
                    <div className="text-gray-300 text-sm">Available for rent</div>
                    <div className="text-gray-400 text-sm mt-2">Click to learn more</div>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hover Cards */}
      <AnimatePresence>
        {hoveredStudio && (() => {
          const studio = studioShapes.find(s => s.id === hoveredStudio);
          if (!studio) return null;
          
          return (
            <StudioHoverCard
              studio={studio}
              onBook={handleBookArtist}
              onViewProfile={handleViewProfile}
              hoverTimeout={hoverTimeout}
              setHoverTimeout={setHoverTimeout}
              setHoveredStudio={setHoveredStudio}
            />
          );
        })()}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div>
            <span>Garden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500/10 border border-gray-500/30 rounded"></div>
            <span>Available</span>
          </div>
          {searchTerm && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400/30 border border-yellow-500 rounded"></div>
              <span>Search Match</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveStudioMap;
