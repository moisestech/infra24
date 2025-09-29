'use client'

import { Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface TimelineEvent {
  year: string
  title: string
  description: string
  category?: 'milestone' | 'breakthrough' | 'release' | 'research'
}

interface TimelineProps {
  events: TimelineEvent[]
  title?: string
  className?: string
}

const categoryConfig = {
  milestone: {
    color: 'bg-lime-500',
    borderColor: 'border-lime-500',
    textColor: 'text-lime-400'
  },
  breakthrough: {
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400'
  },
  release: {
    color: 'bg-purple-500',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400'
  },
  research: {
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-400'
  }
}

export function Timeline({ 
  events, 
  title = "AI Development Timeline", 
  className 
}: TimelineProps) {
  if (events.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("space-y-6", className)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-lime-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/20" />
        
        <div className="space-y-8">
          {events.map((event, index) => {
            const config = categoryConfig[event.category || 'milestone']
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                    config.borderColor,
                    config.color
                  )}>
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      <span className={cn(
                        "text-sm font-medium px-2 py-1 rounded-full border",
                        config.textColor,
                        config.borderColor.replace('border-', 'border-')
                      )}>
                        {event.year}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
} 