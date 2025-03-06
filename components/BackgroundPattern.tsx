'use client';

import { useEffect, useRef, useState } from 'react';
import { AnnouncementType, AnnouncementSubType } from '@/types/announcement';
import { PatternFactory, PatternType } from './patterns';
import { PatternColors } from './patterns/types';
import { DevComponent } from './DevComponent';

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

export function BackgroundPattern({ type, subType, width, height }: BackgroundPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPattern, setCurrentPattern] = useState<PatternType>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Define colors based on announcement type
    const colors: PatternColors = {
      primary: getColorForType(type),
      secondary: getSecondaryColorForType(type),
      accent: getAccentColorForType(type),
      pattern: getPatternColorForType(type),
      background: getBackgroundColorForType(type),
    };

    // Create pattern with undefined type to get random pattern
    const pattern = PatternFactory.create(undefined, ctx, colors);
    pattern.draw(width, height);
    
    // Store the pattern type for dev display
    setCurrentPattern(PatternFactory.getCurrentPattern());

  }, [type, subType, width, height]);

  return (
    <DevComponent patternName={currentPattern}>
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
    </DevComponent>
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