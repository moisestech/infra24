'use client'

import { ReactNode, useState } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const show = () => setIsVisible(true)
  const hide = () => setIsVisible(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900',
    bottom: 'absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900',
    left: 'absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900',
    right: 'absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900'
  }

  return (
    <div
      className={`relative inline-flex shrink-0 ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}
      <div
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white transition-opacity ${
          positionClasses[position]
        } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        role="tooltip"
      >
        {content}
        <div className={arrowClasses[position]} />
      </div>
    </div>
  )
}
