'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  BookOpen,
  Award,
  Calendar,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

interface CourseCardProps {
  course: Course;
  organizationSlug: string;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: string) => void;
  className?: string;
}

export function CourseCard({ 
  course, 
  organizationSlug, 
  showEnrollButton = true,
  onEnroll,
  className 
}: CourseCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      case 'all-levels': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'art': return <BookOpen className="w-4 h-4" />;
      case 'technology': return <Play className="w-4 h-4" />;
      case 'business': return <Award className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const totalLessons = course.course_lessons?.length || 0;
  const publishedLessons = course.course_lessons?.filter(lesson => lesson.is_published).length || 0;
  const totalDuration = course.course_lessons?.reduce((sum, lesson) => sum + lesson.duration_minutes, 0) || 0;
  const enrolledCount = course.course_enrollments?.length || 0;
  const isFullyEnrolled = course.max_enrollments > 0 && enrolledCount >= course.max_enrollments;

  return (
    <Card className={cn('w-full hover:shadow-lg transition-shadow', className)}>
      {course.course_image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={course.course_image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(course.category)}
              <Badge variant="default" className="text-xs">
                {course.category}
              </Badge>
              <Badge className={getLevelColor(course.level)}>
                {course.level}
              </Badge>
              {course.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg mb-2 line-clamp-2">
              {course.title}
            </CardTitle>
            
            <CardDescription className="line-clamp-3">
              {course.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
          </div>
          
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{publishedLessons} lessons</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{enrolledCount} enrolled</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(course.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{course.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {course.price > 0 ? (
              <div className="text-lg font-bold">
                ${course.price} {course.currency}
              </div>
            ) : (
              <div className="text-lg font-bold text-green-600">
                Free
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link href={`/o/${organizationSlug}/courses/${course.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            
            {showEnrollButton && (
              <Button 
                size="sm"
                onClick={() => onEnroll?.(course.id)}
                disabled={isFullyEnrolled || !course.published}
              >
                {isFullyEnrolled ? 'Full' : 'Enroll'}
              </Button>
            )}
          </div>
        </div>

        {/* Capacity Warning */}
        {isFullyEnrolled && (
          <div className="mt-2 text-xs text-orange-600">
            Course is at maximum capacity
          </div>
        )}
      </CardContent>
    </Card>
  );
}
