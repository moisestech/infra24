'use client';

import { useEffect, useRef } from 'react';
import { AnnouncementType, AnnouncementSubType } from '@/types/announcement';
import { PatternFactory, PatternType } from './patterns';
import { PatternColors } from './patterns/types';

interface BackgroundPatternProps {
  type: AnnouncementType;
  subType: AnnouncementSubType;
  width: number;
  height: number;
  patternType?: PatternType;
}

interface ColorScheme extends PatternColors {
  background?: string;
}

interface ColorSchemes {
  [key: string]: ColorScheme;
}

// Move colorSchemes outside component to avoid recreation on each render
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

export function BackgroundPattern({ type, subType, width, height, patternType = 'memphis' }: BackgroundPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = colorSchemes[type];
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.accent);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Create and draw pattern
    const pattern = PatternFactory.create(patternType, ctx, colors);
    pattern.draw(width, height);

  }, [type, subType, width, height, patternType]);

  return (
    <canvas 
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
} 