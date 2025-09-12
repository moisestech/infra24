'use client';

import { useEffect, useRef, useState } from 'react';
import { AnnouncementType, AnnouncementSubType } from '@/types/announcement';
import { PatternFactory, PatternType } from './patterns';
import { PatternColors } from './patterns/types';
import { DevComponent } from './DevComponent';
import { useTheme } from 'next-themes';

interface BackgroundPatternProps {
  type: AnnouncementType;
  subType: AnnouncementSubType;
  width: number;
  height: number;
  organizationSlug?: string;
  organizationTheme?: any;
}

interface ColorScheme extends PatternColors {
  background?: string;
}

interface ColorSchemes {
  [key: string]: ColorScheme;
}

// Color schemes for different announcement types
const colorSchemes: ColorSchemes = {
  urgent: {
    primary: 'rgba(239, 68, 68, 0.05)',
    secondary: 'rgba(251, 146, 60, 0.05)',
    accent: 'rgba(254, 215, 170, 0.05)',
    pattern: 'rgba(239, 68, 68, 0.9)'
  },
  facility: {
    primary: 'rgba(59, 130, 246, 0.05)',
    secondary: 'rgba(14, 165, 233, 0.05)',
    accent: 'rgba(186, 230, 253, 0.05)',
    pattern: 'rgba(59, 130, 246, 0.9)'
  },
  event: {
    primary: 'rgba(234, 179, 8, 0.05)',
    secondary: 'rgba(245, 158, 11, 0.05)',
    accent: 'rgba(254, 240, 138, 0.05)',
    pattern: 'rgba(234, 179, 8, 0.9)'
  },
  opportunity: {
    primary: 'rgba(59, 130, 246, 0.12)', // Primary blue for exhibitions
    secondary: 'rgba(96, 165, 250, 0.10)', // Light blue
    accent: 'rgba(147, 197, 253, 0.08)', // Lighter blue
    pattern: 'rgba(59, 130, 246, 0.9)', // Strong primary blue pattern
    background: 'rgba(59, 130, 246, 0.08)' // Primary blue background
  },
  administrative: {
    primary: 'rgba(107, 114, 128, 0.05)',
    secondary: 'rgba(156, 163, 175, 0.05)',
    accent: 'rgba(229, 231, 235, 0.05)',
    pattern: 'rgba(107, 114, 128, 0.9)'
  },
  // Bakehouse-specific custom types with primary yellow palette (light mode)
  attention_artists: {
    primary: 'rgba(255, 193, 7, 0.12)', // Primary yellow
    secondary: 'rgba(255, 213, 79, 0.10)', // Light yellow
    accent: 'rgba(255, 235, 59, 0.08)', // Bright yellow
    pattern: 'rgba(255, 193, 7, 0.9)', // Strong primary yellow pattern
    background: 'rgba(255, 193, 7, 0.08)' // Primary yellow background
  },
  attention_public: {
    primary: 'rgba(255, 152, 0, 0.12)', // Orange-yellow
    secondary: 'rgba(255, 183, 77, 0.10)', // Light orange-yellow
    accent: 'rgba(255, 213, 79, 0.08)', // Yellow-orange
    pattern: 'rgba(255, 152, 0, 0.9)', // Strong orange-yellow pattern
    background: 'rgba(255, 193, 7, 0.08)' // Primary yellow background
  },
  fun_fact: {
    primary: 'rgba(255, 235, 59, 0.15)', // Bright yellow
    secondary: 'rgba(255, 213, 79, 0.12)', // Light yellow
    accent: 'rgba(255, 193, 7, 0.10)', // Primary yellow
    pattern: 'rgba(255, 235, 59, 0.9)', // Strong bright yellow pattern
    background: 'rgba(255, 235, 59, 0.10)' // Bright yellow background
  },
  promotion: {
    primary: 'rgba(255, 171, 0, 0.12)', // Amber-yellow
    secondary: 'rgba(255, 193, 7, 0.10)', // Primary yellow
    accent: 'rgba(255, 213, 79, 0.08)', // Light yellow
    pattern: 'rgba(255, 171, 0, 0.9)', // Strong amber-yellow pattern
    background: 'rgba(255, 193, 7, 0.08)' // Primary yellow background
  },
  gala_announcement: {
    primary: 'rgba(255, 111, 0, 0.12)', // Deep orange-yellow
    secondary: 'rgba(255, 152, 0, 0.10)', // Orange-yellow
    accent: 'rgba(255, 193, 7, 0.08)', // Primary yellow
    pattern: 'rgba(255, 111, 0, 0.9)', // Strong deep orange-yellow pattern
    background: 'rgba(255, 193, 7, 0.08)' // Primary yellow background
  }
};

// Dark mode color schemes
const darkColorSchemes: ColorSchemes = {
  urgent: {
    primary: 'rgba(239, 68, 68, 0.15)',
    secondary: 'rgba(251, 146, 60, 0.12)',
    accent: 'rgba(254, 215, 170, 0.10)',
    pattern: 'rgba(239, 68, 68, 0.5)'
  },
  facility: {
    primary: 'rgba(59, 130, 246, 0.15)',
    secondary: 'rgba(14, 165, 233, 0.12)',
    accent: 'rgba(186, 230, 253, 0.10)',
    pattern: 'rgba(59, 130, 246, 0.5)'
  },
  event: {
    primary: 'rgba(234, 179, 8, 0.15)',
    secondary: 'rgba(245, 158, 11, 0.12)',
    accent: 'rgba(254, 240, 138, 0.10)',
    pattern: 'rgba(234, 179, 8, 0.5)'
  },
  opportunity: {
    primary: 'rgba(59, 130, 246, 0.25)', // Primary blue for exhibitions (dark mode)
    secondary: 'rgba(96, 165, 250, 0.22)', // Light blue
    accent: 'rgba(147, 197, 253, 0.20)', // Lighter blue
    pattern: 'rgba(59, 130, 246, 0.8)', // Strong primary blue pattern
    background: 'rgba(59, 130, 246, 0.15)' // Primary blue background
  },
  administrative: {
    primary: 'rgba(107, 114, 128, 0.15)',
    secondary: 'rgba(156, 163, 175, 0.12)',
    accent: 'rgba(229, 231, 235, 0.10)',
    pattern: 'rgba(107, 114, 128, 0.5)'
  },
  // Bakehouse-specific custom types with primary yellow palette (dark mode)
  attention_artists: {
    primary: 'rgba(255, 193, 7, 0.25)', // Primary yellow
    secondary: 'rgba(255, 213, 79, 0.22)', // Light yellow
    accent: 'rgba(255, 235, 59, 0.20)', // Bright yellow
    pattern: 'rgba(255, 193, 7, 0.8)', // Strong primary yellow pattern
    background: 'rgba(255, 193, 7, 0.15)' // Primary yellow background
  },
  attention_public: {
    primary: 'rgba(255, 152, 0, 0.25)', // Orange-yellow
    secondary: 'rgba(255, 183, 77, 0.22)', // Light orange-yellow
    accent: 'rgba(255, 213, 79, 0.20)', // Yellow-orange
    pattern: 'rgba(255, 152, 0, 0.8)', // Strong orange-yellow pattern
    background: 'rgba(255, 193, 7, 0.15)' // Primary yellow background
  },
  fun_fact: {
    primary: 'rgba(255, 235, 59, 0.30)', // Bright yellow
    secondary: 'rgba(255, 213, 79, 0.27)', // Light yellow
    accent: 'rgba(255, 193, 7, 0.25)', // Primary yellow
    pattern: 'rgba(255, 235, 59, 0.8)', // Strong bright yellow pattern
    background: 'rgba(255, 235, 59, 0.20)' // Bright yellow background
  },
  promotion: {
    primary: 'rgba(255, 171, 0, 0.25)', // Amber-yellow
    secondary: 'rgba(255, 193, 7, 0.22)', // Primary yellow
    accent: 'rgba(255, 213, 79, 0.20)', // Light yellow
    pattern: 'rgba(255, 171, 0, 0.8)', // Strong amber-yellow pattern
    background: 'rgba(255, 193, 7, 0.15)' // Primary yellow background
  },
  gala_announcement: {
    primary: 'rgba(255, 111, 0, 0.25)', // Deep orange-yellow
    secondary: 'rgba(255, 152, 0, 0.22)', // Orange-yellow
    accent: 'rgba(255, 193, 7, 0.20)', // Primary yellow
    pattern: 'rgba(255, 111, 0, 0.8)', // Strong deep orange-yellow pattern
    background: 'rgba(255, 193, 7, 0.15)' // Primary yellow background
  }
};

// Responsive BackgroundPattern
export function BackgroundPattern({ type, subType, width = 400, height = 400, organizationSlug, organizationTheme }: BackgroundPatternProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPattern, setCurrentPattern] = useState<PatternType>();
  const [size, setSize] = useState({ width: 400, height: 400 });

  // Primary colors scheme for organizations that want white backgrounds with primary colors
  const primaryColorsScheme: ColorSchemes = {
    event: {
      primary: 'rgba(255, 255, 255, 0.95)', // White background
      secondary: 'rgba(239, 68, 68, 0.15)', // Red accent
      accent: 'rgba(59, 130, 246, 0.15)', // Blue accent
      pattern: 'rgba(239, 68, 68, 0.8)', // Red pattern
      background: 'rgba(255, 255, 255, 0.98)' // Very white background
    },
    opportunity: {
      primary: 'rgba(255, 255, 255, 0.95)', // White background
      secondary: 'rgba(59, 130, 246, 0.15)', // Blue accent
      accent: 'rgba(251, 191, 36, 0.15)', // Yellow accent
      pattern: 'rgba(59, 130, 246, 0.8)', // Blue pattern
      background: 'rgba(255, 255, 255, 0.98)' // Very white background
    },
    urgent: {
      primary: 'rgba(255, 255, 255, 0.95)', // White background
      secondary: 'rgba(251, 191, 36, 0.15)', // Yellow accent
      accent: 'rgba(239, 68, 68, 0.15)', // Red accent
      pattern: 'rgba(251, 191, 36, 0.8)', // Yellow pattern
      background: 'rgba(255, 255, 255, 0.98)' // Very white background
    },
    facility: {
      primary: 'rgba(255, 255, 255, 0.95)', // White background
      secondary: 'rgba(59, 130, 246, 0.15)', // Blue accent
      accent: 'rgba(239, 68, 68, 0.15)', // Red accent
      pattern: 'rgba(59, 130, 246, 0.8)', // Blue pattern
      background: 'rgba(255, 255, 255, 0.98)' // Very white background
    },
    administrative: {
      primary: 'rgba(255, 255, 255, 0.95)', // White background
      secondary: 'rgba(107, 114, 128, 0.15)', // Gray accent
      accent: 'rgba(59, 130, 246, 0.15)', // Blue accent
      pattern: 'rgba(107, 114, 128, 0.8)', // Gray pattern
      background: 'rgba(255, 255, 255, 0.98)' // Very white background
    }
  };

  // Midnight Gallery - Dark purple and blue tones for sophisticated art gallery
  const midnightGalleryScheme: ColorSchemes = {
    event: {
      primary: 'rgba(75, 0, 130, 0.12)', // Indigo background
      secondary: 'rgba(138, 43, 226, 0.10)', // Blue violet
      accent: 'rgba(72, 61, 139, 0.08)', // Dark slate blue
      pattern: 'rgba(75, 0, 130, 0.8)', // Strong indigo pattern
      background: 'rgba(25, 25, 112, 0.08)' // Midnight blue background
    },
    opportunity: {
      primary: 'rgba(72, 61, 139, 0.12)', // Dark slate blue
      secondary: 'rgba(75, 0, 130, 0.10)', // Indigo
      accent: 'rgba(138, 43, 226, 0.08)', // Blue violet
      pattern: 'rgba(72, 61, 139, 0.8)', // Strong dark slate blue pattern
      background: 'rgba(25, 25, 112, 0.08)' // Midnight blue background
    },
    urgent: {
      primary: 'rgba(138, 43, 226, 0.15)', // Blue violet
      secondary: 'rgba(75, 0, 130, 0.12)', // Indigo
      accent: 'rgba(72, 61, 139, 0.10)', // Dark slate blue
      pattern: 'rgba(138, 43, 226, 0.8)', // Strong blue violet pattern
      background: 'rgba(25, 25, 112, 0.10)' // Midnight blue background
    },
    facility: {
      primary: 'rgba(25, 25, 112, 0.12)', // Midnight blue
      secondary: 'rgba(72, 61, 139, 0.10)', // Dark slate blue
      accent: 'rgba(75, 0, 130, 0.08)', // Indigo
      pattern: 'rgba(25, 25, 112, 0.8)', // Strong midnight blue pattern
      background: 'rgba(25, 25, 112, 0.08)' // Midnight blue background
    },
    administrative: {
      primary: 'rgba(72, 61, 139, 0.10)', // Dark slate blue
      secondary: 'rgba(25, 25, 112, 0.08)', // Midnight blue
      accent: 'rgba(138, 43, 226, 0.06)', // Blue violet
      pattern: 'rgba(72, 61, 139, 0.8)', // Strong dark slate blue pattern
      background: 'rgba(25, 25, 112, 0.06)' // Midnight blue background
    }
  };

  // Sunset Studios - Warm orange and red tones for creative studio
  const sunsetStudiosScheme: ColorSchemes = {
    event: {
      primary: 'rgba(255, 69, 0, 0.12)', // Red orange
      secondary: 'rgba(255, 140, 0, 0.10)', // Dark orange
      accent: 'rgba(255, 165, 0, 0.08)', // Orange
      pattern: 'rgba(255, 69, 0, 0.8)', // Strong red orange pattern
      background: 'rgba(255, 99, 71, 0.08)' // Tomato background
    },
    opportunity: {
      primary: 'rgba(255, 140, 0, 0.12)', // Dark orange
      secondary: 'rgba(255, 69, 0, 0.10)', // Red orange
      accent: 'rgba(255, 165, 0, 0.08)', // Orange
      pattern: 'rgba(255, 140, 0, 0.8)', // Strong dark orange pattern
      background: 'rgba(255, 99, 71, 0.08)' // Tomato background
    },
    urgent: {
      primary: 'rgba(255, 165, 0, 0.15)', // Orange
      secondary: 'rgba(255, 69, 0, 0.12)', // Red orange
      accent: 'rgba(255, 140, 0, 0.10)', // Dark orange
      pattern: 'rgba(255, 165, 0, 0.8)', // Strong orange pattern
      background: 'rgba(255, 99, 71, 0.10)' // Tomato background
    },
    facility: {
      primary: 'rgba(255, 99, 71, 0.12)', // Tomato
      secondary: 'rgba(255, 140, 0, 0.10)', // Dark orange
      accent: 'rgba(255, 69, 0, 0.08)', // Red orange
      pattern: 'rgba(255, 99, 71, 0.8)', // Strong tomato pattern
      background: 'rgba(255, 99, 71, 0.08)' // Tomato background
    },
    administrative: {
      primary: 'rgba(255, 140, 0, 0.10)', // Dark orange
      secondary: 'rgba(255, 99, 71, 0.08)', // Tomato
      accent: 'rgba(255, 165, 0, 0.06)', // Orange
      pattern: 'rgba(255, 140, 0, 0.8)', // Strong dark orange pattern
      background: 'rgba(255, 99, 71, 0.06)' // Tomato background
    }
  };

  // Ocean Workshop - Cool blue and teal tones for marine-inspired art
  const oceanWorkshopScheme: ColorSchemes = {
    event: {
      primary: 'rgba(0, 191, 255, 0.12)', // Deep sky blue
      secondary: 'rgba(0, 206, 209, 0.10)', // Dark turquoise
      accent: 'rgba(64, 224, 208, 0.08)', // Turquoise
      pattern: 'rgba(0, 191, 255, 0.8)', // Strong deep sky blue pattern
      background: 'rgba(0, 128, 128, 0.08)' // Teal background
    },
    opportunity: {
      primary: 'rgba(0, 206, 209, 0.12)', // Dark turquoise
      secondary: 'rgba(0, 191, 255, 0.10)', // Deep sky blue
      accent: 'rgba(64, 224, 208, 0.08)', // Turquoise
      pattern: 'rgba(0, 206, 209, 0.8)', // Strong dark turquoise pattern
      background: 'rgba(0, 128, 128, 0.08)' // Teal background
    },
    urgent: {
      primary: 'rgba(64, 224, 208, 0.15)', // Turquoise
      secondary: 'rgba(0, 191, 255, 0.12)', // Deep sky blue
      accent: 'rgba(0, 206, 209, 0.10)', // Dark turquoise
      pattern: 'rgba(64, 224, 208, 0.8)', // Strong turquoise pattern
      background: 'rgba(0, 128, 128, 0.10)' // Teal background
    },
    facility: {
      primary: 'rgba(0, 128, 128, 0.12)', // Teal
      secondary: 'rgba(0, 206, 209, 0.10)', // Dark turquoise
      accent: 'rgba(0, 191, 255, 0.08)', // Deep sky blue
      pattern: 'rgba(0, 128, 128, 0.8)', // Strong teal pattern
      background: 'rgba(0, 128, 128, 0.08)' // Teal background
    },
    administrative: {
      primary: 'rgba(0, 206, 209, 0.10)', // Dark turquoise
      secondary: 'rgba(0, 128, 128, 0.08)', // Teal
      accent: 'rgba(64, 224, 208, 0.06)', // Turquoise
      pattern: 'rgba(0, 206, 209, 0.8)', // Strong dark turquoise pattern
      background: 'rgba(0, 128, 128, 0.06)' // Teal background
    }
  };

  // Forest Collective - Natural green and earth tones for eco-friendly art
  const forestCollectiveScheme: ColorSchemes = {
    event: {
      primary: 'rgba(34, 139, 34, 0.12)', // Forest green
      secondary: 'rgba(107, 142, 35, 0.10)', // Olive drab
      accent: 'rgba(154, 205, 50, 0.08)', // Yellow green
      pattern: 'rgba(34, 139, 34, 0.8)', // Strong forest green pattern
      background: 'rgba(85, 107, 47, 0.08)' // Dark olive green background
    },
    opportunity: {
      primary: 'rgba(107, 142, 35, 0.12)', // Olive drab
      secondary: 'rgba(34, 139, 34, 0.10)', // Forest green
      accent: 'rgba(154, 205, 50, 0.08)', // Yellow green
      pattern: 'rgba(107, 142, 35, 0.8)', // Strong olive drab pattern
      background: 'rgba(85, 107, 47, 0.08)' // Dark olive green background
    },
    urgent: {
      primary: 'rgba(154, 205, 50, 0.15)', // Yellow green
      secondary: 'rgba(34, 139, 34, 0.12)', // Forest green
      accent: 'rgba(107, 142, 35, 0.10)', // Olive drab
      pattern: 'rgba(154, 205, 50, 0.8)', // Strong yellow green pattern
      background: 'rgba(85, 107, 47, 0.10)' // Dark olive green background
    },
    facility: {
      primary: 'rgba(85, 107, 47, 0.12)', // Dark olive green
      secondary: 'rgba(107, 142, 35, 0.10)', // Olive drab
      accent: 'rgba(34, 139, 34, 0.08)', // Forest green
      pattern: 'rgba(85, 107, 47, 0.8)', // Strong dark olive green pattern
      background: 'rgba(85, 107, 47, 0.08)' // Dark olive green background
    },
    administrative: {
      primary: 'rgba(107, 142, 35, 0.10)', // Olive drab
      secondary: 'rgba(85, 107, 47, 0.08)', // Dark olive green
      accent: 'rgba(154, 205, 50, 0.06)', // Yellow green
      pattern: 'rgba(107, 142, 35, 0.8)', // Strong olive drab pattern
      background: 'rgba(85, 107, 47, 0.06)' // Dark olive green background
    }
  };

  // Get organization-specific color scheme
  const getOrganizationColorScheme = (orgSlug?: string, theme?: any) => {
    if (orgSlug === 'bakehouse') {
      // For Bakehouse, use the custom color schemes with bright primary yellow
      return resolvedTheme === 'dark' ? darkColorSchemes : colorSchemes;
    }
    
    if (orgSlug === 'primary-colors') {
      // For Primary Colors organization, use white backgrounds with primary color patterns
      return primaryColorsScheme;
    }
    
    if (orgSlug === 'midnight-gallery') {
      // For Midnight Gallery, use dark purple and blue tones
      return midnightGalleryScheme;
    }
    
    if (orgSlug === 'sunset-studios') {
      // For Sunset Studios, use warm orange and red tones
      return sunsetStudiosScheme;
    }
    
    if (orgSlug === 'ocean-workshop') {
      // For Ocean Workshop, use cool blue and teal tones
      return oceanWorkshopScheme;
    }
    
    if (orgSlug === 'forest-collective') {
      // For Forest Collective, use natural green and earth tones
      return forestCollectiveScheme;
    }
    
    // For other organizations, return the default schemes
    return resolvedTheme === 'dark' ? darkColorSchemes : colorSchemes;
  };

  // Pick color scheme based on theme and organization
  const scheme = getOrganizationColorScheme(organizationSlug, organizationTheme);

  // Responsive resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    };
    updateSize();
    const observer = new window.ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = size.width;
    canvas.height = size.height;
    // Clear the canvas
    ctx.clearRect(0, 0, size.width, size.height);
    // Define colors based on announcement type
    const colors: PatternColors = {
      primary: scheme[type]?.primary || scheme.administrative.primary,
      secondary: scheme[type]?.secondary || scheme.administrative.secondary,
      accent: scheme[type]?.accent || scheme.administrative.accent,
      pattern: scheme[type]?.pattern || scheme.administrative.pattern,
      background: scheme[type]?.background || scheme[type]?.primary || scheme.administrative.primary,
    };
    // Create pattern with undefined type to get random pattern
    const pattern = PatternFactory.create(undefined, ctx, colors);
    pattern.draw(size.width, size.height);
    setCurrentPattern(PatternFactory.getCurrentPattern());
  }, [type, subType, size, scheme]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <DevComponent patternName={currentPattern}>
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
        />
      </DevComponent>
    </div>
  );
}

// Color helper functions
function getColorForType(type: AnnouncementType): string {
  return colorSchemes[type]?.primary || colorSchemes.administrative.primary;
}

function getSecondaryColorForType(type: AnnouncementType): string {
  return colorSchemes[type]?.secondary || colorSchemes.administrative.secondary;
}

function getAccentColorForType(type: AnnouncementType): string {
  return colorSchemes[type]?.accent || colorSchemes.administrative.accent;
}

function getPatternColorForType(type: AnnouncementType): string {
  return colorSchemes[type]?.pattern || colorSchemes.administrative.pattern;
}

function getBackgroundColorForType(type: AnnouncementType): string {
  // Use primary color with lower opacity for background if not specified
  return colorSchemes[type]?.background || colorSchemes[type]?.primary || colorSchemes.administrative.primary;
} 