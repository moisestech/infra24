'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Minus } from 'lucide-react'

interface ComparisonItem {
  id: string
  name: string
  description?: string
  features: {
    [key: string]: boolean | string | number
  }
  metadata?: {
    price?: string
    category?: string
    rating?: number
    website?: string
  }
}

interface ComparisonListProps {
  title?: string
  subtitle?: string
  items: ComparisonItem[]
  features: {
    key: string
    label: string
    description?: string
    type?: 'boolean' | 'text' | 'number'
  }[]
  className?: string
  collapsible?: boolean
  defaultExpanded?: boolean
  highlightDifferences?: boolean
}

export function ComparisonList({
  title,
  subtitle,
  items,
  features,
  className,
  collapsible = false,
  defaultExpanded = true,
  highlightDifferences = true
}: ComparisonListProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const getFeatureValue = (item: ComparisonItem, featureKey: string) => {
    return item.features[featureKey]
  }

  const renderFeatureValue = (value: boolean | string | number, type: string = 'boolean') => {
    if (type === 'boolean') {
      if (value === true) {
        return <CheckCircle className="w-4 h-4 text-green-400" />
      } else if (value === false) {
        return <XCircle className="w-4 h-4 text-red-400" />
      } else {
        return <Minus className="w-4 h-4 text-gray-400" />
      }
    }
    
    if (type === 'number') {
      return <span className="text-[#00ff00] font-mono">{value}</span>
    }
    
    return <span className="text-white">{value}</span>
  }

  const isFeatureDifferent = (featureKey: string) => {
    if (!highlightDifferences) return false
    
    const values = items.map(item => getFeatureValue(item, featureKey))
    return new Set(values).size > 1
  }

  return (
    <div className={cn("space-y-4", className)}>
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
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}>
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-medium text-white">Features</h4>
              </div>
              {items.map((item) => (
                <div key={item.id} className="p-4 bg-white/5 rounded-lg text-center">
                  <h4 className="font-medium text-white mb-1">{item.name}</h4>
                  {item.description && (
                    <p className="text-xs text-gray-400">{item.description}</p>
                  )}
                  {item.metadata?.price && (
                    <p className="text-sm text-[#00ff00] mt-2 font-semibold">{item.metadata.price}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Feature rows */}
            <div className="space-y-2">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className={cn(
                    "grid gap-4 p-4 rounded-lg transition-colors cursor-pointer",
                    isFeatureDifferent(feature.key) 
                      ? "bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20" 
                      : "bg-white/5 hover:bg-white/10",
                    selectedFeature === feature.key && "bg-[#00ff00]/10 border border-[#00ff00]/30"
                  )}
                  style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
                  onClick={() => setSelectedFeature(selectedFeature === feature.key ? null : feature.key)}
                >
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-white">{feature.label}</h5>
                    {isFeatureDifferent(feature.key) && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                        Diff
                      </span>
                    )}
                  </div>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-center">
                      {renderFeatureValue(getFeatureValue(item, feature.key), feature.type)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Specialized comparison for platforms
export function PlatformComparison({ items, features, title, subtitle, className }: Omit<ComparisonListProps, 'items'> & { items: ComparisonItem[] }) {
  return (
    <ComparisonList
      items={items}
      features={features}
      title={title}
      subtitle={subtitle}
      className={className}
      highlightDifferences={true}
    />
  )
}
