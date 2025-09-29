'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import LearnHero from './LearnHero';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { isSignedIn } = useAuth();
  // Only use searchParams on client side to avoid SSR issues
  const searchParams = typeof window !== 'undefined' ? useSearchParams() : null
  const [isChecking, setIsChecking] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      // Always show the workshop grid - no authentication required (BuzzFeed-style)
      // Users can browse freely and will be prompted to sign up for interactive features
      setHasCompletedOnboarding(true);
      setShowOnboarding(false);
      setIsChecking(false);
    };

    checkOnboarding();
  }, [isSignedIn, searchParams]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (showOnboarding) {
    return <LearnHero />;
  }

  return <>{children}</>;
} 