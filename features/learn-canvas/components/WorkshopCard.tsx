'use client'

import Link from 'next/link'
import { BookOpen, Clock, Users, Star, GraduationCap, Heart } from 'lucide-react'
import { Workshop } from '@/types/workshop'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// ASCIIAnimation not available
import { useState } from 'react'
import { useLearningTracking } from '../hooks/useLearningTracking'
// useLanguage not available

interface WorkshopCardProps {
  workshop: Workshop;
  user_progress?: any; // UserWorkshopProgress type not available
}

export function WorkshopCard({ workshop, user_progress }: WorkshopCardProps) {
  // Simple fallback for language support
  const t = (key: string) => key;
  
  // Fallback constants for difficulty
  const DIFFICULTY_LABELS = {
    beginner: 'Beginner',
    intermediate: 'Intermediate', 
    advanced: 'Advanced'
  };
  
  const DIFFICULTY_COLORS = {
    beginner: 'text-green-600',
    intermediate: 'text-yellow-600',
    advanced: 'text-red-600'
  };
  const progressPercentage = user_progress?.completion_percentage || 0;
  const isInProgress = user_progress && user_progress.chapters_started > 0;
  const isCompleted = user_progress && user_progress.completion_percentage === 100;
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { likeWorkshop, unlikeWorkshop, isTracking } = useLearningTracking();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      await unlikeWorkshop(workshop.id);
      setIsLiked(false);
    } else {
      await likeWorkshop(workshop.id);
      setIsLiked(true);
    }
  };

  return (
    <Link href={`/learn/${workshop.id}`}>
      <Card 
        className="h-full bg-gray-900/50 border-gray-800 hover:border-lime-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-lime-400/10 group cursor-pointer relative overflow-hidden workshop-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Workshop Image - Top */}
          {workshop.image_url && (
            <div className="relative w-full h-32 overflow-hidden rounded-t-lg flex-shrink-0">
              <img 
                src={workshop.image_url} 
                alt={workshop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Featured and Like buttons overlay */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {workshop.featured && (
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLikeClick}
                  disabled={isTracking}
                  className={`p-1 h-6 w-6 ${
                    isLiked 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 flex flex-col p-4">
            {/* Header with difficulty badge */}
            <div className="flex items-start justify-between mb-2">
              <Badge 
                variant="default" 
                className={`${DIFFICULTY_COLORS[workshop.level]} border-current text-xs`}
              >
                {DIFFICULTY_LABELS[workshop.level]}
              </Badge>
            </div>
            
            {/* Title */}
            <h3 className="text-sm font-bold text-white group-hover:text-lime-400 transition-colors learn-heading mb-1 line-clamp-2">
              {workshop.title}
            </h3>
            
            {/* Subtitle */}
            {workshop.description && (
              <p className="text-gray-400 text-xs mb-2 learn-body line-clamp-1">
                {workshop.description}
              </p>
            )}

            {/* Description */}
            <p className="text-gray-300 text-xs line-clamp-2 learn-body mb-3 flex-1">
              {workshop.description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>{workshop.duration_minutes ? Math.round(workshop.duration_minutes / 60) : 0}h</span>
              </div>
              <div className="flex items-center space-x-1">
                <GraduationCap className="h-3 w-3" />
                <span>0</span>
              </div>
            </div>

            {/* Progress Bar - only show if user has progress */}
            {user_progress && (
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-lime-400 font-medium">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div 
                    className="bg-lime-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="mt-auto">
              {isCompleted ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  ✓ Complete
                </Badge>
              ) : isInProgress ? (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  🔄 In Progress
                </Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                  Start Learning
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 