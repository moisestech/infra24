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
import { TypeStyle } from './announcement-styles';
import { LucideIcon } from 'lucide-react';

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
  avatarSizeMultiplier = 4,
  showTags = false
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

  return (
    <div className="relative w-full h-full">
      {/* Base gradient background */}
      <div className={cn("absolute inset-0", styles.gradient)} />

      {/* Pattern overlay */}
      {isMounted && (
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

      {/* Date Display */}
      <AnnouncementDateDisplay
        announcement={announcement}
        orientation={orientation}
        organizationTheme={organizationTheme}
        showDetailedMetadata={true}
        textSizes={textSizes}
      />

      {/* People with Avatars */}
      <AnnouncementPeople 
        people={announcement.people || []}
        orientation={orientation}
        avatarSizeMultiplier={avatarSizeMultiplier}
      />

      {/* Partner Organizations */}
      <AnnouncementPartnerOrgs
        externalOrgs={announcement.external_orgs || []}
        orientation={orientation}
        textSizes={textSizes}
        className="absolute top-80 right-8 md:right-12 z-20"
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
      />



      {/* Tags */}
      {showTags && (
        <AnnouncementTags 
          tags={announcement.tags || []}
          orientation={orientation}
          textSizes={textSizes}
        />
      )}
    </div>
  );
}
