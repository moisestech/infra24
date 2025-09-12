'use client';

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { TypeStyle } from './announcement-styles';
import { AnnouncementMetadata } from './AnnouncementMetadata';

interface AnnouncementContentProps {
  announcement: any;
  styles: TypeStyle;
  IconComponent: LucideIcon;
  orientation: 'portrait' | 'landscape';
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  organizationSlug?: string;
  textSizeMultiplier?: number;
}

export function AnnouncementContent({ 
  announcement, 
  styles, 
  IconComponent, 
  orientation,
  showQRCode,
  setShowQRCode,
  organizationSlug,
  textSizeMultiplier = 1
}: AnnouncementContentProps) {
  
  // Helper function to apply text size multiplier
  const getTextSize = (baseSize: string) => {
    if (textSizeMultiplier === 1) return baseSize;
    
    // Extract the size value and apply multiplier
    const sizeMatch = baseSize.match(/(\d+(?:\.\d+)?)([a-z]+)/);
    if (sizeMatch) {
      const [, size, unit] = sizeMatch;
      const newSize = parseFloat(size) * textSizeMultiplier;
      return `${newSize}${unit}`;
    }
    
    return baseSize;
  };

  return (
    <motion.div 
      className="relative z-20 h-full p-20 md:p-32 xl:p-40 2xl:p-48 3xl:p-56 flex flex-col justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl space-y-16 xl:space-y-20 2xl:space-y-24 3xl:space-y-28">
        {/* Type Badge */}
        <motion.div 
          className="inline-flex items-center gap-4 xl:gap-6 px-8 xl:px-12 py-4 xl:py-6 rounded-full bg-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <IconComponent className="w-8 xl:w-12 2xl:w-16 3xl:w-20 h-8 xl:h-12 2xl:h-16 3xl:h-20 text-white" />
          <span className="text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-7xl font-bold text-white">
            {announcement.type?.replace('_', ' ').toUpperCase() || 'EVENT'}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="font-black text-white leading-tight"
          style={{
            fontSize: textSizeMultiplier !== 1 
              ? getTextSize(orientation === 'portrait' ? '20rem' : '24rem')
              : undefined
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {announcement.title}
        </motion.h1>

        {/* Description */}
        <motion.p 
          className={cn(
            "text-white/90 font-medium leading-relaxed",
            orientation === 'portrait'
              ? "text-12xl md:text-16xl xl:text-20xl 2xl:text-24xl 3xl:text-28xl 4xl:text-32xl"
              : "text-20xl md:text-20xl xl:text-24xl 2xl:text-28xl 3xl:text-32xl 4xl:text-36xl"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {announcement.body}
        </motion.p>

        {/* Location and QR Code Section */}
        <motion.div 
          className="flex flex-col xl:flex-row items-start xl:items-center gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Location */}
          {announcement.location && (
            <motion.div 
              className={cn(
                "flex items-center gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10",
                orientation === 'portrait'
                  ? "text-8xl xl:text-10xl 2xl:text-12xl 3xl:text-14xl 4xl:text-16xl"
                  : "text-10xl xl:text-12xl 2xl:text-14xl 3xl:text-16xl 4xl:text-18xl"
              )}
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className={cn(
                "text-white/80",
                orientation === 'portrait'
                  ? "w-12 xl:w-16 2xl:w-20 3xl:w-24 4xl:w-28 h-12 xl:h-16 2xl:h-20 3xl:h-24 4xl:h-28"
                  : "w-16 xl:w-20 2xl:w-24 3xl:w-28 4xl:w-32 h-16 xl:h-20 2xl:h-24 3xl:h-28 4xl:h-32"
              )} />
              <span className="text-white/80 font-medium">
                {announcement.location}
              </span>
            </motion.div>
          )}

          {/* QR Code Toggle and Display */}
          <div className="flex flex-col items-start gap-4 xl:gap-6">
            {/* QR Code Toggle Button */}
            <motion.button
              onClick={() => setShowQRCode(!showQRCode)}
              className={cn(
                "inline-flex items-center gap-3 xl:gap-4 px-6 xl:px-8 py-3 xl:py-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all font-medium text-white",
                orientation === 'portrait'
                  ? "text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-7xl"
                  : "text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-8xl"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
            </motion.button>

            {/* QR Code Display */}
            {showQRCode && (
              <motion.div
                className="flex flex-col items-center gap-4 xl:gap-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={cn(
                  "bg-white p-4 xl:p-6 2xl:p-8 3xl:p-10 rounded-lg shadow-2xl",
                  orientation === 'portrait'
                    ? "w-32 xl:w-40 2xl:w-48 3xl:w-56 4xl:w-64 h-32 xl:h-40 2xl:h-48 3xl:h-56 4xl:h-64"
                    : "w-40 xl:w-48 2xl:w-56 3xl:w-64 4xl:w-72 h-40 xl:h-48 2xl:h-56 3xl:h-64 4xl:h-72"
                )}>
                  {/* QR Code will be rendered here */}
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm">
                    QR Code
                  </div>
                </div>
                <p className={cn(
                  "text-white/80 text-center font-medium",
                  orientation === 'portrait'
                    ? "text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl"
                    : "text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl"
                )}>
                  Scan to view event
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Metadata Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AnnouncementMetadata 
            announcement={announcement}
            orientation={orientation}
            className="mt-8"
          />
        </motion.div>

        {/* Learn More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href={organizationSlug ? `/o/${organizationSlug}/announcements/${announcement.id}` : `/announcements/${announcement.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-4 xl:gap-6 px-12 xl:px-16 2xl:px-20 3xl:px-24 py-6 xl:py-8 2xl:py-10 3xl:py-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all font-bold text-white",
              orientation === 'portrait'
                ? "text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-8xl"
                : "text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-9xl"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Learn More</span>
            <ExternalLink className={cn(
              "text-white",
              orientation === 'portrait'
                ? "w-8 xl:w-10 2xl:w-12 3xl:w-14 4xl:w-16 h-8 xl:h-10 2xl:h-12 3xl:h-14 4xl:h-16"
                : "w-10 xl:w-12 2xl:w-14 3xl:w-16 4xl:w-18 h-10 xl:h-12 2xl:h-14 3xl:h-16 4xl:h-18"
            )} />
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
}
