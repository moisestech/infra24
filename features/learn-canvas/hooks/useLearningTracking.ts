import { useState } from 'react';

interface LearningActivity {
  activityType: 'concept_viewed' | 'lesson_viewed' | 'quiz_completed' | 'project_passed' | 'program_completed' | 'workshop_liked';
  workshopSlug?: string;
  chapterSlug?: string;
  conceptId?: string;
  quizId?: string;
  projectId?: string;
  programId?: string;
  metadata?: Record<string, any>;
}

interface WorkshopLike {
  workshopSlug: string;
}

export function useLearningTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackActivity = async (activity: LearningActivity) => {
    setIsTracking(true);
    setError(null);

    try {
      const response = await fetch('/api/learning/track-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to track activity');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error tracking learning activity:', err);
    } finally {
      setIsTracking(false);
    }
  };

  const likeWorkshop = async (workshopSlug: string) => {
    setIsTracking(true);
    setError(null);

    try {
      const response = await fetch('/api/learning/workshop-like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workshopSlug }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like workshop');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error liking workshop:', err);
    } finally {
      setIsTracking(false);
    }
  };

  const unlikeWorkshop = async (workshopSlug: string) => {
    setIsTracking(true);
    setError(null);

    try {
      const response = await fetch(`/api/learning/workshop-like?workshopSlug=${workshopSlug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unlike workshop');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error unliking workshop:', err);
    } finally {
      setIsTracking(false);
    }
  };

  // Convenience methods for common activities
  const trackConceptView = (workshopSlug: string, chapterSlug: string, conceptId: string) => {
    return trackActivity({
      activityType: 'concept_viewed',
      workshopSlug,
      chapterSlug,
      conceptId
    });
  };

  const trackLessonView = (workshopSlug: string, chapterSlug: string) => {
    return trackActivity({
      activityType: 'lesson_viewed',
      workshopSlug,
      chapterSlug
    });
  };

  const trackQuizCompletion = (workshopSlug: string, quizId: string, score?: number) => {
    return trackActivity({
      activityType: 'quiz_completed',
      workshopSlug,
      quizId,
      metadata: score ? { score } : undefined
    });
  };

  const trackProjectCompletion = (workshopSlug: string, projectId: string) => {
    return trackActivity({
      activityType: 'project_passed',
      workshopSlug,
      projectId
    });
  };

  const trackProgramCompletion = (programId: string) => {
    return trackActivity({
      activityType: 'program_completed',
      programId
    });
  };

  return {
    trackActivity,
    likeWorkshop,
    unlikeWorkshop,
    trackConceptView,
    trackLessonView,
    trackQuizCompletion,
    trackProjectCompletion,
    trackProgramCompletion,
    isTracking,
    error
  };
} 