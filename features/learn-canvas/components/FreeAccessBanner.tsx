'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, UserPlus, Sparkles, Target, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'

interface FreeAccessBannerProps {
  className?: string
}

export function FreeAccessBanner({ className = '' }: FreeAccessBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <div className={`bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-purple-500/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Free to browse, enhanced with sign-up</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>Interactive quizzes</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Progress tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Community access</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/sign-up">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up Free
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for mobile
export function CompactFreeAccessBanner({ className = '' }: FreeAccessBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <div className={`bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-purple-500/30 ${className}`}>
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Free to browse • Sign up for interactive features</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/sign-up">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1">
                Sign Up
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
