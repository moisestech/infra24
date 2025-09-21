'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  Calendar, 
  Target, 
  TrendingUp,
  BookOpen,
  Monitor,
  Palette,
  Zap
} from 'lucide-react';

export default function OoliteDigitalOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Oolite Arts Digital Lab
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Welcome to Miami's premier digital arts education and creation space. 
            Explore cutting-edge technology, learn new skills, and connect with a vibrant community of digital artists.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Programs</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Community Members</p>
                  <p className="text-2xl font-bold text-gray-900">300+</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Equipment Stations</p>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                </div>
                <Monitor className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Workshops</h3>
              <p className="text-gray-600 text-sm mb-4">
                Join our comprehensive workshop series covering AI, 3D printing, and creative coding.
              </p>
              <Button size="sm" className="w-full">
                View Workshops
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Monitor className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Lab</h3>
              <p className="text-gray-600 text-sm mb-4">
                Access state-of-the-art equipment including VR workstations and 3D printers.
              </p>
              <Button size="sm" className="w-full">
                Book Equipment
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Tools</h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore cutting-edge AI tools for video generation, image creation, and more.
              </p>
              <Button size="sm" className="w-full">
                Discover Tools
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Roadmap</h3>
              <p className="text-gray-600 text-sm mb-4">
                View our strategic roadmap and upcoming program developments.
              </p>
              <Button size="sm" className="w-full">
                View Roadmap
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Programs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  AI Video Generation
                </CardTitle>
                <CardDescription>
                  Master the art of AI-powered video creation using cutting-edge tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className="bg-blue-100 text-blue-800">Beginner Friendly</Badge>
                  <p className="text-sm text-gray-600">
                    Learn to create stunning videos using AI tools like RunwayML and other platforms.
                  </p>
                  <Button size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-green-600" />
                  3D Printing Workshop
                </CardTitle>
                <CardDescription>
                  Get hands-on experience with 3D printing technology and design.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className="bg-green-100 text-green-800">Hands-On</Badge>
                  <p className="text-sm text-gray-600">
                    Design and print your own 3D models using professional-grade equipment.
                  </p>
                  <Button size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Creative Coding
                </CardTitle>
                <CardDescription>
                  Explore the intersection of art and code through visual programming.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className="bg-purple-100 text-purple-800">Advanced</Badge>
                  <p className="text-sm text-gray-600">
                    Create generative art and interactive installations using code.
                  </p>
                  <Button size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Your Digital Arts Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of digital artists and start creating with cutting-edge technology. 
            Whether you're a beginner or an experienced artist, we have something for everyone.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-5 h-5 mr-2" />
              Book a Workshop
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