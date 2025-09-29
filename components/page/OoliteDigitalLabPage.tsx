'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  Monitor, 
  Printer, 
  Camera, 
  Headphones, 
  Cpu, 
  Wifi,
  Users,
  Clock,
  Calendar,
  BookOpen,
  ExternalLink,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import EquipmentVoting from '@/components/equipment/EquipmentVoting';
import { useTenant } from '@/components/tenant/TenantProvider';

interface Equipment {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  capacity: number;
  duration_minutes: number;
  price: number;
  currency: string;
  location: string;
  requirements: string[];
  availability_rules: any;
  metadata: any;
}

export default function OoliteDigitalLabPage() {
  const { tenantConfig } = useTenant();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Oolite Digital Lab: Loading data...');
      
      // Load organization data
      const orgResponse = await fetch('/api/organizations/by-slug/oolite');
      console.log('🔍 Oolite Digital Lab: Organization response status:', orgResponse.status);
      
      if (orgResponse.ok) {
        const orgData = await orgResponse.json();
        console.log('🔍 Oolite Digital Lab: Organization data:', orgData);
        setOrganization(orgData.organization);
        
        // Load Digital Lab resources - get all equipment resources
        const resourcesResponse = await fetch(`/api/organizations/${orgData.organization.id}/resources`);
        console.log('🔍 Oolite Digital Lab: Resources response status:', resourcesResponse.status);
        
        if (resourcesResponse.ok) {
          const resourcesData = await resourcesResponse.json();
          console.log('🔍 Oolite Digital Lab: All resources:', resourcesData.resources);
          
          // Filter for equipment type resources
          const equipmentResources = (resourcesData.resources || []).filter((r: Equipment) => r.type === 'equipment');
          console.log('🔍 Oolite Digital Lab: Equipment resources:', equipmentResources);
          console.log('🔍 Oolite Digital Lab: Equipment statuses:', equipmentResources.map(e => ({ name: e.title, status: e.metadata?.status })));
          setEquipment(equipmentResources);
        } else {
          console.error('🔍 Oolite Digital Lab: Resources API error:', resourcesResponse.status);
        }
      } else {
        console.error('🔍 Oolite Digital Lab: Organization API error:', orgResponse.status);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from actual equipment data
  const categories = ['all', ...Array.from(new Set(equipment.map(item => item.category)))];

  const filteredEquipment = selectedCategory === 'all' 
    ? equipment 
    : equipment.filter(item => item.category === selectedCategory);

  const getStatusColor = (equipment: Equipment) => {
    const status = equipment.metadata?.status || 'available';
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (equipment: Equipment) => {
    const status = equipment.metadata?.status || 'available';
    return status.replace('-', ' ');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Digital Lab equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Digital Arts Lab
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            State-of-the-art digital creation space equipped with cutting-edge technology for artists, 
            designers, and creative technologists. Book equipment, join workshops, and bring your ideas to life.
          </p>
        </div>

        {/* Lab Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                  <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
                </div>
                <Monitor className="w-8 h-8" style={{ color: tenantConfig?.theme?.primary || '#47abc4' }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Now</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {equipment.filter(e => e.metadata?.status === 'available').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Use</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {equipment.filter(e => e.metadata?.status === 'in-use').length}
                  </p>
                </div>
                <Users className="w-8 h-8" style={{ color: tenantConfig?.theme?.primary || '#47abc4' }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {equipment.filter(e => e.metadata?.status === 'maintenance').length}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Equipment Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
                style={selectedCategory === category ? {
                  backgroundColor: tenantConfig?.theme?.primary || '#47abc4',
                  color: 'white'
                } : {
                  borderColor: tenantConfig?.theme?.primary || '#47abc4',
                  color: tenantConfig?.theme?.primary || '#47abc4'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.backgroundColor = tenantConfig?.theme?.primaryAlpha || 'rgba(71, 171, 196, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredEquipment.map((item) => {
            const isAvailable = item.metadata?.status === 'available';
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${tenantConfig?.theme?.primary || '#47abc4'}20` }}>
                        <Printer className="w-6 h-6" style={{ color: tenantConfig?.theme?.primary || '#47abc4' }} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge 
                          variant="default" 
                          className="mt-1"
                          style={{
                            backgroundColor: `${tenantConfig?.theme?.primary || '#47abc4'}20`,
                            color: tenantConfig?.theme?.primary || '#47abc4',
                            borderColor: tenantConfig?.theme?.primary || '#47abc4'
                          }}
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item)}>
                      {getStatusText(item)}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Equipment Image */}
                    {item.metadata?.image_url && (
                      <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={item.metadata.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Specifications */}
                    {item.metadata?.specifications && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                        <div className="space-y-1">
                          {Object.entries(item.metadata.specifications).map(([key, value], index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="w-3 h-3" style={{ color: tenantConfig?.theme?.primary || '#47abc4' }} />
                              {key}: {value as string}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Booking Info */}
                    <div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600">Capacity: {item.capacity}</span>
                        <span className="text-gray-600">Duration: {item.duration_minutes} min</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Location: {item.location}</span>
                        <span className="text-gray-600">Price: ${item.price}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={!isAvailable}
                        style={{
                          backgroundColor: isAvailable ? (tenantConfig?.theme?.primary || '#47abc4') : '#9ca3af',
                          color: 'white'
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {isAvailable ? 'Book Now' : 'Unavailable'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        style={{
                          borderColor: tenantConfig?.theme?.primary || '#47abc4',
                          color: tenantConfig?.theme?.primary || '#47abc4'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = tenantConfig?.theme?.primaryAlpha || 'rgba(71, 171, 196, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <BookOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Equipment Voting Section */}
        {organization && (
          <div className="mb-16">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <EquipmentVoting orgId={organization.id} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lab Guidelines */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Lab Guidelines & Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Policy</h3>
              <p className="text-gray-600">
                Equipment can be booked up to 2 weeks in advance. 
                Maximum 4 hours per session. Cancellations must be made 24 hours in advance.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">
                All users must complete safety training before using equipment. 
                Follow all posted guidelines and ask staff for assistance when needed.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Wifi className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Use</h3>
              <p className="text-gray-600">
                Respect other users and maintain a collaborative environment. 
                Clean up after yourself and report any equipment issues immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of digital artists and start creating with cutting-edge technology.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-5 h-5 mr-2" />
              Book Equipment
            </Button>
            <Button size="lg" variant="outline">
              <BookOpen className="w-5 h-5 mr-2" />
              View Workshops
            </Button>
            <Button size="lg" variant="outline">
              <ExternalLink className="w-5 h-5 mr-2" />
              Lab Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}