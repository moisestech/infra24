'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import { Play, CheckCircle, Clock, Target } from 'lucide-react'

interface ExerciseCardProps {
  title: string
  description?: string
  estimatedTime?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  status?: 'not-started' | 'in-progress' | 'completed'
  children?: ReactNode
  onStart?: () => void
  onComplete?: () => void
  className?: string
}

export function ExerciseCard({
  title,
  description,
  estimatedTime,
  difficulty,
  status = 'not-started',
  children,
  onStart,
  onComplete,
  className = ''
}: ExerciseCardProps) {
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

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Play className="w-5 h-5 text-blue-500" />
      default:
        return <Play className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'border-green-500/20 bg-green-500/5'
      case 'in-progress':
        return 'border-blue-500/20 bg-blue-500/5'
      default:
        return 'border-gray-500/20 bg-gray-500/5'
    }
  }

  return (
    <Card className={`${getStatusColor()} ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              {title}
            </CardTitle>
            {description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {estimatedTime && (
            <Badge variant="outline" className="border-gray-400 text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {estimatedTime} min
            </Badge>
          )}
          {difficulty && (
            <Badge variant="outline" className={getDifficultyColor(difficulty)}>
              <Target className="w-3 h-3 mr-1" />
              {difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
      
      <CardContent className="pt-0">
        <div className="flex gap-2">
          {status === 'not-started' && onStart && (
            <Button onClick={onStart} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Start Exercise
            </Button>
          )}
          {status === 'in-progress' && onComplete && (
            <Button onClick={onComplete} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}
          {status === 'completed' && (
            <Button variant="outline" className="flex-1" disabled>
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
