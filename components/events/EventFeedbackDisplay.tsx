'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventFeedback {
  id: string;
  event_id: string;
  organization_id: string;
  user_id: string;
  rating: number;
  comments: {
    instructorRating?: number;
    contentRating?: number;
    venueRating?: number;
    wouldRecommend?: string;
    favoriteAspects?: string;
    improvementSuggestions?: string;
    additionalComments?: string;
  };
  created_at: string;
  updated_at: string;
}

interface EventFeedbackDisplayProps {
  eventId: string;
  organizationId: string;
  showTitle?: boolean;
  className?: string;
}

export function EventFeedbackDisplay({ 
  eventId, 
  organizationId, 
  showTitle = true,
  className 
}: EventFeedbackDisplayProps) {
  const [feedback, setFeedback] = useState<EventFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}/feedback`);
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [eventId]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (feedback.length === 0) {
      return {
        averageRating: 0,
        totalResponses: 0,
        recommendationRate: 0,
        averageInstructorRating: 0,
        averageContentRating: 0,
        averageVenueRating: 0
      };
    }

    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRating / feedback.length;

    const recommendations = feedback.filter(f => f.comments.wouldRecommend === 'yes').length;
    const recommendationRate = (recommendations / feedback.length) * 100;

    const instructorRatings = feedback
      .map(f => f.comments.instructorRating)
      .filter(r => r !== null && r !== undefined) as number[];
    const averageInstructorRating = instructorRatings.length > 0 
      ? instructorRatings.reduce((sum, r) => sum + r, 0) / instructorRatings.length 
      : 0;

    const contentRatings = feedback
      .map(f => f.comments.contentRating)
      .filter(r => r !== null && r !== undefined) as number[];
    const averageContentRating = contentRatings.length > 0 
      ? contentRatings.reduce((sum, r) => sum + r, 0) / contentRatings.length 
      : 0;

    const venueRatings = feedback
      .map(f => f.comments.venueRating)
      .filter(r => r !== null && r !== undefined) as number[];
    const averageVenueRating = venueRatings.length > 0 
      ? venueRatings.reduce((sum, r) => sum + r, 0) / venueRatings.length 
      : 0;

    return {
      averageRating,
      totalResponses: feedback.length,
      recommendationRate,
      averageInstructorRating,
      averageContentRating,
      averageVenueRating
    };
  }, [feedback]);

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center">Loading feedback...</div>
        </CardContent>
      </Card>
    );
  }

  if (feedback.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Event Feedback
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No feedback available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Event Feedback
            <Badge variant="secondary" className="ml-2">
              {stats.totalResponses} responses
            </Badge>
          </CardTitle>
          <CardDescription>
            Feedback and ratings from event participants
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent>
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Overall Rating</div>
            {renderStarRating(stats.averageRating)}
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.recommendationRate.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Recommendation Rate</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ThumbsUp className="w-4 h-4 text-green-600" />
              <span className="text-xs">Would recommend</span>
            </div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.averageInstructorRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Instructor Rating</div>
            {renderStarRating(stats.averageInstructorRating)}
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.averageContentRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Content Rating</div>
            {renderStarRating(stats.averageContentRating)}
          </div>
        </div>

        {/* Recent Feedback */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {feedback.slice(0, 5).map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {renderStarRating(item.rating)}
                    <Badge variant="outline" className="text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                  {item.comments.wouldRecommend && (
                    <div className="flex items-center gap-1">
                      {item.comments.wouldRecommend === 'yes' ? (
                        <>
                          <ThumbsUp className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600">Recommended</span>
                        </>
                      ) : (
                        <>
                          <ThumbsDown className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-red-600">Not recommended</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {item.comments.favoriteAspects && (
                  <div className="mb-2">
                    <div className="text-sm font-medium text-gray-700">What they liked:</div>
                    <div className="text-sm text-gray-600">{item.comments.favoriteAspects}</div>
                  </div>
                )}
                
                {item.comments.improvementSuggestions && (
                  <div className="mb-2">
                    <div className="text-sm font-medium text-gray-700">Suggestions:</div>
                    <div className="text-sm text-gray-600">{item.comments.improvementSuggestions}</div>
                  </div>
                )}
                
                {item.comments.additionalComments && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Additional comments:</div>
                    <div className="text-sm text-gray-600">{item.comments.additionalComments}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {feedback.length > 5 && (
            <div className="text-center mt-4">
              <Badge variant="outline">
                +{feedback.length - 5} more responses
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
