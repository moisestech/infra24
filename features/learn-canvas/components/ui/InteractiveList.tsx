'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Info, AlertTriangle, Star, Zap, Target, Clock, Users, Settings, Video, Monitor, Smartphone, Globe, Shield, Award, TrendingUp, Cpu, Database, Layers } from 'lucide-react'

// Base list item interface
interface ListItem {
  id?: string
  title: string
  description?: string
  icon?: React.ReactNode
  customIcon?: string // For Lucide icon names
  status?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  metadata?: Record<string, any>
  details?: string[] // For accordion content
}

// Component variants
type ListVariant = 
  | 'accordion'      // Expandable sections
  | 'feature-grid'   // Grid layout with icons
  | 'timeline'       // Chronological with dates
  | 'comparison'     // Side-by-side comparison
  | 'checklist'      // Interactive checkboxes
  | 'cards'          // Card-based layout
  | 'horizontal'     // Horizontal scrolling
  | 'tabs'           // Tabbed content

interface InteractiveListProps {
  variant: ListVariant
  title?: string
  subtitle?: string
  items: ListItem[]
  className?: string
  collapsible?: boolean
  defaultExpanded?: boolean
  showIcons?: boolean
  maxItems?: number
  groupBy?: string
  accordionItems?: boolean // Enable accordion for individual items
}

// Icon mapping for different statuses
const statusIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  neutral: Star,
}

// Default icons for different contexts
const contextIcons = {
  feature: Star,
  improvement: Zap,
  impact: Target,
  timeline: Clock,
  platform: Users,
  technical: Settings,
}

// Custom icon mapping for contextual icons
const customIconMap = {
  // Video & Media
  'video': Video,
  'duration': Clock,
  'resolution': Monitor,
  'quality': Award,
  'clips': Video,
  
  // Technology
  'technical': Cpu,
  'innovation': Zap,
  'architecture': Layers,
  'models': Database,
  'api': Globe,
  
  // Features & Capabilities
  'interface': Monitor,
  'mobile': Smartphone,
  'web': Globe,
  'access': Shield,
  'integration': Layers,
  
  // Business & Impact
  'market': TrendingUp,
  'professional': Award,
  'community': Users,
  'adoption': TrendingUp,
  'breakthrough': Star,
  
  // Status & Results
  'success': CheckCircle,
  'warning': AlertTriangle,
  'info': Info,
  'error': XCircle,
}

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
  return customIconMap[iconName as keyof typeof customIconMap] || Star
}

export function InteractiveList({
  variant,
  title,
  subtitle,
  items,
  className,
  collapsible = false,
  defaultExpanded = true,
  showIcons = true,
  maxItems,
  groupBy,
  accordionItems = false
}: InteractiveListProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setCheckedItems(newChecked)
  }

  const toggleAccordionItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const displayItems = maxItems ? items.slice(0, maxItems) : items

  // Accordion variant
  if (variant === 'accordion') {
    return (
      <div className={cn("space-y-2", className)}>
        {title && (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
            {collapsible && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
        
        {expanded && (
          <div className="space-y-2">
            {displayItems.map((item, index) => (
              <div key={item.id || index} className="border border-white/10 rounded-lg overflow-hidden">
                <div className="p-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    {showIcons && item.icon && (
                      <div className="flex-shrink-0">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.title}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Feature Grid variant
  if (variant === 'feature-grid') {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayItems.map((item, index) => {
            const itemId = item.id || `item-${index}`
            const isExpanded = expandedItems.has(itemId)
            const hasDetails = item.details && item.details.length > 0
            
            // Determine which icon to use
            let IconComponent
            if (item.icon) {
              IconComponent = () => <>{item.icon}</>
            } else if (item.customIcon) {
              IconComponent = getIconComponent(item.customIcon)
            } else if (item.status) {
              IconComponent = statusIcons[item.status]
            } else {
              IconComponent = contextIcons.feature
            }
            
            return (
              <div key={itemId} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  {showIcons && (
                    <div className={cn(
                      "flex-shrink-0 p-2 rounded-lg",
                      item.status === 'success' && "bg-green-500/20 text-green-400",
                      item.status === 'error' && "bg-red-500/20 text-red-400",
                      item.status === 'warning' && "bg-yellow-500/20 text-yellow-400",
                      item.status === 'info' && "bg-blue-500/20 text-blue-400",
                      !item.status && "bg-[#00ff00]/20 text-[#00ff00]"
                    )}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{item.title}</h4>
                      {accordionItems && hasDetails && (
                        <button
                          onClick={() => toggleAccordionItem(itemId)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                    )}
                    {accordionItems && hasDetails && isExpanded && (
                      <div className="mt-3 space-y-2">
                        {item.details?.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-[#00ff00] mt-1">•</span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Checklist variant
  if (variant === 'checklist') {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
        
        <div className="space-y-2">
          {displayItems.map((item, index) => {
            const itemId = item.id || `item-${index}`
            const isChecked = checkedItems.has(itemId)
            return (
              <div key={itemId} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <button
                  onClick={() => toggleItem(itemId)}
                  className={cn(
                    "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                    isChecked 
                      ? "bg-[#00ff00] border-[#00ff00] text-black" 
                      : "border-white/30 hover:border-[#00ff00]/50"
                  )}
                >
                  {isChecked && <CheckCircle className="w-3 h-3" />}
                </button>
                <div className="flex-1">
                  <h4 className={cn(
                    "font-medium transition-colors",
                    isChecked ? "text-[#00ff00] line-through" : "text-white"
                  )}>
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00ff00] to-transparent"></div>
          <div className="space-y-6">
            {displayItems.map((item, index) => (
              <div key={item.id || index} className="relative flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#00ff00] rounded-full flex items-center justify-center relative z-10">
                  <span className="text-black text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1 pb-6">
                  <h4 className="font-medium text-white">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  )}
                  {item.metadata?.date && (
                    <p className="text-xs text-[#00ff00] mt-2">{item.metadata.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Cards variant
  if (variant === 'cards') {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((item, index) => (
            <div key={item.id || index} className="p-4 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg hover:border-[#00ff00]/30 transition-all duration-300">
              {showIcons && item.icon && (
                <div className="mb-3">
                  {item.icon}
                </div>
              )}
              <h4 className="font-medium text-white mb-2">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-gray-400">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {displayItems.map((item, index) => (
              <div key={item.id || index} className="flex-shrink-0 w-64 p-4 bg-white/5 border border-white/10 rounded-lg">
                {showIcons && item.icon && (
                  <div className="mb-3">
                    {item.icon}
                  </div>
                )}
                <h4 className="font-medium text-white mb-2">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-gray-400">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default simple list
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      )}
      
      <div className="space-y-2">
        {displayItems.map((item, index) => (
          <div key={item.id || index} className="flex items-start gap-3">
            {showIcons && item.icon && (
              <div className="flex-shrink-0 mt-0.5">
                {item.icon}
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-white">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Specialized list components for common use cases
export function FeatureList({ items, title, subtitle, className, accordionItems }: Omit<InteractiveListProps, 'variant'>) {
  return (
    <InteractiveList
      variant="feature-grid"
      items={items}
      title={title}
      subtitle={subtitle}
      className={className}
      accordionItems={accordionItems}
    />
  )
}

export function TimelineList({ items, title, subtitle, className }: Omit<InteractiveListProps, 'variant'>) {
  return (
    <InteractiveList
      variant="timeline"
      items={items}
      title={title}
      subtitle={subtitle}
      className={className}
    />
  )
}

export function ChecklistList({ items, title, subtitle, className }: Omit<InteractiveListProps, 'variant'>) {
  return (
    <InteractiveList
      variant="checklist"
      items={items}
      title={title}
      subtitle={subtitle}
      className={className}
    />
  )
}

export function AccordionList({ items, title, subtitle, className, collapsible = true }: Omit<InteractiveListProps, 'variant'>) {
  return (
    <InteractiveList
      variant="accordion"
      items={items}
      title={title}
      subtitle={subtitle}
      className={className}
      collapsible={collapsible}
    />
  )
}
