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
import { MemphisPattern } from './MemphisPattern';
import { StripesPattern } from './StripesPattern';
import { GridPattern } from './GridPattern';
import { StarPattern } from './StarPattern';
import { ConfettiPattern } from './ConfettiPattern';
import { GenerativeBauhausPattern } from './GenerativeBauhausPattern';
import { VoronoiPattern } from './VoronoiPattern';
import { PolkaDotFadePattern } from './PolkaDotFadePattern';
import { CircleGradientPattern } from './CircleGradientPattern';

export type PatternType = 
  | 'bauhaus'
  | 'memphis'
  | 'stripes'
  | 'circles'
  | 'grid'
  | 'stars'
  | 'confetti'
  | 'voronoi'
  | 'polkadot';

const PatternClasses = {
  bauhaus: GenerativeBauhausPattern,
  memphis: MemphisPattern,
  stripes: StripesPattern,
  circles: CircleGradientPattern,
  grid: GridPattern,
  stars: StarPattern,
  confetti: ConfettiPattern,
  voronoi: VoronoiPattern,
  polkadot: PolkaDotFadePattern
} as const;

export class PatternFactory {
  private static lastPattern: PatternType | null = null;
  private static usedPatterns: Set<PatternType> = new Set();
  private static currentPattern: PatternType | null = null;

  static getCurrentPattern(): PatternType | undefined {
    return this.currentPattern || undefined;
  }

  static create(type: PatternType | undefined, ctx: CanvasRenderingContext2D, colors: PatternColors): Pattern {
    const patterns = [
      'bauhaus',
      'memphis',
      'stripes',
      'circles',
      'grid',
      'stars',
      'confetti',
      'voronoi',
      'polkadot'
    ] as const;

    // Reset used patterns if all have been used
    if (this.usedPatterns.size >= patterns.length) {
      this.usedPatterns.clear();
    }

    // Select random pattern that hasn't been used recently
    let selectedPattern = type;
    if (!selectedPattern) {
      do {
        selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
      } while (this.usedPatterns.has(selectedPattern));
    }

    // Add to used patterns
    this.usedPatterns.add(selectedPattern);
    this.lastPattern = selectedPattern;

    const seed = `${selectedPattern}-${Date.now()}-${Math.random()}`;
    const config = {
      seed,
      detail: Math.floor(Math.random() * 4) + 4,
      density: Math.floor(Math.random() * 24) + 12,
      scale: Math.random() * 0.5 + 0.5
    };

    this.currentPattern = selectedPattern;
    return new PatternClasses[selectedPattern](ctx, colors, seed, config);
  }
} 