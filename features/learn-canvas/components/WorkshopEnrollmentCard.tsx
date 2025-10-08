'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useEnrollment } from '../hooks/useEnrollment'
import { useUser } from '@clerk/nextjs'
import { 
  BookOpen, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Clock,
  Star,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkshopEnrollmentCardProps {
  workshopSlug: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  category: string
  featured?: boolean
  onEnroll?: (workshopSlug: string) => void
}

const difficultyConfig = {
  beginner: { color: 'bg-green-500', label: 'Beginner' },
  intermediate: { color: 'bg-yellow-500', label: 'Intermediate' },
  advanced: { color: 'bg-red-500', label: 'Advanced' }
}

const categoryConfig = {
  'journalism': { icon: BookOpen, color: 'text-blue-500' },
  'art': { icon: Star, color: 'text-purple-500' },
  'data': { icon: Zap, color: 'text-green-500' },
  'music': { icon: Users, color: 'text-pink-500' },
  'video': { icon: Clock, color: 'text-orange-500' },
  'writing': { icon: BookOpen, color: 'text-indigo-500' }
}

export function WorkshopEnrollmentCard({
  workshopSlug,
  title,
  description,
  difficulty,
  duration,
  category,
  featured = false,
  onEnroll
}: WorkshopEnrollmentCardProps) {
  const { user } = useUser()
  const { 
    getWorkshopAccess, 
    enrollInWorkshop, 
    isEnrolledInWorkshop,
    loading,
    error 
  } = useEnrollment()
  
  const [enrolling, setEnrolling] = useState(false)
  const [enrollError, setEnrollError] = useState<string | null>(null)

  const access = getWorkshopAccess(workshopSlug)
  const isEnrolled = isEnrolledInWorkshop(workshopSlug)
  const canAccess = access?.hasAccess || false
  const requiresSubscription = access?.subscriptionRequired || false

  const difficultyInfo = difficultyConfig[difficulty]
  const categoryInfo = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.journalism

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to sign in
      return
    }

    setEnrolling(true)
    setEnrollError(null)

    try {
      const result = await enrollInWorkshop(workshopSlug)
      if (result.success) {
        onEnroll?.(workshopSlug)
      } else {
        setEnrollError(result.error || 'Failed to enroll')
      }
    } catch (err) {
      setEnrollError('Failed to enroll in workshop')
    } finally {
      setEnrolling(false)
    }
  }

  const getAccessMessage = () => {
    if (!user) {
      return 'Sign in to access this workshop'
    }
    
    if (!canAccess) {
      if (requiresSubscription) {
        return `Upgrade to ${access?.subscriptionTier || 'Creator'} tier to access`
      }
      return access?.reason || 'Access denied'
    }
    
    if (isEnrolled) {
      return 'You are enrolled in this workshop'
    }
    
    return 'Click to enroll in this workshop'
  }

  const getActionButton = () => {
    if (!user) {
      return (
        <Button variant="default" className="w-full">
          Sign In to Enroll
        </Button>
      )
    }

    if (isEnrolled) {
      return (
        <Button disabled className="w-full bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Enrolled
        </Button>
      )
    }

    if (!canAccess) {
      return (
        <Button variant="default" disabled className="w-full">
          <Lock className="w-4 h-4 mr-2" />
          {requiresSubscription ? 'Upgrade Required' : 'Access Denied'}
        </Button>
      )
    }

    return (
      <Button 
        onClick={handleEnroll}
        disabled={enrolling}
        className="w-full"
      >
        {enrolling ? 'Enrolling...' : 'Enroll Now'}
      </Button>
    )
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
      featured && "ring-2 ring-lime-500/50",
      isEnrolled && "border-green-500 bg-green-50/5"
    )}>
      {featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-lime-500 to-green-500 text-black px-3 py-1 text-xs font-semibold">
          Featured
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-black dark:text-white">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {description}
            </CardDescription>
          </div>
          <categoryInfo.icon className={cn("w-6 h-6", categoryInfo.color)} />
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge 
            variant="default" 
            className={cn("text-xs", difficultyInfo.color.replace('bg-', 'text-'))}
          >
            {difficultyInfo.label}
          </Badge>
          <Badge variant="default" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {duration}
          </Badge>
          <Badge variant="default" className="text-xs capitalize">
            {category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Access Status */}
        <div className="flex items-center gap-2 text-sm">
          {isEnrolled ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : canAccess ? (
            <BookOpen className="w-4 h-4 text-blue-500" />
          ) : (
            <Lock className="w-4 h-4 text-gray-500" />
          )}
          <span className={cn(
            "text-sm",
            isEnrolled ? "text-green-600 dark:text-green-400" :
            canAccess ? "text-blue-600 dark:text-blue-400" :
            "text-gray-600 dark:text-gray-400"
          )}>
            {getAccessMessage()}
          </span>
        </div>

        {/* Error Display */}
        {(error || enrollError) && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              {enrollError || error}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        {getActionButton()}

        {/* Subscription Info */}
        {requiresSubscription && !canAccess && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            This workshop requires a subscription
          </div>
        )}
      </CardContent>
    </Card>
  )
} 