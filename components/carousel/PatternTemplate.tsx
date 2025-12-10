'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { BackgroundPattern } from '@/components/BackgroundPattern';
import { AnnouncementDateDisplay } from './AnnouncementDateDisplay';
import { AnnouncementContent } from './AnnouncementContent';
import { AnnouncementPeople } from './AnnouncementPeople';
import { AnnouncementTags } from './AnnouncementTags';
import { AnnouncementPartnerOrgs } from './AnnouncementPartnerOrgs';
import { LearnMoreButton } from './LearnMoreButton';
import { TypeStyle } from './announcement-styles';
import { LucideIcon } from 'lucide-react';
import { ImageLayout } from './ImageLayouts';
import { ImageLayoutType } from '@/types/announcement';
import { LayoutDebugOverlay } from './LayoutDebugOverlay';
import { type ScreenMetrics, type ResponsiveSizes } from './ResponsiveSizing';

interface ImageSettings {
  layout?: ImageLayoutType;
  scale?: number;
  splitPercentage?: number;
  opacity?: number;
}

interface PatternTemplateProps {
  announcement: any;
  styles: TypeStyle;
  IconComponent: LucideIcon;
  orientation: 'portrait' | 'landscape';
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  organizationSlug?: string;
  organizationTheme?: any;
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
  avatarSizeMultiplier?: number;
  showTags?: boolean;
  showPriorityBadge?: boolean;
  showVisibilityBadge?: boolean;
  showQRCodeButton?: boolean;
  showLearnMore?: boolean;
  imageSettings?: ImageSettings;
  screenMetrics?: ScreenMetrics;
  responsiveSizes?: ResponsiveSizes;
  isActive?: boolean;
  animationsPaused?: boolean;
}

export function PatternTemplate({ 
  announcement, 
  styles, 
  IconComponent, 
  orientation, 
  showQRCode, 
  setShowQRCode, 
  organizationSlug,
  organizationTheme,
  textSizes = {
    title: 'text-6xl',
    description: 'text-3xl',
    location: 'text-3xl',
    date: 'text-7xl',
    type: 'text-8xl',
    metadata: 'text-sm',
    startDate: 'text-3xl',
    endDate: 'text-3xl',
    duration: 'text-3xl'
  },
  iconSizeMultiplier = 1,
  avatarSizeMultiplier = 5,
  showTags = false,
  showPriorityBadge = false,
  showVisibilityBadge = false,
  showQRCodeButton = false, // Disabled until QR code is fully tested
  showLearnMore = true,
  imageSettings,
  screenMetrics,
  responsiveSizes,
  isActive = false,
  animationsPaused = false
}: PatternTemplateProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Check if announcement has an image and determine layout
  const hasImage = announcement.image_url && announcement.image_url.trim() !== '';
  // Use custom image settings layout if provided, otherwise use announcement's layout or default
  const imageLayout = hasImage 
    ? (imageSettings?.layout || announcement.image_layout || 'hero' as ImageLayoutType)
    : null;

  // Image information logging removed to reduce console noise

  // Content wrapper component
  const ContentWrapper = () => (
    <>
      {/* Date Display */}
      <AnnouncementDateDisplay
        announcement={announcement}
        orientation={orientation}
        organizationTheme={organizationTheme}
        showDetailedMetadata={true}
        textSizes={textSizes}
        iconSizeMultiplier={iconSizeMultiplier}
        screenMetrics={screenMetrics}
        responsiveSizes={responsiveSizes}
      />

      {/* People with Avatars - right under date display */}
      <AnnouncementPeople 
        people={announcement.people || []}
        orientation={orientation}
        avatarSizeMultiplier={avatarSizeMultiplier}
        organizationSlug={organizationSlug}
        className="absolute top-80 right-8 md:right-12 z-30"
      />

      {/* Partner Organizations */}
      <AnnouncementPartnerOrgs
        externalOrgs={announcement.external_orgs || []}
        orientation={orientation}
        textSizes={textSizes}
        className="absolute top-96 right-8 md:right-12 z-30"
      />

      {/* Main Content */}
      <AnnouncementContent 
        announcement={announcement}
        styles={styles}
        IconComponent={IconComponent}
        orientation={orientation}
        showQRCode={showQRCode}
        setShowQRCode={setShowQRCode}
        organizationSlug={organizationSlug}
        textSizes={textSizes}
        iconSizeMultiplier={iconSizeMultiplier}
        showPriorityBadge={showPriorityBadge}
        showVisibilityBadge={showVisibilityBadge}
        showQRCodeButton={showQRCodeButton}
        showLearnMore={showLearnMore}
        layoutType={imageLayout}
        screenMetrics={screenMetrics}
        responsiveSizes={responsiveSizes}
        isActive={isActive}
        animationsPaused={animationsPaused}
      />

      {/* Learn More Button */}
      {showLearnMore && (
        <LearnMoreButton
          primaryLink={announcement.primary_link}
          orientation={orientation}
          className="absolute bottom-8 right-8 md:right-12 z-30"
        />
      )}

      {/* Tags */}
      {showTags && (
        <AnnouncementTags 
          tags={announcement.tags || []}
          orientation={orientation}
          textSizes={textSizes}
        />
      )}
    </>
  );

  // If image exists, use ImageLayout component
  if (hasImage && imageLayout) {
    // Image layout rendering log removed to reduce console noise

    return (
      <>
        <LayoutDebugOverlay 
          imageLayout={imageLayout}
          hasImage={hasImage}
          organizationSlug={organizationSlug}
        />
        <ImageLayout
          layout={imageLayout}
          announcement={announcement}
          imageUrl={announcement.image_url}
          orientation={orientation}
          textSizes={textSizes}
          styles={styles}
          IconComponent={IconComponent}
          imageSettings={imageSettings}
          screenMetrics={screenMetrics}
          responsiveSizes={responsiveSizes}
        >
          {/* Pattern overlay - only show if not using image background and not solid pattern */}
          {isMounted && 
           imageLayout !== 'hero' && 
           imageLayout !== 'overlay' && 
           imageLayout !== 'background' && 
           styles.backgroundPattern !== 'solid' && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <BackgroundPattern 
                type={announcement.type || 'event'} 
                subType={announcement.sub_type || 'exhibition'}
                width={dimensions.width}
                height={dimensions.height}
                organizationSlug={organizationSlug}
                organizationTheme={organizationTheme}
              />
            </div>
          )}
          <ContentWrapper />
        </ImageLayout>
      </>
    );
  }

  // Default layout (no image) - logging removed to reduce console noise

  return (
    <>
      <LayoutDebugOverlay 
        imageLayout={null}
        hasImage={false}
        organizationSlug={organizationSlug}
      />
      <div className="relative w-full h-full">
        {/* Base gradient background */}
        <div 
          className={cn("absolute inset-0", typeof styles.gradient === 'string' ? styles.gradient : '')}
          style={styles.gradientStyle || (typeof styles.gradient === 'object' ? styles.gradient.style : undefined)}
        />

        {/* Pattern overlay - skip if solid pattern for Oolite */}
        {isMounted && styles.backgroundPattern !== 'solid' && (
          <div className="absolute inset-0 z-10">
            <BackgroundPattern 
              type={announcement.type || 'event'} 
              subType={announcement.sub_type || 'exhibition'}
              width={dimensions.width}
              height={dimensions.height}
              organizationSlug={organizationSlug}
              organizationTheme={organizationTheme}
            />
          </div>
        )}

        <ContentWrapper />
      </div>
    </>
  );
}
