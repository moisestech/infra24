'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  Tag,
  Building2,
  Award,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementMetadataProps {
  announcement: any;
  orientation: 'portrait' | 'landscape';
  className?: string;
}

export function AnnouncementMetadata({ 
  announcement, 
  orientation, 
  className 
}: AnnouncementMetadataProps) {
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Same day
    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate);
    }
    
    // Different days
    const startFormatted = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const endFormatted = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'opportunity': return <Award className="w-4 h-4" />;
      case 'facility': return <Building2 className="w-4 h-4" />;
      case 'administrative': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
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
        {/* Type Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
          {getTypeIcon(announcement.type)}
          <span className="text-white/90 text-sm font-medium capitalize">
            {announcement.type?.replace('_', ' ')}
          </span>
          {announcement.sub_type && (
            <span className="text-white/70 text-sm">
              • {announcement.sub_type.replace('_', ' ')}
            </span>
          )}
        </div>

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

      {/* Date and Time Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Start Date/Time */}
        {announcement.starts_at && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <Calendar className="w-5 h-5 text-white/70" />
            <div className="flex-1">
              <div className="text-white/90 text-sm font-medium">
                {formatDate(announcement.starts_at)}
              </div>
              {formatTime(announcement.starts_at) && (
                <div className="text-white/70 text-xs">
                  {formatTime(announcement.starts_at)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* End Date/Time */}
        {announcement.ends_at && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <Clock className="w-5 h-5 text-white/70" />
            <div className="flex-1">
              <div className="text-white/90 text-sm font-medium">
                {formatDate(announcement.ends_at)}
              </div>
              {formatTime(announcement.ends_at) && (
                <div className="text-white/70 text-xs">
                  {formatTime(announcement.ends_at)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Date Range (if multi-day) */}
      {announcement.starts_at && announcement.ends_at && 
       formatDateRange(announcement.starts_at, announcement.ends_at) && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <Calendar className="w-5 h-5 text-white/70" />
          <div className="text-white/90 text-sm font-medium">
            Duration: {formatDateRange(announcement.starts_at, announcement.ends_at)}
          </div>
        </div>
      )}

      {/* Location */}
      {announcement.location && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <MapPin className="w-5 h-5 text-white/70" />
          <div className="text-white/90 text-sm font-medium">
            {announcement.location}
          </div>
        </div>
      )}

      {/* People */}
      {announcement.people && announcement.people.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <Users className="w-5 h-5 text-white/70" />
          <div className="flex-1">
            <div className="text-white/90 text-sm font-medium mb-1">
              Featured People
            </div>
            <div className="text-white/70 text-xs">
              {announcement.people.join(', ')}
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
