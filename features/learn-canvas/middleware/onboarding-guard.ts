import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function checkOnboardingStatus(userId: string): Promise<boolean> {
  try {
    // First, get the user from "User" table by Clerk userId
    const { data: userData } = await supabase
      .from('User')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userData) {
      return false;
    }

    // Check if user has completed onboarding
    const { data: onboardingData } = await supabase
      .from('user_onboarding')
      .select('onboarding_completed')
      .eq('user_id', userData.id)
      .single();

    return onboardingData?.onboarding_completed || false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function redirectToOnboarding(userId: string): Promise<string> {
  // First, get the user from "User" table by Clerk userId
  const { data: userData } = await supabase
    .from('User')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (!userData) {
    return '/learn?onboarding=required';
  }

  // Check if user has any onboarding data
  const { data: responseData } = await supabase
    .from('user_onboarding_responses')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (responseData) {
    // User has submitted onboarding but onboarding record not updated
    await supabase
      .from('user_onboarding')
      .upsert({
        user_id: userData.id,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });
    return '/learn';
  }

  return '/learn?onboarding=required';
} 