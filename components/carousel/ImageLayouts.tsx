'use client';

import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { ImageLayoutType } from '@/types/announcement';
import { LucideIcon } from 'lucide-react';

interface ImageSettings {
  layout?: string;
  scale?: number;
  splitPercentage?: number;
  opacity?: number;
}

interface ImageLayoutProps {
  announcement: any;
  imageUrl: string;
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
  children: React.ReactNode; // The announcement content
  styles?: any;
  IconComponent?: LucideIcon;
  imageSettings?: ImageSettings;
  screenMetrics?: any;
  responsiveSizes?: any;
}

// Hero Layout: Large image as background with content overlay
export function HeroImageLayout({ announcement, imageUrl, orientation, children, styles, imageSettings }: ImageLayoutProps) {
  const imageScale = imageSettings?.scale || 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          transform: `scale(${imageScale})`,
          opacity: imageOpacity
        }}
      >
      </div>
      
      {/* Pattern overlay (reduced opacity) */}
      {styles && (
        <div className={cn("absolute inset-0 opacity-30", styles.gradient)} />
      )}
      
      {/* Content */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
}

// Split Left: Image on left (40%), content on right (60%)
export function SplitLeftImageLayout({ announcement, imageUrl, orientation, children, styles, imageSettings, screenMetrics, responsiveSizes }: ImageLayoutProps) {
  const splitPercentage = imageSettings?.splitPercentage || responsiveSizes?.splitPercentage || 40;
  const imageScale = imageSettings?.scale || 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  // SplitLeftImageLayout rendering log removed to reduce console noise
  
  return (
    <div className="relative w-full h-full flex">
      {/* Background for content section - applied to container */}
      {styles?.gradientStyle && (
        <div 
          className="absolute inset-0"
          style={styles.gradientStyle}
        />
      )}
      
      {/* Image Section - Left */}
      <div 
        className="h-full relative flex-shrink-0 z-10"
        style={{ width: `${splitPercentage}%` }}
      >
        <div 
          style={{ 
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            opacity: imageOpacity
          }}
        >
          <img 
            src={imageUrl}
            alt={announcement.title || 'Announcement image'}
            className="w-full h-full object-cover"
            onLoad={() => {}} // Image load logging removed
            onError={() => console.error('❌ Image failed to load:', imageUrl)} // Keep errors
          />
        </div>
      </div>
      
      {/* Content Section - Right */}
      <div className={cn(
        "flex-1 relative z-10 overflow-auto flex flex-col min-w-0 w-full",
        responsiveSizes?.padding ? '' : ''
      )}>
        {children}
      </div>
    </div>
  );
}

// Split Right: Image on right (40%), content on left (60%)
export function SplitRightImageLayout({ announcement, imageUrl, orientation, children, styles, imageSettings, screenMetrics, responsiveSizes }: ImageLayoutProps) {
  const splitPercentage = imageSettings?.splitPercentage || responsiveSizes?.splitPercentage || 40;
  const imageScale = imageSettings?.scale || 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  // SplitRightImageLayout rendering log removed to reduce console noise
  
  return (
    <div className="relative w-full h-full flex">
      {/* Background for content section - applied to container */}
      {styles?.gradientStyle && (
        <div 
          className="absolute inset-0"
          style={styles.gradientStyle}
        />
      )}
      
      {/* Content Section - Left */}
      <div className={cn(
        "flex-1 relative z-10 overflow-auto flex flex-col min-w-0 w-full",
        responsiveSizes?.padding ? '' : ''
      )}>
        {children}
      </div>
      
      {/* Image Section - Right */}
      <div 
        className="h-full relative flex-shrink-0 z-10"
        style={{ width: `${splitPercentage}%` }}
      >
        <div 
          style={{ 
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            opacity: imageOpacity
          }}
        >
          <img 
            src={imageUrl}
            alt={announcement.title || 'Announcement image'}
            className="w-full h-full object-cover"
            onLoad={() => {}} // Image load logging removed
            onError={() => console.error('❌ Image failed to load:', imageUrl)} // Keep errors
          />
        </div>
      </div>
    </div>
  );
}

// Card Layout: Image as prominent card element with content flowing around it
export function CardImageLayout({ announcement, imageUrl, orientation, children, textSizes, styles, imageSettings, screenMetrics, responsiveSizes }: ImageLayoutProps) {
  // Always use scale 1 unless explicitly set by imageSettings
  // Don't use responsiveSizes?.imageScale as it might be less than 1
  const imageScale = imageSettings?.scale !== undefined ? imageSettings.scale : 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  // Get responsive image card dimensions
  let imageCardStyle: { width?: string; height?: string } = {};
  let imageCardClassName: string;
  
  if (screenMetrics?.isConstrained) {
    // Use responsive sizing for constrained screens
    const width = screenMetrics.width;
    const height = screenMetrics.height;
    const cardWidth = orientation === 'portrait' 
      ? Math.floor(width * 0.35) 
      : Math.floor(width * 0.30);
    const cardHeight = orientation === 'portrait'
      ? Math.floor(height * 0.40)
      : Math.floor(height * 0.35);
    imageCardStyle = {
      width: `${cardWidth}px`,
      height: `${cardHeight}px`
    };
    imageCardClassName = "relative overflow-hidden";
  } else {
    // Fixed sizes for larger screens
      imageCardClassName = cn(
      "relative overflow-hidden",
      orientation === 'portrait' 
        ? "w-64 xl:w-80 2xl:w-96 h-80 xl:h-96 2xl:h-[28rem]"
        : "w-80 xl:w-96 2xl:w-[28rem] h-96 xl:h-[28rem] 2xl:h-[32rem]"
    );
  }
  
  // CardImageLayout rendering log removed to reduce console noise
  
  return (
    <div className="relative w-full h-full">
      {/* Background - use solid color for Oolite if available */}
      <div 
        className={cn(
          "absolute inset-0",
          styles?.gradientStyle ? '' : ""
        )}
        style={styles?.gradientStyle}
      />
      
      {/* Content with floating image card */}
      <div className={cn(
        "relative z-20 h-full flex flex-col",
        responsiveSizes?.padding || "p-12 md:p-16 xl:p-20"
      )}>
        {/* Check if portrait/tall display - show image on top */}
        {orientation === 'portrait' && screenMetrics && screenMetrics.height > screenMetrics.width * 1.5 ? (
          <div className="flex-1 flex flex-col relative min-w-0">
            {/* Image Card - On Top */}
            <motion.div
              className="flex-shrink-0 relative z-10 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                className={imageCardClassName}
                style={{
                  ...imageCardStyle,
                  width: screenMetrics.width ? `${Math.floor(screenMetrics.width * 0.9)}px` : undefined,
                  height: screenMetrics.height ? `${Math.floor(screenMetrics.height * 0.4)}px` : undefined,
                  transform: `scale(${imageScale})`,
                  transformOrigin: 'center',
                  opacity: imageOpacity
                }}
              >
                <img 
                  src={imageUrl}
                  alt={announcement.title || 'Announcement image'}
                  className="w-full h-full object-contain"
                  onLoad={() => console.log('✅ Image loaded:', imageUrl)}
                  onError={() => console.error('❌ Image failed to load:', imageUrl)}
                />
              </div>
            </motion.div>
            
            {/* Content - Below Image */}
            <div className="flex-1 min-w-0 relative z-30 overflow-y-auto flex flex-col" style={{ maxWidth: '100%' }}>
              {children}
            </div>
          </div>
        ) : (
          <div className={cn(
            "flex-1 flex items-start relative min-w-0",
            responsiveSizes?.gap || "gap-8 xl:gap-12"
          )}>
            {/* Image Card - Side */}
            <motion.div
              className="flex-shrink-0 relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                className={imageCardClassName}
                style={{
                  ...imageCardStyle,
                  transform: `scale(${imageScale})`,
                  transformOrigin: 'center',
                  opacity: imageOpacity
                }}
              >
                <img 
                  src={imageUrl}
                  alt={announcement.title || 'Announcement image'}
                  className="w-full h-full object-contain"
                  onLoad={() => console.log('✅ Image loaded:', imageUrl)}
                  onError={() => console.error('❌ Image failed to load:', imageUrl)}
                />
              </div>
            </motion.div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 relative z-30 overflow-y-auto flex flex-col" style={{ maxWidth: '100%' }}>
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Masonry Layout: Image and content in asymmetric grid layout
export function MasonryImageLayout({ announcement, imageUrl, orientation, children, imageSettings }: ImageLayoutProps) {
  const imageScale = imageSettings?.scale || 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  return (
    <div className="relative w-full h-full">
      {/* Background */}
      
      {/* Asymmetric Grid */}
      <div className="relative z-20 h-full p-8 md:p-12 xl:p-16 grid grid-cols-12 grid-rows-6 gap-4">
        {/* Image in top-right quadrant */}
        <div 
          className="col-span-7 row-span-3 relative overflow-hidden"
          style={{
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
            opacity: imageOpacity
          }}
        >
          <img 
            src={imageUrl}
            alt={announcement.title || 'Announcement image'}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content spans multiple areas */}
        <div className="col-span-5 row-span-6 col-start-8 row-start-1">
          {children}
        </div>
        
        {/* Additional content area */}
        <div className="col-span-7 row-span-3 row-start-4">
          {/* Additional content can go here */}
        </div>
      </div>
    </div>
  );
}

// Overlay Layout: Image with semi-transparent overlay, content on top
export function OverlayImageLayout({ announcement, imageUrl, orientation, children, styles, imageSettings }: ImageLayoutProps) {
  const imageScale = imageSettings?.scale || 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          transform: `scale(${imageScale})`,
          opacity: imageOpacity
        }}
      >
      </div>
      
      {/* Pattern overlay (if styles provided) */}
      {styles && (
        <div className={cn("absolute inset-0 opacity-20", styles.gradient)} />
      )}
      
      {/* Content */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
}

// Side Panel: Narrow image panel on one side, full content area
export function SidePanelImageLayout({ announcement, imageUrl, orientation, children, imageSettings }: ImageLayoutProps) {
  const imageScale = imageSettings?.scale || 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  return (
    <div className="relative w-full h-full flex">
      {/* Narrow Image Panel - Left */}
      <div className="w-32 md:w-40 xl:w-48 2xl:w-56 h-full relative flex-shrink-0">
        <div
          style={{
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            opacity: imageOpacity
          }}
        >
          <img 
            src={imageUrl}
            alt={announcement.title || 'Announcement image'}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle border effect */}
        <div className="absolute inset-0 border-r-4 border-white/10" />
      </div>
      
      {/* Full Content Area */}
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
  );
}

// Background Layout: Image as subtle background with strong content foreground
export function BackgroundImageLayout({ announcement, imageUrl, orientation, children, styles, imageSettings }: ImageLayoutProps) {
  const imageScale = imageSettings?.scale || 1;
  const baseOpacity = 0.2;
  const imageOpacity = imageSettings?.opacity !== undefined ? (imageSettings.opacity / 100) * baseOpacity : baseOpacity;
  
  return (
    <div className="relative w-full h-full">
      {/* Subtle Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${imageUrl})`, 
          filter: 'blur(8px)',
          transform: `scale(${imageScale})`,
          opacity: imageOpacity
        }}
      />
      
      
      {/* Pattern overlay (if styles provided) */}
      {styles && (
        <div className={cn("absolute inset-0 opacity-40", styles.gradient)} />
      )}
      
      {/* Content */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
}

// Main component that selects the appropriate layout
export function ImageLayout({ 
  layout, 
  ...props 
}: ImageLayoutProps & { layout: ImageLayoutType }) {
  switch (layout) {
    case 'hero':
      return <HeroImageLayout {...props} />;
    case 'split-left':
      return <SplitLeftImageLayout {...props} />;
    case 'split-right':
      return <SplitRightImageLayout {...props} />;
    case 'card':
      return <CardImageLayout {...props} />;
    case 'masonry':
      return <MasonryImageLayout {...props} />;
    case 'overlay':
      return <OverlayImageLayout {...props} />;
    case 'side-panel':
      return <SidePanelImageLayout {...props} />;
    case 'background':
      return <BackgroundImageLayout {...props} />;
    default:
      // Fallback to hero layout
      return <HeroImageLayout {...props} />;
  }
}

