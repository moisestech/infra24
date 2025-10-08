'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Clock, BookOpen, Target, CheckCircle, Lock } from 'lucide-react'
import Link from 'next/link'

interface Chapter {
  id: string
  title: string
  description: string
  content: string
  estimatedTime: number
  difficulty: string
  progress: number
  locked: boolean
  slug: string
  workshopId: string
  workshopTitle: string
}

interface ChapterContext {
  previousChapter?: Chapter | null
  nextChapter?: Chapter | null
  workshop: {
    title: string
    id: string
  }
}

export default function ChapterReaderPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { workshopId, chapterSlug } = params
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [chapterContext, setChapterContext] = useState<ChapterContext | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true)
        
        // Fetch chapter from API
        const response = await fetch(`/api/learn/workshops/${workshopId}/chapters/${chapterSlug}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch chapter: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          const chapterData = data.data
          const chapter: Chapter = {
            id: '1',
            title: chapterData.metadata.title || chapterSlug as string,
            description: chapterData.metadata.description || '',
            content: chapterData.content,
            estimatedTime: chapterData.metadata.estimatedTime || 30,
            difficulty: chapterData.metadata.difficulty || 'beginner',
            progress: 0,
            locked: false,
            slug: chapterSlug as string,
            workshopId: workshopId as string,
            workshopTitle: 'AI Filmmaking Workshop'
          }

          const mockContext: ChapterContext = {
            previousChapter: null,
            nextChapter: {
              id: '2',
              title: 'AI Tools for Filmmakers',
              description: 'Explore the latest AI tools and their applications in film production',
              content: '',
              estimatedTime: 45,
              difficulty: 'intermediate',
              progress: 0,
              locked: false,
              slug: 'ai-tools-for-filmmakers',
              workshopId: workshopId as string,
              workshopTitle: 'AI Filmmaking Workshop'
            },
            workshop: {
              title: 'AI Filmmaking Workshop',
              id: workshopId as string
            }
          }

          setChapter(chapter)
          setChapterContext(mockContext)
        } else {
          throw new Error('Chapter not found')
        }
      } catch (err) {
        console.error('Error fetching chapter:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch chapter')
      } finally {
        setLoading(false)
      }
    }

    if (workshopId && chapterSlug) {
      fetchChapter()
    }
  }, [workshopId, chapterSlug])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleChapterComplete = () => {
    // Track chapter completion
    console.log('Chapter completed:', chapter?.id)
    // In production, this would update user progress in the database
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
                <div key={i} className="h-4 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
            <p className="text-gray-400 mb-8">{error || 'Chapter not found'}</p>
            <Link href={`/o/oolite/workshops/${workshopId}`}>
              <Button variant="outline" className="border-gray-600 text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workshop
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
              Please sign in to access this chapter content.
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
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Link href={`/o/oolite/workshops/${workshopId}`}>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-white font-mono">
                  {chapter.title}
                </h1>
                <p className="text-sm text-gray-400">
                  {chapterContext?.workshop?.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {chapter.estimatedTime} min
              </div>
              <Badge variant="default" className="border-gray-600 text-gray-300">
                {chapter.difficulty}
              </Badge>
            </div>
          </div>
          
          <Progress 
            value={readingProgress} 
            className="h-2 bg-gray-800"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 font-mono">
            {chapter.title}
          </h1>
          
          {chapter.description && (
            <p className="text-gray-400 text-lg mb-6 font-mono">
              {chapter.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge variant="default" className="border-gray-400 text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              {chapter.estimatedTime} min
            </Badge>
            <Badge variant="default" className="border-gray-400 text-gray-400">
              <Target className="w-4 h-4 mr-2" />
              {chapter.difficulty}
            </Badge>
            {chapter.progress === 1 && (
              <Badge variant="default" className="border-green-500 text-green-500">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Chapter Content */}
        <div className="prose prose-invert max-w-none mb-8">
          <div 
            className="text-gray-300 leading-relaxed font-mono"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
            style={{
              '--tw-prose-headings': '#00ff00',
              '--tw-prose-links': '#00ff00',
              '--tw-prose-bold': '#ffffff',
              '--tw-prose-code': '#00ff00',
              '--tw-prose-pre-bg': '#111827',
              '--tw-prose-pre-code': '#00ff00',
            } as React.CSSProperties}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-800">
          {chapterContext?.previousChapter ? (
            <Link href={`/learn/${workshopId}/${chapterContext.previousChapter.slug}`}>
              <Button variant="outline" className="border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous: {chapterContext.previousChapter.title}
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
          
          {chapterContext?.nextChapter ? (
            <Link href={`/learn/${workshopId}/${chapterContext.nextChapter.slug}`}>
              <Button 
                className="bg-[#00ff00] text-black hover:bg-[#00ff00]/90"
                onClick={handleChapterComplete}
              >
                Next: {chapterContext.nextChapter.title}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button 
              className="bg-[#00ff00] text-black hover:bg-[#00ff00]/90"
              onClick={handleChapterComplete}
            >
              Complete Chapter
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
