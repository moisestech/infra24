'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EnhancedFormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  description?: string
  helpText?: string
  characterLimit?: number
  wordLimit?: number
  currentValue?: string
  className?: string
  showCharacterCount?: boolean
  showWordCount?: boolean
  acceptedFormats?: string[]
  maxFileSize?: string
  examples?: string[]
}

export function EnhancedFormField({ 
  label, 
  error, 
  required, 
  children, 
  description,
  helpText,
  characterLimit,
  wordLimit,
  currentValue = '',
  className,
  showCharacterCount = false,
  showWordCount = false,
  acceptedFormats,
  maxFileSize,
  examples
}: EnhancedFormFieldProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const helpRef = useRef<HTMLDivElement>(null)

  const characterCount = currentValue.length
  const wordCount = currentValue.trim().split(/\s+/).filter(word => word.length > 0).length

  const isCharacterLimitReached = characterLimit && characterCount >= characterLimit
  const isWordLimitReached = wordLimit && wordCount >= wordLimit
  const isNearCharacterLimit = characterLimit && characterCount >= characterLimit * 0.9
  const isNearWordLimit = wordLimit && wordCount >= wordLimit * 0.9

  return (
    <motion.div 
      className={cn("space-y-3", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Label and Help */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
          
          {description && (
            <div className="text-base text-gray-600 dark:text-gray-400 mb-3">
              {description.split('\n').map((line, index) => (
                <p key={index} className={index > 0 ? 'mt-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {helpText && (
          <div className="relative ml-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Show help"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  ref={helpRef}
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-8 w-80 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                >
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {helpText}
                  </div>
                  <div className="absolute -top-1 right-4 w-2 h-2 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Format Guidelines */}
      {(acceptedFormats || maxFileSize) && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <div className="font-medium mb-1">Accepted formats:</div>
            {acceptedFormats && (
              <div className="mb-1">
                {acceptedFormats.join(', ')}
              </div>
            )}
            {maxFileSize && (
              <div className="text-xs">
                Maximum file size: {maxFileSize}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Examples */}
      {examples && examples.length > 0 && (
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            {showExamples ? 'Hide examples' : 'Show examples'} ({examples.length})
          </Button>
          
          <AnimatePresence>
            {showExamples && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="font-medium mb-2">Examples:</div>
                  <ul className="space-y-1">
                    {examples.map((example, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        {children}
      </div>

      {/* Character/Word Count */}
      {(showCharacterCount || showWordCount) && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {showCharacterCount && characterLimit && (
              <div className={cn(
                "flex items-center space-x-1",
                isCharacterLimitReached ? "text-red-600 dark:text-red-400" :
                isNearCharacterLimit ? "text-orange-600 dark:text-orange-400" :
                "text-gray-500 dark:text-gray-400"
              )}>
                <span>{characterCount}</span>
                <span>/</span>
                <span>{characterLimit}</span>
                <span>characters</span>
              </div>
            )}
            
            {showWordCount && wordLimit && (
              <div className={cn(
                "flex items-center space-x-1",
                isWordLimitReached ? "text-red-600 dark:text-red-400" :
                isNearWordLimit ? "text-orange-600 dark:text-orange-400" :
                "text-gray-500 dark:text-gray-400"
              )}>
                <span>{wordCount}</span>
                <span>/</span>
                <span>{wordLimit}</span>
                <span>words</span>
              </div>
            )}
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-1">
            {error ? (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            ) : currentValue && (
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400" 
          role="alert"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  )
}
