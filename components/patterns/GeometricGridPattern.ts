import { PatternColors, Pattern, PatternConfig } from './types';
import seedrandom from 'seedrandom';

export class GeometricGridPattern implements Pattern {
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
    const detail = 2; // Like Bauhaus's small detail number
    const cellSize = Math.min(width, height) / detail;

    // Optional background
    if (this.colors.background) {
      this.ctx.fillStyle = this.colors.background;
      this.ctx.fillRect(0, 0, width, height);
    }

    for (let x = 0; x < width; x += cellSize) {
      for (let y = 0; y < height; y += cellSize) {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        
        const choice = Math.floor(this.rng() * 6) + 1;
        const color = this.getRandomColor();
        const rotation = Math.floor(this.rng() * 4) * 90;

        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.translate(-cx, -cy);

        const size = cellSize * 0.95;
        switch (choice) {
          case 1:
            this.drawRect(cx, cy, size, color); // 5 params including 2 sizes
            break;
          case 2:
            this.drawLine(cx, cy, size, color);
            break;
          case 3:
            this.drawCircle(cx, cy, size/2, color);
            break;
          case 4:
            this.drawArc(cx, cy, size/2, color);
            break;
          case 5:
            this.drawTriangle(cx, cy, size, color);
            break;
          case 6:
            this.drawCross(cx, cy, size, color);
            break;
        }

        this.ctx.restore();
      }
    }
  }

  private getRandomColor(): string {
    const colors = [
      this.colors.primary,
      this.colors.secondary,
      this.colors.accent,
      this.colors.pattern
    ];
    return colors[Math.floor(this.rng() * colors.length)];
  }

  private drawRect(cx: number, cy: number, size: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      cx - size/2,
      cy - size/2,
      size,
      size
    );
  }

  private drawLine(cx: number, cy: number, size: number, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size * 0.5; // Increased from 0.4
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - size/2, cy);
    this.ctx.lineTo(cx + size/2, cy);
    this.ctx.stroke();
  }

  private drawCircle(cx: number, cy: number, radius: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawArc(cx: number, cy: number, size: number, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size * 0.5; // Increased from 0.4
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, size/2, 0, Math.PI);
    this.ctx.stroke();
  }

  private drawTriangle(cx: number, cy: number, size: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(cx - size/2, cy + size/2);
    this.ctx.lineTo(cx, cy - size/2);
    this.ctx.lineTo(cx + size/2, cy + size/2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawCross(cx: number, cy: number, size: number, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size * 0.4; // Increased from 0.3
    this.ctx.lineCap = 'round';
    
    const padding = size * 0.1; // Reduced from 0.15 for larger cross
    
    this.ctx.beginPath();
    // Horizontal line
    this.ctx.moveTo(cx - padding, cy);
    this.ctx.lineTo(cx + padding, cy);
    // Vertical line
    this.ctx.moveTo(cx, cy - padding);
    this.ctx.lineTo(cx, cy + padding);
    this.ctx.stroke();
  }
} 