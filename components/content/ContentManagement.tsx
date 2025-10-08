'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Tag,
  FileText
} from 'lucide-react'
import { ContentEditor } from './ContentEditor'
import { ContentViewer } from './ContentViewer'

interface ContentItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content_type: string
  category: string
  tags: string[]
  published: boolean
  featured: boolean
  view_count: number
  like_count: number
  reading_time: number
  created_at: string
  updated_at: string
  author_id: string
}

export function ContentManagement() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [contentTypeFilter, setContentTypeFilter] = useState('all')
  const [publishedFilter, setPublishedFilter] = useState('all')
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const OOLITE_ORG_ID = '73339522-c672-40ac-a464-e027e9c99d13'

  useEffect(() => {
    fetchContentItems()
  }, [])

  const fetchContentItems = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        orgId: OOLITE_ORG_ID,
        limit: '50'
      })

      const response = await fetch(`/api/content?${params}`)
      if (response.ok) {
        const result = await response.json()
        setContentItems(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching content items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContent = () => {
    setSelectedContent(null)
    setIsCreating(true)
    setShowEditor(true)
  }

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content)
    setIsCreating(false)
    setShowEditor(true)
  }

  const handleViewContent = (content: ContentItem) => {
    setSelectedContent(content)
    setShowViewer(true)
  }

  const handleSaveContent = async (contentData: any) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      })

      if (response.ok) {
        await fetchContentItems()
        setShowEditor(false)
        setSelectedContent(null)
        setIsCreating(false)
      } else {
        const error = await response.json()
        console.error('Error saving content:', error)
      }
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) {
      return
    }

    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchContentItems()
      } else {
        const error = await response.json()
        console.error('Error deleting content:', error)
      }
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = contentTypeFilter === 'all' || item.content_type === contentTypeFilter
    const matchesPublished = publishedFilter === 'all' || 
                           (publishedFilter === 'published' && item.published) ||
                           (publishedFilter === 'draft' && !item.published)
    
    return matchesSearch && matchesType && matchesPublished
  })

  if (showEditor) {
    return (
      <ContentEditor
        initialContent={selectedContent ? {
          id: selectedContent.id,
          title: selectedContent.title,
          slug: selectedContent.slug,
          content: '', // Would need to fetch full content
          excerpt: selectedContent.excerpt,
          contentType: selectedContent.content_type,
          category: selectedContent.category,
          tags: selectedContent.tags,
          published: selectedContent.published,
          featured: selectedContent.featured,
          seoTitle: '',
          seoDescription: '',
          seoKeywords: []
        } : undefined}
        organizationId={OOLITE_ORG_ID}
        onSave={handleSaveContent}
        onCancel={() => {
          setShowEditor(false)
          setSelectedContent(null)
          setIsCreating(false)
        }}
      />
    )
  }

  if (showViewer && selectedContent) {
    return (
      <ContentViewer
        content={selectedContent}
        onClose={() => {
          setShowViewer(false)
          setSelectedContent(null)
        }}
        onEdit={() => {
          setShowViewer(false)
          handleEditContent(selectedContent)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Content Library
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {contentItems.length} content items
          </p>
        </div>
        <Button onClick={handleCreateContent}>
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
              <Select value={publishedFilter} onValueChange={setPublishedFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                      {item.featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                      <Badge variant="default">{item.content_type}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                  {item.excerpt}
                </p>
                
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="default" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="default" className="text-xs">
                        +{item.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.view_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {item.reading_time} min
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.updated_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewContent(item)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditContent(item)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteContent(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredContent.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No content found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm || contentTypeFilter !== 'all' || publishedFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first content item.'
              }
            </p>
            {!searchTerm && contentTypeFilter === 'all' && publishedFilter === 'all' && (
              <Button onClick={handleCreateContent}>
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
