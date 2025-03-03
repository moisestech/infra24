import { PatternColors, Pattern } from './types';

export class GeometricPattern implements Pattern {
  constructor(private ctx: CanvasRenderingContext2D, private colors: PatternColors) {}

  draw(width: number, height: number, gridSize: number = 90) {
    const colSize = width / gridSize;
    const rowSize = height / gridSize;
    
    for (let x = 0; x < width; x += colSize) {
      for (let y = 0; y < height; y += rowSize) {
        // Deterministic pattern based on position
        const choice = Math.floor((x + y) / (colSize + rowSize)) % 3;
        
        switch (choice) {
          case 0:
            this.drawRect(x, y, colSize * 0.75, rowSize * 0.75);
            break;
          case 1:
            this.drawLine(x, y, x + colSize, y + rowSize);
            break;
          case 2:
            this.drawCircle(x + colSize/2, y + rowSize/2, Math.min(colSize, rowSize) * 0.3);
            break;
        }
      }
    }
  }

  private drawRect(x: number, y: number, width: number, height: number) {
    this.ctx.fillStyle = this.colors.pattern;
    this.ctx.fillRect(x, y, width, height);
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.strokeStyle = this.colors.pattern;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private drawCircle(x: number, y: number, radius: number) {
    this.ctx.fillStyle = this.colors.pattern;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
} 