'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, Award } from 'lucide-react'

interface ProgressRingProps {
  percent: number
  label?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showIcon?: boolean
  showLabel?: boolean
  showPercentage?: boolean
  animated?: boolean
  color?: 'lime' | 'blue' | 'purple' | 'orange' | 'red'
  className?: string
}

export function ProgressRing({
  percent,
  label = 'Progress',
  size = 'md',
  showIcon = true,
  showLabel = true,
  showPercentage = true,
  animated = true,
  color = 'lime',
  className = ''
}: ProgressRingProps) {
  const [displayPercent, setDisplayPercent] = useState(0)

  // Size configurations
  const sizeConfig = {
    sm: { width: 60, strokeWidth: 4, fontSize: 'text-xs' },
    md: { width: 80, strokeWidth: 6, fontSize: 'text-sm' },
    lg: { width: 120, strokeWidth: 8, fontSize: 'text-base' },
    xl: { width: 160, strokeWidth: 10, fontSize: 'text-lg' }
  }

  const config = sizeConfig[size]
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (displayPercent / 100) * circumference

  // Color configurations
  const colorConfig = {
    lime: {
      stroke: '#84cc16',
      bg: '#84cc16/20',
      icon: '#84cc16'
    },
    blue: {
      stroke: '#3b82f6',
      bg: '#3b82f6/20',
      icon: '#3b82f6'
    },
    purple: {
      stroke: '#8b5cf6',
      bg: '#8b5cf6/20',
      icon: '#8b5cf6'
    },
    orange: {
      stroke: '#f97316',
      bg: '#f97316/20',
      icon: '#f97316'
    },
    red: {
      stroke: '#ef4444',
      bg: '#ef4444/20',
      icon: '#ef4444'
    }
  }

  const colors = colorConfig[color]

  // Animate progress
  useEffect(() => {
    if (animated) {
      const duration = 1000 // 1 second
      const steps = 60
      const increment = percent / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= percent) {
          current = percent
          clearInterval(timer)
        }
        setDisplayPercent(current)
      }, duration / steps)

      return () => clearInterval(timer)
    } else {
      setDisplayPercent(percent)
    }
  }, [percent, animated])

  // Get status icon
  const getStatusIcon = () => {
    if (displayPercent >= 100) {
      return <CheckCircle className="w-4 h-4" style={{ color: colors.icon }} />
    } else if (displayPercent >= 80) {
      return <Award className="w-4 h-4" style={{ color: colors.icon }} />
    } else {
      return <Clock className="w-4 h-4" style={{ color: colors.icon }} />
    }
  }

  // Get status text
  const getStatusText = () => {
    if (displayPercent >= 100) {
      return 'Complete'
    } else if (displayPercent >= 80) {
      return 'Almost Done'
    } else if (displayPercent >= 50) {
      return 'Halfway'
    } else {
      return 'In Progress'
    }
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Progress Ring */}
      <div className="relative">
        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="transparent"
            className="text-gray-700"
          />
          
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showIcon && (
            <div className="mb-1">
              {getStatusIcon()}
            </div>
          )}
          {showPercentage && (
            <div className={`font-bold text-white ${config.fontSize}`}>
              {Math.round(displayPercent)}%
            </div>
          )}
        </div>
      </div>

      {/* Label and Status */}
      {showLabel && (
        <div className="text-center">
          <div className="text-white font-medium">{label}</div>
          <div className="text-gray-400 text-sm">{getStatusText()}</div>
        </div>
      )}
    </div>
  )
}

// Variant components for common use cases
export function ChapterProgress({ percent, chapterTitle }: { percent: number; chapterTitle: string }) {
  return (
    <ProgressRing
      percent={percent}
      label={chapterTitle}
      size="md"
      color="lime"
      showIcon={true}
      showLabel={true}
      showPercentage={true}
      animated={true}
    />
  )
}

export function WorkshopProgress({ percent, workshopTitle }: { percent: number; workshopTitle: string }) {
  return (
    <ProgressRing
      percent={percent}
      label={workshopTitle}
      size="lg"
      color="blue"
      showIcon={true}
      showLabel={true}
      showPercentage={true}
      animated={true}
    />
  )
}

export function AchievementProgress({ percent, achievementName }: { percent: number; achievementName: string }) {
  return (
    <ProgressRing
      percent={percent}
      label={achievementName}
      size="sm"
      color="purple"
      showIcon={true}
      showLabel={true}
      showPercentage={false}
      animated={true}
    />
  )
} 