'use client'

import { useState } from 'react'
import { Clock, Play, CheckCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface ExerciseStep {
  text: string
  completed?: boolean
}

interface ToolLink {
  name: string
  url: string
  description?: string
}

interface ExerciseCardProps {
  title: string
  steps: ExerciseStep[]
  toolLinks?: ToolLink[]
  estTime?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  className?: string
  onStepComplete?: (stepIndex: number, completed: boolean) => void
}

const difficultyConfig = {
  beginner: {
    color: 'bg-green-500/20 border-green-500/30 text-green-400',
    label: 'Beginner'
  },
  intermediate: {
    color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    label: 'Intermediate'
  },
  advanced: {
    color: 'bg-red-500/20 border-red-500/30 text-red-400',
    label: 'Advanced'
  }
}

export function ExerciseCard({ 
  title, 
  steps, 
  toolLinks = [], 
  estTime, 
  difficulty = 'beginner',
  className,
  onStepComplete
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  
  const config = difficultyConfig[difficulty]
  const progress = (completedSteps.size / steps.length) * 100

  const handleStepToggle = (stepIndex: number) => {
    const newCompletedSteps = new Set(completedSteps)
    
    if (newCompletedSteps.has(stepIndex)) {
      newCompletedSteps.delete(stepIndex)
    } else {
      newCompletedSteps.add(stepIndex)
    }
    
    setCompletedSteps(newCompletedSteps)
    onStepComplete?.(stepIndex, newCompletedSteps.has(stepIndex))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-lime-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {estTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{estTime}</span>
                </div>
              )}
              
              <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full border", config.color)}>
                <span className="text-xs font-medium">{config.label}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{completedSteps.size} of {steps.length} steps</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-lime-400 to-green-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      
      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Steps */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Steps</h4>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <button
                        onClick={() => handleStepToggle(index)}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                          completedSteps.has(index)
                            ? "bg-lime-500 border-lime-500 text-black"
                            : "border-gray-500 text-transparent hover:border-lime-400"
                        )}
                      >
                        {completedSteps.has(index) && <CheckCircle className="w-3 h-3" />}
                      </button>
                      
                      <span className={cn(
                        "text-sm leading-relaxed",
                        completedSteps.has(index) ? "text-gray-400 line-through" : "text-gray-200"
                      )}>
                        {step.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Tool Links */}
              {toolLinks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Tools & Resources</h4>
                  <div className="grid gap-2">
                    {toolLinks.map((tool, index) => (
                      <motion.a
                        key={index}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-lime-500/30 hover:bg-white/5 transition-colors group"
                      >
                        <div>
                          <div className="font-medium text-white group-hover:text-lime-400 transition-colors">
                            {tool.name}
                          </div>
                          {tool.description && (
                            <div className="text-sm text-gray-400">{tool.description}</div>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-lime-400 transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 