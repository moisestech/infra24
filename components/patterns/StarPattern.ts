import { PatternColors } from './types';

export class StarPattern {
  constructor(private ctx: CanvasRenderingContext2D, private colors: PatternColors) {}

  draw(width: number, height: number, starCount: number = 15) {

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 60 + 40; // Increased from (12 + 6) to (60 + 40) for much larger stars
      
      this.ctx.fillStyle = this.colors.pattern;
      this.drawStar(x, y, size);
    }
  }

  private drawStar(x: number, y: number, size: number) {
    const outerRadius = size * 0.95; // Increased from 0.8
    const innerRadius = outerRadius * 0.5;
    const spikes = 5;
    
    this.ctx.beginPath();
    for (let i = 0; i < spikes; i++) {
      const angle = (i * 4 * Math.PI) / spikes - Math.PI / 2;
      const point = i === 0 ? this.ctx.moveTo : this.ctx.lineTo;
      point.call(this.ctx, 
        x + outerRadius * Math.cos(angle),
        y + outerRadius * Math.sin(angle)
      );

      // Add inner points for star shape
      const innerAngle = angle + (2 * Math.PI) / (spikes * 2);
      this.ctx.lineTo(
        x + innerRadius * Math.cos(innerAngle),
        y + innerRadius * Math.sin(innerAngle)
      );
    }
    this.ctx.closePath();
    this.ctx.fill();
  }
} 