import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface OnboardingData {
  selectedInterests: string[];
  sessionId?: string;
  referrer?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

export function useOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  const submitOnboarding = async (data: OnboardingData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get session ID
      const sessionId = sessionStorage.getItem('sessionId') || 
                       `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);

      // Get UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {
        source: urlParams.get('utm_source') || undefined,
        medium: urlParams.get('utm_medium') || undefined,
        campaign: urlParams.get('utm_campaign') || undefined,
      };

      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId,
          sessionId,
          referrer: document.referrer,
          utmParams,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit onboarding data');
      }

      const result = await response.json();
      
      // Store recommendations in session storage for later use
      sessionStorage.setItem('userRecommendations', JSON.stringify(result.recommendations));
      
      return result;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOnboarding,
    isSubmitting,
    error,
  };
} 