'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Printer,
  Video,
  Mic,
  Headphones
} from 'lucide-react';

interface ExhibitionSpace {
  id: string;
  name: string;
  type: 'main-gallery' | 'project-space' | 'outdoor' | 'performance' | 'screening' | 'workshop';
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  description: string;
  equipment: string[];
  amenities: string[];
  hourlyRate: number;
  imageUrl?: string;
  currentExhibition?: Exhibition;
}

interface Exhibition {
  id: string;
  title: string;
  artist: string;
  email: string;
  phone?: string;
  website?: string;
  bio: string;
  specialties: string[];
  startDate: string;
  endDate: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  avatar?: string;
  isActive: boolean;
  spaceId?: string;
  exhibitionType: 'solo' | 'group' | 'curated' | 'performance' | 'screening';
  description: string;
  works: {
    title: string;
    description: string;
    imageUrl: string;
    year: number;
    medium: string;
  }[];
}

function EdgeZonesMapPageContent() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [exhibitionSpaces, setExhibitionSpaces] = useState<ExhibitionSpace[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ExhibitionSpace | null>(null);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    if (tenantId === 'edgezones') {
      loadEdgeZonesData();
    }
  }, [tenantId]);

  const loadEdgeZonesData = () => {
    // Mock data - in real implementation, fetch from API
    const mockExhibitionSpaces: ExhibitionSpace[] = [
      {
        id: 'main-gallery',
        name: 'Main Gallery',
        type: 'main-gallery',
        capacity: 100,
        status: 'occupied',
        description: 'Large main exhibition space with professional lighting and climate control',
        equipment: ['Track Lighting', 'Projection System', 'Audio System', 'Display Cases', 'Security System'],
        amenities: ['Climate Control', 'Professional Lighting', 'Security', 'Accessibility', 'Storage'],
        hourlyRate: 150,
        imageUrl: '/images/spaces/main-gallery.jpg'
      },
      {
        id: 'project-space',
        name: 'Project Space',
        type: 'project-space',
        capacity: 50,
        status: 'available',
        description: 'Flexible project space for experimental and emerging artists',
        equipment: ['Flexible Lighting', 'White Walls', 'Audio System', 'Display System'],
        amenities: ['Flexible Layout', 'Climate Control', 'Storage', 'Accessibility'],
        hourlyRate: 75,
        imageUrl: '/images/spaces/project-space.jpg'
      },
      {
        id: 'outdoor-courtyard',
        name: 'Outdoor Courtyard',
        type: 'outdoor',
        capacity: 200,
        status: 'available',
        description: 'Large outdoor courtyard perfect for installations and performances',
        equipment: ['Power Outlets', 'Lighting', 'Sound System', 'Weather Protection'],
        amenities: ['Outdoor Space', 'Weather Protection', 'Power Access', 'Flexible Layout'],
        hourlyRate: 100,
        imageUrl: '/images/spaces/outdoor-courtyard.jpg'
      },
      {
        id: 'performance-space',
        name: 'Performance Space',
        type: 'performance',
        capacity: 80,
        status: 'occupied',
        description: 'Intimate performance space with professional audio and lighting',
        equipment: ['Stage', 'Professional Audio', 'Lighting System', 'Seating', 'Backstage'],
        amenities: ['Professional Audio', 'Lighting', 'Climate Control', 'Accessibility'],
        hourlyRate: 125,
        imageUrl: '/images/spaces/performance-space.jpg'
      },
      {
        id: 'screening-room',
        name: 'Screening Room',
        type: 'screening',
        capacity: 40,
        status: 'available',
        description: 'Professional screening room with high-quality projection and sound',
        equipment: ['4K Projector', 'Surround Sound', 'Seating', 'Blackout Curtains'],
        amenities: ['Professional AV', 'Climate Control', 'Soundproofing', 'Accessibility'],
        hourlyRate: 80,
        imageUrl: '/images/spaces/screening-room.jpg'
      },
      {
        id: 'workshop-space',
        name: 'Workshop Space',
        type: 'workshop',
        capacity: 25,
        status: 'available',
        description: 'Flexible workshop space for educational programs and artist talks',
        equipment: ['Tables', 'Chairs', 'Projection', 'Whiteboard', 'Audio System'],
        amenities: ['Flexible Seating', 'Climate Control', 'WiFi', 'Storage'],
        hourlyRate: 60,
        imageUrl: '/images/spaces/workshop-space.jpg'
      }
    ];

    const mockExhibitions: Exhibition[] = [
      {
        id: 'exhibition-1',
        title: 'Digital Landscapes',
        artist: 'Alex Rivera',
        email: 'alex@example.com',
        phone: '(305) 555-0123',
        website: 'https://alexrivera.digital',
        bio: 'Digital artist exploring the intersection of technology and nature through immersive installations.',
        specialties: ['Digital Art', 'Installation', 'VR/AR', 'Interactive Media'],
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        socialMedia: {
          instagram: '@alexrivera_digital',
          twitter: '@alexrivera_art'
        },
        avatar: '/images/artists/alex-rivera.jpg',
        isActive: true,
        spaceId: 'main-gallery',
        exhibitionType: 'solo',
        description: 'An immersive exploration of digital landscapes that blur the boundaries between virtual and physical reality.',
        works: [
          {
            title: 'Virtual Forest',
            description: 'Interactive VR installation exploring digital nature',
            imageUrl: '/images/works/virtual-forest.jpg',
            year: 2024,
            medium: 'VR Installation'
          }
        ]
      },
      {
        id: 'exhibition-2',
        title: 'Sound Waves',
        artist: 'Maya Chen',
        email: 'maya@example.com',
        bio: 'Sound artist and composer creating immersive audio experiences.',
        specialties: ['Sound Art', 'Composition', 'Installation', 'Performance'],
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        socialMedia: {
          instagram: '@mayachen_sound'
        },
        avatar: '/images/artists/maya-chen.jpg',
        isActive: true,
        spaceId: 'performance-space',
        exhibitionType: 'performance',
        description: 'A series of sound installations and performances exploring the physicality of sound.',
        works: [
          {
            title: 'Resonance Chamber',
            description: 'Interactive sound installation responding to movement',
            imageUrl: '/images/works/resonance-chamber.jpg',
            year: 2024,
            medium: 'Sound Installation'
          }
        ]
      }
    ];

    // Connect exhibitions to spaces
    const spacesWithExhibitions = mockExhibitionSpaces.map(space => {
      const exhibition = mockExhibitions.find(e => e.spaceId === space.id);
      return { ...space, currentExhibition: exhibition };
    });

    setExhibitionSpaces(spacesWithExhibitions);
    setExhibitions(mockExhibitions);
  };

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'main-gallery': return Building;
      case 'project-space': return Palette;
      case 'outdoor': return MapPin;
      case 'performance': return Mic;
      case 'screening': return Video;
      case 'workshop': return Users;
      default: return Home;
    }
  };

  const getSpaceColor = (type: string) => {
    switch (type) {
      case 'main-gallery': return 'bg-red-100 text-red-800';
      case 'project-space': return 'bg-blue-100 text-blue-800';
      case 'outdoor': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'screening': return 'bg-orange-100 text-orange-800';
      case 'workshop': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'reserved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExhibitionTypeColor = (type: string) => {
    switch (type) {
      case 'solo': return 'bg-blue-100 text-blue-800';
      case 'group': return 'bg-green-100 text-green-800';
      case 'curated': return 'bg-purple-100 text-purple-800';
      case 'performance': return 'bg-orange-100 text-orange-800';
      case 'screening': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSpaces = exhibitionSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.currentExhibition?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.currentExhibition?.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || space.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (tenantId !== 'edgezones') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible for Edge Zones.</p>
        </div>
      </div>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edge Zones Exhibition Spaces</h1>
            <p className="text-gray-600">
              Explore our exhibition spaces and discover current and upcoming shows
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search spaces, exhibitions, or artists..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="main-gallery">Main Gallery</option>
                    <option value="project-space">Project Space</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="performance">Performance</option>
                    <option value="screening">Screening</option>
                    <option value="workshop">Workshop</option>
                  </select>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Map
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exhibition Spaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => {
              const SpaceIcon = getSpaceIcon(space.type);
              return (
                <Card 
                  key={space.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedSpace(space)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SpaceIcon className="w-5 h-5 text-gray-600" />
                        <CardTitle className="text-lg">{space.name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(space.status)}>
                        {space.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Capacity: {space.capacity} • ${space.hourlyRate}/hour
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{space.description}</p>
                    
                    {/* Space Type Badge */}
                    <div className="mb-4">
                      <Badge className={getSpaceColor(space.type)}>
                        {space.type.replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Equipment */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Equipment:</h4>
                      <div className="flex flex-wrap gap-1">
                        {space.equipment.slice(0, 3).map((equipment, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {equipment}
                          </Badge>
                        ))}
                        {space.equipment.length > 3 && (
                          <Badge variant="default" className="text-xs">
                            +{space.equipment.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Current Exhibition */}
                    {space.currentExhibition && (
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Palette className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{space.currentExhibition.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getExhibitionTypeColor(space.currentExhibition.exhibitionType)}>
                                {space.currentExhibition.exhibitionType}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                by {space.currentExhibition.artist}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(space.currentExhibition.startDate).toLocaleDateString()} - {new Date(space.currentExhibition.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Space Detail Modal */}
          {selectedSpace && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{selectedSpace.name}</h2>
                    <Button variant="outline" onClick={() => setSelectedSpace(null)}>
                      Close
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Space Info */}
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Space Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Description</h4>
                            <p className="text-gray-600">{selectedSpace.description}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Details</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>Capacity: {selectedSpace.capacity} people</li>
                              <li>Hourly Rate: ${selectedSpace.hourlyRate}</li>
                              <li>Status: {selectedSpace.status}</li>
                              <li>Type: {selectedSpace.type.replace('-', ' ')}</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Equipment</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedSpace.equipment.map((equipment, index) => (
                                <Badge key={index} variant="default">
                                  {equipment}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedSpace.amenities.map((amenity, index) => (
                                <Badge key={index} variant="default">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Current Exhibition Info */}
                    {selectedSpace.currentExhibition && (
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>Current Exhibition</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <Palette className="w-8 h-8 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{selectedSpace.currentExhibition.title}</h3>
                                <p className="text-gray-600">by {selectedSpace.currentExhibition.artist}</p>
                                <Badge className={getExhibitionTypeColor(selectedSpace.currentExhibition.exhibitionType)}>
                                  {selectedSpace.currentExhibition.exhibitionType}
                                </Badge>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900">Exhibition Dates</h4>
                              <p className="text-gray-600 text-sm">
                                {new Date(selectedSpace.currentExhibition.startDate).toLocaleDateString()} - {new Date(selectedSpace.currentExhibition.endDate).toLocaleDateString()}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">Description</h4>
                              <p className="text-gray-600 text-sm">{selectedSpace.currentExhibition.description}</p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">Artist Bio</h4>
                              <p className="text-gray-600 text-sm">{selectedSpace.currentExhibition.bio}</p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">Artist Specialties</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedSpace.currentExhibition.specialties.map((specialty, index) => (
                                  <Badge key={index} variant="default">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">Contact & Links</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm text-gray-600">{selectedSpace.currentExhibition.email}</span>
                                </div>
                                {selectedSpace.currentExhibition.website && (
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-600" />
                                    <a 
                                      href={selectedSpace.currentExhibition.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm"
                                    >
                                      Website
                                    </a>
                                  </div>
                                )}
                                {selectedSpace.currentExhibition.socialMedia.instagram && (
                                  <div className="flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-600">
                                      {selectedSpace.currentExhibition.socialMedia.instagram}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TenantLayout>
  );
}

export default function EdgeZonesMapPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EdgeZonesMapPageContent />
    </Suspense>
  );
}

