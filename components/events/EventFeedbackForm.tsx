'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Send,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventFeedbackFormProps {
  eventId: string;
  organizationId: string;
  onFeedbackSubmitted?: (feedback: any) => void;
  className?: string;
}

export function EventFeedbackForm({ 
  eventId, 
  organizationId, 
  onFeedbackSubmitted,
  className 
}: EventFeedbackFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({
    overallRating: '',
    instructorRating: '',
    contentRating: '',
    venueRating: '',
    wouldRecommend: '',
    favoriteAspects: '',
    improvementSuggestions: '',
    additionalComments: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.overallRating) {
      alert('Please provide an overall rating');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/events/${eventId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId,
          rating: parseInt(feedback.overallRating),
          comments: {
            instructorRating: feedback.instructorRating ? parseInt(feedback.instructorRating) : null,
            contentRating: feedback.contentRating ? parseInt(feedback.contentRating) : null,
            venueRating: feedback.venueRating ? parseInt(feedback.venueRating) : null,
            wouldRecommend: feedback.wouldRecommend,
            favoriteAspects: feedback.favoriteAspects,
            improvementSuggestions: feedback.improvementSuggestions,
            additionalComments: feedback.additionalComments
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitted(true);
        onFeedbackSubmitted?.(data.data);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Event Feedback
        </CardTitle>
        <CardDescription>
          Help us improve by sharing your experience
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div>
            <Label className="text-base font-medium">
              Overall Rating <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={feedback.overallRating}
              onValueChange={(value) => handleInputChange('overallRating', value)}
              className="flex gap-4 mt-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`overall-${rating}`} />
                  <Label htmlFor={`overall-${rating}`} className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {rating}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Instructor Rating */}
          <div>
            <Label className="text-base font-medium">Instructor Rating</Label>
            <RadioGroup
              value={feedback.instructorRating}
              onValueChange={(value) => handleInputChange('instructorRating', value)}
              className="flex gap-4 mt-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`instructor-${rating}`} />
                  <Label htmlFor={`instructor-${rating}`} className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {rating}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Content Rating */}
          <div>
            <Label className="text-base font-medium">Content Quality</Label>
            <RadioGroup
              value={feedback.contentRating}
              onValueChange={(value) => handleInputChange('contentRating', value)}
              className="flex gap-4 mt-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`content-${rating}`} />
                  <Label htmlFor={`content-${rating}`} className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {rating}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Venue Rating */}
          <div>
            <Label className="text-base font-medium">Venue/Facilities</Label>
            <RadioGroup
              value={feedback.venueRating}
              onValueChange={(value) => handleInputChange('venueRating', value)}
              className="flex gap-4 mt-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`venue-${rating}`} />
                  <Label htmlFor={`venue-${rating}`} className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {rating}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Would Recommend */}
          <div>
            <Label className="text-base font-medium">Would you recommend this event to others?</Label>
            <RadioGroup
              value={feedback.wouldRecommend}
              onValueChange={(value) => handleInputChange('wouldRecommend', value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="recommend-yes" />
                <Label htmlFor="recommend-yes" className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="recommend-no" />
                <Label htmlFor="recommend-no" className="flex items-center gap-1">
                  <ThumbsDown className="w-4 h-4" />
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Favorite Aspects */}
          <div>
            <Label htmlFor="favoriteAspects" className="text-base font-medium">
              What did you like most about this event?
            </Label>
            <Textarea
              id="favoriteAspects"
              value={feedback.favoriteAspects}
              onChange={(e) => handleInputChange('favoriteAspects', e.target.value)}
              placeholder="Share what you enjoyed most..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Improvement Suggestions */}
          <div>
            <Label htmlFor="improvementSuggestions" className="text-base font-medium">
              How could we improve this event?
            </Label>
            <Textarea
              id="improvementSuggestions"
              value={feedback.improvementSuggestions}
              onChange={(e) => handleInputChange('improvementSuggestions', e.target.value)}
              placeholder="Share your suggestions for improvement..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Additional Comments */}
          <div>
            <Label htmlFor="additionalComments" className="text-base font-medium">
              Additional Comments
            </Label>
            <Textarea
              id="additionalComments"
              value={feedback.additionalComments}
              onChange={(e) => handleInputChange('additionalComments', e.target.value)}
              placeholder="Any other thoughts or feedback..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={submitting || !feedback.overallRating}
              className="min-w-32"
            >
              {submitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
