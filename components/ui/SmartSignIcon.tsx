'use client'
import { Signpost } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SmartSignIconProps {
  size?: number
  className?: string
  showText?: boolean
  autoHideOnMobile?: boolean
}

export default function SmartSignIcon({ 
  size = 24, 
  className = "text-blue-600",
  showText = false,
  autoHideOnMobile = false
}: SmartSignIconProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const shouldShowText = autoHideOnMobile ? (showText && !isMobile) : showText

  return (
    <div className="flex items-center space-x-2">
      <Signpost 
        size={size} 
        className={className}
      />
      {shouldShowText && (
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Smart Sign
        </span>
      )}
    </div>
  )
}
