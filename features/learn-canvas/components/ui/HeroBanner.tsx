'use client'

import { LucideIcon, icons } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface HeroBannerProps {
  title: string
  subtitle?: string
  icon?: keyof typeof icons
  bgGradient?: string
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function HeroBanner({ 
  title, 
  subtitle, 
  icon, 
  bgGradient = "from-[#00ff00]/30 via-[#00ff00]/10 to-black",
  className,
  titleClassName,
  subtitleClassName
}: HeroBannerProps) {
  const IconComponent = icon ? icons[icon] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative overflow-hidden rounded-xl p-8 md:p-12",
        `bg-gradient-to-br ${bgGradient}`,
        "border border-white/10 backdrop-blur-sm",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {IconComponent && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", "bg-gradient-to-br from-[#00ff00]/40 via-[#00ff00]/10 to-black")}
          >
            <IconComponent className="w-8 h-8 text-[#00ff00]" />
          </motion.div>
        )}
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={cn("text-3xl md:text-5xl font-extrabold mb-2 text-[#00ff00] drop-shadow-lg", titleClassName)}
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn("text-lg md:text-2xl font-medium text-[#00ff00]/80 mb-2", subtitleClassName)}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-lime-400 rounded-full opacity-60" />
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-400 rounded-full opacity-40" />
      <div className="absolute top-1/2 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-30" />
    </motion.div>
  )
} 