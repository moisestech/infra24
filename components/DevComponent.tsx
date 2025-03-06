'use client';

interface DevComponentProps {
  children: React.ReactNode;
  patternName?: string;
  debug?: Record<string, unknown>;
}

export function DevComponent({ children, patternName, debug }: DevComponentProps) {
  return (
    <div className="relative">
      {children}
      {process.env.NODE_ENV !== 'production' && (
        <>
          {patternName && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-mono">
              {patternName}
            </div>
          )}
          {debug && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
              {Object.entries(debug).map(([key, value]) => (
                <div key={key}>{`${key}: ${value}`}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 