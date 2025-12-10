'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BudgetLineItem as BudgetLineItemType } from '@/lib/budget/budget-utils'
import { CategoryIcon } from './CategoryIcon'
import { formatCurrency } from '@/lib/budget/budget-utils'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BudgetLineItemProps {
  item: BudgetLineItemType
  showImage?: boolean
  compact?: boolean
  onClick?: () => void
}

export function BudgetLineItem({ 
  item, 
  showImage = true, 
  compact = false,
  onClick 
}: BudgetLineItemProps) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={cn(
          'hover:shadow-lg transition-all duration-200 cursor-pointer',
          compact && 'p-2'
        )}
        onClick={onClick}
      >
        <CardContent className={cn('p-4', compact && 'p-2')}>
          <div className={cn(
            'flex gap-4',
            compact && 'gap-2'
          )}>
            {showImage && (
              <div className={cn(
                'relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800',
                compact ? 'w-16 h-16' : 'w-24 h-24'
              )}>
                {!imageError ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <CategoryIcon categoryId={item.category} size="md" />
                  </div>
                )}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    'font-semibold text-gray-900 dark:text-white mb-1',
                    compact ? 'text-sm' : 'text-base'
                  )}>
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryIcon categoryId={item.category} size="sm" />
                    {item.vendor && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.vendor}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={cn(
                    'font-bold text-gray-900 dark:text-white',
                    compact ? 'text-sm' : 'text-lg'
                  )}>
                    {formatCurrency(item.amount)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              {item.notes && !compact && (
                <div className="flex items-start gap-1 mt-2">
                  <Info className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


