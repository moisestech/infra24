'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Code,
  Quote,
  Save,
  Eye,
  Upload,
  X
} from 'lucide-react'

interface ContentEditorProps {
  initialContent?: {
    id?: string
    title: string
    slug: string
    content: string
    excerpt: string
    contentType: string
    category: string
    tags: string[]
    published: boolean
    featured: boolean
    seoTitle: string
    seoDescription: string
    seoKeywords: string[]
  }
  organizationId: string
  onSave: (content: any) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function ContentEditor({ 
  initialContent, 
  organizationId, 
  onSave, 
  onCancel,
  isLoading = false 
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent || {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    contentType: 'article',
    category: '',
    tags: [],
    published: false,
    featured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: []
  })

  const [activeTab, setActiveTab] = useState('content')
  const [previewMode, setPreviewMode] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (content.title && !initialContent?.slug) {
      const slug = content.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setContent(prev => ({ ...prev, slug }))
    }
  }, [content.title, initialContent?.slug])

  const handleSave = async () => {
    try {
      await onSave({
        ...content,
        organizationId
      })
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  const insertMarkdown = (markdown: string) => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.content.substring(start, end)
    
    let newText = ''
    if (selectedText) {
      newText = content.content.substring(0, start) + markdown.replace('{}', selectedText) + content.content.substring(end)
    } else {
      newText = content.content.substring(0, start) + markdown + content.content.substring(end)
    }

    setContent(prev => ({ ...prev, content: newText }))
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + markdown.length, start + markdown.length)
    }, 0)
  }

  const addTag = () => {
    if (newTag.trim() && !content.tags.includes(newTag.trim())) {
      setContent(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setContent(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !content.seoKeywords.includes(newKeyword.trim())) {
      setContent(prev => ({ ...prev, seoKeywords: [...prev.seoKeywords, newKeyword.trim()] }))
      setNewKeyword('')
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setContent(prev => ({ ...prev, seoKeywords: prev.seoKeywords.filter(keyword => keyword !== keywordToRemove) }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('organizationId', organizationId)
      formData.append('altText', file.name)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const imageUrl = result.data.fileUrl
        setUploadedImages(prev => [...prev, imageUrl])
        insertMarkdown(`![${file.name}](${imageUrl})`)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const renderPreview = () => {
    // Simple markdown preview - in a real implementation, you'd use a proper markdown parser
    return (
      <div className="prose max-w-none">
        <h1>{content.title}</h1>
        <p className="text-muted-foreground">{content.excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br>') }} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {initialContent ? 'Edit Content' : 'Create Content'}
        </h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="default"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={content.title}
                    onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter content title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={content.slug}
                    onChange={(e) => setContent(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-friendly-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={content.excerpt}
                  onChange={(e) => setContent(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the content"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                {!previewMode ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 border rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown('**{}**')}
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown('*{}*')}
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown('`{}`')}
                      >
                        <Code className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown('\n> {}\n')}
                      >
                        <Quote className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown('\n- {}\n')}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown('\n1. {}\n')}
                      >
                        <ListOrdered className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown('[{}](url)')}
                      >
                        <Link className="w-4 h-4" />
                      </Button>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="ghost" size="sm">
                          <Image className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      ref={contentRef}
                      value={content.content}
                      onChange={(e) => setContent(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your content in Markdown..."
                      rows={20}
                      className="font-mono"
                    />
                  </div>
                ) : (
                  <div className="border rounded-md p-4 min-h-[400px]">
                    {renderPreview()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select
                    value={content.contentType}
                    onValueChange={(value) => setContent(prev => ({ ...prev, contentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={content.category}
                    onChange={(e) => setContent(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Enter category"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={content.published}
                    onChange={(e) => setContent(prev => ({ ...prev, published: e.target.checked }))}
                  />
                  <span>Published</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={content.featured}
                    onChange={(e) => setContent(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <span>Featured</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={content.seoTitle}
                  onChange={(e) => setContent(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="SEO optimized title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={content.seoDescription}
                  onChange={(e) => setContent(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="SEO meta description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>SEO Keywords</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add a keyword"
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  />
                  <Button onClick={addKeyword} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.seoKeywords.map((keyword) => (
                    <Badge key={keyword} variant="default" className="flex items-center gap-1">
                      {keyword}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
