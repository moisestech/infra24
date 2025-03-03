import { PatternColors } from './types';

export class GridPattern {
  constructor(private ctx: CanvasRenderingContext2D, private colors: PatternColors) {}

  draw(width: number, height: number, gridSize: number = 90, dotSize: number = 9) {
    this.ctx.strokeStyle = this.colors.pattern;
    this.ctx.lineWidth = 2;

    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        // Grid lines
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();

        // Intersection dots
        this.ctx.fillStyle = this.colors.pattern;
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
} 