'use client'

import React from 'react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { 
  Lock, 
  UserPlus, 
  Star, 
  BookOpen, 
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface SignUpPromptProps {
  feature: 'quiz' | 'activity' | 'progress' | 'bookmark' | 'comment' | 'download'
  title?: string
  description?: string
  className?: string
}

const featureConfig = {
  quiz: {
    title: 'Take the Quiz',
    description: 'Test your knowledge and track your progress',
    icon: Target,
    benefits: ['Track your progress', 'Get personalized feedback', 'Unlock achievements']
  },
  activity: {
    title: 'Start the Activity',
    description: 'Hands-on exercises to reinforce your learning',
    icon: BookOpen,
    benefits: ['Interactive exercises', 'Step-by-step guidance', 'Save your work']
  },
  progress: {
    title: 'Track Your Progress',
    description: 'See how far you\'ve come in your learning journey',
    icon: Star,
    benefits: ['Visual progress tracking', 'Completion certificates', 'Learning streaks']
  },
  bookmark: {
    title: 'Save for Later',
    description: 'Bookmark this content to revisit anytime',
    icon: BookOpen,
    benefits: ['Save favorite content', 'Create reading lists', 'Sync across devices']
  },
  comment: {
    title: 'Join the Discussion',
    description: 'Share your thoughts and learn from others',
    icon: UserPlus,
    benefits: ['Community discussions', 'Expert feedback', 'Peer learning']
  },
  download: {
    title: 'Download Resources',
    description: 'Get access to downloadable materials and templates',
    icon: Target,
    benefits: ['Templates and resources', 'Offline access', 'Premium materials']
  }
}

export function SignUpPrompt({ 
  feature, 
  title, 
  description, 
  className = '' 
}: SignUpPromptProps) {
  const config = featureConfig[feature]
  const Icon = config.icon

  return (
    <Card className={`bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-purple-400" />
        </div>
        <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
          <Icon className="w-5 h-5 text-purple-400" />
          {title || config.title}
        </CardTitle>
        <p className="text-gray-300 text-sm">
          {description || config.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Benefits */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-200 mb-2">Sign up to unlock:</h4>
          {config.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
              {benefit}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/sign-up" className="flex-1">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/sign-in" className="flex-1">
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              Already have an account?
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Free to join</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>No credit card</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Inline sign-up prompt for smaller spaces
export function InlineSignUpPrompt({ 
  feature, 
  title, 
  description 
}: SignUpPromptProps) {
  const config = featureConfig[feature]
  const Icon = config.icon

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium flex items-center gap-2">
            <Icon className="w-4 h-4 text-purple-400" />
            {title || config.title}
          </h4>
          <p className="text-gray-300 text-sm">
            {description || config.description}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link href="/sign-up">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Overlay sign-up prompt for interactive elements
export function InteractiveSignUpPrompt({ 
  feature, 
  title, 
  description,
  onClose 
}: SignUpPromptProps & { onClose?: () => void }) {
  const config = featureConfig[feature]
  const Icon = config.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-700 max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-purple-400" />
          </div>
          <CardTitle className="text-lg text-white flex items-center justify-center gap-2">
            <Icon className="w-4 h-4 text-purple-400" />
            {title || config.title}
          </CardTitle>
          <p className="text-gray-300 text-sm">
            {description || config.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {config.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/sign-up">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up Free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                Already have an account?
              </Button>
            </Link>
            {onClose && (
              <Button 
                variant="ghost" 
                className="w-full text-gray-400 hover:text-white"
                onClick={onClose}
              >
                Maybe later
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
