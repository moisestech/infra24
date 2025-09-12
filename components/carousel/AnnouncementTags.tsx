'use client';

import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementTagsProps {
  tags: string[];
  orientation: 'portrait' | 'landscape';
  textSizes?: {
    title: string;
    description: string;
    location: string;
    date: string;
    type: string;
    metadata: string;
    startDate: string;
    endDate: string;
    duration: string;
  };
  className?: string;
}

export function AnnouncementTags({ 
  tags, 
  orientation, 
  textSizes = {
    title: 'text-9xl',
    description: 'text-7xl',
    location: 'text-7xl',
    date: 'text-7xl',
    type: 'text-8xl',
    metadata: 'text-sm',
    startDate: 'text-3xl',
    endDate: 'text-3xl',
    duration: 'text-3xl'
  },
  className 
}: AnnouncementTagsProps) {
  
  if (!tags || tags.length === 0) {
    return null;
  }

  const getTextSize = () => {
    return textSizes.metadata;
  };

  return (
    <motion.div 
      className={cn("space-y-3", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-white/70" />
        <span className="text-white/90 text-sm font-medium">
          Tags ({tags.length})
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-white/80 bg-white/10 border border-white/20 hover:bg-white/15 transition-colors",
              getTextSize()
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + (index * 0.05) }}
            whileHover={{ scale: 1.05 }}
          >
            {tag.replace('_', ' ').toLowerCase()}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
