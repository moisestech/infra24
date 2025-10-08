'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Clock, BookOpen, Target, CheckCircle, Play, Lock, Users } from 'lucide-react'
import Link from 'next/link'

interface Workshop {
  id: string
  title: string
  description: string
  slug: string
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  isPremium: boolean
  hasLearnContent: boolean
  chaptersCount: number
  completedChapters: number
  progress: number
}

interface Chapter {
  id: string
  title: string
  description: string
  estimatedTime: number
  difficulty: string
  progress: number
  locked: boolean
  slug: string
}

export default function WorkshopLearnPage() {
  const params = useParams()
  const { isSignedIn } = useAuth()
  const { workshopId } = params
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setLoading(true)
        
        // Mock workshop data for now - in production, fetch from API
        const mockWorkshop: Workshop = {
          id: workshopId as string,
          title: 'AI Filmmaking',
          description: 'Master the art and technology of AI-powered filmmaking, from script to screen. Learn to create professional-quality videos using cutting-edge AI tools.',
          slug: 'ai-filmmaking',
          estimatedTime: 180,
          difficulty: 'intermediate',
          category: 'AI & Video',
          isPremium: false,
          hasLearnContent: true,
          chaptersCount: 5,
          completedChapters: 1,
          progress: 0.2
        }

        const mockChapters: Chapter[] = [
          {
            id: '1',
            title: 'Introduction to AI Filmmaking',
            description: 'Learn the fundamentals of AI-powered video production and understand how artificial intelligence is revolutionizing the film industry.',
            estimatedTime: 30,
            difficulty: 'beginner',
            progress: 1,
            locked: false,
            slug: 'introduction-to-ai-filmmaking'
          },
          {
            id: '2',
            title: 'AI Tools for Filmmakers',
            description: 'Explore the latest AI tools and their applications in film production, from text-to-video to style transfer.',
            estimatedTime: 45,
            difficulty: 'intermediate',
            progress: 0,
            locked: false,
            slug: 'ai-tools-for-filmmakers'
          },
          {
            id: '3',
            title: 'Creating Your First AI Video',
            description: 'Hands-on tutorial for creating AI-generated content using popular platforms and tools.',
            estimatedTime: 60,
            difficulty: 'intermediate',
            progress: 0,
            locked: true,
            slug: 'creating-your-first-ai-video'
          },
          {
            id: '4',
            title: 'Advanced AI Techniques',
            description: 'Master advanced AI filmmaking techniques including motion synthesis and automated editing.',
            estimatedTime: 45,
            difficulty: 'advanced',
            progress: 0,
            locked: true,
            slug: 'advanced-ai-techniques'
          },
          {
            id: '5',
            title: 'Final Project & Portfolio',
            description: 'Create a complete AI-generated short film and build your portfolio.',
            estimatedTime: 90,
            difficulty: 'advanced',
            progress: 0,
            locked: true,
            slug: 'final-project-portfolio'
          }
        ]

        setWorkshop(mockWorkshop)
        setChapters(mockChapters)
      } catch (err) {
        console.error('Error fetching workshop:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch workshop')
      } finally {
        setLoading(false)
      }
    }

    if (workshopId) {
      fetchWorkshop()
    }
  }, [workshopId])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'border-green-400 text-green-400'
      case 'intermediate': return 'border-yellow-400 text-yellow-400'
      case 'advanced': return 'border-red-400 text-red-400'
      default: return 'border-gray-400 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
            <p className="text-gray-400 mb-8">{error || 'Workshop not found'}</p>
            <Link href="/learn">
              <Button variant="outline" className="border-gray-600 text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Learn
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
            <p className="text-gray-400 mb-8">
              Please sign in to access this workshop content.
            </p>
            <Link href="/sign-in">
              <Button className="bg-[#00ff00] text-black hover:bg-[#00ff00]/90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/learn">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learn
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#00ff00]/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#00ff00]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-mono">{workshop.title}</h1>
              <p className="text-gray-400">{workshop.category}</p>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-6 font-mono">
            {workshop.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Badge variant="default" className="border-gray-400 text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              {workshop.estimatedTime} min total
            </Badge>
            <Badge variant="default" className={getDifficultyBadgeColor(workshop.difficulty)}>
              <Target className="w-4 h-4 mr-2" />
              {workshop.difficulty}
            </Badge>
            <Badge variant="default" className="border-blue-400 text-blue-400">
              <Users className="w-4 h-4 mr-2" />
              {workshop.chaptersCount} chapters
            </Badge>
            {workshop.isPremium && (
              <Badge variant="default" className="border-yellow-400 text-yellow-400">
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="w-5 h-5 text-[#00ff00]" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                <span className="text-sm text-[#00ff00]">
                  {workshop.completedChapters}/{workshop.chaptersCount} chapters completed
                </span>
              </div>
              <Progress 
                value={workshop.progress * 100} 
                className="h-3 bg-gray-800"
              />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#00ff00]">{workshop.completedChapters}</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{workshop.chaptersCount - workshop.completedChapters}</div>
                  <div className="text-sm text-gray-400">Remaining</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{workshop.estimatedTime}</div>
                  <div className="text-sm text-gray-400">Minutes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapter List */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Course Chapters</CardTitle>
            <p className="text-gray-400">
              Work through each chapter to master {workshop.title}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className={`p-4 border rounded-lg ${
                    chapter.locked 
                      ? 'border-gray-700 bg-gray-800' 
                      : 'border-[#00ff00]/30 bg-[#00ff00]/5 hover:bg-[#00ff00]/10 cursor-pointer'
                  } transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          chapter.progress === 1
                            ? 'bg-green-600 text-white'
                            : chapter.locked 
                            ? 'bg-gray-600 text-gray-400' 
                            : 'bg-[#00ff00] text-black'
                        }`}>
                          {chapter.progress === 1 ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${
                            chapter.locked ? 'text-gray-500' : 'text-white'
                          } font-mono`}>
                            {chapter.title}
                          </h3>
                          <p className={`text-sm ${
                            chapter.locked ? 'text-gray-600' : 'text-gray-400'
                          } font-mono`}>
                            {chapter.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 ml-11">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {chapter.estimatedTime} min
                        </div>
                        <Badge 
                          variant="default" 
                          className={`text-xs ${
                            chapter.difficulty === 'beginner' 
                              ? 'border-green-400 text-green-400'
                              : chapter.difficulty === 'intermediate'
                              ? 'border-yellow-400 text-yellow-400'
                              : 'border-red-400 text-red-400'
                          }`}
                        >
                          {chapter.difficulty}
                        </Badge>
                        {chapter.progress === 1 && (
                          <Badge variant="default" className="border-green-500 text-green-500 text-xs">
                            Completed
                          </Badge>
                        )}
                        {chapter.locked && (
                          <Badge variant="default" className="border-gray-500 text-gray-500 text-xs">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {chapter.locked ? (
                        <Button variant="outline" size="sm" disabled className="border-gray-600 text-gray-500">
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      ) : chapter.progress === 1 ? (
                        <Link href={`/learn/${workshopId}/${chapter.slug}`}>
                          <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/learn/${workshopId}/${chapter.slug}`}>
                          <Button size="sm" className="bg-[#00ff00] text-black hover:bg-[#00ff00]/90">
                            <Play className="w-4 h-4 mr-2" />
                            {chapter.progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
