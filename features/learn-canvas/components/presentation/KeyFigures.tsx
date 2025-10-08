'use client'

import { cn } from '@/lib/utils'

interface KeyFigure {
  name: string
  role: string
  contribution: string
  avatar?: string
  organization?: string
  year?: string
}

interface KeyFiguresProps {
  figures: KeyFigure[]
  className?: string
}

export function KeyFigures({ figures, className }: KeyFiguresProps) {
  if (!figures || figures.length === 0) return null

  return (
    <div className={cn("space-y-6", className)}>
      <h4 className="text-lg font-semibold text-[#00ff00] mb-4">Key Figures in AI Video</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {figures.map((figure, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg"
          >
            {/* Avatar placeholder */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#00ff00]/20 to-[#00ff00]/5 border border-[#00ff00]/30 rounded-full flex items-center justify-center flex-shrink-0">
              {figure.avatar ? (
                <img
                  src={figure.avatar}
                  alt={figure.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="text-2xl">👤</div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-semibold text-white truncate">{figure.name}</h5>
                {figure.year && (
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                    {figure.year}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#00ff00] mb-2">{figure.role}</p>
              {figure.organization && (
                <p className="text-xs text-gray-400 mb-2">{figure.organization}</p>
              )}
              <p className="text-sm text-gray-300 leading-relaxed">{figure.contribution}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
