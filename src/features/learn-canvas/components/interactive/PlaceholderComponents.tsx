'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react'

// Activity Component
interface ActivityProps {
  title: string
  description?: string
  steps?: string[]
  estimatedTime?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  onStart?: () => void
  className?: string
}

export function Activity({ 
  title, 
  description, 
  steps, 
  estimatedTime, 
  difficulty,
  onStart,
  className = '' 
}: ActivityProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'border-green-400 text-green-400'
      case 'intermediate':
        return 'border-yellow-400 text-yellow-400'
      case 'advanced':
        return 'border-red-400 text-red-400'
      default:
        return 'border-gray-400 text-gray-400'
    }
  }

  return (
    <Card className={`border-blue-200 dark:border-blue-800 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-blue-500" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          {estimatedTime && (
            <Badge variant="default" className="border-gray-400 text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {estimatedTime} min
            </Badge>
          )}
          {difficulty && (
            <Badge variant="default" className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {steps && steps.length > 0 && (
        <CardContent>
          <h4 className="font-medium mb-3">Steps:</h4>
          <ol className="space-y-2">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-gray-700 dark:text-gray-300">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      )}
      
      <CardContent className="pt-0">
        {onStart && (
          <Button onClick={onStart} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Start Activity
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Poll Component
interface PollProps {
  question: string
  options: string[]
  onVote?: (optionIndex: number) => void
  results?: number[]
  className?: string
}

export function Poll({ question, options, onVote, results, className = '' }: PollProps) {
  const totalVotes = results ? results.reduce((sum, count) => sum + count, 0) : 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Poll
        </CardTitle>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {question}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {options.map((option, index) => {
            const percentage = results && totalVotes > 0 
              ? (results[index] / totalVotes) * 100 
              : 0

            return (
              <div key={index} className="space-y-2">
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => onVote?.(index)}
                  disabled={!!results}
                >
                  {option}
                </Button>
                {results && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {results[index]} votes
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {results && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Total votes: {totalVotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// TimelineWrapper Component
interface TimelineWrapperProps {
  title?: string
  items: Array<{
    title: string
    description?: string
    date?: string
    status?: 'completed' | 'current' | 'upcoming'
  }>
  className?: string
}

export function TimelineWrapper({ title, items, className = '' }: TimelineWrapperProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-4 h-4 rounded-full mt-2 ${
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'current' ? 'bg-blue-500' :
                  'bg-gray-300'
                }`} />
                {index < items.length - 1 && (
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 ml-2 mt-2" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {item.description}
                  </p>
                )}
                {item.date && (
                  <p className="text-gray-500 text-xs mt-1">
                    {item.date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// BeforeAfterSlider Component
interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Before", 
  afterLabel = "After",
  className = '' 
}: BeforeAfterSliderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-center">{beforeLabel}</h4>
          <img 
            src={beforeImage} 
            alt={beforeLabel}
            className="w-full rounded-lg border"
          />
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-center">{afterLabel}</h4>
          <img 
            src={afterImage} 
            alt={afterLabel}
            className="w-full rounded-lg border"
          />
        </div>
      </div>
    </div>
  )
}
