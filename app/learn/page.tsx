'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Play,
  Lock,
  GraduationCap
} from 'lucide-react'
import Link from 'next/link'

interface Workshop {
  id: string
  title: string
  description: string
  slug: string
  icon: string
  progress: number
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  isPremium: boolean
  image?: string
  tags: string[]
  hasLearnContent: boolean
  chaptersCount: number
  completedChapters: number
}

export default function LearnPage() {
  const { isSignedIn } = useAuth()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true)
        
        // Mock workshop data for now - in production, fetch from API
        const mockWorkshops: Workshop[] = [
          {
            id: '1',
            title: 'AI Filmmaking',
            description: 'Master the art and technology of AI-powered filmmaking, from script to screen.',
            slug: 'ai-filmmaking',
            icon: 'Film',
            progress: 0.3,
            estimatedTime: 180,
            difficulty: 'intermediate',
            category: 'AI & Video',
            isPremium: false,
            tags: ['AI', 'Video', 'Filmmaking', 'Creative'],
            hasLearnContent: true,
            chaptersCount: 5,
            completedChapters: 1
          },
          {
            id: '2',
            title: 'AI Art Fundamentals',
            description: 'Learn the fundamentals of creating art with artificial intelligence tools.',
            slug: 'ai-art-fundamentals',
            icon: 'Palette',
            progress: 0.0,
            estimatedTime: 120,
            difficulty: 'beginner',
            category: 'AI & Art',
            isPremium: false,
            tags: ['AI', 'Art', 'Design', 'Creative'],
            hasLearnContent: true,
            chaptersCount: 4,
            completedChapters: 0
          },
          {
            id: '3',
            title: 'VibeCoding',
            description: 'The future of programming with AI assistance and creative coding techniques.',
            slug: 'vibecoding',
            icon: 'Code',
            progress: 0.0,
            estimatedTime: 240,
            difficulty: 'advanced',
            category: 'Programming',
            isPremium: true,
            tags: ['AI', 'Programming', 'Creative', 'Advanced'],
            hasLearnContent: true,
            chaptersCount: 8,
            completedChapters: 0
          }
        ]
        
        setWorkshops(mockWorkshops)
      } catch (error) {
        console.error('Error fetching workshops:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [])

  const categories = Array.from(new Set(workshops.map(w => w.category)))

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || workshop.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

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
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-[#00ff00]" />
            <h1 className="text-4xl font-bold text-white font-mono">Learn</h1>
          </div>
          <p className="text-gray-400 text-lg font-mono">
            Master AI-powered creativity with our comprehensive workshops and courses.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Workshop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <Card key={workshop.id} className="h-full hover:border-[#00ff00] transition-all duration-300 group cursor-pointer bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#00ff00]/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#00ff00]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white group-hover:text-[#00ff00] transition-colors font-mono">
                        {workshop.title}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{workshop.category}</p>
                    </div>
                  </div>
                  {workshop.isPremium && (
                    <Badge variant="default" className="border-yellow-400 text-yellow-400 bg-yellow-400/10">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 font-mono">
                  {workshop.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        {workshop.estimatedTime} min
                      </div>
                      <Badge 
                        variant="default" 
                        className={getDifficultyBadgeColor(workshop.difficulty)}
                      >
                        {workshop.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  {workshop.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-[#00ff00]">
                          {workshop.completedChapters}/{workshop.chaptersCount} chapters
                        </span>
                      </div>
                      <Progress 
                        value={workshop.progress * 100} 
                        className="h-2 bg-gray-800"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-gray-400">
                      {workshop.isPremium ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {workshop.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </div>
                    
                    {workshop.hasLearnContent ? (
                      <Link href={`/learn/${workshop.id}`}>
                        <Button 
                          size="sm" 
                          className="bg-[#00ff00] text-black hover:bg-[#00ff00]/90"
                        >
                          {workshop.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-600 text-gray-400"
                        disabled
                      >
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No workshops found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or browse all workshops.
            </p>
          </div>
        )}

        {/* Sign In Prompt */}
        {!isSignedIn && (
          <div className="mt-12 text-center">
            <Card className="max-w-md mx-auto bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Sign In to Access Content</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Create an account to track your progress and access all learning materials.
                </p>
                <Link href="/sign-in">
                  <Button className="w-full bg-[#00ff00] text-black hover:bg-[#00ff00]/90">
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
