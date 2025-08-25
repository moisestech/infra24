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
  }
};

// Responsive BackgroundPattern
export function BackgroundPattern({ type, subType }: { type: AnnouncementType; subType: AnnouncementSubType }) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPattern, setCurrentPattern] = useState<PatternType>();
  const [size, setSize] = useState({ width: 400, height: 400 });

  // Pick color scheme based on theme
  const scheme = resolvedTheme === 'dark' ? darkColorSchemes : colorSchemes;

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