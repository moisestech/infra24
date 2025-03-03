import { PatternColors } from './types';

export class StripesPattern {
  constructor(private ctx: CanvasRenderingContext2D, private colors: PatternColors) {}

  draw(width: number, height: number, stripeWidth: number = 90) {
    this.ctx.fillStyle = this.colors.pattern;
    
    // Draw diagonal stripes
    for (let x = -height; x < width + height; x += stripeWidth * 2) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + height, height);
      this.ctx.lineTo(x + height + stripeWidth, height);
      this.ctx.lineTo(x + stripeWidth, 0);
      this.ctx.fill();
    }

    // Add some accent stripes
    this.ctx.fillStyle = this.colors.accent;
    for (let x = -height; x < width + height; x += stripeWidth * 6) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + height, height);
      this.ctx.lineTo(x + height + stripeWidth/2, height);
      this.ctx.lineTo(x + stripeWidth/2, 0);
      this.ctx.fill();
    }

    // Add thin secondary stripes
    this.ctx.fillStyle = this.colors.secondary;
    for (let x = -height; x < width + height; x += stripeWidth * 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + height, height);
      this.ctx.lineTo(x + height + stripeWidth/4, height);
      this.ctx.lineTo(x + stripeWidth/4, 0);
      this.ctx.fill();
    }
  }
} 