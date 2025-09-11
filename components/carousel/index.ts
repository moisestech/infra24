// Main carousel component
export { AnnouncementCarousel } from './AnnouncementCarousel';

// Sub-components
export { PatternTemplate } from './PatternTemplate';
export { AnnouncementDateDisplay } from './AnnouncementDateDisplay';
export { AnnouncementContent } from './AnnouncementContent';
export { CarouselControls } from './CarouselControls';

// Theme management
export { OrganizationThemeProvider, useOrganizationTheme } from './OrganizationThemeContext';

// Configuration and utilities
export { 
  typeStyles, 
  typeIcons, 
  getIconForAnnouncement, 
  getStylesForAnnouncement,
  type TypeStyle,
  type TypeStyles,
  type TypeIconMappings
} from './announcement-styles';
