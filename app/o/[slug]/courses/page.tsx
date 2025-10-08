'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Filter,
  Star,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { CourseCard } from '@/components/courses/CourseCard';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  instructor_id?: string;
  duration_hours: number;
  max_enrollments: number;
  price: number;
  currency: string;
  published: boolean;
  featured: boolean;
  featured_until?: string;
  tags: string[];
  course_image?: string;
  course_video?: string;
  created_at: string;
  course_lessons?: Array<{
    id: string;
    title: string;
    duration_minutes: number;
    is_published: boolean;
  }>;
  course_enrollments?: Array<{
    id: string;
    user_id: string;
    completion_percentage: number;
    status: string;
  }>;
}

export default function PublicCoursesPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterPrice, setFilterPrice] = useState<string>('all');
  const [organizationId, setOrganizationId] = useState<string>('');

  // Fetch organization and courses
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get organization ID
      const orgResponse = await fetch(`/api/organizations?slug=${slug}`);
      if (orgResponse.ok) {
        const orgData = await orgResponse.json();
        setOrganizationId(orgData.data.id);
        
        // Fetch published courses
        const coursesResponse = await fetch(`/api/courses?organizationId=${orgData.data.id}&published=true`);
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          setCourses(coursesData.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  // Handle course enrollment
  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId
        })
      });

      if (response.ok) {
        alert('Successfully enrolled in course!');
        // You could redirect to the course or show a success message
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    const matchesPrice = filterPrice === 'all' || 
                        (filterPrice === 'free' && course.price === 0) ||
                        (filterPrice === 'paid' && course.price > 0);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const categories = Array.from(new Set(courses.map(c => c.category)));
  const featuredCourses = courses.filter(c => c.featured);
  const regularCourses = filteredCourses.filter(c => !c.featured);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/o/${slug}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organization
            </Button>
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Courses</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and enroll in educational courses designed to help you learn and grow
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all-levels">All Levels</option>
            </select>
            
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Courses</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                organizationSlug={slug}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Courses</h2>
          <Badge variant="default">
            {filteredCourses.length} courses
          </Badge>
        </div>
        
        {regularCourses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterCategory !== 'all' || filterLevel !== 'all' || filterPrice !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No courses are available at the moment'
                }
              </p>
              {(searchTerm || filterCategory !== 'all' || filterLevel !== 'all' || filterPrice !== 'all') && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterLevel('all');
                    setFilterPrice('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                organizationSlug={slug}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
