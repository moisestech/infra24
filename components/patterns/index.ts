// Central pattern registry and types
export type PatternStyle = 
  | 'geometric'    // Grid-based geometric shapes
  | 'bauhaus'      // Bauhaus-inspired patterns
  | 'memphis'      // Memphis style patterns
  | 'dots'         // Organized dot patterns
  | 'lines'        // Line-based patterns
  | 'waves'        // Organic wave patterns
  | 'noise'        // Perlin noise patterns
  | 'circuit'      // Circuit board patterns
  | 'isometric'    // Isometric grid patterns
  | 'organic';     // Nature-inspired patterns 

import { PatternColors, Pattern } from './types';
import { BauhausPattern } from './BauhausPattern';
import { MemphisPattern } from './MemphisPattern';
import { GeometricPattern } from './GeometricPattern';
import { StripesPattern } from './StripesPattern';
import { GridPattern } from './GridPattern';
import { StarPattern } from './StarPattern';
import { ConfettiPattern } from './ConfettiPattern';
import { DotsPattern } from './DotsPattern';

export type PatternType = 
  | 'bauhaus'
  | 'memphis'
  | 'geometric'
  | 'stripes'
  | 'grid'
  | 'stars'
  | 'confetti'
  | 'dots';

export class PatternFactory {
  static create(type: PatternType, ctx: CanvasRenderingContext2D, colors: PatternColors): Pattern {
    switch (type) {
      case 'bauhaus':
        return new BauhausPattern(ctx, colors);
      case 'memphis':
        return new MemphisPattern(ctx, colors);
      case 'geometric':
        return new GeometricPattern(ctx, colors);
      case 'stripes':
        return new StripesPattern(ctx, colors);
      case 'grid':
        return new GridPattern(ctx, colors);
      case 'stars':
        return new StarPattern(ctx, colors);
      case 'confetti':
        return new ConfettiPattern(ctx, colors);
      case 'dots':
        return new DotsPattern(ctx, colors);
      default:
        return new MemphisPattern(ctx, colors);
    }
  }
} 