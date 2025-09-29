'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  Play, 
  Users,
  Star,
  ArrowRight,
  Bookmark,
  Share2
} from 'lucide-react'
import { ChapterReader } from './ChapterReader'
// import { useOrganizationTheme } from '@/contexts/OrganizationThemeContext' // Placeholder

interface Workshop {
  id: string
  title: string
  description: string
  slug: string
  has_learn_content: boolean
  learn_syllabus?: any
  learn_objectives?: string[]
  estimated_learn_time?: number
  learn_difficulty?: string
  learn_prerequisites?: string[]
  learn_materials?: string[]
  organization_id: string
}

interface Chapter {
  id: string
  workshop_id: string
  chapter_slug: string
  title: string
  description?: string
  order_index: number
  estimated_time?: number
}

interface UserProgress {
  chapter_id: string
  completed_at?: string
  progress_percentage: number
  time_spent: number
}

interface WorkshopLearnContentProps {
  workshop: Workshop
  organizationSlug: string
  userProgress?: UserProgress[]
  isAuthenticated: boolean
}

export function WorkshopLearnContent({ 
  workshop, 
  organizationSlug, 
  userProgress = [], 
  isAuthenticated 
}: WorkshopLearnContentProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const { theme } = useOrganizationTheme() // Placeholder
  const theme = 'dark' // Default theme for now

  useEffect(() => {
    if (workshop.has_learn_content) {
      loadChapters()
    } else {
      setLoading(false)
    }
  }, [workshop.id])

  const loadChapters = async () => {
    try {
      const response = await fetch(`/api/workshops/${workshop.id}/chapters`)
      if (!response.ok) throw new Error('Failed to load chapters')
      
      const data = await response.json()
      setChapters(data.chapters || [])
      
      // Select first chapter by default
      if (data.chapters && data.chapters.length > 0) {
        setSelectedChapter(data.chapters[0])
      }
    } catch (err) {
      setError('Failed to load workshop content')
      console.error('Error loading chapters:', err)
    } finally {
      setLoading(false)
    }
  }

  const getChapterProgress = (chapterId: string) => {
    const progress = userProgress.find(p => p.chapter_id === chapterId)
    return progress?.progress_percentage || 0
  }

  const getChapterStatus = (chapterId: string) => {
    const progress = userProgress.find(p => p.chapter_id === chapterId)
    if (progress?.completed_at) return 'completed'
    if (progress?.progress_percentage > 0) return 'in-progress'
    return 'not-started'
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'border-green-400 text-green-400'
      case 'intermediate':
        return 'border-yellow-400 text-yellow-400'
      case 'advanced':
        return 'border-red-400 text-red-400'
      default:
        return 'border-gray-400 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <Play className="w-4 h-4 text-blue-500" />
      default:
        return <BookOpen className="w-4 h-4 text-gray-400" />
    }
  }

  const totalEstimatedTime = chapters.reduce((sum, chapter) => sum + (chapter.estimated_time || 0), 0)
  const completedChapters = userProgress.filter(p => p.completed_at).length
  const overallProgress = chapters.length > 0 ? (completedChapters / chapters.length) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading workshop content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={loadChapters} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!workshop.has_learn_content) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Learn Content Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Interactive learning content for this workshop is being developed.
          </p>
          <Button 
            onClick={() => router.push(`/o/${organizationSlug}/workshops/${workshop.slug}/book`)}
            style={{ backgroundColor: theme.primaryColor }}
            className="text-white hover:opacity-90"
          >
            Book This Workshop
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workshop Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6" style={{ color: theme.primaryColor }} />
                {workshop.title} - Learn
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                {workshop.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            {workshop.estimated_learn_time && (
              <Badge variant="outline" className="border-gray-400 text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                {workshop.estimated_learn_time} min total
              </Badge>
            )}
            {workshop.learn_difficulty && (
              <Badge variant="outline" className={getDifficultyColor(workshop.learn_difficulty)}>
                <Target className="w-4 h-4 mr-2" />
                {workshop.learn_difficulty}
              </Badge>
            )}
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              <Users className="w-4 h-4 mr-2" />
              {chapters.length} chapters
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedChapters} of {chapters.length} chapters completed
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(overallProgress)}% complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      {workshop.learn_objectives && workshop.learn_objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: theme.primaryColor }} />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {workshop.learn_objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites */}
      {workshop.learn_prerequisites && workshop.learn_prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" style={{ color: theme.primaryColor }} />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {workshop.learn_prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{prerequisite}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Chapter Navigation */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: theme.primaryColor }} />
              Course Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chapters.map((chapter, index) => {
                const status = getChapterStatus(chapter.id)
                const progress = getChapterProgress(chapter.id)
                
                return (
                  <div
                    key={chapter.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedChapter?.id === chapter.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(status)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {index + 1}. {chapter.title}
                          </h4>
                          {chapter.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {chapter.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {chapter.estimated_time && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {chapter.estimated_time} min
                          </Badge>
                        )}
                        {progress > 0 && (
                          <div className="w-16">
                            <Progress value={progress} className="h-1" />
                          </div>
                        )}
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapter Content */}
      {selectedChapter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" style={{ color: theme.primaryColor }} />
              {selectedChapter.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChapterReader
              workshopSlug={workshop.slug}
              chapterSlug={selectedChapter.chapter_slug}
              chapter={selectedChapter}
              chapterContext={{
                workshop,
                chapters,
                currentChapter: selectedChapter,
                previousChapter: chapters[chapters.indexOf(selectedChapter) - 1] || null,
                nextChapter: chapters[chapters.indexOf(selectedChapter) + 1] || null
              }}
              mdxSource={null} // Will be loaded by ChapterReader
              isAuthenticated={isAuthenticated}
              userId={user?.id}
              organizationSlug={organizationSlug}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
