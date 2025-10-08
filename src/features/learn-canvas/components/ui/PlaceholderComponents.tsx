'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Image, Sparkles } from 'lucide-react'

// ResourceList Component
interface ResourceListProps {
  title?: string
  resources: Array<{
    title: string
    description?: string
    url?: string
    type?: 'document' | 'video' | 'link' | 'tool'
  }>
  className?: string
}

export function ResourceList({ title, resources, className = '' }: ResourceListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title || 'Resources'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <ExternalLink className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {resource.title}
                </h4>
                {resource.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {resource.description}
                  </p>
                )}
                {resource.url && (
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm mt-1 inline-flex items-center gap-1"
                  >
                    View Resource
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// IconDivider Component
interface IconDividerProps {
  icon?: ReactNode
  className?: string
}

export function IconDivider({ icon, className = '' }: IconDividerProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          {icon || <Sparkles className="w-5 h-5 text-gray-500" />}
        </div>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  )
}

// ReflectionPrompt Component
interface ReflectionPromptProps {
  question: string
  placeholder?: string
  className?: string
}

export function ReflectionPrompt({ question, placeholder, className = '' }: ReflectionPromptProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Reflection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {question}
          </p>
          <textarea
            placeholder={placeholder || "Share your thoughts..."}
            className="w-full p-3 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button className="w-full">
            Save Reflection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// VisualEnhancer Component
interface VisualEnhancerProps {
  children: ReactNode
  type?: 'highlight' | 'glow' | 'shadow'
  className?: string
}

export function VisualEnhancer({ children, type = 'highlight', className = '' }: VisualEnhancerProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'glow':
        return 'shadow-lg shadow-blue-500/20'
      case 'shadow':
        return 'shadow-xl'
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
    }
  }

  return (
    <div className={`p-4 rounded-lg ${getTypeStyles()} ${className}`}>
      {children}
    </div>
  )
}

// DevPlaceholder Component
interface DevPlaceholderProps {
  title: string
  description?: string
  className?: string
}

export function DevPlaceholder({ title, description, className = '' }: DevPlaceholderProps) {
  return (
    <div className={`p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center ${className}`}>
      <div className="text-gray-500 dark:text-gray-400">
        <Image className="w-12 h-12 mx-auto mb-3" />
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        {description && (
          <p className="text-sm">{description}</p>
        )}
      </div>
    </div>
  )
}

// ExternalLinkWrapper Component
interface ExternalLinkWrapperProps {
  href: string
  children: ReactNode
  className?: string
}

export function ExternalLinkWrapper({ href, children, className = '' }: ExternalLinkWrapperProps) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 ${className}`}
    >
      {children}
      <ExternalLink className="w-3 h-3" />
    </a>
  )
}

// Figure Component
interface FigureProps {
  src: string
  alt: string
  caption?: string
  className?: string
}

export function Figure({ src, alt, caption, className = '' }: FigureProps) {
  return (
    <figure className={`space-y-2 ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full rounded-lg"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 dark:text-gray-400 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// DevFigure Component
interface DevFigureProps {
  title: string
  description?: string
  className?: string
}

export function DevFigure({ title, description, className = '' }: DevFigureProps) {
  return (
    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      <div className="bg-gray-100 dark:bg-gray-800 h-48 rounded-lg flex items-center justify-center mb-3">
        <Image className="w-12 h-12 text-gray-400" />
      </div>
      <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
  )
}

// KeyFigure Component
interface KeyFigureProps {
  value: string | number
  label: string
  description?: string
  className?: string
}

export function KeyFigure({ value, label, description, className = '' }: KeyFigureProps) {
  return (
    <div className={`text-center p-4 ${className}`}>
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
        {value}
      </div>
      <div className="font-medium text-gray-900 dark:text-white">
        {label}
      </div>
      {description && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </div>
      )}
    </div>
  )
}

// InlineKeyFigure Component
interface InlineKeyFigureProps {
  value: string | number
  label: string
  className?: string
}

export function InlineKeyFigure({ value, label, className = '' }: InlineKeyFigureProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="font-bold text-blue-600 dark:text-blue-400">{value}</span>
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
    </span>
  )
}
