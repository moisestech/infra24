'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  description?: string
  className?: string
}

export function FormField({ 
  label, 
  error, 
  required, 
  children, 
  description, 
  className 
}: FormFieldProps) {
  return (
    <motion.div 
      className={cn("space-y-2", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      {description && (
        <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      
      <div className="relative">
        {children}
      </div>
      
      {error && (
        <motion.p 
          className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1" 
          role="alert"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg 
            className="h-4 w-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <motion.div 
      className={cn("space-y-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  )
}
