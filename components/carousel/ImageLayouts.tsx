'use client';

import { motion } from "framer-motion";
import Image from 'next/image';
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
  /** When true, skip enter animations (e.g. kiosk / reduced motion) */
  animationsPaused?: boolean;
}

// Hero Layout: Large image as background with content overlay
export function HeroImageLayout({ announcement, imageUrl, orientation, children, styles, imageSettings }: ImageLayoutProps) {
  const imageScale = imageSettings?.scale || 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          transform: `scale(${imageScale})`,
          opacity: imageOpacity
        }}
      />
      {/* Cinematic scrim: keeps typography readable over busy photos */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/35 to-black/20"
        aria-hidden
      />
      {/* Pattern overlay (reduced opacity) */}
      {styles && (
        <div className={cn("absolute inset-0 z-[2] opacity-25", styles.gradient)} />
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
        className="h-full relative flex-shrink-0 z-10 overflow-hidden rounded-r-2xl shadow-[12px_0_48px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
        style={{ width: `${splitPercentage}%` }}
      >
        <div 
          className="relative h-full w-full min-h-[160px]"
          style={{ 
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
            opacity: imageOpacity
          }}
        >
          <Image
            src={imageUrl}
            alt={announcement.title || 'Announcement image'}
            fill
            className="object-cover"
            sizes={`${splitPercentage}vw`}
            priority={false}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/25 to-transparent" aria-hidden />
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
        className="h-full relative flex-shrink-0 z-10 overflow-hidden rounded-l-2xl shadow-[-12px_0_48px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
        style={{ width: `${splitPercentage}%` }}
      >
        <div 
          className="relative h-full w-full min-h-[160px]"
          style={{ 
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
            opacity: imageOpacity
          }}
        >
          <Image
            src={imageUrl}
            alt={announcement.title || 'Announcement image'}
            fill
            className="object-cover"
            sizes={`${splitPercentage}vw`}
            priority={false}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/25 to-transparent" aria-hidden />
        </div>
      </div>
    </div>
  );
}

// Debug: set true to show colored backgrounds (red=outer, blue=content wrapper, green=stack, orange=image, yellow=text)
const DEBUG_LAYOUT = false;

// Card Layout: Image on top, all text stacked underneath
export function CardImageLayout({ announcement, imageUrl, orientation, children, textSizes, styles, imageSettings, screenMetrics, responsiveSizes, animationsPaused }: ImageLayoutProps) {
  const imageScale = imageSettings?.scale !== undefined ? imageSettings.scale : 1;
  const imageOpacity = imageSettings?.opacity !== undefined ? imageSettings.opacity / 100 : 1;
  
  const debugBg = (color: string) => DEBUG_LAYOUT ? { backgroundColor: color } : {};
  
  return (
    <div className="relative w-full max-w-full h-full overflow-hidden" style={debugBg('rgba(255,0,0,0.2)')}>
      <div 
        className={cn(
          "absolute inset-0",
          styles?.gradientStyle ? '' : ""
        )}
        style={styles?.gradientStyle}
      />
      
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
          {/* Image — editorial frame, cover crop, micro-motion */}
          <motion.div
            className="flex-shrink-0 relative z-10 mb-4 md:mb-8 w-full flex justify-center"
            initial={animationsPaused ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={debugBg('rgba(255,165,0,0.4)')}
          >
            <div
              className="w-full max-w-4xl"
              style={{
                transform: `scale(${imageScale})`,
                transformOrigin: 'center top',
                opacity: imageOpacity,
              }}
            >
              <div className="rounded-2xl p-[1px] bg-gradient-to-br from-white/50 via-white/15 to-emerald-400/25 shadow-[0_28px_90px_-24px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
                <div
                  className={cn(
                    'relative overflow-hidden rounded-2xl bg-neutral-950/40',
                    orientation === 'portrait'
                      ? 'aspect-[4/3] max-h-[min(44vh,540px)] w-full max-w-lg mx-auto'
                      : 'aspect-[16/9] w-full mx-auto'
                  )}
                >
                  <Image
                    src={imageUrl}
                    alt={announcement.title || 'Announcement image'}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, min(85vw, 960px)"
                    priority={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
                  <div className="pointer-events-none absolute top-3 left-3 h-9 w-9 border-l-2 border-t-2 border-white/40 rounded-tl-md" />
                  <div className="pointer-events-none absolute bottom-3 right-3 h-9 w-9 border-r-2 border-b-2 border-white/40 rounded-br-md" />
                </div>
              </div>
            </div>
          </motion.div>
          
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
          className="col-span-7 row-span-3 relative overflow-hidden rounded-xl ring-1 ring-white/15 shadow-xl"
          style={{
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
            opacity: imageOpacity
          }}
        >
          <div className="relative h-full min-h-[140px] w-full">
            <Image
              src={imageUrl}
              alt={announcement.title || 'Announcement image'}
              fill
              className="object-cover"
              sizes="58vw"
              priority={false}
            />
          </div>
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
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          transform: `scale(${imageScale})`,
          opacity: imageOpacity
        }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-black/70 via-black/40 to-black/65" aria-hidden />
      {styles && (
        <div className={cn("absolute inset-0 z-[2] opacity-25", styles.gradient)} />
      )}
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

