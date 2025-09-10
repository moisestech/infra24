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
    primary: 'rgba(168, 85, 247, 0.05)',
    secondary: 'rgba(192, 132, 252, 0.05)',
    accent: 'rgba(233, 213, 255, 0.05)',
    pattern: 'rgba(168, 85, 247, 0.9)'
  },
  administrative: {
    primary: 'rgba(107, 114, 128, 0.05)',
    secondary: 'rgba(156, 163, 175, 0.05)',
    accent: 'rgba(229, 231, 235, 0.05)',
    pattern: 'rgba(107, 114, 128, 0.9)'
  },
  // Bakehouse-specific custom types with bright primary yellow
  attention_artists: {
    primary: 'rgba(30, 64, 175, 0.08)', // Blue
    secondary: 'rgba(59, 130, 246, 0.06)',
    accent: 'rgba(147, 197, 253, 0.04)',
    pattern: 'rgba(30, 64, 175, 0.9)',
    background: 'rgba(251, 191, 36, 0.12)' // Bright primary yellow background
  },
  attention_public: {
    primary: 'rgba(220, 38, 38, 0.08)', // Red
    secondary: 'rgba(239, 68, 68, 0.06)',
    accent: 'rgba(252, 165, 165, 0.04)',
    pattern: 'rgba(220, 38, 38, 0.9)',
    background: 'rgba(251, 191, 36, 0.12)' // Bright primary yellow background
  },
  fun_fact: {
    primary: 'rgba(251, 191, 36, 0.12)', // Bright primary yellow
    secondary: 'rgba(245, 158, 11, 0.10)',
    accent: 'rgba(254, 240, 138, 0.08)',
    pattern: 'rgba(251, 191, 36, 0.9)',
    background: 'rgba(251, 191, 36, 0.15)' // Even brighter yellow background
  },
  promotion: {
    primary: 'rgba(124, 58, 237, 0.08)', // Purple
    secondary: 'rgba(147, 51, 234, 0.06)',
    accent: 'rgba(196, 181, 253, 0.04)',
    pattern: 'rgba(124, 58, 237, 0.9)',
    background: 'rgba(251, 191, 36, 0.12)' // Bright primary yellow background
  },
  gala_announcement: {
    primary: 'rgba(220, 38, 38, 0.08)', // Red
    secondary: 'rgba(239, 68, 68, 0.06)',
    accent: 'rgba(252, 165, 165, 0.04)',
    pattern: 'rgba(220, 38, 38, 0.9)',
    background: 'rgba(251, 191, 36, 0.12)' // Bright primary yellow background
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
    primary: 'rgba(168, 85, 247, 0.15)',
    secondary: 'rgba(192, 132, 252, 0.12)',
    accent: 'rgba(233, 213, 255, 0.10)',
    pattern: 'rgba(168, 85, 247, 0.5)'
  },
  administrative: {
    primary: 'rgba(107, 114, 128, 0.15)',
    secondary: 'rgba(156, 163, 175, 0.12)',
    accent: 'rgba(229, 231, 235, 0.10)',
    pattern: 'rgba(107, 114, 128, 0.5)'
  },
  // Bakehouse-specific custom types with bright primary yellow (dark mode)
  attention_artists: {
    primary: 'rgba(30, 64, 175, 0.20)', // Blue
    secondary: 'rgba(59, 130, 246, 0.18)',
    accent: 'rgba(147, 197, 253, 0.15)',
    pattern: 'rgba(30, 64, 175, 0.7)',
    background: 'rgba(251, 191, 36, 0.25)' // Bright primary yellow background
  },
  attention_public: {
    primary: 'rgba(220, 38, 38, 0.20)', // Red
    secondary: 'rgba(239, 68, 68, 0.18)',
    accent: 'rgba(252, 165, 165, 0.15)',
    pattern: 'rgba(220, 38, 38, 0.7)',
    background: 'rgba(251, 191, 36, 0.25)' // Bright primary yellow background
  },
  fun_fact: {
    primary: 'rgba(251, 191, 36, 0.25)', // Bright primary yellow
    secondary: 'rgba(245, 158, 11, 0.22)',
    accent: 'rgba(254, 240, 138, 0.20)',
    pattern: 'rgba(251, 191, 36, 0.7)',
    background: 'rgba(251, 191, 36, 0.30)' // Even brighter yellow background
  },
  promotion: {
    primary: 'rgba(124, 58, 237, 0.20)', // Purple
    secondary: 'rgba(147, 51, 234, 0.18)',
    accent: 'rgba(196, 181, 253, 0.15)',
    pattern: 'rgba(124, 58, 237, 0.7)',
    background: 'rgba(251, 191, 36, 0.25)' // Bright primary yellow background
  },
  gala_announcement: {
    primary: 'rgba(220, 38, 38, 0.20)', // Red
    secondary: 'rgba(239, 68, 68, 0.18)',
    accent: 'rgba(252, 165, 165, 0.15)',
    pattern: 'rgba(220, 38, 38, 0.7)',
    background: 'rgba(251, 191, 36, 0.25)' // Bright primary yellow background
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