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
        "flex-1 relative z-10 overflow-y-auto overflow-x-hidden flex flex-col min-w-0 w-full",
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
        "flex-1 relative z-10 overflow-y-auto overflow-x-hidden flex flex-col min-w-0 w-full",
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

// Debug: set true to show colored backgrounds (red=outer, blue=content wrapper, green=stack, orange=image, yellow=text)
const DEBUG_LAYOUT = false;

// Card Layout: Image on top, all text stacked underneath
export function CardImageLayout({ announcement, imageUrl, orientation, children, textSizes, styles, imageSettings, screenMetrics, responsiveSizes }: ImageLayoutProps) {
  const imageScale = imageSettings?.scale !== undefined ? imageSettings.scale : 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  const debugBg = (color: string) => DEBUG_LAYOUT ? { backgroundColor: color } : {};
  
  return (
    <div className="relative w-full max-w-full h-full overflow-hidden" style={debugBg('rgba(255,0,0,0.2)')}>
      {/* Background - use solid color for Oolite if available */}
      <div 
        className={cn(
          "absolute inset-0",
          styles?.gradientStyle ? '' : ""
        )}
        style={styles?.gradientStyle}
      />
      
      {/* Content: stacked layout - image on top, all text underneath */}
      <div 
        className={cn(
          "relative z-20 w-full max-w-full h-full flex flex-col overflow-hidden",
          responsiveSizes?.padding || "p-8 md:p-12 xl:p-16"
        )}
        style={debugBg('rgba(0,0,255,0.25)')}
      >
        <div 
          className="flex-1 flex flex-col relative min-w-0 overflow-hidden"
          style={debugBg('rgba(0,255,0,0.2)')}
        >
          {/* Image - On Top */}
          <motion.div
            className="flex-shrink-0 relative z-10 mb-4 md:mb-6 bg-transparent rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={debugBg('rgba(255,165,0,0.4)')}
          >
            <div 
              className={cn(
                "relative overflow-hidden mx-auto bg-transparent rounded-md",
                orientation === 'portrait' 
                  ? "w-full max-w-md aspect-[4/3] xl:aspect-[3/2]"
                  : "w-full max-w-2xl xl:max-w-3xl aspect-video"
              )}
              style={{
                transform: `scale(${imageScale})`,
                transformOrigin: 'center',
                opacity: imageOpacity
              }}
            >
              <img 
                src={imageUrl}
                alt={announcement.title || 'Announcement image'}
                className="w-full h-full object-contain object-center"
                onLoad={() => {}}
                onError={() => console.error('❌ Image failed to load:', imageUrl)}
              />
            </div>
          </motion.div>
          
          {/* All text content - Below Image */}
          <div 
            className="flex-1 min-w-0 relative z-30 overflow-y-auto overflow-x-hidden flex flex-col" 
            style={{ maxWidth: '100%', ...debugBg('rgba(255,255,0,0.35)') }}
          >
            {children}
          </div>
        </div>
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

