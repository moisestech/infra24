'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { MemphisPattern } from '@/components/patterns/MemphisPattern';
import { PatternColors } from '@/components/patterns/types';

function PatternTestPageContent() {
  const [dimensions] = useState({ width: 1200, height: 800 });
  const [cellSize, setCellSize] = useState(120);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  // Move drawPattern to useCallback to avoid recreation
  const drawPattern = useCallback(() => {
    if (!canvasRef) return;
    
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Create and draw Memphis pattern
    const colors: PatternColors = {
      primary: 'rgba(239, 68, 68, 0.9)',
      secondary: 'rgba(234, 179, 8, 0.9)',
      accent: 'rgba(59, 130, 246, 0.9)',
      pattern: 'rgba(0, 0, 0, 0.9)'
    };

    const memphis = new MemphisPattern(ctx, colors);
    memphis.draw(dimensions.width, dimensions.height, cellSize);
  }, [canvasRef, cellSize, dimensions.width, dimensions.height]);

  // Update pattern when dependencies change
  useEffect(() => {
    drawPattern();
  }, [drawPattern]);

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <label className="font-medium">Pattern Size:</label>
          <input 
            type="range" 
            min="60" 
            max="240" 
            value={cellSize} 
            onChange={(e) => setCellSize(Number(e.target.value))}
            className="w-48"
          />
          <span>{cellSize}px</span>
        </div>

        <div className="relative w-full h-[800px] rounded-xl overflow-hidden border border-gray-200">
          <canvas
            ref={setCanvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          />
        </div>
      </div>
    </main>
  );
}

export default function PatternTestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatternTestPageContent />
    </Suspense>
  );
} 