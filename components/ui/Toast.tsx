'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const bgColor = type === 'success' 
    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'

  const textColor = type === 'success' 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400'

  const iconColor = type === 'success' 
    ? 'text-green-400 dark:text-green-500' 
    : 'text-red-400 dark:text-red-500'

  const Icon = type === 'success' ? CheckCircle : XCircle

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2">
      <div className={`flex items-center p-4 rounded-lg border ${bgColor} shadow-lg max-w-sm`}>
        <Icon className={`h-5 w-5 ${iconColor} mr-3 flex-shrink-0`} />
        <p className={`text-sm font-medium ${textColor} flex-1`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
