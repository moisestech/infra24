'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100
  
  return (
    <motion.div 
      className={cn("space-y-3", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress Text */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          Question {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-gray-500 dark:text-gray-500 font-mono">
          {Math.round(progress)}% complete
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: 0.5 
            }}
          />
        </motion.div>
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              index <= currentStep 
                ? "bg-blue-500" 
                : "bg-gray-300 dark:bg-gray-600"
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300",
                index < currentStep 
                  ? "bg-green-500 text-white" 
                  : index === currentStep 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </motion.div>
            
            <span className={cn(
              "mt-2 text-xs font-medium transition-colors duration-300",
              index <= currentStep 
                ? "text-gray-900 dark:text-white" 
                : "text-gray-500 dark:text-gray-400"
            )}>
              {step}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <motion.div
              className={cn(
                "flex-1 h-0.5 mx-4 transition-colors duration-300",
                index < currentStep 
                  ? "bg-green-500" 
                  : "bg-gray-300 dark:bg-gray-600"
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
