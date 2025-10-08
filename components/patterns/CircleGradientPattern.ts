import { PatternColors, Pattern, PatternConfig } from './types';
import seedrandom from 'seedrandom';

export class CircleGradientPattern implements Pattern {
  private rng: () => number;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private colors: PatternColors,
    seed: string = Math.random().toString(),
    private config: PatternConfig = {}
  ) {
    this.rng = seedrandom(seed);
  }

  draw(width: number, height: number) {
    if (this.colors.background) {
      this.ctx.fillStyle = this.colors.background;
      this.ctx.fillRect(0, 0, width, height);
    }

    const baseRadius = Math.min(width, height) / 12;
    const gridSize = baseRadius * 1.5;
    
    // Create rows and columns of circles
    for (let y = 0; y < height + gridSize; y += gridSize) {
      for (let x = 0; x < width + gridSize; x += gridSize) {
        // Add some randomness to position
        const offsetX = (this.rng() - 0.5) * gridSize * 0.3;
        const offsetY = (this.rng() - 0.5) * gridSize * 0.3;
        
        // Calculate position-based gradient
        const progress = y / height;
        const radius = baseRadius * (0.5 + this.rng() * 0.5);
        
        // Create radial gradient
        const gradient = this.ctx.createRadialGradient(
          x + offsetX, y + offsetY, 0,
          x + offsetX, y + offsetY, radius
        );
        
        // Use progress to transition colors
        const startColor = this.getColorAtProgress(progress);
        const endColor = this.getColorAtProgress(progress + 0.2);
        
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        this.ctx.beginPath();
        this.ctx.fillStyle = gradient;
        this.ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private getColorAtProgress(progress: number): string {
    const colors = [
      this.colors.primary,
      this.colors.secondary,
      this.colors.accent,
      this.colors.pattern
    ];
    
    // Ensure progress is between 0 and 1
    progress = Math.min(Math.max(progress, 0), 1);
    
    // Get two colors to interpolate between
    const index = Math.floor(progress * (colors.length - 1));
    const nextIndex = Math.min(index + 1, colors.length - 1);
    
    // Calculate interpolation factor
    const factor = (progress * (colors.length - 1)) % 1;
    
    return this.interpolateColors(colors[index], colors[nextIndex], factor);
  }

  private interpolateColors(color1: string, color2: string, factor: number): string {
    // Convert colors to RGB
    const c1 = this.getRGBA(color1);
    const c2 = this.getRGBA(color2);
    
    // Interpolate
    return `rgba(${
      Math.round(c1.r + (c2.r - c1.r) * factor)}, ${
      Math.round(c1.g + (c2.g - c1.g) * factor)}, ${
      Math.round(c1.b + (c2.b - c1.b) * factor)}, ${
      c1.a + (c2.a - c1.a) * factor
    })`;
  }

  private getRGBA(color: string): { r: number; g: number; b: number; a: number } {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    const r = data[0];
    const g = data[1];
    const b = data[2];
    const a = data[3];
    return { r, g, b, a: a / 255 };
  }
} 