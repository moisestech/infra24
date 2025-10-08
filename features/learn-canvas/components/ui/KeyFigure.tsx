'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Building2, User, Calendar, Globe } from 'lucide-react'
import { FaRedditAlien } from 'react-icons/fa'
import { FaMeta } from 'react-icons/fa6'
import { FaGoogle } from 'react-icons/fa'
import { AiFillOpenAI } from 'react-icons/ai'
// MidjourneyIcon not available

interface KeyFigureProps {
  name: string
  type: 'company' | 'person' | 'technology' | 'event'
  description: string
  founded?: string
  foundedBy?: string
  website?: string
  notableFor?: string[]
  context?: string
  className?: string
  icon?: string
  children: React.ReactNode
}

export function KeyFigure({ 
  name, 
  type, 
  description, 
  founded, 
  foundedBy, 
  website, 
  notableFor = [], 
  context,
  className,
  icon,
  children 
}: KeyFigureProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const elementRef = useRef<HTMLSpanElement>(null)

  const getTypeIcon = () => {
    if (icon) {
      // Handle string-based icon names
      switch (icon) {
        case 'FaRedditAlien':
          return <FaRedditAlien className="w-3 h-3 text-orange-500" />
        case 'FaMeta':
          return <FaMeta className="w-3 h-3 text-blue-500" />
        case 'FaGoogle':
          return <FaGoogle className="w-3 h-3 text-red-500" />
        case 'AiFillOpenAI':
          return <AiFillOpenAI className="w-3 h-3 text-green-500" />
        case 'MidjourneyIcon':
          return <div className="w-3 h-3 bg-purple-500 rounded" />
        default:
          return <span className="w-3 h-3 flex items-center justify-center">{icon}</span>
      }
    }
    switch (type) {
      case 'company': return <Building2 className="w-3 h-3" />
      case 'person': return <User className="w-3 h-3" />
      case 'technology': return <Globe className="w-3 h-3" />
      case 'event': return <Calendar className="w-3 h-3" />
      default: return <Building2 className="w-3 h-3" />
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case 'company': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'person': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'technology': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'event': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'company': return 'Company'
      case 'person': return 'Person'
      case 'technology': return 'Technology'
      case 'event': return 'Event'
      default: return 'Entity'
    }
  }

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    // Calculate position for the popover
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      setPopoverPosition({
        top: rect.top - 10, // Position above the element
        left: rect.left + rect.width / 2 // Center horizontally
      })
    }
    
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    // Set a delay before hiding the popover
    const timeout = setTimeout(() => {
      setIsHovered(false)
    }, 1000) // 1 second delay
    setHoverTimeout(timeout)
  }

  const handlePopoverMouseEnter = () => {
    // Clear the timeout when mouse enters the popover
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
  }

  const handlePopoverMouseLeave = () => {
    // Hide immediately when leaving the popover
    setIsHovered(false)
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <span 
      ref={elementRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Highlighted text */}
      <span className="bg-[#00ff00]/20 text-[#00ff00] px-1 py-0.5 rounded-sm cursor-help transition-all duration-200 hover:bg-[#00ff00]/30">
        {children}
      </span>

      {/* Hover badge */}
      {isHovered && (
        <div 
          className="fixed transform -translate-x-1/2 -translate-y-full"
          style={{
            top: popoverPosition.top,
            left: popoverPosition.left,
            zIndex: 99999
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        >
          <Card className="bg-black/95 border-[#00ff00]/30 shadow-lg min-w-80 max-w-96">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getTypeColor()}>
                  {getTypeIcon()}
                  <span className="ml-1">{getTypeLabel()}</span>
                </Badge>
                <h3 className="font-semibold text-white text-sm">{name}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {description}
              </p>

              {/* Additional Info */}
              <div className="space-y-2 text-xs">
                {founded && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>Founded: {founded}</span>
                  </div>
                )}
                
                {foundedBy && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-3 h-3" />
                    <span>Founded by: {foundedBy}</span>
                  </div>
                )}

                {context && (
                  <div className="text-gray-400 italic">
                    Context: {context}
                  </div>
                )}

                {notableFor.length > 0 && (
                  <div>
                    <div className="text-[#00ff00] font-medium mb-1">Notable for:</div>
                    <ul className="text-gray-400 space-y-1">
                      {notableFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-[#00ff00] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {website && (
                  <div className="pt-2 border-t border-gray-700">
                    <a 
                      href={website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#00ff00] hover:text-[#00ff00]/80 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Visit Website</span>
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </span>
  )
}

// Simplified version for inline use
export function InlineKeyFigure({ 
  name, 
  type, 
  description, 
  className,
  children 
}: Pick<KeyFigureProps, 'name' | 'type' | 'description' | 'className' | 'children'>) {
  return (
    <KeyFigure
      name={name}
      type={type}
      description={description}
      className={className}
    >
      {children}
    </KeyFigure>
  )
}
