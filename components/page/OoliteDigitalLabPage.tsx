'use client';

import { useState } from 'react';
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

export default function OoliteDigitalLabPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const equipment = [
    {
      id: 'vr-workstation',
      name: 'VR/AR Workstation',
      category: 'Immersive Technology',
      description: 'High-end VR development and content creation station',
      icon: Monitor,
      status: 'available',
      specs: ['RTX 4080 GPU', '32GB RAM', 'VR Headset', 'Motion Controllers'],
      bookingSlots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      maxUsers: 2,
      difficulty: 'Advanced'
    },
    {
      id: '3d-printer',
      name: '3D Printer (Prusa i3 MK3S+)',
      category: 'Digital Fabrication',
      description: 'Professional-grade 3D printer for rapid prototyping',
      icon: Printer,
      status: 'in-use',
      specs: ['0.4mm Nozzle', 'PLA/ABS/PETG', '220x220x250mm Build Volume'],
      bookingSlots: ['10:00 AM', '1:00 PM', '3:00 PM'],
      maxUsers: 1,
      difficulty: 'Intermediate'
    },
    {
      id: 'photo-studio',
      name: 'Digital Photo Studio',
      category: 'Photography',
      description: 'Professional photography setup with lighting and backdrop',
      icon: Camera,
      status: 'available',
      specs: ['Canon EOS R5', 'Studio Lighting', 'Green Screen', 'Tripods'],
      bookingSlots: ['9:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'],
      maxUsers: 4,
      difficulty: 'Beginner'
    },
    {
      id: 'audio-booth',
      name: 'Audio Recording Booth',
      category: 'Audio Production',
      description: 'Sound-isolated recording space with professional equipment',
      icon: Headphones,
      status: 'maintenance',
      specs: ['Audio Interface', 'Condenser Mic', 'Acoustic Treatment', 'DAW Software'],
      bookingSlots: ['10:00 AM', '2:00 PM', '4:00 PM'],
      maxUsers: 2,
      difficulty: 'Intermediate'
    },
    {
      id: 'ai-workstation',
      name: 'AI Development Station',
      category: 'AI & Machine Learning',
      description: 'High-performance workstation for AI model training',
      icon: Cpu,
      status: 'available',
      specs: ['RTX 4090 GPU', '64GB RAM', 'AI Software Suite', 'Cloud Access'],
      bookingSlots: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'],
      maxUsers: 1,
      difficulty: 'Advanced'
    },
    {
      id: 'collaboration-space',
      name: 'Collaborative Workspace',
      category: 'General',
      description: 'Flexible space for group projects and presentations',
      icon: Users,
      status: 'available',
      specs: ['Large Display', 'Wireless Presentation', 'Whiteboard', 'Seating for 8'],
      bookingSlots: ['9:00 AM', '12:00 PM', '3:00 PM'],
      maxUsers: 8,
      difficulty: 'Beginner'
    }
  ];

  const categories = ['all', 'Immersive Technology', 'Digital Fabrication', 'Photography', 'Audio Production', 'AI & Machine Learning', 'General'];

  const filteredEquipment = selectedCategory === 'all' 
    ? equipment 
    : equipment.filter(item => item.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Now</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {equipment.filter(e => e.status === 'available').length}
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
                    {equipment.filter(e => e.status === 'in-use').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {equipment.filter(e => e.status === 'maintenance').length}
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
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredEquipment.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge variant="default" className="mt-1">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Specifications */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                      <div className="space-y-1">
                        {item.specs.map((spec, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-3 h-3 text-blue-500" />
                            {spec}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Available Slots</h4>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.bookingSlots.map((slot, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {slot}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Max Users: {item.maxUsers}</span>
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={item.status !== 'available'}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {item.status === 'available' ? 'Book Now' : 'Unavailable'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

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