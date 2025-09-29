'use client'

import { 
  ArrowRightCircle, 
  ArrowDownCircle, 
  Minus, 
  Star, 
  Sparkles,
  Zap,
  Heart,
  Target,
  BookOpen,
  Palette,
  Code,
  Music,
  Video,
  Camera,
  Globe,
  Lightbulb
} from 'lucide-react'

interface IconDividerProps {
  icon?: 'arrow-right' | 'arrow-down' | 'minus' | 'star' | 'sparkles' | 'zap' | 'heart' | 'target' | 'book' | 'palette' | 'code' | 'music' | 'video' | 'camera' | 'globe' | 'lightbulb' | 'custom'
  customIcon?: React.ReactNode
  text?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'lime' | 'blue' | 'purple' | 'orange' | 'red' | 'pink' | 'cyan' | 'yellow' | 'white'
  variant?: 'simple' | 'fancy' | 'gradient' | 'animated'
  className?: string
}

export function IconDivider({
  icon = 'arrow-right',
  customIcon,
  text,
  size = 'md',
  color = 'lime',
  variant = 'simple',
  className = ''
}: IconDividerProps) {
  // Size configurations
  const sizeConfig = {
    sm: { iconSize: 16, textSize: 'text-sm', spacing: 'py-4' },
    md: { iconSize: 24, textSize: 'text-base', spacing: 'py-6' },
    lg: { iconSize: 32, textSize: 'text-lg', spacing: 'py-8' }
  }

  const config = sizeConfig[size]

  // Color configurations
  const colorConfig = {
    lime: {
      icon: 'text-lime-400',
      border: 'border-lime-500/30',
      gradient: 'from-lime-400 to-cyan-400'
    },
    blue: {
      icon: 'text-blue-400',
      border: 'border-blue-500/30',
      gradient: 'from-blue-400 to-purple-400'
    },
    purple: {
      icon: 'text-purple-400',
      border: 'border-purple-500/30',
      gradient: 'from-purple-400 to-pink-400'
    },
    orange: {
      icon: 'text-orange-400',
      border: 'border-orange-500/30',
      gradient: 'from-orange-400 to-red-400'
    },
    red: {
      icon: 'text-red-400',
      border: 'border-red-500/30',
      gradient: 'from-red-400 to-pink-400'
    },
    pink: {
      icon: 'text-pink-400',
      border: 'border-pink-500/30',
      gradient: 'from-pink-400 to-purple-400'
    },
    cyan: {
      icon: 'text-cyan-400',
      border: 'border-cyan-500/30',
      gradient: 'from-cyan-400 to-blue-400'
    },
    yellow: {
      icon: 'text-yellow-400',
      border: 'border-yellow-500/30',
      gradient: 'from-yellow-400 to-orange-400'
    },
    white: {
      icon: 'text-white',
      border: 'border-white/30',
      gradient: 'from-white to-gray-300'
    }
  }

  const colors = colorConfig[color]

  // Get icon component
  const getIcon = () => {
    if (customIcon) {
      return customIcon
    }

    const iconProps = { 
      className: `${colors.icon} ${variant === 'animated' ? 'animate-pulse' : ''}`,
      size: config.iconSize 
    }

    switch (icon) {
      case 'arrow-right':
        return <ArrowRightCircle {...iconProps} />
      case 'arrow-down':
        return <ArrowDownCircle {...iconProps} />
      case 'minus':
        return <Minus {...iconProps} />
      case 'star':
        return <Star {...iconProps} />
      case 'sparkles':
        return <Sparkles {...iconProps} />
      case 'zap':
        return <Zap {...iconProps} />
      case 'heart':
        return <Heart {...iconProps} />
      case 'target':
        return <Target {...iconProps} />
      case 'book':
        return <BookOpen {...iconProps} />
      case 'palette':
        return <Palette {...iconProps} />
      case 'code':
        return <Code {...iconProps} />
      case 'music':
        return <Music {...iconProps} />
      case 'video':
        return <Video {...iconProps} />
      case 'camera':
        return <Camera {...iconProps} />
      case 'globe':
        return <Globe {...iconProps} />
      case 'lightbulb':
        return <Lightbulb {...iconProps} />
      default:
        return <ArrowRightCircle {...iconProps} />
    }
  }

  // Render different variants
  if (variant === 'fancy') {
    return (
      <div className={`flex items-center justify-center ${config.spacing} ${className}`}>
        <div className="flex items-center space-x-4">
          <div className={`flex-1 h-px ${colors.border} bg-gradient-to-r from-transparent ${colors.gradient.split(' ')[1]}`} />
          <div className="flex items-center space-x-3">
            {getIcon()}
            {text && (
              <span className={`${config.textSize} font-medium bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {text}
              </span>
            )}
          </div>
          <div className={`flex-1 h-px ${colors.border} bg-gradient-to-l from-transparent ${colors.gradient.split(' ')[1]}`} />
        </div>
      </div>
    )
  }

  if (variant === 'gradient') {
    return (
      <div className={`flex items-center justify-center ${config.spacing} ${className}`}>
        <div className="relative">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors.gradient} p-0.5`}>
            <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
              {getIcon()}
            </div>
          </div>
          {text && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className={`${config.textSize} font-medium bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {text}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'animated') {
    return (
      <div className={`flex items-center justify-center ${config.spacing} ${className}`}>
        <div className="flex items-center space-x-4">
          <div className={`flex-1 h-px ${colors.border} animate-pulse`} />
          <div className="flex items-center space-x-3">
            <div className="animate-bounce">
              {getIcon()}
            </div>
            {text && (
              <span className={`${config.textSize} font-medium ${colors.icon} animate-pulse`}>
                {text}
              </span>
            )}
          </div>
          <div className={`flex-1 h-px ${colors.border} animate-pulse`} />
        </div>
      </div>
    )
  }

  // Simple variant (default)
  return (
    <div className={`flex items-center justify-center ${config.spacing} ${className}`}>
      <div className="flex items-center space-x-4">
        <div className={`flex-1 h-px ${colors.border}`} />
        <div className="flex items-center space-x-3">
          {getIcon()}
          {text && (
            <span className={`${config.textSize} font-medium ${colors.icon}`}>
              {text}
            </span>
          )}
        </div>
        <div className={`flex-1 h-px ${colors.border}`} />
      </div>
    </div>
  )
}

// Predefined dividers for common use cases
export function TopicDivider({ text, ...props }: Omit<IconDividerProps, 'icon'>) {
  return (
    <IconDivider
      icon="arrow-right"
      text={text}
      variant="fancy"
      color="lime"
      {...props}
    />
  )
}

export function SectionDivider({ text, ...props }: Omit<IconDividerProps, 'icon'>) {
  return (
    <IconDivider
      icon="minus"
      text={text}
      variant="simple"
      color="blue"
      {...props}
    />
  )
}

export function ChapterDivider({ text, ...props }: Omit<IconDividerProps, 'icon'>) {
  return (
    <IconDivider
      icon="star"
      text={text}
      variant="gradient"
      color="purple"
      {...props}
    />
  )
}

export function ExerciseDivider({ text, ...props }: Omit<IconDividerProps, 'icon'>) {
  return (
    <IconDivider
      icon="target"
      text={text}
      variant="animated"
      color="orange"
      {...props}
    />
  )
}

export function NextChapterDivider({ text = 'Next Chapter', ...props }: Omit<IconDividerProps, 'icon'>) {
  return (
    <IconDivider
      icon="arrow-right"
      text={text}
      variant="fancy"
      color="lime"
      size="lg"
      {...props}
    />
  )
} 