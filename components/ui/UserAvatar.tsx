'use client'

import { User } from 'lucide-react'

interface UserAvatarProps {
  name?: string
  email?: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function UserAvatar({ 
  name, 
  email, 
  imageUrl, 
  size = 'md',
  className = '' 
}: UserAvatarProps) {
  const getInitials = () => {
    if (name) {
      const parts = name.trim().split(' ')
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return name[0]?.toUpperCase() || '?'
    }
    if (email) {
      return email[0]?.toUpperCase() || '?'
    }
    return '?'
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs'
      case 'lg':
        return 'w-12 h-12 text-lg'
      default:
        return 'w-10 h-10 text-sm'
    }
  }

  const getBackgroundColor = () => {
    if (name) {
      const hash = name.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      const colors = [
        'bg-blue-500',
        'bg-green-500', 
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-teal-500'
      ]
      return colors[Math.abs(hash) % colors.length]
    }
    return 'bg-gray-500'
  }

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || 'User avatar'}
        className={`${getSizeClasses()} rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <div className={`${getSizeClasses()} ${getBackgroundColor()} rounded-full flex items-center justify-center text-white font-medium ${className}`}>
      {getInitials()}
    </div>
  )
}
