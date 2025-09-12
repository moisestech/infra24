'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  ExternalLink, 
  Tag,
  User,
  Info,
  Building2
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


      {/* Location */}
      {announcement.location && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <MapPin className="w-5 h-5 text-white/70" />
          <div className="text-white/90 text-sm font-medium">
            {announcement.location}
          </div>
        </div>
      )}

      {/* People with Avatars */}
      {announcement.people && announcement.people.length > 0 && (
        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
          <Users className="w-5 h-5 text-white/70 mt-0.5" />
          <div className="flex-1">
            <div className="text-white/90 text-sm font-medium mb-3">
              Featured People
            </div>
            <div className="flex flex-wrap gap-3">
              {announcement.people.map((person: any, index: number) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Avatar */}
                  <div className="relative">
                    {person.avatar_url ? (
                      <img
                        src={person.avatar_url}
                        alt={person.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={cn(
                      "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center",
                      person.avatar_url ? "hidden" : ""
                    )}>
                      <User className="w-4 h-4 text-white/70" />
                    </div>
                    {/* Member badge */}
                    {person.is_member && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white/20" />
                    )}
                  </div>
                  
                  {/* Person Info */}
                  <div className="flex flex-col">
                    <div className="text-white/90 text-xs font-medium">
                      {person.name}
                    </div>
                    {person.role && (
                      <div className="text-white/60 text-xs">
                        {person.role}
                      </div>
                    )}
                    {person.relationship_type && (
                      <div className="text-white/50 text-xs capitalize">
                        {person.relationship_type.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Tags */}
      {announcement.tags && announcement.tags.length > 0 && (
        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
          <Tag className="w-5 h-5 text-white/70 mt-0.5" />
          <div className="flex-1">
            <div className="text-white/90 text-sm font-medium mb-2">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {announcement.tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/10 rounded text-white/80 text-xs"
                >
                  {tag.replace('_', ' ')}
                </span>
              ))}
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
