import { PatternColors, Pattern, PatternConfig } from './types';
import seedrandom from 'seedrandom';

interface Point {
  x: number;
  y: number;
}

interface Cell {
  centroid: Point;
  points: Point[];
  innerCircleRadius: number;
}

export class VoronoiPattern implements Pattern {
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
    const points = this.generatePoints(width, height, this.config.density || 8);
    const cells = this.computeVoronoi(points);
    
    // Fill background
    this.ctx.fillStyle = this.colors.background || this.colors.primary;
    this.ctx.fillRect(0, 0, width, height);

    cells.forEach(cell => {
      const style = Math.floor(this.rng() * 3);
      const color = this.getRandomColor();

      switch (style) {
        case 0: // Circles
          this.drawCircleInCell(cell, color);
          break;
        case 1: // Lines
          this.drawLineInCell(cell, color);
          break;
        case 2: // Arcs
          this.drawArcInCell(cell, color);
          break;
      }
    });
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

  private generatePoints(width: number, height: number, count: number): Point[] {
    return Array.from({ length: count }, () => ({
      x: this.rng() * width,
      y: this.rng() * height
    }));
  }

  private drawCircleInCell(cell: Cell, color: string) {
    const { centroid, innerCircleRadius } = cell;
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(
      centroid.x,
      centroid.y,
      innerCircleRadius * 0.8,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.restore();
  }

  private drawLineInCell(cell: Cell, color: string) {
    const { centroid, innerCircleRadius } = cell;
    const angle = this.rng() * Math.PI * 2;
    
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = innerCircleRadius * 0.4;
    this.ctx.lineCap = 'round';
    
    this.ctx.beginPath();
    this.ctx.moveTo(
      centroid.x + Math.cos(angle) * innerCircleRadius,
      centroid.y + Math.sin(angle) * innerCircleRadius
    );
    this.ctx.lineTo(
      centroid.x - Math.cos(angle) * innerCircleRadius,
      centroid.y - Math.sin(angle) * innerCircleRadius
    );
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawArcInCell(cell: Cell, color: string) {
    const { centroid, innerCircleRadius } = cell;
    const startAngle = this.rng() * Math.PI * 2;
    
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = innerCircleRadius * 0.3;
    this.ctx.beginPath();
    this.ctx.arc(
      centroid.x,
      centroid.y,
      innerCircleRadius * 0.7,
      startAngle,
      startAngle + Math.PI
    );
    this.ctx.stroke();
    this.ctx.restore();
  }

  // Simplified Voronoi computation - you might want to use a library like d3-voronoi for production
  private computeVoronoi(points: Point[]): Cell[] {
    // This is a simplified version - you should implement proper Voronoi tessellation
    return points.map(point => ({
      centroid: point,
      points: this.generateCellPoints(point),
      innerCircleRadius: 90 + this.rng() * 60
    }));
  }

  private generateCellPoints(center: Point): Point[] {
    const points: Point[] = [];
    const sides = 6;
    const radius = 90;

    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      points.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
      });
    }

    return points;
  }
} 