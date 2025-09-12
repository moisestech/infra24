'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  ExternalLink, 
  Info,
  Building2,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementMetadataProps {
  announcement: any;
  orientation: 'portrait' | 'landscape';
  textSizes?: {
    title: string;
    description: string;
    location: string;
    date: string;
    type: string;
    metadata: string;
  };
  className?: string;
}

export function AnnouncementMetadata({ 
  announcement, 
  orientation, 
  textSizes = {
    title: 'text-9xl',
    description: 'text-7xl',
    location: 'text-7xl',
    date: 'text-7xl',
    type: 'text-8xl',
    metadata: 'text-sm'
  },
  className 
}: AnnouncementMetadataProps) {
  

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-400 bg-red-500/20';
      case 2: return 'text-orange-400 bg-orange-500/20';
      case 3: return 'text-yellow-400 bg-yellow-500/20';
      case 4: return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'High Priority';
      case 2: return 'Medium Priority';
      case 3: return 'Normal Priority';
      case 4: return 'Low Priority';
      default: return 'Standard';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'internal': return <Users className="w-4 h-4" />;
      case 'external': return <ExternalLink className="w-4 h-4" />;
      case 'both': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'internal': return 'Internal Only';
      case 'external': return 'Public';
      case 'both': return 'Internal & Public';
      default: return 'Standard';
    }
  };


  return (
    <motion.div 
      className={cn(
        "space-y-3",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {/* Type and Priority Row */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Priority Badge */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full",
          getPriorityColor(announcement.priority)
        )}>
          <span className="text-sm font-medium">
            {getPriorityLabel(announcement.priority)}
          </span>
        </div>

        {/* Visibility Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
          {getVisibilityIcon(announcement.visibility)}
          <span className="text-white/90 text-sm font-medium">
            {getVisibilityLabel(announcement.visibility)}
          </span>
        </div>
      </div>


      {/* External Organizations */}
      {announcement.external_orgs && announcement.external_orgs.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <Building2 className="w-5 h-5 text-white/70" />
          <div className="flex-1">
            <div className="text-white/90 text-sm font-medium mb-1">
              Partner Organizations
            </div>
            <div className="text-white/70 text-xs">
              {announcement.external_orgs.map((org: any) => org.name).join(', ')}
            </div>
          </div>
        </div>
      )}


      {/* Primary Link */}
      {announcement.primary_link && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <ExternalLink className="w-5 h-5 text-white/70" />
          <div className="flex-1">
            <div className="text-white/90 text-sm font-medium mb-1">
              Learn More
            </div>
            <a 
              href={announcement.primary_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 text-xs hover:text-white/90 transition-colors break-all"
            >
              {announcement.primary_link}
            </a>
          </div>
        </div>
      )}

      {/* Additional Info */}
      {announcement.additional_info && (
        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
          <Info className="w-5 h-5 text-white/70 mt-0.5" />
          <div className="flex-1">
            <div className="text-white/90 text-sm font-medium mb-1">
              Additional Information
            </div>
            <div className="text-white/70 text-xs">
              {announcement.additional_info}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
