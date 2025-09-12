'use client';

import { motion } from "framer-motion";
import { cn } from '@/lib/utils';

interface AnnouncementDateDisplayProps {
  announcement: any;
  orientation: 'portrait' | 'landscape';
  organizationTheme?: any;
}

export function AnnouncementDateDisplay({ 
  announcement, 
  orientation, 
  organizationTheme 
}: AnnouncementDateDisplayProps) {
  
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

  // Use starts_at if available, otherwise use created_at
  const eventDate = announcement.starts_at || announcement.created_at;
  const dateStatus = getDateStatus(eventDate);
  
  // Check if this is a fun_fact that shouldn't show dates (like historical facts)
  const isHistoricalFunFact = (announcement.type as string) === 'fun_fact' && (announcement.sub_type as string) === 'historical';
  const shouldShowDate = !isHistoricalFunFact;

  return (
    <motion.div 
      className="absolute top-16 right-8 md:right-12 text-right z-20"
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
    </motion.div>
  );
}
