import { PatternColors, Pattern, PatternConfig } from './types';
import seedrandom from 'seedrandom';

export class PolkaDotFadePattern implements Pattern {
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
    // Clear background
    if (this.colors.background) {
      this.ctx.fillStyle = this.colors.background;
      this.ctx.fillRect(0, 0, width, height);
    }

    // Configuration
    const spacing = Math.min(width, height) / 15; // Adjust for dot density
    const fadeOffset = 20; // Percentage where fade starts
    const color = this.colors.pattern;

    this.ctx.fillStyle = color;

    for (let y = 0; y < height + spacing; y += spacing) {
      for (let x = 0; x < width + spacing; x += spacing * 2) {
        // Stagger dots in alternating rows
        const staggerX = x + ((Math.floor(y / spacing) % 2 === 1) ? spacing : 0);

        // Calculate dot radius based on horizontal position and fade
        const fadeRelativeX = staggerX - width * fadeOffset / 100;
        const radius = spacing * 0.4 * Math.max(
          Math.min(1 - fadeRelativeX / width, 1), 
          0
        );

        // Add some randomness to radius
        const finalRadius = radius * (0.8 + this.rng() * 0.4);

        // Draw dot
        this.ctx.beginPath();
        this.ctx.arc(staggerX, y, finalRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
} 