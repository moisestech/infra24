'use client'

import { BookOpen, Clock, Users, Star, GraduationCap, CheckCircle, PlayCircle, Video, UserPlus, Target } from 'lucide-react'
import { Workshop } from '@/types/workshop'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChapterCard } from './ChapterCard'
// useLanguage not available
import Link from 'next/link'

interface WorkshopDetailProps {
  workshop: Workshop;
  chapters?: any[]; // ChapterNavigation type not available
  user_progress?: any; // UserWorkshopProgress type not available
}

export function WorkshopDetail({ workshop, chapters = [], user_progress }: WorkshopDetailProps) {
  // Fallback constants for difficulty
  const DIFFICULTY_LABELS = {
    beginner: 'Beginner',
    intermediate: 'Intermediate', 
    advanced: 'Advanced'
  };
  
  const DIFFICULTY_COLORS = {
    beginner: 'text-green-600',
    intermediate: 'text-yellow-600',
    advanced: 'text-red-600'
  };
  console.log('[WorkshopDetail] chapters prop:', chapters);
  // Simple fallback for language support
  const t = (key: string, options?: any) => key;
  const language: string = 'en';
  const completedChapters = user_progress?.completed_chapters || [];
  const progressPercentage = user_progress?.completion_percentage || 0;

  // Get translated content for workshops
  const getTranslatedContent = () => {
    // AI Video Production Workshop
    if (workshop.id === 'ai-video-production') {
      const translatedObjectives = t('ai_video_workshop.learning_objectives', { returnObjects: true });
      const translatedPrerequisites = t('ai_video_workshop.prerequisites', { returnObjects: true });
      
      return {
        title: t('ai_video_workshop.title'),
        subtitle: t('ai_video_workshop.subtitle'),
        description: t('ai_video_workshop.description'),
        learning_objectives: Array.isArray(translatedObjectives) ? translatedObjectives : workshop.outcomes,
        prerequisites: Array.isArray(translatedPrerequisites) ? translatedPrerequisites : workshop.prerequisites,
        chapters: chapters.map(chapter => ({
          ...chapter,
          title: t(`ai_video_workshop.chapters.${chapter.slug}.title`) || chapter.title
        }))
      };
    }
    
    // AI Ethics Courses
    const ethicsCourses = ['ai-ethics-governance', 'ai-social-impact', 'ethical-ai-journalism', 'ai-literacy-digital-citizenship'];
    if (ethicsCourses.includes(workshop.id)) {
      const courseKey = workshop.id.replace(/-/g, '_');
      const translatedObjectives = t(`courses.${courseKey}.syllabus.outcomes`, { returnObjects: true });
      const translatedPrerequisites = t(`courses.${courseKey}.syllabus.prerequisites`, { returnObjects: true });
      
      return {
        title: t(`courses.${courseKey}.title`) || workshop.title,
        subtitle: workshop.description,
        description: t(`courses.${courseKey}.description`) || workshop.description,
        learning_objectives: Array.isArray(translatedObjectives) ? translatedObjectives : workshop.outcomes,
        prerequisites: Array.isArray(translatedPrerequisites) ? translatedPrerequisites : workshop.prerequisites,
        chapters: chapters.map(chapter => ({
          ...chapter,
          title: t(`courses.${courseKey}.chapters.${chapter.slug}.title`) || chapter.title
        }))
      };
    }
    
    return {
      title: workshop.title,
      subtitle: workshop.description,
      description: workshop.description,
      learning_objectives: workshop.outcomes,
      prerequisites: workshop.prerequisites,
      chapters: chapters
    };
  };

  const translatedContent = getTranslatedContent();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Workshop Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="default" className={DIFFICULTY_COLORS[workshop.level]}>
              {DIFFICULTY_LABELS[workshop.level]}
          </Badge>
          {workshop.featured && (
            <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <Star className="w-3 h-3 mr-1" />
              {t('workshop.featured')}
            </Badge>
          )}
        </div>
        
        <h1 className="text-4xl font-bold">{translatedContent.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {translatedContent.subtitle}
        </p>
        
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {workshop.duration_minutes ? Math.round(workshop.duration_minutes / 60) : 0}h
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {chapters.length} {t('workshop.chapters')}
          </span>
          <span className="flex items-center gap-1">
            <Video className="w-4 h-4" />
            {workshop.category === 'video' ? t('workshop.video_category') : workshop.category}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      {user_progress && (
        <Card className="bg-gradient-to-r from-[#00ff00]/10 to-[#00ff00]/5 dark:from-[#00ff00]/20 dark:to-[#00ff00]/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Progress</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedChapters.length} of {chapters.length} chapters completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {progressPercentage}% complete
              </span>
              {progressPercentage === 100 && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed!
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workshop Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              {t('workshop.what_youll_learn')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {translatedContent.learning_objectives?.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('workshop.prerequisites')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {translatedContent.prerequisites?.map((prereq, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{prereq}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Chapters Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('workshop.chapters')}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Free to browse</span>
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            <span>Interactive features</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {translatedContent.chapters.map((chapter, index) => {
            const isCompleted = completedChapters.includes(chapter.id);
            // Make all chapters accessible for browsing (BuzzFeed-style)
            const isAccessible = true;
            
            return (
              <ChapterCard
                key={chapter.id}
                chapter={{
                  id: chapter.id,
                  title: chapter.title,
                  chapter_number: chapter.chapter_number,
                  estimated_duration_minutes: chapter.estimated_duration_minutes || 30,
                  slug: chapter.slug,
                  is_free: true // All chapters are free to browse
                }}
                workshopSlug={workshop.id}
                isCompleted={isCompleted}
                isAccessible={isAccessible}
              />
            );
          })}
        </div>
        
        {/* Interactive Features CTA */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-white">Unlock Interactive Learning</h3>
            <p className="text-gray-300 mb-4">
              Sign up to access quizzes, activities, progress tracking, and community features
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up Free
              </Button>
              <Button variant="default" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Already have an account?
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>Interactive quizzes</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Progress tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Community access</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 