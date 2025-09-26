'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Calendar, 
  Tag, 
  FileText,
  User,
  Clock
} from 'lucide-react'

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

interface ContentViewerProps {
  content: ContentItem
  onClose: () => void
  onEdit: () => void
}

export function ContentViewer({ content, onClose, onEdit }: ContentViewerProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Content
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">
                {content.title}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {content.excerpt}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Content Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant={content.published ? "default" : "secondary"}>
                {content.published ? "Published" : "Draft"}
              </Badge>
              {content.featured && (
                <Badge variant="outline">Featured</Badge>
              )}
              <Badge variant="outline">{content.content_type}</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {content.view_count} views
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {content.reading_time} min read
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Updated {new Date(content.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="mb-6">
            {content.category && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category: 
                </span>
                <Badge variant="outline" className="ml-2">
                  {content.category}
                </Badge>
              </div>
            )}
            
            {content.tags.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Preview */}
          <div className="prose max-w-none dark:prose-invert">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Content Preview</p>
                <p className="text-sm">
                  The full content would be displayed here. This is a preview of the content structure.
                </p>
                <p className="text-sm mt-2">
                  In a real implementation, this would render the MDX content with proper formatting,
                  syntax highlighting, and interactive elements.
                </p>
              </div>
            </div>
          </div>

          {/* Content Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {content.view_count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Views
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {content.like_count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Likes
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {content.reading_time}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Minutes to Read
                </div>
              </div>
            </div>
          </div>

          {/* Content Details */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Content Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Content ID:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
                  {content.id}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Slug:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
                  {content.slug}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Author ID:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
                  {content.author_id}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {new Date(content.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
