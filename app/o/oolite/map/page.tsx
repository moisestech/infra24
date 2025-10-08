'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
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
  Monitor,
  Cpu,
  Printer
} from 'lucide-react';

interface LabSpace {
  id: string;
  name: string;
  type: 'digital-lab' | 'workshop' | 'studio' | 'meeting-room' | 'exhibition';
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  description: string;
  equipment: string[];
  amenities: string[];
  hourlyRate: number;
  imageUrl?: string;
  currentUser?: LabUser;
}

interface LabUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  bio: string;
  specialties: string[];
  joinDate: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  avatar?: string;
  isActive: boolean;
  spaceId?: string;
  membershipType: 'resident' | 'member' | 'visitor';
}

function OoliteMapPageContent() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();
  const [labSpaces, setLabSpaces] = useState<LabSpace[]>([]);
  const [users, setUsers] = useState<LabUser[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<LabSpace | null>(null);
  const [selectedUser, setSelectedUser] = useState<LabUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    if (tenantId === 'oolite') {
      loadOoliteData();
    }
  }, [tenantId]);

  const loadOoliteData = () => {
    // Mock data - in real implementation, fetch from API
    const mockLabSpaces: LabSpace[] = [
      {
        id: 'digital-lab-1',
        name: 'Digital Arts Lab',
        type: 'digital-lab',
        capacity: 12,
        status: 'occupied',
        description: 'Main digital arts lab with high-end workstations, 3D printers, and VR equipment',
        equipment: ['3D Printers', 'VR Headsets', 'High-end Workstations', 'Laser Cutters', 'CNC Machines'],
        amenities: ['High-Speed WiFi', 'Climate Control', 'Soundproofing', 'Storage', 'Projection System'],
        hourlyRate: 25,
        imageUrl: '/images/labs/digital-lab-1.jpg'
      },
      {
        id: 'workshop-1',
        name: 'AI Workshop Space',
        type: 'workshop',
        capacity: 20,
        status: 'available',
        description: 'Dedicated space for AI and machine learning workshops with presentation equipment',
        equipment: ['Projection System', 'Whiteboards', 'Computers', 'Audio System'],
        amenities: ['WiFi', 'Climate Control', 'Flexible Seating', 'Storage'],
        hourlyRate: 30,
        imageUrl: '/images/labs/workshop-1.jpg'
      },
      {
        id: 'studio-1',
        name: 'Creative Studio',
        type: 'studio',
        capacity: 8,
        status: 'occupied',
        description: 'Flexible creative space for individual and small group projects',
        equipment: ['Workstations', 'Drawing Tables', 'Storage', 'Lighting'],
        amenities: ['Natural Light', 'Climate Control', 'WiFi', 'Storage'],
        hourlyRate: 20,
        imageUrl: '/images/labs/studio-1.jpg'
      },
      {
        id: 'meeting-room-1',
        name: 'Collaboration Room',
        type: 'meeting-room',
        capacity: 6,
        status: 'available',
        description: 'Small meeting room for team collaborations and consultations',
        equipment: ['Conference Table', 'Whiteboard', 'Display Screen'],
        amenities: ['WiFi', 'Climate Control', 'Soundproofing'],
        hourlyRate: 15,
        imageUrl: '/images/labs/meeting-room-1.jpg'
      },
      {
        id: 'exhibition-1',
        name: 'Gallery Space',
        type: 'exhibition',
        capacity: 50,
        status: 'reserved',
        description: 'Main exhibition space for showcasing digital art and installations',
        equipment: ['Display Screens', 'Lighting System', 'Audio System', 'Projection'],
        amenities: ['Climate Control', 'Security System', 'Accessibility', 'Storage'],
        hourlyRate: 100,
        imageUrl: '/images/labs/exhibition-1.jpg'
      }
    ];

    const mockUsers: LabUser[] = [
      {
        id: 'user-1',
        name: 'Dr. Sarah Chen',
        email: 'sarah@example.com',
        phone: '(305) 555-0123',
        website: 'https://sarahchen.digital',
        bio: 'Digital artist and AI researcher exploring the intersection of technology and creativity.',
        specialties: ['AI Art', 'Machine Learning', 'Digital Sculpture', 'Interactive Media'],
        joinDate: '2023-01-15',
        socialMedia: {
          instagram: '@sarahchen_ai',
          twitter: '@sarahchen_digital'
        },
        avatar: '/images/users/sarah-chen.jpg',
        isActive: true,
        spaceId: 'digital-lab-1',
        membershipType: 'resident'
      },
      {
        id: 'user-2',
        name: 'Marcus Rodriguez',
        email: 'marcus@example.com',
        phone: '(305) 555-0456',
        website: 'https://marcusrodriguez.art',
        bio: '3D artist and VR developer creating immersive digital experiences.',
        specialties: ['3D Modeling', 'VR Development', 'Game Design', 'Animation'],
        joinDate: '2023-03-20',
        socialMedia: {
          instagram: '@marcusrodriguez_3d',
          linkedin: 'marcus-rodriguez-3d'
        },
        avatar: '/images/users/marcus-rodriguez.jpg',
        isActive: true,
        spaceId: 'studio-1',
        membershipType: 'member'
      },
      {
        id: 'user-3',
        name: 'Elena Vasquez',
        email: 'elena@example.com',
        bio: 'Creative technologist and educator specializing in digital fabrication and maker culture.',
        specialties: ['Digital Fabrication', '3D Printing', 'Laser Cutting', 'Education'],
        joinDate: '2023-02-10',
        socialMedia: {
          instagram: '@elenavasquez_maker'
        },
        avatar: '/images/users/elena-vasquez.jpg',
        isActive: true,
        membershipType: 'member'
      }
    ];

    // Connect users to spaces
    const spacesWithUsers = mockLabSpaces.map(space => {
      const user = mockUsers.find(u => u.spaceId === space.id);
      return { ...space, currentUser: user };
    });

    setLabSpaces(spacesWithUsers);
    setUsers(mockUsers);
  };

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'digital-lab': return Cpu;
      case 'workshop': return Users;
      case 'studio': return Palette;
      case 'meeting-room': return Home;
      case 'exhibition': return Monitor;
      default: return Home;
    }
  };

  const getSpaceColor = (type: string) => {
    switch (type) {
      case 'digital-lab': return 'bg-blue-100 text-blue-800';
      case 'workshop': return 'bg-green-100 text-green-800';
      case 'studio': return 'bg-purple-100 text-purple-800';
      case 'meeting-room': return 'bg-orange-100 text-orange-800';
      case 'exhibition': return 'bg-red-100 text-red-800';
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

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'resident': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'visitor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSpaces = labSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.currentUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || space.type === filterType;
    return matchesSearch && matchesFilter;
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

  if (tenantId !== 'oolite') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible for Oolite Arts.</p>
        </div>
      </div>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Oolite Digital Lab Map</h1>
            <p className="text-gray-600">
              Explore our digital lab spaces and connect with resident artists and technologists
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
                      placeholder="Search spaces, users, or descriptions..."
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
                    <option value="digital-lab">Digital Lab</option>
                    <option value="workshop">Workshop</option>
                    <option value="studio">Studio</option>
                    <option value="meeting-room">Meeting Room</option>
                    <option value="exhibition">Exhibition</option>
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

          {/* Lab Spaces Grid */}
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

                    {/* Current User */}
                    {space.currentUser && (
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{space.currentUser.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getMembershipColor(space.currentUser.membershipType)}>
                                {space.currentUser.membershipType}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {space.currentUser.specialties.slice(0, 2).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Space Type Badge */}
                    <div className="mt-4">
                      <Badge className={getSpaceColor(space.type)}>
                        {space.type.replace('-', ' ')}
                      </Badge>
                    </div>
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

                    {/* Current User Info */}
                    {selectedSpace.currentUser && (
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>Current User</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{selectedSpace.currentUser.name}</h3>
                                <p className="text-gray-600">{selectedSpace.currentUser.email}</p>
                                {selectedSpace.currentUser.phone && (
                                  <p className="text-gray-600">{selectedSpace.currentUser.phone}</p>
                                )}
                                <Badge className={getMembershipColor(selectedSpace.currentUser.membershipType)}>
                                  {selectedSpace.currentUser.membershipType}
                                </Badge>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900">Bio</h4>
                              <p className="text-gray-600 text-sm">{selectedSpace.currentUser.bio}</p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">Specialties</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedSpace.currentUser.specialties.map((specialty, index) => (
                                  <Badge key={index} variant="default">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">Contact & Links</h4>
                              <div className="space-y-2">
                                {selectedSpace.currentUser.website && (
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-600" />
                                    <a 
                                      href={selectedSpace.currentUser.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm"
                                    >
                                      Website
                                    </a>
                                  </div>
                                )}
                                {selectedSpace.currentUser.socialMedia.instagram && (
                                  <div className="flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-600">
                                      {selectedSpace.currentUser.socialMedia.instagram}
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

export default function OoliteMapPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OoliteMapPageContent />
    </Suspense>
  );
}

