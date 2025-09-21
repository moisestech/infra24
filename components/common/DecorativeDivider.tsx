'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DecorativeDividerProps {
  icon: LucideIcon;
  gradientColors: {
    from: string;
    via: string;
    to: string;
  };
  iconColor?: string;
  className?: string;
}

const sectionDivider = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

export default function DecorativeDivider({ 
  icon: Icon, 
  gradientColors,
  iconColor = 'text-indigo-500/50',
  className = ''
}: DecorativeDividerProps) {
  return (
    <motion.div
      variants={sectionDivider}
      className={`relative py-12 flex justify-center ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-24 h-24 rounded-full blur-xl"
          style={{
            background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`
          }}
        />
      </div>
      <div className="relative z-10">
        <Icon className={`w-12 h-12 ${iconColor}`} />
      </div>
    </motion.div>
  );
}

