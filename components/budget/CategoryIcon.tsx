import React from 'react'
import { BUDGET_CATEGORIES, getCategoryById } from '@/lib/budget/budget-utils'
import { cn } from '@/lib/utils'

interface CategoryIconProps {
  categoryId: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function CategoryIcon({ 
  categoryId, 
  size = 'md', 
  showLabel = false,
  className 
}: CategoryIconProps) {
  const category = getCategoryById(categoryId)
  
  if (!category) {
    return null
  }
  
  const IconComponent = category.icon
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div 
        className={cn(
          'rounded-full p-1.5 flex items-center justify-center',
          sizeClasses[size]
        )}
        style={{ backgroundColor: `${category.color}20` }}
      >
        <IconComponent 
          className={sizeClasses[size]}
          style={{ color: category.color }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium" style={{ color: category.color }}>
          {category.name}
        </span>
      )}
    </div>
  )
}


