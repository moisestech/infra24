import { useState, useEffect } from 'react';

interface LearningStats {
  concepts_viewed: number;
  lessons_viewed: number;
  quizzes_completed: number;
  projects_passed: number;
  programs_completed: number;
  workshops_liked: number;
  total_workshops_enrolled: number;
  total_workshops_completed: number;
  average_completion_percentage: number;
}

interface WorkshopProgress {
  workshop_slug: string;
  chapters_started: number;
  chapters_completed: number;
  total_chapters: number;
  completion_percentage: number;
  last_accessed_at: string;
}

interface LikedWorkshop {
  workshop_slug: string;
  created_at: string;
}

interface LearningStatsData {
  stats: LearningStats;
  recentProgress: WorkshopProgress[];
  likedWorkshops: LikedWorkshop[];
}

export function useLearningStats() {
  const [data, setData] = useState<LearningStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/learning/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch learning statistics');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load learning statistics');
      console.error('Error fetching learning stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refresh = () => {
    fetchStats();
  };

  return {
    data,
    loading,
    error,
    refresh
  };
} 