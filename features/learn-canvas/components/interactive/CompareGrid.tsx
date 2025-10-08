'use client'

import { Check, X, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CompareFeature {
  name: string
  values: (boolean | string | number | null)[]
}

interface CompareGridProps {
  tools: string[]
  features: CompareFeature[]
  title?: string
  className?: string
}

export function CompareGrid({
  tools,
  features,
  title = "Tool Comparison",
  className
}: CompareGridProps) {
  if (tools.length === 0 || features.length === 0) return null

  const renderValue = (value: boolean | string | number | null, index: number) => {
    if (value === null) {
      return <Minus className="w-4 h-4 text-gray-500" />
    }
    
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <X className="w-4 h-4 text-red-400" />
      )
    }
    
    if (typeof value === 'number') {
      return (
        <span className="text-sm font-medium text-white">
          {value}
        </span>
      )
    }
    
    return (
      <span className="text-sm text-gray-300">
        {value}
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("space-y-4", className)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
          <Check className="w-4 h-4 text-lime-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          {/* Header Row */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${tools.length}, 1fr)` }}>
            <div className="p-4 bg-white/10 border-b border-white/10">
              <span className="text-sm font-medium text-gray-400">Features</span>
            </div>
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/10 border-b border-white/10 text-center"
              >
                <span className="text-sm font-semibold text-white">{tool}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Feature Rows */}
          {features.map((feature, featureIndex) => (
            <motion.div
              key={featureIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: featureIndex * 0.05 }}
              className={cn(
                "grid border-b border-white/10",
                featureIndex % 2 === 0 ? "bg-white/5" : "bg-white/10"
              )}
              style={{ gridTemplateColumns: `200px repeat(${tools.length}, 1fr)` }}
            >
              <div className="p-4 border-r border-white/10">
                <span className="text-sm text-gray-300">{feature.name}</span>
              </div>
              {feature.values.map((value, valueIndex) => (
                <div
                  key={valueIndex}
                  className="p-4 border-r border-white/10 last:border-r-0 flex items-center justify-center"
                >
                  {renderValue(value, valueIndex)}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Check className="w-3 h-3 text-green-400" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <X className="w-3 h-3 text-red-400" />
          <span>Not Available</span>
        </div>
        <div className="flex items-center gap-1">
          <Minus className="w-3 h-3 text-gray-500" />
          <span>Unknown</span>
        </div>
      </div>
    </motion.div>
  )
} 