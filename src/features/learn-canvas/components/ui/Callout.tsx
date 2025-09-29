'use client'

import { ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: ReactNode
  className?: string
}

export function Callout({ 
  type = 'info', 
  title, 
  children, 
  className = '' 
}: CalloutProps) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5'
      case 'error':
        return 'border-red-500/20 bg-red-500/5'
      case 'success':
        return 'border-green-500/20 bg-green-500/5'
      default:
        return 'border-blue-500/20 bg-blue-500/5'
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getBorderColor()} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h4>
          )}
          <div className="text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
