'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Eye, 
  Save, 
  FileText, 
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  Star,
  ChevronRight,
  Folder,
  File,
  Code,
  Image,
  Video,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface Workshop {
  id: string
  title: string
  description: string
  organization_id: string
  has_learn_content: boolean
  learn_objectives?: string[]
  estimated_learn_time?: number
  learn_difficulty?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  created_at: string
  updated_at: string
}

interface Chapter {
  id: string
  workshop_id: string
  chapter_slug: string
  title: string
  description: string
  order_index: number
  estimated_time: number
  created_at: string
  updated_at: string
}

export default function ContentPage() {
  const { user } = useUser()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [editingChapter, setEditingChapter] = useState(false)
  const [chapterContent, setChapterContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadWorkshops()
  }, [])

  const loadWorkshops = async () => {
    try {
      setLoading(true)
      // Load workshops that have learn content enabled
      const response = await fetch('/api/workshops')
      if (response.ok) {
        const data = await response.json()
        const workshopsWithLearnContent = data.filter((w: Workshop) => w.has_learn_content)
        setWorkshops(workshopsWithLearnContent)
      }
    } catch (error) {
      console.error('Error loading workshops:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChapters = async (workshopId: string) => {
    try {
      const response = await fetch(`/api/workshops/${workshopId}/chapters`)
      if (response.ok) {
        const data = await response.json()
        setChapters(data.chapters || [])
      }
    } catch (error) {
      console.error('Error loading chapters:', error)
    }
  }

  const handleWorkshopSelect = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setSelectedChapter(null)
    setEditingChapter(false)
    loadChapters(workshop.id)
  }

  const handleChapterSelect = async (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setEditingChapter(false)
    setShowPreview(false)
    
    // Load chapter content from file system
    try {
      const response = await fetch(`/api/content/workshops/${selectedWorkshop?.id}/chapters/${chapter.chapter_slug}`)
      if (response.ok) {
        const data = await response.json()
        setChapterContent(data.content || '')
      } else {
        // If no content exists, show template
        setChapterContent(generateChapterTemplate(chapter))
      }
    } catch (error) {
      console.error('Error loading chapter content:', error)
      setChapterContent(generateChapterTemplate(chapter))
    }
  }

  const generateChapterTemplate = (chapter: Chapter) => {
    return `---
title: "${chapter.title}"
description: "${chapter.description}"
estimatedTime: ${chapter.estimated_time}
difficulty: "beginner"
---

# ${chapter.title}

${chapter.description}

## Learning Objectives

By the end of this chapter, you will be able to:

- Understand the key concepts
- Apply practical techniques
- Implement best practices

## Key Concepts

<FeatureList 
  title="What You'll Learn"
  items={[
    { text: "Fundamental concepts", description: "Core principles and theory" },
    { text: "Practical applications", description: "Real-world examples and use cases" },
    { text: "Best practices", description: "Industry standards and recommendations" }
  ]}
/>

## Interactive Learning

<Quiz 
  questions={[
    {
      id: "q1",
      question: "What is the main topic of this chapter?",
      options: [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
      correct: 0,
      explanation: "This is the correct answer because..."
    }
  ]}
/>

## Hands-on Activity

<Activity 
  title="Practice Exercise"
  description="Apply what you've learned with this practical exercise."
  steps={[
    "Step 1: Set up your environment",
    "Step 2: Follow the instructions",
    "Step 3: Test your implementation",
    "Step 4: Review and reflect"
  ]}
/>

## Summary

In this chapter, we covered:

- Key concept 1
- Key concept 2
- Key concept 3

## Next Steps

<ReflectionPrompt 
  prompt="How will you apply what you've learned in this chapter to your own projects?"
/>

## Additional Resources

<ResourceList 
  title="Further Reading"
  items={[
    { title: "Resource 1", url: "https://example.com", description: "Additional information" },
    { title: "Resource 2", url: "https://example.com", description: "More details" }
  ]}
/>
`
  }

  const saveChapterContent = async () => {
    if (!selectedChapter || !selectedWorkshop) return

    try {
      const response = await fetch(`/api/content/workshops/${selectedWorkshop.id}/chapters/${selectedChapter.chapter_slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: chapterContent,
          title: selectedChapter.title,
          description: selectedChapter.description
        }),
      })

      if (response.ok) {
        alert('Chapter content saved successfully!')
        setEditingChapter(false)
      } else {
        alert('Error saving chapter content')
      }
    } catch (error) {
      console.error('Error saving chapter:', error)
      alert('Error saving chapter content')
    }
  }

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>
              Please sign in to access the content management system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Content Management
              </h1>
              <p className="text-gray-600">
                Create and manage interactive workshop content with MDX
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Zap className="h-3 w-3 mr-1" />
                Learn Canvas
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Workshops Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Workshops
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search workshops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading workshops...
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredWorkshops.map((workshop) => (
                      <div
                        key={workshop.id}
                        onClick={() => handleWorkshopSelect(workshop)}
                        className={`p-4 cursor-pointer border-l-4 transition-colors ${
                          selectedWorkshop?.id === workshop.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{workshop.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {workshop.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {workshop.learn_difficulty || 'beginner'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {workshop.estimated_learn_time || 0} min
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Chapters Sidebar */}
          {selectedWorkshop && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Chapters
                  </CardTitle>
                  <CardDescription>
                    {selectedWorkshop.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        onClick={() => handleChapterSelect(chapter)}
                        className={`p-3 cursor-pointer border-l-4 transition-colors ${
                          selectedChapter?.id === chapter.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{chapter.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {chapter.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {chapter.estimated_time} min
                              </span>
                              <span className="text-xs text-gray-500">
                                Ch. {chapter.order_index}
                              </span>
                            </div>
                          </div>
                          <File className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            {selectedChapter ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        {selectedChapter.title}
                      </CardTitle>
                      <CardDescription>
                        Chapter {selectedChapter.order_index} • {selectedChapter.estimated_time} minutes
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {showPreview ? 'Edit' : 'Preview'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingChapter(!editingChapter)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {editingChapter ? 'Cancel' : 'Edit'}
                      </Button>
                      {editingChapter && (
                        <Button
                          size="sm"
                          onClick={saveChapterContent}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingChapter ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          MDX Content
                        </label>
                        <Textarea
                          value={chapterContent}
                          onChange={(e) => setChapterContent(e.target.value)}
                          className="min-h-[600px] font-mono text-sm"
                          placeholder="Enter your MDX content here..."
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Code className="h-4 w-4" />
                        <span>MDX supports React components, interactive elements, and rich formatting</span>
                      </div>
                    </div>
                  ) : showPreview ? (
                    <div className="prose prose-gray max-w-none">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Preview Mode</h3>
                        <p className="text-gray-600">
                          Preview functionality will be implemented to show how the MDX content renders.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Chapter Content</h3>
                        <p className="text-gray-600 mb-4">
                          {selectedChapter.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {selectedChapter.estimated_time} minutes
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            Chapter {selectedChapter.order_index}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">MDX Content Available</h4>
                        <p className="text-blue-800 text-sm mb-3">
                          This chapter has MDX content ready for editing. Click "Edit" to modify the content.
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingChapter(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Content
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(true)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a Chapter
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Choose a workshop and then select a chapter to view and edit its content.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
