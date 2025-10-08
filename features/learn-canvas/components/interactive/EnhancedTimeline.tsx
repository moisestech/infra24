'use client'

import { useState, useMemo } from 'react'
import { Calendar, Clock, Search, Filter, ExternalLink, Play, Image as ImageIcon, FileText, Github, Video } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TimelineSource {
  title: string
  url: string
  type: 'paper' | 'article' | 'video' | 'demo' | 'github'
  credibility: 'high' | 'medium' | 'low'
}

interface EnhancedTimelineEvent {
  id: string
  year: string
  month?: string
  day?: string
  title: string
  description: string
  longDescription?: string
  category: 'milestone' | 'breakthrough' | 'release' | 'research' | 'controversy' | 'adoption'
  importance: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  sources?: TimelineSource[]
  media?: {
    image?: string
    video?: string
    audio?: string
    gif?: string
  }
  impact?: {
    technical: number // 1-10
    social: number // 1-10
    commercial: number // 1-10
  }
  relatedEvents?: string[]
  location?: string
  organization?: string
  keyPeople?: Array<{
    name: string
    role: string
    organization: string
  }>
}

interface EnhancedTimelineProps {
  events: EnhancedTimelineEvent[]
  title?: string
  className?: string
  showFilters?: boolean
  showSearch?: boolean
  showImpact?: boolean
  showSources?: boolean
  showMedia?: boolean
}

const categoryConfig = {
  milestone: {
    color: 'bg-lime-500',
    borderColor: 'border-lime-500',
    textColor: 'text-lime-400',
    icon: '🎯'
  },
  breakthrough: {
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    icon: '💡'
  },
  release: {
    color: 'bg-purple-500',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    icon: '🚀'
  },
  research: {
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-400',
    icon: '🔬'
  },
  controversy: {
    color: 'bg-red-500',
    borderColor: 'border-red-500',
    textColor: 'text-red-400',
    icon: '⚠️'
  },
  adoption: {
    color: 'bg-green-500',
    borderColor: 'border-green-500',
    textColor: 'text-green-400',
    icon: '📈'
  }
}

const importanceConfig = {
  low: { size: 'w-8 h-8', opacity: 'opacity-60' },
  medium: { size: 'w-10 h-10', opacity: 'opacity-80' },
  high: { size: 'w-12 h-12', opacity: 'opacity-100' },
  critical: { size: 'w-14 h-14', opacity: 'opacity-100' }
}

const sourceTypeIcons = {
  paper: FileText,
  article: FileText,
  video: Video,
  demo: Play,
  github: Github
}

export function EnhancedTimeline({ 
  events, 
  title = "AI Development Timeline", 
  className,
  showFilters = true,
  showSearch = true,
  showImpact = true,
  showSources = true,
  showMedia = true
}: EnhancedTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedImportance, setSelectedImportance] = useState<string>('all')
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      const matchesImportance = selectedImportance === 'all' || event.importance === selectedImportance
      
      return matchesSearch && matchesCategory && matchesImportance
    })
  }, [events, searchTerm, selectedCategory, selectedImportance])

  const categories = Array.from(new Set(events.map(e => e.category)))
  const importanceLevels = Array.from(new Set(events.map(e => e.importance)))

  if (events.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("space-y-6", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-lime-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Badge variant="default" className="text-xs">
            {filteredEvents.length} events
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      {(showFilters || showSearch) && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {showSearch && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search events, tags, or descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              )}
              
              {showFilters && (
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {categoryConfig[category]?.icon} {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedImportance} onValueChange={setSelectedImportance}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Importance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {importanceLevels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/20" />
        
        <div className="space-y-8">
          <AnimatePresence>
            {filteredEvents.map((event, index) => {
              const config = categoryConfig[event.category]
              const importanceStyle = importanceConfig[event.importance]
              const isExpanded = expandedEvent === event.id
              
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex items-start gap-6"
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={cn(
                      "rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110",
                      config.borderColor,
                      config.color,
                      importanceStyle.size,
                      importanceStyle.opacity
                    )}>
                      <span className="text-white text-sm font-bold">
                        {config.icon}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Card className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-white text-lg mb-2">{event.title}</CardTitle>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default" className={cn("text-xs", config.textColor, config.borderColor)}>
                                {event.year}
                              </Badge>
                              <Badge variant="default" className="text-xs">
                                {event.importance}
                              </Badge>
                              {event.tags.map(tag => (
                                <Badge key={tag} variant="default" className="text-xs text-gray-400">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-300 leading-relaxed mb-4">
                          {event.description}
                        </p>

                        {/* Impact Visualization */}
                        {showImpact && event.impact && (
                          <div className="mb-4">
                            <h5 className="text-xs font-semibold text-gray-400 mb-2">Impact Scores</h5>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="text-blue-400 font-semibold">Technical</div>
                                <div className="text-white">{event.impact.technical}/10</div>
                              </div>
                              <div className="text-center">
                                <div className="text-green-400 font-semibold">Social</div>
                                <div className="text-white">{event.impact.social}/10</div>
                              </div>
                              <div className="text-center">
                                <div className="text-purple-400 font-semibold">Commercial</div>
                                <div className="text-white">{event.impact.commercial}/10</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Media Preview */}
                        {showMedia && event.media && (
                          <div className="mb-4">
                            <div className="flex gap-2">
                              {event.media.image && (
                                <Button size="sm" variant="default" className="text-xs">
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  Image
                                </Button>
                              )}
                              {event.media.video && (
                                <Button size="sm" variant="default" className="text-xs">
                                  <Video className="w-3 h-3 mr-1" />
                                  Video
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Sources */}
                        {showSources && event.sources && event.sources.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-xs font-semibold text-gray-400 mb-2">Sources</h5>
                            <div className="flex flex-wrap gap-1">
                              {event.sources.map((source, idx) => {
                                const IconComponent = sourceTypeIcons[source.type]
                                return (
                                  <Button
                                    key={idx}
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs h-6 px-2"
                                    onClick={() => window.open(source.url, '_blank')}
                                  >
                                    <IconComponent className="w-3 h-3 mr-1" />
                                    {source.title}
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </Button>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Expand/Collapse */}
                        {event.longDescription && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                            className="text-xs"
                          >
                            {isExpanded ? 'Show Less' : 'Show More'}
                          </Button>
                        )}

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && event.longDescription && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-white/10"
                            >
                              <p className="text-sm text-gray-300 leading-relaxed">
                                {event.longDescription}
                              </p>
                              
                              {event.keyPeople && event.keyPeople.length > 0 && (
                                <div className="mt-4">
                                  <h6 className="text-xs font-semibold text-gray-400 mb-2">Key People</h6>
                                  <div className="space-y-1">
                                    {event.keyPeople.map((person, idx) => (
                                      <div key={idx} className="text-xs text-gray-300">
                                        <span className="font-medium">{person.name}</span> - {person.role} at {person.organization}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
