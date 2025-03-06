import { PatternColors, Pattern, PatternConfig } from './types';
import seedrandom from 'seedrandom';

export class StripesPattern implements Pattern {
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

    const stripeWidth = Math.min(width, height) / 6;
    const colors = [
      this.colors.primary,
      this.colors.secondary,
      this.colors.accent,
      this.colors.pattern
    ];

    // Draw diagonal stripes with gradients
    for (let x = -height; x < width + height; x += stripeWidth) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + height, height);
      this.ctx.lineTo(x + height + stripeWidth, height);
      this.ctx.lineTo(x + stripeWidth, 0);
      this.ctx.closePath();

      // Create gradient for stripe
      const gradient = this.ctx.createLinearGradient(x, 0, x + stripeWidth, height);
      const color1 = colors[Math.floor(this.rng() * colors.length)];
      const color2 = colors[Math.floor(this.rng() * colors.length)];
      
      // Add multiple color stops for more interesting gradients
      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5, this.colors.pattern);
      gradient.addColorStop(1, color2);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.restore();
    }

    // Add a subtle noise texture
    this.addNoiseTexture(width, height);
  }

  private addNoiseTexture(width: number, height: number) {
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (this.rng() - 0.5) * 15;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    
    this.ctx.putImageData(imageData, 0, 0);
  }
} 