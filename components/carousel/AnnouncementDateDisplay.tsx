'use client';

import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface AnnouncementDateDisplayProps {
  announcement: any;
  orientation: 'portrait' | 'landscape';
  organizationTheme?: any;
  showDetailedMetadata?: boolean; // New prop to show detailed date info in metadata section
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
  iconSizeMultiplier?: number;
  screenMetrics?: any;
  responsiveSizes?: any;
}

export function AnnouncementDateDisplay({ 
  announcement, 
  orientation, 
  organizationTheme,
  showDetailedMetadata = false,
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
  iconSizeMultiplier = 1,
  screenMetrics,
  responsiveSizes
}: AnnouncementDateDisplayProps) {
  
  // Get responsive icon size for date display icons
  const getDateIconSize = () => {
    if (!screenMetrics) {
      return 24; // Default size
    }
    
    const { isLargeDisplay, isConstrained, orientation: screenOrientation, pixelRatio } = screenMetrics;
    
    // Base size for date icons (medium size)
    let baseSize = isLargeDisplay
      ? (screenOrientation === 'portrait' ? 32 : 40)
      : isConstrained
      ? (screenOrientation === 'portrait' ? 20 : 24)
      : (screenOrientation === 'portrait' ? 24 : 32);
    
    // Adjust for pixel ratio
    const pixelRatioAdjustment = pixelRatio > 2 ? 0.95 : pixelRatio > 1.5 ? 0.98 : 1;
    const adjustedSize = Math.round(baseSize * pixelRatioAdjustment);
    
    // Always use the iconSizeMultiplier prop - it's explicitly passed and should take precedence
    const multiplier = iconSizeMultiplier;
    return Math.round(adjustedSize * multiplier);
  };
  
  const dateIconSize = getDateIconSize();
  
  const getDateStatus = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (date.getTime() === today.getTime()) return { type: 'today', message: 'Happening Today' };
    if (date < today) return { type: 'past', message: `${Math.abs(diffDays)} days ago` };
    return { type: 'future', message: `In ${diffDays} days` };
  };

  const formatDateWithDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleString('en-US', { weekday: 'long' });
    const month = date.toLocaleString('en-US', { month: 'short' });
    const dayNum = date.getDate();
    return {
      dayOfWeek: day,
      date: `${month} ${dayNum}`
    };
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

  const formatEndDate = (startDateStr: string, endDateStr: string) => {
    if (!endDateStr) return null;
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // If same day, just show time
    if (startDate.toDateString() === endDate.toDateString()) {
      return formatTime(endDateStr);
    }
    
    // If different days, show date
    const month = endDate.toLocaleString('en-US', { month: 'short' });
    const dayNum = endDate.getDate();
    return `${month} ${dayNum}`;
  };

  const getDateRange = (startDateStr: string, endDateStr: string) => {
    if (!endDateStr) return null;
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // If same day
    if (startDate.toDateString() === endDate.toDateString()) {
      return null; // Don't show range for same day
    }
    
    // If different days, show range
    const startMonth = startDate.toLocaleString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
    const endDay = endDate.getDate();
    
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };

  // Detailed date formatting functions for metadata section
  const formatDetailedDate = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDetailedTime = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDetailedDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Same day
    if (start.toDateString() === end.toDateString()) {
      return formatDetailedDate(startDate);
    }
    
    // Different days - avoid redundant month mentions
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endDay = end.getDate();
    
    // If same month, only show month once
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    
    // Different months
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };

  // Use starts_at if available, otherwise use created_at
  const eventDate = announcement.starts_at || announcement.created_at;
  const dateStatus = getDateStatus(eventDate);
  
  // Check if this is a fun_fact that shouldn't show dates
  const isFunFact = (announcement.type as string) === 'fun_fact';
  const isHistoricalFunFact = isFunFact && (announcement.sub_type as string) === 'historical';
  const shouldShowDate = !isFunFact;

  return (
    <motion.div 
      className="absolute top-16 right-8 md:right-12 text-right z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Day of Week - only show for non-historical fun facts */}
      {shouldShowDate && (
        <motion.div 
          className="text-4xl xl:text-6xl 2xl:text-8xl 3xl:text-10xl font-bold text-white/80 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formatDateWithDay(eventDate).dayOfWeek}
        </motion.div>
      )}

      {/* Special Historical Fun Fact Day Display */}
      {isHistoricalFunFact && (
        <motion.div 
          className="text-4xl xl:text-6xl 2xl:text-8xl 3xl:text-10xl font-bold mb-2"
          style={{
            color: organizationTheme?.dateTextColor || '#fbbf24'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          HISTORY
        </motion.div>
      )}

      {/* Date - only show for non-historical fun facts */}
      {shouldShowDate && (
        <motion.div className="text-[10rem] md:text-[12rem] xl:text-[16rem] 2xl:text-[20rem] 3xl:text-[24rem] font-black text-white tracking-tighter leading-none">
          {formatDateWithDay(eventDate).date}
        </motion.div>
      )}

      {/* Special Historical Fun Fact Date Display */}
      {isHistoricalFunFact && (
        <motion.div 
          className="text-[10rem] md:text-[12rem] xl:text-[16rem] 2xl:text-[20rem] 3xl:text-[24rem] font-black tracking-tighter leading-none"
          style={{
            color: organizationTheme?.dateTextColor || '#fbbf24'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          📚
        </motion.div>
      )}

      {/* Time if available - only show for non-historical fun facts */}
      {shouldShowDate && formatTime(eventDate) && (
        <motion.div className="text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-8xl text-white/60 font-medium tracking-tight mt-2">
          {formatTime(eventDate)}
        </motion.div>
      )}

      {/* End Date/Time if available - only show for non-historical fun facts */}
      {shouldShowDate && announcement.ends_at && (
        <motion.div 
          className="text-2xl xl:text-4xl 2xl:text-5xl 3xl:text-7xl text-white/50 font-medium tracking-tight mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {formatEndDate(eventDate, announcement.ends_at) && (
            <span>Until {formatEndDate(eventDate, announcement.ends_at)}</span>
          )}
        </motion.div>
      )}

      {/* Date Range if multi-day event */}
      {shouldShowDate && getDateRange(eventDate, announcement.ends_at) && (
        <motion.div 
          className="text-xl xl:text-3xl 2xl:text-4xl 3xl:text-6xl text-white/40 font-medium tracking-tight mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {getDateRange(eventDate, announcement.ends_at)}
        </motion.div>
      )}

      {/* Special Historical Fun Fact Badge */}
      {isHistoricalFunFact && (
        <motion.div 
          className="text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-8xl font-medium tracking-tight mt-2"
          style={{
            color: organizationTheme?.dateTextColor || '#fbbf24'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          📚 Historical Fact
        </motion.div>
      )}

      {/* Days Left Badge - only show for non-historical fun facts */}
      {shouldShowDate && (
        <motion.div 
          className={cn(
            `inline-flex items-center rounded-full mt-4 font-bold ${
              orientation === 'portrait'
                ? 'gap-3 xl:gap-5 2xl:gap-7 3xl:gap-9 px-6 xl:px-8 2xl:px-10 3xl:px-14 py-3 xl:py-4 2xl:py-5 3xl:py-7 text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-7xl'
                : 'gap-2 xl:gap-4 2xl:gap-6 3xl:gap-8 px-4 xl:px-6 2xl:px-8 3xl:px-12 py-2 xl:py-3 2xl:py-4 3xl:py-6 text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-6xl'
            }`,
            dateStatus.type === 'today' ? "bg-green-500" : 
            dateStatus.type === 'past' ? "bg-red-500" : 
            "bg-blue-500"
          )}
          style={{
            color: organizationTheme?.dateTextColor || '#ffffff'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="flex items-center gap-2">
            {dateStatus.type === 'today' ? (
              <>🎯 Today</>
            ) : dateStatus.type === 'future' ? (
              <>⏰ {dateStatus.message}</>
            ) : (
              <>📅 {dateStatus.message}</>
            )}
          </span>
        </motion.div>
      )}

      {/* Special Fun Fact Badge for Historical Facts */}
      {isHistoricalFunFact && (
        <motion.div 
          className={cn(
            `inline-flex items-center rounded-full mt-4 font-bold ${
              orientation === 'portrait'
                ? 'gap-3 xl:gap-5 2xl:gap-7 3xl:gap-9 px-6 xl:px-8 2xl:px-10 3xl:px-14 py-3 xl:py-4 2xl:py-5 3xl:py-7 text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-7xl'
                : 'gap-2 xl:gap-4 2xl:gap-6 3xl:gap-8 px-4 xl:px-6 2xl:px-8 3xl:px-12 py-2 xl:py-3 2xl:py-4 3xl:py-6 text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-6xl'
            }`,
            "bg-yellow-500"
          )}
          style={{
            color: organizationTheme?.dateTextColor || '#ffffff'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="flex items-center gap-2">
            <>💡 Fun Fact</>
          </span>
        </motion.div>
      )}

      {/* Detailed Date and Time Information for Metadata Section */}
      {showDetailedMetadata && shouldShowDate && (
        <motion.div 
          className="mt-6 space-y-4 text-right"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Start Date/Time */}
          {announcement.starts_at && (
            <motion.div 
              className="flex items-center justify-end gap-3 p-4 bg-white/5 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-right flex-1">
                <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">
                  Start
                </div>
                <div className={cn("text-white/90 font-medium", textSizes.startDate)}>
                  {formatDetailedDate(announcement.starts_at)}
                </div>
                {formatDetailedTime(announcement.starts_at) && (
                  <div className={cn("text-white/70", textSizes.startDate)}>
                    {formatDetailedTime(announcement.starts_at)}
                  </div>
                )}
              </div>
              <Calendar size={dateIconSize} className="text-white/70" />
            </motion.div>
          )}

          {/* End Date/Time */}
          {announcement.ends_at && (
            <motion.div 
              className="flex items-center justify-end gap-3 p-4 bg-white/5 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-right flex-1">
                <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">
                  End
                </div>
                <div className={cn("text-white/90 font-medium", textSizes.endDate)}>
                  {formatDetailedDate(announcement.ends_at)}
                </div>
                {formatDetailedTime(announcement.ends_at) && (
                  <div className={cn("text-white/70", textSizes.endDate)}>
                    {formatDetailedTime(announcement.ends_at)}
                  </div>
                )}
              </div>
              <Clock size={dateIconSize} className="text-white/70" />
            </motion.div>
          )}

          {/* Date Range (if multi-day) */}
          {announcement.starts_at && announcement.ends_at && 
           formatDetailedDateRange(announcement.starts_at, announcement.ends_at) && (
            <motion.div 
              className="flex items-center justify-end gap-3 p-4 bg-white/5 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-right flex-1">
                <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">
                  Duration
                </div>
                <div className={cn("text-white/90 font-medium", textSizes.duration)}>
                  {formatDetailedDateRange(announcement.starts_at, announcement.ends_at)}
                </div>
              </div>
              <Calendar size={dateIconSize} className="text-white/70" />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
