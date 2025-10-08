'use client'

import { ExternalLink, BookOpen, Video, FileText, Code, Globe, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ResourceItem {
  title: string
  url: string
  type?: 'article' | 'video' | 'document' | 'code' | 'website' | 'download'
  description?: string
  author?: string
  duration?: string
}

interface ResourceListProps {
  items: ResourceItem[]
  title?: string
  className?: string
}

const resourceTypeConfig = {
  article: {
    icon: BookOpen,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  video: {
    icon: Video,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  document: {
    icon: FileText,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  code: {
    icon: Code,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  website: {
    icon: Globe,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20'
  },
  download: {
    icon: Download,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  }
}

export function ResourceList({ 
  items, 
  title = "Additional Resources", 
  className 
}: ResourceListProps) {
  if (items.length === 0) return null

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
          <BookOpen className="w-4 h-4 text-lime-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      {/* Resources Grid */}
      <div className="grid gap-3">
        {items.map((item, index) => {
          const config = resourceTypeConfig[item.type || 'website'] || resourceTypeConfig['website'];
          if (!resourceTypeConfig[item.type || 'website']) {
            console.warn('[ResourceList] Unknown resource type:', item.type, 'for item:', item);
          }
          const IconComponent = config.icon
          
          return (
            <motion.a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group p-4 rounded-lg border transition-all duration-300",
                config.borderColor,
                "hover:border-lime-500/50 hover:bg-white/5",
                "focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:ring-offset-2 focus:ring-offset-black"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  config.bgColor
                )}>
                  <IconComponent className={cn("w-5 h-5", config.color)} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-white group-hover:text-lime-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-lime-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    {item.author && (
                      <span>By {item.author}</span>
                    )}
                    {item.duration && (
                      <span>{item.duration}</span>
                    )}
                    {item.type && (
                      <span className="capitalize">{item.type}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.a>
          )
        })}
      </div>
      
      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-500">
          {items.length} resource{items.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </motion.div>
  )
} 