import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function useOnboardingGuard() {
  const { userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isSignedIn) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch('/api/user/onboarding-status');
        if (response.ok) {
          const { hasCompleted } = await response.json();
          setHasCompletedOnboarding(hasCompleted);
          
          if (!hasCompleted) {
            // Redirect to onboarding if not completed
            router.push('/learn?onboarding=required');
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkOnboarding();
  }, [isSignedIn, userId, router]);

  return {
    isChecking,
    hasCompletedOnboarding,
    isSignedIn,
  };
} 