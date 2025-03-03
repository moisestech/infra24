import { PatternColors } from './types';

export class StarPattern {
  constructor(private ctx: CanvasRenderingContext2D, private colors: PatternColors) {}

  draw(width: number, height: number, starCount: number = 50) {
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 12 + 6;
      
      this.ctx.fillStyle = this.colors.pattern;
      this.drawStar(x, y, size);
    }
  }

  private drawStar(x: number, y: number, size: number) {
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const point = i === 0 ? this.ctx.moveTo : this.ctx.lineTo;
      point.call(this.ctx, 
        x + size * Math.cos(angle),
        y + size * Math.sin(angle)
      );
    }
    this.ctx.closePath();
    this.ctx.fill();
  }
} 