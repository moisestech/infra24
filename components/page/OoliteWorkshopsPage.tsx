'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import { getWorkshopsForOrganization, getWorkshopCategories } from '@/lib/workshops/shared-workshops';

const workshops = getWorkshopsForOrganization('oolite');
const categories = getWorkshopCategories();

export default function OoliteWorkshopsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Digital Arts Workshops
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive workshop series covering AI, 3D printing, creative coding, and more. 
            Join our community of digital artists and creators.
          </p>
        </div>

        {/* Workshop Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Workshop Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const count = workshops.filter(w => w.category === category).length;
              const colors = [
                'bg-purple-100 text-purple-800',
                'bg-blue-100 text-blue-800', 
                'bg-green-100 text-green-800',
                'bg-orange-100 text-orange-800'
              ];
              return (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category}</h3>
                    <Badge className={colors[index % colors.length]}>{count} workshops</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Featured Workshops */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.slice(0, 6).map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{workshop.title}</CardTitle>
                  <CardDescription className="text-base">
                    {workshop.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{workshop.category}</Badge>
                      <Badge className={
                        workshop.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        workshop.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {workshop.level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workshop.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {workshop.maxParticipants} max
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        ${workshop.price}
                      </span>
                      <Button size="sm">
                        Register
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of digital artists and start creating with cutting-edge technology. 
            All skill levels welcome!
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-5 h-5 mr-2" />
              View All Workshops
            </Button>
            <Button size="lg" variant="outline">
              <Users className="w-5 h-5 mr-2" />
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}