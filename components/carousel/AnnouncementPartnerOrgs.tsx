'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementPartnerOrgsProps {
  externalOrgs: any[];
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

export function AnnouncementPartnerOrgs({ 
  externalOrgs, 
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
}: AnnouncementPartnerOrgsProps) {
  
  if (!externalOrgs || externalOrgs.length === 0) {
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
      transition={{ delay: 0.9 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-white/70" />
        <span className="text-white/90 text-sm font-medium">
          Partner Organizations ({externalOrgs.length})
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {externalOrgs.map((org: any, index: number) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 + (index * 0.05) }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Organization Info */}
            <div className="flex flex-col">
              <div className={cn("text-white/90 font-medium", getTextSize())}>
                {org.name}
              </div>
              {org.description && (
                <div className="text-white/60 text-xs">
                  {org.description}
                </div>
              )}
            </div>

            {/* Organization Icon/Avatar */}
            <div className="relative flex-shrink-0 w-8 h-8">
              {org.logo_url ? (
                <img
                  src={org.logo_url}
                  alt={org.name}
                  className="rounded-full object-cover border border-white/20 w-full h-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={cn(
                "rounded-full bg-white/20 flex items-center justify-center w-full h-full",
                org.logo_url ? "hidden" : ""
              )}>
                <Building2 className="w-4 h-4 text-white/70" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
