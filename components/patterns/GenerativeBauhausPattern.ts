import { PatternColors, Pattern } from './types';
import seedrandom from 'seedrandom';

export class GenerativeBauhausPattern implements Pattern {
  private rng: () => number;

  constructor(
    private ctx: CanvasRenderingContext2D, 
    private colors: PatternColors,
    seed: string = Math.random().toString()
  ) {
    this.rng = seedrandom(seed);
  }

  draw(width: number, height: number, detail: number = 3) {
    const cellSize = Math.min(width, height) / detail;
    const shapes = ['circle', 'arc', 'rectangle', 'triangle'];

    for (let x = 0; x < width; x += cellSize) {
      for (let y = 0; y < height; y += cellSize) {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        
        const shape = shapes[Math.floor(this.rng() * shapes.length)];
        const color = this.getRandomColor();
        const rotation = Math.floor(this.rng() * 4) * 90;

        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.translate(-cx, -cy);
        this.ctx.fillStyle = color;

        this.drawShape(shape, cx, cy, cellSize * 0.95);

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

  private drawShape(type: string, x: number, y: number, size: number) {
    switch (type) {
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        break;
      case 'arc':
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI);
        break;
      case 'rectangle':
        this.ctx.beginPath();
        this.ctx.rect(x - size/2, y - size/2, size, size);
        break;
      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(x - size/2, y + size/2);
        this.ctx.lineTo(x, y - size/2);
        this.ctx.lineTo(x + size/2, y + size/2);
        break;
    }
    this.ctx.fill();
  }
} 