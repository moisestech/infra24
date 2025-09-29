'use client'

import { AlertTriangle, Info, Lightbulb, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface CalloutProps {
  type?: 'tip' | 'warning' | 'info' | 'success'
  title?: string
  children: React.ReactNode
  className?: string
}

const calloutConfig = {
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-lime-500/10',
    borderColor: 'border-lime-500/30',
    iconColor: 'text-lime-400',
    titleColor: 'text-lime-300'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-300'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
    titleColor: 'text-green-300'
  }
}

export function Callout({ 
  type = 'info', 
  title, 
  children, 
  className 
}: CalloutProps) {
  const config = calloutConfig[type]
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-lg border p-4 md:p-6",
        config.bgColor,
        config.borderColor,
        "backdrop-blur-sm",
        className
      )}
    >
      <div className="flex gap-3 md:gap-4">
        <IconComponent className={cn("w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5", config.iconColor)} />
        
        <div className="flex-1 space-y-2">
          {title && (
            <h4 className={cn("font-semibold text-sm md:text-base", config.titleColor)}>
              {title}
            </h4>
          )}
          
          <div className="text-sm md:text-base text-gray-200 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
      
      {/* Decorative corner */}
      <div className={cn(
        "absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px]",
        config.borderColor.replace('border-', 'border-t-')
      )} />
    </motion.div>
  )
} 