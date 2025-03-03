import { PatternColors } from './types';

export class ConfettiPattern {
  constructor(private ctx: CanvasRenderingContext2D, private colors: PatternColors) {}

  draw(width: number, height: number, particleCount: number = 100) {
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 18 + 6;

      this.ctx.fillStyle = this.colors.pattern;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
} 