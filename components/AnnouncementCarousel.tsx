'use client';

// Re-export the refactored carousel components for backward compatibility
export { 
  AnnouncementCarousel,
  OrganizationThemeProvider,
  useOrganizationTheme
} from './carousel';

// This file now serves as a re-export for backward compatibility
// The actual implementation has been moved to ./carousel/ directory
// 
// The original 800+ line file has been refactored into:
// - ./carousel/AnnouncementCarousel.tsx (main component)
// - ./carousel/PatternTemplate.tsx (template component)
// - ./carousel/AnnouncementDateDisplay.tsx (date display logic)
// - ./carousel/AnnouncementContent.tsx (main content display)
// - ./carousel/CarouselControls.tsx (navigation controls)
// - ./carousel/OrganizationThemeContext.tsx (theme management)
// - ./carousel/announcement-styles.ts (style configurations)
// - ./carousel/index.ts (exports)
