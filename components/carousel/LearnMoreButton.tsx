'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearnMoreButtonProps {
  primaryLink: string;
  orientation: 'portrait' | 'landscape';
  className?: string;
}

export function LearnMoreButton({ 
  primaryLink, 
  orientation, 
  className 
}: LearnMoreButtonProps) {
  if (!primaryLink) {
    return null;
  }

  return (
    <motion.div 
      className={cn(
        "flex items-center gap-3 p-3 bg-white/5 rounded-lg",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <ExternalLink className="w-5 h-5 text-white/70" />
      <div className="flex-1">
        <div className="text-white/90 text-sm font-medium mb-1">
          Learn More
        </div>
        <a 
          href={primaryLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 text-xs hover:text-white/90 transition-colors break-all"
        >
          {primaryLink}
        </a>
      </div>
    </motion.div>
  );
}
