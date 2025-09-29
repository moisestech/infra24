'use client'

import { useState, useEffect } from 'react'
import { Award, Lock, Star, Zap, BookOpen, Target, Users, Lightbulb } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: 'award' | 'star' | 'zap' | 'book' | 'target' | 'users' | 'lightbulb' | 'custom'
  customIcon?: React.ReactNode
  color: 'lime' | 'blue' | 'purple' | 'orange' | 'red' | 'pink' | 'cyan' | 'yellow'
  unlocked: boolean
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'achievement' | 'milestone' | 'skill' | 'social'
  progress?: number
  maxProgress?: number
}

interface BadgeGridProps {
  badges: Badge[]
  title?: string
  description?: string
  layout?: 'grid' | 'list' | 'compact'
  showProgress?: boolean
  showRarity?: boolean
  showUnlockDate?: boolean
  animated?: boolean
  className?: string
}

export function BadgeGrid({
  badges,
  title = 'Achievements',
  description,
  layout = 'grid',
  showProgress = true,
  showRarity = true,
  showUnlockDate = true,
  animated = true,
  className = ''
}: BadgeGridProps) {
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set())
  const [showConfetti, setShowConfetti] = useState<string | null>(null)

  // Initialize unlocked badges
  useEffect(() => {
    const unlocked = new Set(badges.filter(b => b.unlocked).map(b => b.id))
    setUnlockedBadges(unlocked)
  }, [badges])

  // Get icon component
  const getIcon = (badge: Badge) => {
    if (badge.customIcon) {
      return badge.customIcon
    }

    const iconProps = { className: 'w-5 h-5' }
    
    switch (badge.icon) {
      case 'award':
        return <Award {...iconProps} />
      case 'star':
        return <Star {...iconProps} />
      case 'zap':
        return <Zap {...iconProps} />
      case 'book':
        return <BookOpen {...iconProps} />
      case 'target':
        return <Target {...iconProps} />
      case 'users':
        return <Users {...iconProps} />
      case 'lightbulb':
        return <Lightbulb {...iconProps} />
      default:
        return <Award {...iconProps} />
    }
  }

  // Get color classes
  const getColorClasses = (badge: Badge) => {
    const colorConfig = {
      lime: {
        bg: 'bg-lime-500/20',
        border: 'border-lime-500/30',
        text: 'text-lime-400',
        icon: 'text-lime-400'
      },
      blue: {
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: 'text-blue-400'
      },
      purple: {
        bg: 'bg-purple-500/20',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        icon: 'text-purple-400'
      },
      orange: {
        bg: 'bg-orange-500/20',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        icon: 'text-orange-400'
      },
      red: {
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: 'text-red-400'
      },
      pink: {
        bg: 'bg-pink-500/20',
        border: 'border-pink-500/30',
        text: 'text-pink-400',
        icon: 'text-pink-400'
      },
      cyan: {
        bg: 'bg-cyan-500/20',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        icon: 'text-cyan-400'
      },
      yellow: {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: 'text-yellow-400'
      }
    }

    return colorConfig[badge.color]
  }

  // Get rarity classes
  const getRarityClasses = (rarity: Badge['rarity']) => {
    const rarityConfig = {
      common: {
        bg: 'bg-gray-500/20',
        border: 'border-gray-500/30',
        text: 'text-gray-400'
      },
      rare: {
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        text: 'text-blue-400'
      },
      epic: {
        bg: 'bg-purple-500/20',
        border: 'border-purple-500/30',
        text: 'text-purple-400'
      },
      legendary: {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400'
      }
    }

    return rarityConfig[rarity]
  }

  // Handle badge unlock animation
  const handleUnlock = (badgeId: string) => {
    if (animated) {
      setShowConfetti(badgeId)
      setTimeout(() => setShowConfetti(null), 2000)
    }
  }

  // Render badge card
  const renderBadgeCard = (badge: Badge) => {
    const colors = getColorClasses(badge)
    const rarity = getRarityClasses(badge.rarity)
    const isUnlocked = unlockedBadges.has(badge.id)
    const isNewlyUnlocked = showConfetti === badge.id

    return (
      <div
        key={badge.id}
        className={`relative group cursor-pointer transition-all duration-300 ${
          layout === 'compact' ? 'p-3' : 'p-4'
        } ${colors.bg} ${colors.border} border rounded-lg hover:scale-105 ${
          isUnlocked ? 'opacity-100' : 'opacity-60'
        } ${isNewlyUnlocked ? 'animate-pulse' : ''}`}
        onClick={() => !isUnlocked && handleUnlock(badge.id)}
      >
        {/* Confetti effect for newly unlocked badges */}
        {isNewlyUnlocked && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
            <div className="absolute top-0 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}

        {/* Badge Icon */}
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            {isUnlocked ? (
              <div className={colors.icon}>
                {getIcon(badge)}
              </div>
            ) : (
              <Lock className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {showRarity && (
            <span className={`text-xs font-medium px-2 py-1 rounded ${rarity.bg} ${rarity.text}`}>
              {badge.rarity}
            </span>
          )}
        </div>

        {/* Badge Content */}
        <div className="space-y-2">
          <h4 className={`font-semibold ${isUnlocked ? colors.text : 'text-gray-500'}`}>
            {badge.name}
          </h4>
          <p className="text-sm text-gray-400">
            {badge.description}
          </p>

          {/* Progress Bar */}
          {showProgress && badge.progress !== undefined && badge.maxProgress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{badge.progress}/{badge.maxProgress}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Unlock Date */}
          {showUnlockDate && badge.unlockedAt && (
            <div className="text-xs text-gray-500 mt-2">
              Unlocked {badge.unlockedAt.toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Hover effect */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">Click to unlock</span>
          </div>
        )}
      </div>
    )
  }

  // Render grid layout
  if (layout === 'grid') {
    return (
      <div className={className}>
        {(title || description) && (
          <div className="mb-6">
            {title && <h3 className="text-xl font-bold text-white mb-2">{title}</h3>}
            {description && <p className="text-gray-400">{description}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {badges.map(renderBadgeCard)}
        </div>
      </div>
    )
  }

  // Render list layout
  if (layout === 'list') {
    return (
      <div className={className}>
        {(title || description) && (
          <div className="mb-6">
            {title && <h3 className="text-xl font-bold text-white mb-2">{title}</h3>}
            {description && <p className="text-gray-400">{description}</p>}
          </div>
        )}
        <div className="space-y-3">
          {badges.map(renderBadgeCard)}
        </div>
      </div>
    )
  }

  // Render compact layout
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-bold text-white mb-1">{title}</h3>}
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {badges.map(renderBadgeCard)}
      </div>
    </div>
  )
}

// Predefined badge sets
export const commonBadges: Badge[] = [
  {
    id: 'first-chapter',
    name: 'First Steps',
    description: 'Complete your first chapter',
    icon: 'book',
    color: 'lime',
    unlocked: false,
    rarity: 'common',
    category: 'milestone'
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score 100% on 5 quizzes',
    icon: 'target',
    color: 'blue',
    unlocked: false,
    rarity: 'rare',
    category: 'achievement',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Participate in 10 polls',
    icon: 'users',
    color: 'purple',
    unlocked: false,
    rarity: 'epic',
    category: 'social',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'creative-genius',
    name: 'Creative Genius',
    description: 'Complete all exercises in a workshop',
    icon: 'lightbulb',
    color: 'orange',
    unlocked: false,
    rarity: 'legendary',
    category: 'achievement'
  }
]

// Helper component for workshop completion badges
export function WorkshopBadges({ workshopId, completedChapters }: { workshopId: string; completedChapters: number }) {
  const totalChapters = 10 // Assuming 10 chapters per workshop
  const progress = (completedChapters / totalChapters) * 100

  const workshopBadges: Badge[] = [
    {
      id: `${workshopId}-starter`,
      name: 'Workshop Starter',
      description: 'Begin your learning journey',
      icon: 'book',
      color: 'lime',
      unlocked: completedChapters > 0,
      rarity: 'common',
      category: 'milestone'
    },
    {
      id: `${workshopId}-halfway`,
      name: 'Halfway Hero',
      description: 'Complete 50% of the workshop',
      icon: 'target',
      color: 'blue',
      unlocked: progress >= 50,
      rarity: 'rare',
      category: 'milestone'
    },
    {
      id: `${workshopId}-completion`,
      name: 'Workshop Master',
      description: 'Complete the entire workshop',
      icon: 'award',
      color: 'purple',
      unlocked: progress >= 100,
      rarity: 'epic',
      category: 'achievement'
    }
  ]

  return <BadgeGrid badges={workshopBadges} layout="compact" />
} 