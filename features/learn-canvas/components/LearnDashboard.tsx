// src/features/learn-canvas/components/LearnDashboard.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { GraduationCap, BookOpen, CheckCircle, ListChecks, Trophy, PlayCircle } from 'lucide-react';

const mockStats = [
  { label: 'Concepts Viewed', value: 1, icon: BookOpen },
  { label: 'Lessons Viewed', value: 0, icon: ListChecks },
  { label: 'Quizzes Completed', value: 0, icon: CheckCircle },
  { label: 'Projects Passed', value: 0, icon: Trophy },
  { label: 'Programs Completed', value: 0, icon: GraduationCap },
];

const mockEnrolled = [
  {
    title: 'AI Filmmaking Fundamentals',
    slug: 'ai-filmmaking',
    progress: 1,
    total: 18,
    image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600014/ai24/workshops/ai24-course-ai-filmmaking-fundamentals_bsxlra.png',
  },
  {
    title: 'AI Art Fundamentals',
    slug: 'ai-art-fundamentals',
    progress: 0,
    total: 12,
    image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600013/ai24/workshops/ai24-course-ai-art-fundamentals_nuavhb.png',
  },
];

export default function LearnDashboard() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Your Learning Dashboard</h1>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {mockStats.map((stat) => (
          <Card key={stat.label} className="bg-gray-900/80 border-gray-800">
            <CardContent className="flex flex-col items-center py-6">
              <stat.icon className="w-7 h-7 text-lime-400 mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 text-center">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Enrolled Workshops */}
      <h2 className="text-2xl font-semibold text-white mb-4">Your Enrolled Programs</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {mockEnrolled.map((course) => (
          <Card key={course.slug} className="bg-gray-900/80 border-gray-800 flex flex-col">
            <div className="h-40 w-full overflow-hidden rounded-t-lg">
              <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-white">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <Progress value={Math.round((course.progress / course.total) * 100)} className="h-2" />
                <div className="text-xs text-gray-400 mt-1">
                  {course.progress} of {course.total} lessons completed
                </div>
              </div>
              <Link href={`/learn/${course.slug}`}>
                <Button size="sm" className="w-full mt-2 bg-lime-500 hover:bg-lime-600 text-black">
                  <PlayCircle className="w-4 h-4 mr-2" /> Continue Learning
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* CTA */}
      <div className="text-center mt-8">
        <Link href="/learn">
          <Button size="lg" className="bg-gradient-to-r from-lime-400 to-green-400 text-black hover:from-lime-500 hover:to-green-500">
            Explore More Workshops
          </Button>
        </Link>
      </div>
    </div>
  );
} 