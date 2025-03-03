import { PatternColors } from './types';

export class MemphisPattern {
  constructor(private ctx: CanvasRenderingContext2D, private colors: PatternColors) {}

  draw(width: number, height: number, cellSize: number = 120) {
    // Make the pattern repeat
    for (let x = 0; x < width; x += cellSize * 2) {
      for (let y = 0; y < height; y += cellSize * 2) {
        // Draw the 2x2 pattern unit
        this.drawPatternUnit(x, y, cellSize);
      }
    }
  }

  private drawPatternUnit(x: number, y: number, size: number) {
    // Circle (top left)
    this.ctx.fillStyle = this.colors.primary;
    this.ctx.beginPath();
    this.ctx.arc(x + size/2, y + size/2, size/3, 0, Math.PI * 2);
    this.ctx.fill();

    // Diamond Square (top right)
    this.ctx.fillStyle = this.colors.pattern;
    this.ctx.save();
    this.ctx.translate(x + size * 1.5, y + size/2);
    this.ctx.rotate(Math.PI / 4); // 45 degrees
    this.ctx.fillRect(-size/3, -size/3, size/1.5, size/1.5);
    this.ctx.restore();

    // Triangle (bottom left)
    this.ctx.fillStyle = this.colors.secondary;
    this.ctx.beginPath();
    this.ctx.moveTo(x + size/2, y + size);
    this.ctx.lineTo(x + size/6, y + size * 1.5);
    this.ctx.lineTo(x + size * 0.84, y + size * 1.5);
    this.ctx.closePath();
    this.ctx.fill();

    // Square (bottom right)
    this.ctx.fillStyle = this.colors.accent;
    this.ctx.fillRect(
      x + size * 1.25,
      y + size * 1.25,
      size/2,
      size/2
    );
  }
} 