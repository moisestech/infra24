'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Clock,
  Edit,
  Trash2,
  Eye,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CourseCard } from './CourseCard';

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

interface CourseManagementProps {
  organizationId: string;
  organizationSlug: string;
  onCourseCreated?: (course: Course) => void;
  onCourseUpdated?: (course: Course) => void;
  onCourseDeleted?: (courseId: string) => void;
  className?: string;
}

export function CourseManagement({ 
  organizationId, 
  organizationSlug,
  onCourseCreated,
  onCourseUpdated,
  onCourseDeleted,
  className 
}: CourseManagementProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner' as const,
    instructorId: '',
    prerequisites: [] as string[],
    learningObjectives: [] as string[],
    targetAudience: '',
    durationHours: 0,
    maxEnrollments: 0,
    price: 0,
    currency: 'USD',
    published: false,
    featured: false,
    tags: [] as string[],
    externalLinks: {} as Record<string, string>,
    certificationInfo: '',
    courseImage: '',
    courseVideo: ''
  });

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses?organizationId=${organizationId}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [organizationId]);

  // Create course
  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId,
          ...newCourse
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(prev => [data.data, ...prev]);
        onCourseCreated?.(data.data);
        
        // Reset form
        setNewCourse({
          title: '',
          description: '',
          category: '',
          level: 'beginner',
          instructorId: '',
          prerequisites: [],
          learningObjectives: [],
          targetAudience: '',
          durationHours: 0,
          maxEnrollments: 0,
          price: 0,
          currency: 'USD',
          published: false,
          featured: false,
          tags: [],
          externalLinks: {},
          certificationInfo: '',
          courseImage: '',
          courseVideo: ''
        });
        setShowCreateForm(false);
      } else {
        throw new Error('Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        onCourseDeleted?.(courseId);
      } else {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    const matchesPublished = filterPublished === 'all' || 
                           (filterPublished === 'published' && course.published) ||
                           (filterPublished === 'draft' && !course.published);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPublished;
  });

  const categories = Array.from(new Set(courses.map(c => c.category)));

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center">Loading courses...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Management
            </CardTitle>
            <CardDescription>
              Manage courses and learning content
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Create Course Form */}
        {showCreateForm && (
          <div className="border rounded-lg p-6 mb-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Create New Course</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Course title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Art, Technology, Business"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  value={newCourse.level}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, level: e.target.value as any }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all-levels">All Levels</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Course description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="durationHours">Duration (hours)</Label>
                <Input
                  id="durationHours"
                  type="number"
                  value={newCourse.durationHours}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, durationHours: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="maxEnrollments">Max Enrollments</Label>
                <Input
                  id="maxEnrollments"
                  type="number"
                  value={newCourse.maxEnrollments}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, maxEnrollments: parseInt(e.target.value) || 0 }))}
                  placeholder="0 (unlimited)"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={newCourse.published}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, published: e.target.checked }))}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newCourse.featured}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreateCourse} disabled={creating}>
                {creating ? 'Creating...' : 'Create Course'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all-levels">All Levels</option>
            </select>
            
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowCreateForm(true)}
              >
                Create First Course
              </Button>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="relative">
                <CourseCard
                  course={course}
                  organizationSlug={organizationSlug}
                  showEnrollButton={false}
                />
                
                {/* Admin Actions */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/o/${organizationSlug}/courses/${course.id}`, '_blank')}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* TODO: Edit course */}}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
