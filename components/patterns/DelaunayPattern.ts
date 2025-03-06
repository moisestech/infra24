import { PatternColors, Pattern, PatternConfig } from './types';
import seedrandom from 'seedrandom';

interface Point {
  x: number;
  y: number;
}

interface Triangle {
  points: Point[];
  angle: number;
}

export class DelaunayPattern implements Pattern {
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
    // Generate points
    const points = [
      ...this.generatePoints(width, height),
      ...this.generateBorderPoints(width, height)
    ];

    // Create triangles
    const triangles = this.triangulate(points);

    // Draw background
    this.ctx.fillStyle = this.colors.background || this.colors.primary;
    this.ctx.fillRect(0, 0, width, height);

    // Draw triangles
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.colors.pattern;

    triangles.forEach(triangle => {
      const opacity = (triangle.angle < 0 ? triangle.angle + Math.PI * 2 : triangle.angle) / Math.PI / 2;
      const color = this.getColorWithOpacity(opacity);
      
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(triangle.points[0].x, triangle.points[0].y);
      this.ctx.lineTo(triangle.points[1].x, triangle.points[1].y);
      this.ctx.lineTo(triangle.points[2].x, triangle.points[2].y);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    });
  }

  private generatePoints(width: number, height: number): Point[] {
    const area = width * height;
    const pointArea = this.config.density || 40000;
    const length = Math.floor(area / pointArea);
    
    return Array.from({ length }, () => ({
      x: this.rng() * width,
      y: this.rng() * height
    }));
  }

  private generateBorderPoints(width: number, height: number): Point[] {
    const perimeter = (width + height) * 2;
    const spacing = Math.sqrt(this.config.density || 40000) / 2;
    const count = Math.floor(perimeter / spacing);

    const borderPoints: Point[] = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height }
    ];

    for (let i = 0; i < count; i++) {
      const position = this.rng() * perimeter;
      if (position < width) {
        borderPoints.push({ x: position, y: 0 });
      } else if (position < width + height) {
        borderPoints.push({ x: width, y: position - width });
      } else if (position < width * 2 + height) {
        borderPoints.push({ x: width * 2 + height - position, y: height });
      } else {
        borderPoints.push({ x: 0, y: perimeter - position });
      }
    }

    return borderPoints;
  }

  private triangulate(points: Point[]): Triangle[] {
    // Simplified triangulation for demo
    // In production, use a proper Delaunay library
    const triangles: Triangle[] = [];

    for (let i = 0; i < points.length - 2; i++) {
      const triangle = {
        points: [points[i], points[i + 1], points[i + 2]],
        angle: this.getMedianAngle(
          points[i],
          { x: (points[i + 1].x + points[i + 2].x) / 2, y: (points[i + 1].y + points[i + 2].y) / 2 }
        )
      };
      triangles.push(triangle);
    }

    return triangles;
  }

  private getMedianAngle(point: Point, center: Point): number {
    return Math.atan2(point.y - center.y, point.x - center.x);
  }

  private getColorWithOpacity(opacity: number): string {
    const color = this.colors.pattern;
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }
} 