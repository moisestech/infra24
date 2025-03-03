import { PatternColors } from './types';

export class BauhausPattern {
  constructor(private ctx: CanvasRenderingContext2D, private colors: PatternColors) {}

  draw(width: number, height: number, detail: number = 5) {
    const cellSize = Math.min(width, height) / detail;

    for (let x = 0; x < width; x += cellSize) {
      for (let y = 0; y < height; y += cellSize) {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        
        // Deterministic rotation based on position
        const rotation = ((x + y) / cellSize) % 4 * 90;
        
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.translate(-cx, -cy);

        const shapeIndex = Math.floor((x * y) / (cellSize * cellSize)) % 4;
        this.drawShape(shapeIndex, cx, cy, cellSize * 0.8);

        this.ctx.restore();
      }
    }
  }

  private drawShape(index: number, x: number, y: number, size: number) {
    this.ctx.fillStyle = this.colors.pattern;
    
    switch (index) {
      case 0: // Circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
        break;
      case 1: // Semi-circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI);
        break;
      case 2: // Square
        this.ctx.beginPath();
        this.ctx.rect(x - size/2, y - size/2, size, size);
        break;
      case 3: // Triangle
        this.ctx.beginPath();
        this.ctx.moveTo(x - size/2, y + size/2);
        this.ctx.lineTo(x, y - size/2);
        this.ctx.lineTo(x + size/2, y + size/2);
        break;
    }
    this.ctx.fill();
  }
} 