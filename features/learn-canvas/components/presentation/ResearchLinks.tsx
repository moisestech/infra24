'use client'

import { ExternalLink, FileText, Video, Code, Globe, Github } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ResearchLink {
  title: string
  url: string
  type: 'paper' | 'article' | 'video' | 'demo' | 'github'
}

interface ResearchLinksProps {
  links: ResearchLink[]
  className?: string
}

const getIconForType = (type: ResearchLink['type']) => {
  switch (type) {
    case 'paper':
      return <FileText className="w-4 h-4" />
    case 'article':
      return <Globe className="w-4 h-4" />
    case 'video':
      return <Video className="w-4 h-4" />
    case 'demo':
      return <ExternalLink className="w-4 h-4" />
    case 'github':
      return <Github className="w-4 h-4" />
    default:
      return <ExternalLink className="w-4 h-4" />
  }
}

const getTypeColor = (type: ResearchLink['type']) => {
  switch (type) {
    case 'paper':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    case 'article':
      return 'text-green-400 bg-green-400/10 border-green-400/20'
    case 'video':
      return 'text-red-400 bg-red-400/10 border-red-400/20'
    case 'demo':
      return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    case 'github':
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }
}

export function ResearchLinks({ links, className }: ResearchLinksProps) {
  if (!links || links.length === 0) return null

  return (
    <div className={cn("space-y-3", className)}>
      <h4 className="text-sm font-semibold text-[#00ff00] mb-3">Research & Resources</h4>
      <div className="grid grid-cols-1 gap-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:scale-105",
              "bg-gray-900/50 backdrop-blur-sm",
              getTypeColor(link.type)
            )}
          >
            {getIconForType(link.type)}
            <span className="text-sm font-medium flex-1 truncate">{link.title}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        ))}
      </div>
    </div>
  )
}
