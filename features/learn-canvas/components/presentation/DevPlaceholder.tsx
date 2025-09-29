'use client'

import React from 'react'
import { AlertCircle, Image, Users, Star } from 'lucide-react'

interface KeyFigure {
  name: string
  role: string
  organization?: string
  importance: 'primary' | 'secondary' | 'tertiary'
}

interface DevPlaceholderProps {
  placeholderPrompt: string
  realImageNeeded: string
  keyFigures?: KeyFigure[]
  priority: 'high' | 'medium' | 'low'
  currentImage?: string
  alt?: string
  className?: string
}

export function DevPlaceholder({
  placeholderPrompt,
  realImageNeeded,
  keyFigures = [],
  priority,
  currentImage,
  alt = 'Placeholder',
  className = ''
}: DevPlaceholderProps) {
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return currentImage ? (
      <img src={currentImage} alt={alt} className={className} />
    ) : (
      <div className={`bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <Image className="w-12 h-12 mx-auto mb-2" />
          <p>Image placeholder</p>
        </div>
      </div>
    )
  }

  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50'
  }

  const priorityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  }

  const importanceColors = {
    primary: 'text-red-600 font-semibold',
    secondary: 'text-yellow-600 font-medium',
    tertiary: 'text-green-600'
  }

  return (
    <div className={`border-2 border-dashed rounded-lg p-4 ${priorityColors[priority]} ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        <span className="font-semibold text-gray-800">Development Mode - Asset Requirements</span>
        <span className="text-lg">{priorityIcons[priority]}</span>
      </div>

      <div className="space-y-4">
        {/* Placeholder Prompt */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Image className="w-4 h-4" />
            Placeholder Prompt:
          </h4>
          <p className="text-sm text-gray-700 bg-white p-3 rounded border">
            {placeholderPrompt}
          </p>
        </div>

        {/* Real Image Needed */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Real Image Needed:
          </h4>
          <p className="text-sm text-gray-700 bg-white p-3 rounded border">
            {realImageNeeded}
          </p>
        </div>

        {/* Key Figures */}
        {keyFigures.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Key Figures to Introduce:
            </h4>
            <div className="bg-white p-3 rounded border">
              {keyFigures.map((figure, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <span className={`${importanceColors[figure.importance]}`}>
                    {figure.name}
                  </span>
                  {figure.role && (
                    <span className="text-gray-600 ml-2">- {figure.role}</span>
                  )}
                  {figure.organization && (
                    <span className="text-gray-500 ml-2">({figure.organization})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority Indicator */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-800">Priority:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            priority === 'high' ? 'bg-red-100 text-red-800' :
            priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {priority.toUpperCase()}
          </span>
        </div>

        {/* Current Image Preview */}
        {currentImage && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Current Image:</h4>
            <img 
              src={currentImage} 
              alt={alt} 
              className="w-full h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Predefined asset requirements for easy use
export const AI_VIDEO_ASSETS = {
  // Chapter 1: History
  'title-slide': {
    placeholderPrompt: "Cinematic montage of AI video evolution, deepfake controversy to modern creative tools, dark futuristic aesthetic, neon accents",
    realImageNeeded: "Historical timeline visual showing 2017-2025 progression",
    keyFigures: [],
    priority: 'high' as const
  },
  'journey-begins': {
    placeholderPrompt: "2017 Reddit deepfake controversy, early face-swapping technology, grainy internet aesthetic",
    realImageNeeded: "Screenshot of original Reddit deepfake posts or early deepfake examples",
    keyFigures: [
      { name: "Reddit user 'deepfakes'", role: "Creator of original deepfake technique", importance: 'primary' as const },
      { name: "Ian Goodfellow", role: "Creator of GANs", organization: "Google Brain", importance: 'primary' as const }
    ],
    priority: 'high' as const
  },
  'early-technical': {
    placeholderPrompt: "Technical diagram of early GAN architecture, neural network visualization, scientific aesthetic",
    realImageNeeded: "GAN architecture diagram or early deepfake pipeline visualization",
    keyFigures: [
      { name: "Ian Goodfellow", role: "GAN inventor", organization: "Google Brain", importance: 'primary' as const },
      { name: "Yann LeCun", role: "Deep learning pioneer", organization: "Facebook AI Research", importance: 'secondary' as const }
    ],
    priority: 'high' as const
  },
  'runway-gen2': {
    placeholderPrompt: "Runway ML Gen-2 interface, professional video editing with AI, sleek modern design",
    realImageNeeded: "Runway ML Gen-2 interface screenshot or demo video",
    keyFigures: [
      { name: "Cristóbal Valenzuela", role: "Runway ML co-founder and CEO", importance: 'primary' as const },
      { name: "Anastasis Germanidis", role: "Runway ML co-founder and CTO", importance: 'secondary' as const }
    ],
    priority: 'high' as const
  },
  'nvidia-ace': {
    placeholderPrompt: "NVIDIA ACE interface, character animation, facial motion capture",
    realImageNeeded: "NVIDIA ACE interface or character animation examples",
    keyFigures: [
      { name: "Jensen Huang", role: "NVIDIA CEO", importance: 'primary' as const },
      { name: "Ilya Sutskever", role: "OpenAI co-founder", importance: 'secondary' as const }
    ],
    priority: 'high' as const
  },
  'leo-castaneda': {
    placeholderPrompt: "Leo Castaneda's conceptual game art, AI video for game development, creative exploration",
    realImageNeeded: "Leo Castaneda's AI video game concept examples",
    keyFigures: [
      { name: "Leo Castaneda", role: "Game concept artist, AI video pioneer", importance: 'primary' as const }
    ],
    priority: 'high' as const
  }
}

// Helper function to get asset requirements
export function getAssetRequirements(assetKey: keyof typeof AI_VIDEO_ASSETS) {
  return AI_VIDEO_ASSETS[assetKey]
}
