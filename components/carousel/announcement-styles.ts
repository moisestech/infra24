import React from 'react';
import { 
  AlertTriangle,
  Building2,
  PartyPopper,
  Sparkles,
  FileText,
  CloudRainWind,
  ShieldAlert,
  CarFront,
  Hammer,
  Brush,
  Package,
  Bell,
  Palette,
  Users,
  MessageSquare,
  Theater,
  Briefcase,
  Award,
  Home,
  DollarSign,
  ClipboardCheck,
  FileQuestion,
  Lightbulb,
  Gift,
  Crown,
  LucideIcon
} from 'lucide-react';
import { Announcement } from '@/types/announcement';

// Type style interface
export interface TypeStyle {
  gradient: string | { className: string; style: React.CSSProperties };
  overlay?: string;
  accent: string;
  badge?: string;
  text: string;
  dateStyle?: string;
  icon?: LucideIcon;
  backgroundPattern?: string;
  gradientStyle?: React.CSSProperties; // For inline styles when gradient is an object
}

export interface TypeStyles {
  [key: string]: TypeStyle;
}

// Icon mappings for different announcement types and subtypes
export interface TypeIconMappings {
  [key: string]: {
    [key: string]: LucideIcon;
  };
}

export const typeIcons: TypeIconMappings = {
  urgent: {
    weather: CloudRainWind,
    security: ShieldAlert,
    maintenance: Hammer,
    default: AlertTriangle
  },
  facility: {
    parking: CarFront,
    studio: Brush,
    storage: Package,
    default: Building2
  },
  event: {
    exhibition: Palette,
    workshop: Hammer,
    performance: Theater,
    party: PartyPopper,
    meeting: Users,
    default: PartyPopper
  },
  opportunity: {
    grant: DollarSign,
    residency: Home,
    job: Briefcase,
    award: Award,
    call: MessageSquare,
    default: Sparkles
  },
  administrative: {
    policy: FileText,
    form: ClipboardCheck,
    question: FileQuestion,
    default: FileText
  },
  attention_artists: {
    performance: Theater,
    exhibition: Palette,
    workshop: Hammer,
    default: Palette
  },
  attention_public: {
    event: PartyPopper,
    exhibition: Palette,
    performance: Theater,
    default: Bell
  },
  fun_fact: {
    historical: Lightbulb,
    artist_spotlight: Palette,
    default: Lightbulb
  },
  promotion: {
    gala: Crown,
    sale: DollarSign,
    default: Gift
  },
  gala_announcement: {
    fundraising: DollarSign,
    celebration: Crown,
    default: Crown
  }
};

// Type styles configuration
export const typeStyles: TypeStyles = {
  urgent: {
    gradient: "bg-gradient-to-br from-red-600 via-red-500 to-rose-500",
    overlay: "bg-black/20",
    accent: "from-red-300 to-rose-300",
    badge: "bg-red-500",
    text: "text-white",
    dateStyle: "bg-red-700/90 text-white",
    icon: AlertTriangle,
    backgroundPattern: "radial-gradient-dots"
  },
  facility: {
    gradient: "bg-gradient-to-br from-red-600 via-red-500 to-rose-500",
    overlay: "bg-black/20",
    accent: "from-red-300 to-rose-300",
    badge: "bg-red-500",
    text: "text-white",
    dateStyle: "bg-red-700/90 text-white",
    icon: Building2,
    backgroundPattern: "grid"
  },
  event: {
    gradient: "bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500",
    overlay: "bg-black/20",
    accent: "from-yellow-300 to-orange-300",
    badge: "bg-yellow-500",
    text: "text-white",
    dateStyle: "bg-yellow-700/90 text-white",
    icon: PartyPopper,
    backgroundPattern: "confetti"
  },
  opportunity: {
    gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500",
    overlay: "bg-black/20",
    accent: "from-blue-300 to-indigo-300",
    badge: "bg-blue-500",
    text: "text-white",
    dateStyle: "bg-blue-700/90 text-white",
    icon: Sparkles,
    backgroundPattern: "sparkles"
  },
  administrative: {
    gradient: "bg-gradient-to-br from-gray-600 via-gray-500 to-slate-500",
    overlay: "bg-black/20",
    accent: "from-gray-300 to-slate-300",
    badge: "bg-gray-500",
    text: "text-white",
    dateStyle: "bg-gray-700/90 text-white",
    icon: FileText,
    backgroundPattern: "grid"
  },
  attention_artists: {
    gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500",
    overlay: "bg-black/20",
    accent: "from-blue-300 to-indigo-300",
    badge: "bg-blue-500",
    text: "text-white",
    dateStyle: "bg-blue-700/90 text-white",
    icon: Palette,
    backgroundPattern: "bauhaus"
  },
  attention_public: {
    gradient: "bg-gradient-to-br from-red-600 via-red-500 to-rose-500",
    overlay: "bg-black/20",
    accent: "from-red-300 to-rose-300",
    badge: "bg-red-500",
    text: "text-white",
    dateStyle: "bg-red-700/90 text-white",
    icon: Bell,
    backgroundPattern: "radial-gradient-dots"
  },
  fun_fact: {
    gradient: "bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-400",
    overlay: "bg-black/10",
    accent: "from-yellow-300 to-amber-300",
    badge: "bg-yellow-500",
    text: "text-white",
    dateStyle: "bg-yellow-600/90 text-white",
    icon: Lightbulb,
    backgroundPattern: "confetti"
  },
  promotion: {
    gradient: "bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500",
    overlay: "bg-black/20",
    accent: "from-amber-300 to-yellow-300",
    badge: "bg-amber-500",
    text: "text-white",
    dateStyle: "bg-amber-700/90 text-white",
    icon: Gift,
    backgroundPattern: "sparkles"
  },
  gala_announcement: {
    gradient: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-500",
    overlay: "bg-black/20",
    accent: "from-red-300 to-pink-300",
    badge: "bg-red-500",
    text: "text-white",
    dateStyle: "bg-red-700/90 text-white",
    icon: Crown,
    backgroundPattern: "radial-gradient-dots"
  }
};

// Helper function to get icon for announcement
export const getIconForAnnouncement = (announcement: Announcement): LucideIcon => {
  const type = announcement.type || 'event';
  const subType = announcement.sub_type || 'exhibition';
  
  const typeIconMap = typeIcons[type as keyof TypeIconMappings];
  if (typeIconMap && subType in typeIconMap) {
    return (typeIconMap as any)[subType];
  }
  
  // Fallback icons
  switch (type) {
    case 'urgent': return AlertTriangle;
    case 'facility': return Building2;
    case 'event': return PartyPopper;
    case 'opportunity': return Sparkles;
    case 'administrative': return FileText;
    default: return Bell;
  }
};

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 71, g: 171, b: 196 }; // Default to Oolite color
}

// Helper function to create solid background for Oolite (no gradient, just solid cyan)
// Returns an object with both className and inline style for maximum compatibility
function createOoliteSolidBackground(baseColor: string = '#47abc4'): { className: string; style: React.CSSProperties } {
  return {
    className: '', // Empty className, we'll use inline style
    style: { backgroundColor: baseColor } as React.CSSProperties
  };
}

// Helper function to get styles for announcement type
export const getStylesForAnnouncement = (announcement: Announcement, organizationSlug?: string): TypeStyle => {
  const type = announcement.type || 'event';
  const subType = announcement.sub_type || '';
  const isOolite = organizationSlug === 'oolite';
  const oolitePrimary = '#47abc4';
  
  // Oolite-specific color scheme using their primary color (#47abc4)
  if (isOolite) {
    // Special handling for specific type/subtype combinations with Oolite colors
    // Oolite uses solid cyan backgrounds with white text
    const ooliteGradient = createOoliteSolidBackground(oolitePrimary);
    if (type === 'event' && subType === 'exhibition') {
      return {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent", // No overlay for solid backgrounds
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: Palette,
        backgroundPattern: "solid" // Solid background, no pattern
      };
    }
    
    if (type === 'event' && subType === 'workshop') {
      return {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: Palette,
        backgroundPattern: "solid"
      };
    }
    
    if (type === 'event' && subType === 'meeting') {
      return {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: Crown,
        backgroundPattern: "solid"
      };
    }
    
    // Oolite-specific styles for all types using solid cyan background with white text
    const ooliteTypeStyles: TypeStyles = {
      urgent: {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: AlertTriangle,
        backgroundPattern: "solid"
      },
      facility: {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: Building2,
        backgroundPattern: "solid"
      },
      event: {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: PartyPopper,
        backgroundPattern: "solid"
      },
      opportunity: {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: Sparkles,
        backgroundPattern: "solid"
      },
      administrative: {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: FileText,
        backgroundPattern: "solid"
      },
      news: {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: FileText,
        backgroundPattern: "solid"
      },
      general: {
        gradient: ooliteGradient.className,
        gradientStyle: ooliteGradient.style,
        overlay: "bg-transparent",
        accent: `from-[${oolitePrimary}]/30 to-[${oolitePrimary}]/50`,
        badge: `bg-[${oolitePrimary}]`,
        text: "text-white",
        dateStyle: `bg-[${oolitePrimary}]/90 text-white`,
        icon: FileText,
        backgroundPattern: "solid"
      }
    };
    
    return ooliteTypeStyles[type] || ooliteTypeStyles['event'];
  }
  
  // Default behavior for non-Oolite organizations
  // Special handling for specific type/subtype combinations
  if (type === 'event' && subType === 'exhibition') {
    return {
      gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500",
      overlay: "bg-black/20",
      accent: "from-blue-300 to-indigo-300",
      badge: "bg-blue-500",
      text: "text-white",
      dateStyle: "bg-blue-700/90 text-white",
      icon: Palette,
      backgroundPattern: "bauhaus"
    };
  }
  
  if (type === 'event' && subType === 'workshop') {
    return {
      gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500",
      overlay: "bg-black/20",
      accent: "from-blue-300 to-indigo-300",
      badge: "bg-blue-500",
      text: "text-white",
      dateStyle: "bg-blue-700/90 text-white",
      icon: Palette,
      backgroundPattern: "bauhaus"
    };
  }
  
  if (type === 'event' && subType === 'meeting') {
    return {
      gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500",
      overlay: "bg-black/20",
      accent: "from-blue-300 to-indigo-300",
      badge: "bg-blue-500",
      text: "text-white",
      dateStyle: "bg-blue-700/90 text-white",
      icon: Crown,
      backgroundPattern: "bauhaus"
    };
  }
  
  if (type === 'administrative' && subType === 'survey') {
    return {
      gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500",
      overlay: "bg-black/20",
      accent: "from-blue-300 to-indigo-300",
      badge: "bg-blue-500",
      text: "text-white",
      dateStyle: "bg-blue-700/90 text-white",
      icon: Lightbulb,
      backgroundPattern: "bauhaus"
    };
  }
  
  return typeStyles[type] || typeStyles['event'];
};
