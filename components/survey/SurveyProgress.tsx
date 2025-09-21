'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SurveyProgressProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
  className?: string
}

export function SurveyProgress({ 
  currentStep, 
  totalSteps, 
  stepLabels, 
  className 
}: SurveyProgressProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center">
                {/* Connector Line */}
                {index < stepLabels.length - 1 && (
                  <div 
                    className={cn(
                      "w-8 h-0.5 mx-2",
                      isCompleted ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                    )}
                  />
                )}
                
                {/* Step Circle */}
                <div className="relative">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </motion.div>
                  ) : (
                    <Circle 
                      className={cn(
                        "w-6 h-6",
                        isCurrent 
                          ? "text-blue-600 fill-blue-600" 
                          : "text-gray-300 dark:text-gray-600"
                      )} 
                    />
                  )}
                  
                  {/* Current Step Pulse */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-600 opacity-20"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <div className={cn(
                  "text-xs font-medium",
                  isCurrent || isCompleted
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}>
                  {label}
                </div>
                {isCurrent && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Current
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
