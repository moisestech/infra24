'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  // Get organization theme colors with fallback
  let themeColors
  try {
    const orgTheme = useOrganizationTheme()
    themeColors = orgTheme?.theme?.colors
  } catch (error) {
    console.warn('OrganizationTheme not available, using fallback colors')
  }

  // Fallback colors if themeColors is not available
  const fallbackColors = {
    primary: '#3b82f6',
    primaryLight: '#dbeafe',
    primaryDark: '#1e40af',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    cardBackground: '#ffffff'
  }

  const colors = themeColors || fallbackColors
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
        <span className="font-medium" style={{ color: '#666666' }}>
          Question {currentStep + 1} of {totalSteps}
        </span>
        <span className="font-mono" style={{ color: '#666666' }}>
          {Math.round(progress)}% complete
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: colors.primary + '20' }}>
        <motion.div
          className="h-2 rounded-full relative"
          style={{ 
            background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primary} 100%)`
          }}
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
      
      {/* Compact Step Indicators - Only show a few dots for many steps */}
      <div className="flex justify-center space-x-1">
        {totalSteps <= 10 ? (
          // Show all steps if 10 or fewer
          Array.from({ length: totalSteps }, (_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: index <= currentStep ? colors.primary : colors.primary + '40'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
            />
          ))
        ) : (
          // Show compact representation for many steps
          <>
            {/* First few steps */}
            {Array.from({ length: Math.min(3, currentStep + 1) }, (_, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{ backgroundColor: colors.primary }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
              />
            ))}
            
            {/* Ellipsis if we're in the middle */}
            {currentStep > 2 && currentStep < totalSteps - 3 && (
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary + '40' }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary + '40' }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary + '40' }} />
              </div>
            )}
            
            {/* Last few steps */}
            {Array.from({ length: Math.min(3, totalSteps - currentStep) }, (_, index) => {
              const stepIndex = totalSteps - 3 + index
              return (
                <motion.div
                  key={stepIndex}
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: stepIndex <= currentStep ? colors.primary : colors.primary + '40'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (stepIndex - totalSteps + 3) * 0.05 }}
                />
              )
            })}
          </>
        )}
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
  // Get organization theme colors with fallback
  let themeColors
  try {
    const orgTheme = useOrganizationTheme()
    themeColors = orgTheme?.theme?.colors
  } catch (error) {
    console.warn('OrganizationTheme not available, using fallback colors')
  }

  // Fallback colors if themeColors is not available
  const fallbackColors = {
    primary: '#3b82f6',
    primaryLight: '#dbeafe',
    primaryDark: '#1e40af',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    cardBackground: '#ffffff'
  }

  const colors = themeColors || fallbackColors
  
  // For many steps, show a more compact version
  if (steps.length > 8) {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        {/* Show first few steps */}
        {steps.slice(0, 3).map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-300"
              style={{
                backgroundColor: index < currentStep 
                  ? colors.primary 
                  : index === currentStep 
                    ? colors.primary 
                    : colors.primary + '40',
                color: index <= currentStep ? '#ffffff' : '#666666'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {index < currentStep ? '✓' : index + 1}
            </motion.div>
            <span 
              className="mt-1 text-xs font-medium transition-colors duration-300"
              style={{ 
                color: index <= currentStep ? '#000000' : '#666666' 
              }}
            >
              {step.length > 8 ? step.substring(0, 8) + '...' : step}
            </span>
          </div>
        ))}
        
        {/* Ellipsis */}
        <div className="flex flex-col items-center">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: colors.primary + '40' }}
          >
            ...
          </div>
          <span 
            className="mt-1 text-xs font-medium"
            style={{ color: '#666666' }}
          >
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        {/* Show last few steps */}
        {steps.slice(-2).map((step, index) => {
          const actualIndex = steps.length - 2 + index
          return (
            <div key={actualIndex} className="flex flex-col items-center">
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-300"
                style={{
                  backgroundColor: actualIndex < currentStep 
                    ? colors.primary 
                    : actualIndex === currentStep 
                      ? colors.primary 
                      : colors.primary + '40',
                  color: actualIndex <= currentStep ? '#ffffff' : '#666666'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (actualIndex - steps.length + 2) * 0.05 }}
              >
                {actualIndex < currentStep ? '✓' : actualIndex + 1}
              </motion.div>
              <span 
                className="mt-1 text-xs font-medium transition-colors duration-300"
                style={{ 
                  color: actualIndex <= currentStep ? '#000000' : '#666666' 
                }}
              >
                {step.length > 8 ? step.substring(0, 8) + '...' : step}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  
  // For fewer steps, show the full version
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300"
              style={{
                backgroundColor: index < currentStep 
                  ? colors.primary 
                  : index === currentStep 
                    ? colors.primary 
                    : colors.primary + '40',
                color: index <= currentStep ? '#ffffff' : '#666666'
              }}
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
            
            <span 
              className="mt-2 text-xs font-medium transition-colors duration-300"
              style={{ 
                color: index <= currentStep ? '#000000' : '#666666' 
              }}
            >
              {step}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <motion.div
              className="flex-1 h-0.5 mx-4 transition-colors duration-300"
              style={{
                backgroundColor: index < currentStep ? colors.primary : colors.primary + '40'
              }}
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
