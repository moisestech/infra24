export interface PatternColors {
  primary: string;
  secondary: string;
  accent: string;
  pattern: string;
  background?: string;
}

export interface Pattern {
  draw(width: number, height: number, size?: number): void;
}

export interface PatternConfig {
  seed?: string;
  detail?: number;
  density?: number;
  scale?: number;
} 