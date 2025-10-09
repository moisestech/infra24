'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { MDXRemote } from 'next-mdx-remote'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Separator } from '../../../../components/ui/separator' // Component doesn't exist
import { ArrowLeft, ArrowRight, Clock, BookOpen, Target, CheckCircle } from 'lucide-react'

// Import our components
import { Quiz } from './interactive/Quiz'
import { Activity } from './interactive/PlaceholderComponents'
import { Poll } from './interactive/PlaceholderComponents'
import { TimelineWrapper } from './interactive/PlaceholderComponents'
import { BeforeAfterSlider } from './interactive/PlaceholderComponents'
import { Callout } from './ui/Callout'
import { VideoEmbed } from './ui/VideoEmbed'
import { ExerciseCard } from './ui/ExerciseCard'
import { ResourceList, IconDivider, ReflectionPrompt, VisualEnhancer, DevPlaceholder, ExternalLinkWrapper, Figure, DevFigure, KeyFigure, InlineKeyFigure } from './ui/PlaceholderComponents'
import { FeatureList, TimelineList, ChecklistList, AccordionList, ComparisonList, ProcessList } from './ui/ListComponents'

interface ChapterReaderProps {
  workshopSlug: string
  chapterSlug: string
  chapter: any
  chapterContext?: any
  mdxSource: any
  isAuthenticated?: boolean
  userId?: string
  organizationSlug?: string
}

export function ChapterReader({ 
  workshopSlug, 
  chapterSlug, 
  chapter, 
  chapterContext, 
  mdxSource, 
  isAuthenticated = false, 
  userId,
  organizationSlug
}: ChapterReaderProps) {
  const { isSignedIn } = useAuth()
  const [progress, setProgress] = useState(0)

  const mdxComponents = useMemo(() => ({
    // Basic HTML elements with proper styling
    h1: ({ children, ...props }: any) => (
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-6" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </li>
    ),
    code: ({ children, ...props }: any) => (
      <code className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded text-sm" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }: any) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
        {children}
      </pre>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4" {...props}>
        {children}
      </blockquote>
    ),
    a: ({ children, href, ...props }: any) => (
      <a 
        href={href} 
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline" 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    img: ({ src, alt, ...props }: any) => (
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg mb-4 max-w-full h-auto" 
        {...props} 
      />
    ),
    
    // Interactive Components
    Quiz,
    Activity,
    Poll,
    TimelineWrapper,
    BeforeAfterSlider,
    
    // UI Components
    Callout,
    VideoEmbed,
    ExerciseCard,
    ResourceList,
    IconDivider,
    ReflectionPrompt,
    VisualEnhancer,
    DevPlaceholder,
    ExternalLink: ExternalLinkWrapper,
    Figure,
    DevFigure,
    KeyFigure,
    InlineKeyFigure,
    
    // List Components
    FeatureList,
    TimelineList,
    ChecklistList,
    AccordionList,
    ComparisonList,
    ProcessList,
  }), [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href={`/o/${organizationSlug}/workshops`} className="hover:text-blue-600 dark:hover:text-blue-400">
              Workshops
            </Link>
            <span>/</span>
            <Link href={`/o/${organizationSlug}/workshops/${workshopSlug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
              {chapterContext?.workshop?.title || workshopSlug}
            </Link>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400">{chapter.title}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {chapter.title}
          </h1>
          
          {chapter.description && (
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              {chapter.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 mb-6">
            {chapter.estimatedTime && (
              <Badge variant="default" className="border-blue-500 text-blue-500">
                <Clock className="w-4 h-4 mr-2" />
                {chapter.estimatedTime} min
              </Badge>
            )}
            {chapter.difficulty && (
              <Badge variant="default" className="border-green-500 text-green-500">
                <Target className="w-4 h-4 mr-2" />
                {chapter.difficulty}
              </Badge>
            )}
            {chapter.progress === 1 && (
              <Badge variant="default" className="border-green-500 text-green-500">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <MDXRemote 
            {...mdxSource} 
            components={mdxComponents}
          />
        </div>

            <hr className="my-8 border-gray-700" />

        <div className="flex justify-between items-center">
          {chapterContext?.previousChapter && (
            <Link href={`/o/${organizationSlug}/workshops/${workshopSlug}/learn/${chapterContext.previousChapter.slug}`}>
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous: {chapterContext.previousChapter.title}
              </Button>
            </Link>
          )}
          
          {chapterContext?.nextChapter && (
            <Link href={`/o/${organizationSlug}/workshops/${workshopSlug}/learn/${chapterContext.nextChapter.slug}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Next: {chapterContext.nextChapter.title}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
