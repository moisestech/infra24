export interface PatternColors {
  primary: string;
  secondary: string;
  accent: string;
  pattern: string;
}

export interface Pattern {
  draw(width: number, height: number, size?: number): void;
} 