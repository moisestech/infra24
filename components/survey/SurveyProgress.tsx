'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext'

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
  // Get organization theme colors with fallback
  let themeColors
  try {
    const orgTheme = useOrganizationTheme()
    themeColors = orgTheme?.themeColors
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
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  // For many steps (>8), show a compact version
  if (totalSteps > 8) {
    return (
      <div className={cn("w-full", className)}>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          
          <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.primaryLight }}>
            <motion.div
              className="h-2 rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Compact Step Indicators */}
        <div className="flex items-center justify-center space-x-2">
          {/* Show first few steps */}
          {stepLabels.slice(0, 3).map((label, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="relative">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CheckCircle 
                        className="w-5 h-5" 
                        style={{ color: colors.primary }}
                      />
                    </motion.div>
                  ) : (
                    <Circle 
                      className={cn("w-5 h-5")}
                      style={{
                        color: isCurrent ? colors.primary : colors.primaryLight,
                        fill: isCurrent ? colors.primary : 'transparent'
                      }}
                    />
                  )}
                  
                  {/* Current Step Pulse */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{ backgroundColor: colors.primary }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                
                <div className="mt-1 text-center">
                  <div 
                    className="text-xs font-medium"
                    style={{ 
                      color: isCurrent || isCompleted ? colors.textPrimary : colors.textSecondary 
                    }}
                  >
                    {label.length > 8 ? label.substring(0, 8) + '...' : label}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Ellipsis */}
          <div className="flex flex-col items-center">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: colors.primaryLight }}
            >
              ...
            </div>
            <div 
              className="mt-1 text-xs font-medium"
              style={{ color: colors.textSecondary }}
            >
              {currentStep + 1} of {totalSteps}
            </div>
          </div>
          
          {/* Show last few steps */}
          {stepLabels.slice(-2).map((label, index) => {
            const actualIndex = totalSteps - 2 + index
            const isCompleted = actualIndex < currentStep
            const isCurrent = actualIndex === currentStep
            
            return (
              <div key={actualIndex} className="flex flex-col items-center">
                <div className="relative">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: (actualIndex - totalSteps + 2) * 0.1 }}
                    >
                      <CheckCircle 
                        className="w-5 h-5" 
                        style={{ color: colors.primary }}
                      />
                    </motion.div>
                  ) : (
                    <Circle 
                      className={cn("w-5 h-5")}
                      style={{
                        color: isCurrent ? colors.primary : colors.primaryLight,
                        fill: isCurrent ? colors.primary : 'transparent'
                      }}
                    />
                  )}
                  
                  {/* Current Step Pulse */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{ backgroundColor: colors.primary }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                
                <div className="mt-1 text-center">
                  <div 
                    className="text-xs font-medium"
                    style={{ 
                      color: isCurrent || isCompleted ? colors.textPrimary : colors.textSecondary 
                    }}
                  >
                    {label.length > 8 ? label.substring(0, 8) + '...' : label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // For fewer steps, show the full version
  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm" style={{ color: colors.textSecondary }}>
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        
        <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.primaryLight }}>
          <motion.div
            className="h-2 rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Full Step Indicators */}
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center">
                {/* Connector Line */}
                {index < stepLabels.length - 1 && (
                  <div 
                    className="w-8 h-0.5 mx-2"
                    style={{
                      backgroundColor: isCompleted ? colors.primary : colors.primaryLight
                    }}
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
                      <CheckCircle 
                        className="w-6 h-6" 
                        style={{ color: colors.primary }}
                      />
                    </motion.div>
                  ) : (
                    <Circle 
                      className="w-6 h-6"
                      style={{
                        color: isCurrent ? colors.primary : colors.primaryLight,
                        fill: isCurrent ? colors.primary : 'transparent'
                      }}
                    />
                  )}
                  
                  {/* Current Step Pulse */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{ backgroundColor: colors.primary }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <div 
                  className="text-xs font-medium"
                  style={{ 
                    color: isCurrent || isCompleted ? colors.textPrimary : colors.textSecondary 
                  }}
                >
                  {label}
                </div>
                {isCurrent && (
                  <div 
                    className="text-xs font-medium"
                    style={{ color: colors.primary }}
                  >
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
