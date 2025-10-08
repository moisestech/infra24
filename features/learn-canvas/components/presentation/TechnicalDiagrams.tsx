'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Diagram {
  id: string
  title: string
  description: string
  image?: string
  type: 'architecture' | 'timeline' | 'comparison' | 'workflow'
  content?: string // For text-based diagrams
}

interface TechnicalDiagramsProps {
  diagrams: Diagram[]
  className?: string
}

export function TechnicalDiagrams({ diagrams, className }: TechnicalDiagramsProps) {
  const [currentDiagram, setCurrentDiagram] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!diagrams || diagrams.length === 0) return null

  const current = diagrams[currentDiagram]

  const nextDiagram = () => {
    setCurrentDiagram((prev) => (prev + 1) % diagrams.length)
  }

  const prevDiagram = () => {
    setCurrentDiagram((prev) => (prev - 1 + diagrams.length) % diagrams.length)
  }

  const getTypeIcon = (type: Diagram['type']) => {
    switch (type) {
      case 'architecture':
        return '🏗️'
      case 'timeline':
        return '⏰'
      case 'comparison':
        return '⚖️'
      case 'workflow':
        return '🔄'
      default:
        return '📊'
    }
  }

  const getTypeColor = (type: Diagram['type']) => {
    switch (type) {
      case 'architecture':
        return 'border-blue-400/30 bg-blue-400/10'
      case 'timeline':
        return 'border-green-400/30 bg-green-400/10'
      case 'comparison':
        return 'border-purple-400/30 bg-purple-400/10'
      case 'workflow':
        return 'border-orange-400/30 bg-orange-400/10'
      default:
        return 'border-gray-400/30 bg-gray-400/10'
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-[#00ff00]">Technical Diagrams</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {currentDiagram + 1} of {diagrams.length}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-gray-400 hover:text-[#00ff00] transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={cn(
        "relative bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden",
        isFullscreen ? "fixed inset-4 z-50 bg-gray-900" : ""
      )}>
        {/* Diagram Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{getTypeIcon(current.type)}</span>
            <div>
              <h5 className="text-xl font-semibold text-white">{current.title}</h5>
              <p className="text-sm text-gray-400 capitalize">{current.type} diagram</p>
            </div>
          </div>

          <div className={cn(
            "border-2 rounded-lg p-6 min-h-[300px] flex items-center justify-center",
            getTypeColor(current.type)
          )}>
            {current.image ? (
              <img
                src={current.image}
                alt={current.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-50">
                  {getTypeIcon(current.type)}
                </div>
                <p className="text-gray-400 text-lg">
                  {current.content || 'Diagram placeholder'}
                </p>
              </div>
            )}
          </div>

          <p className="text-gray-300 mt-4 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Navigation */}
        {diagrams.length > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-700">
            <button
              onClick={prevDiagram}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-2">
              {diagrams.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDiagram(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === currentDiagram
                      ? "bg-[#00ff00]"
                      : "bg-gray-600 hover:bg-gray-500"
                  )}
                />
              ))}
            </div>

            <button
              onClick={nextDiagram}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
