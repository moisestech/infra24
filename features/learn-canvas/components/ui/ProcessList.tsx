'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, CheckCircle, Clock, ArrowRight, Play, Pause } from 'lucide-react'

interface ProcessStep {
  id: string
  title: string
  description: string
  details?: string[]
  estimatedTime?: string
  tips?: string[]
  completed?: boolean
  icon?: React.ReactNode
}

interface ProcessListProps {
  title?: string
  subtitle?: string
  steps: ProcessStep[]
  className?: string
  variant?: 'vertical' | 'horizontal' | 'accordion'
  showProgress?: boolean
  interactive?: boolean
  autoAdvance?: boolean
  onStepComplete?: (stepId: string) => void
}

export function ProcessList({
  title,
  subtitle,
  steps,
  className,
  variant = 'vertical',
  showProgress = true,
  interactive = false,
  autoAdvance = false,
  onStepComplete
}: ProcessListProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  const completeStep = (stepId: string) => {
    if (!interactive) return
    
    const newCompleted = new Set(completedSteps)
    newCompleted.add(stepId)
    setCompletedSteps(newCompleted)
    
    onStepComplete?.(stepId)
    
    if (autoAdvance && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const progressPercentage = (completedSteps.size / steps.length) * 100

  // Vertical variant (default)
  if (variant === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
        
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress</span>
              <span>{completedSteps.size} of {steps.length} completed</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-[#00ff00] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id)
            const isCurrent = currentStep === index
            const isExpanded = expandedSteps.has(step.id)
            
            return (
              <div key={step.id} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-[#00ff00] to-transparent" />
                )}
                
                <div className={cn(
                  "flex gap-4 p-4 rounded-lg transition-all duration-300",
                  isCompleted && "bg-green-500/10 border border-green-500/30",
                  isCurrent && !isCompleted && "bg-[#00ff00]/10 border border-[#00ff00]/30",
                  !isCompleted && !isCurrent && "bg-white/5 hover:bg-white/10"
                )}>
                  {/* Step number/icon */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors",
                    isCompleted && "bg-green-500 text-black",
                    isCurrent && !isCompleted && "bg-[#00ff00] text-black",
                    !isCompleted && !isCurrent && "bg-white/10 text-white"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        "font-medium transition-colors",
                        isCompleted && "text-green-400 line-through",
                        isCurrent && !isCompleted && "text-[#00ff00]",
                        !isCompleted && !isCurrent && "text-white"
                      )}>
                        {step.title}
                      </h4>
                      
                      <div className="flex items-center gap-2">
                        {step.estimatedTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{step.estimatedTime}</span>
                          </div>
                        )}
                        
                        {interactive && !isCompleted && (
                          <button
                            onClick={() => completeStep(step.id)}
                            className="px-3 py-1 text-xs bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30 rounded hover:bg-[#00ff00]/30 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                    
                    {(step.details || step.tips) && (
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="flex items-center gap-1 text-xs text-[#00ff00] mt-2 hover:text-[#00ff00]/80 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        {isExpanded ? 'Hide' : 'Show'} details
                      </button>
                    )}
                    
                    {isExpanded && (step.details || step.tips) && (
                      <div className="mt-3 space-y-2">
                        {step.details && (
                          <div>
                            <h5 className="text-xs font-medium text-white mb-1">Details:</h5>
                            <ul className="text-xs text-gray-400 space-y-1">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-[#00ff00] mt-1">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {step.tips && (
                          <div>
                            <h5 className="text-xs font-medium text-white mb-1">Tips:</h5>
                            <ul className="text-xs text-gray-400 space-y-1">
                              {step.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-yellow-400 mt-1">💡</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const isCurrent = currentStep === index
              
              return (
                <div key={step.id} className="flex-shrink-0 w-64">
                  <div className={cn(
                    "p-4 rounded-lg transition-all duration-300",
                    isCompleted && "bg-green-500/10 border border-green-500/30",
                    isCurrent && !isCompleted && "bg-[#00ff00]/10 border border-[#00ff00]/30",
                    !isCompleted && !isCurrent && "bg-white/5 border border-white/10"
                  )}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                        isCompleted && "bg-green-500 text-black",
                        isCurrent && !isCompleted && "bg-[#00ff00] text-black",
                        !isCompleted && !isCurrent && "bg-white/10 text-white"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <h4 className={cn(
                        "font-medium text-sm transition-colors",
                        isCompleted && "text-green-400 line-through",
                        isCurrent && !isCompleted && "text-[#00ff00]",
                        !isCompleted && !isCurrent && "text-white"
                      )}>
                        {step.title}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-3">{step.description}</p>
                    
                    {step.estimatedTime && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>{step.estimatedTime}</span>
                      </div>
                    )}
                    
                    {interactive && !isCompleted && (
                      <button
                        onClick={() => completeStep(step.id)}
                        className="w-full px-3 py-2 text-xs bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30 rounded hover:bg-[#00ff00]/30 transition-colors"
                      >
                        Complete Step
                      </button>
                    )}
                  </div>
                  
                  {/* Arrow connector */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center mt-4">
                      <ArrowRight className="w-4 h-4 text-[#00ff00]" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Accordion variant
  if (variant === 'accordion') {
    return (
      <div className={cn("space-y-2", className)}>
        {title && (
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        )}
        
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id)
            const isExpanded = expandedSteps.has(step.id)
            
            return (
              <div key={step.id} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={cn(
                    "w-full p-4 text-left transition-colors",
                    isCompleted && "bg-green-500/10",
                    !isCompleted && "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                        isCompleted && "bg-green-500 text-black",
                        !isCompleted && "bg-white/10 text-white"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4 className={cn(
                          "font-medium transition-colors",
                          isCompleted && "text-green-400 line-through",
                          !isCompleted && "text-white"
                        )}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-4 bg-white/5 border-t border-white/10">
                    {(step.details || step.tips) && (
                      <div className="space-y-3">
                        {step.details && (
                          <div>
                            <h5 className="text-sm font-medium text-white mb-2">Details:</h5>
                            <ul className="text-sm text-gray-400 space-y-1">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-[#00ff00] mt-1">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {step.tips && (
                          <div>
                            <h5 className="text-sm font-medium text-white mb-2">Tips:</h5>
                            <ul className="text-sm text-gray-400 space-y-1">
                              {step.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-yellow-400 mt-1">💡</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {interactive && !isCompleted && (
                      <button
                        onClick={() => completeStep(step.id)}
                        className="mt-3 px-4 py-2 text-sm bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30 rounded hover:bg-[#00ff00]/30 transition-colors"
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
