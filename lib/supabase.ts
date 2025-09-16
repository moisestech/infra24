import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (for API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Export createClient for API routes that need it
export { createClient };

// Client-side Supabase client (for components)
export function createSupabaseClient(token?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    }
  );
}

// Hook for use in components
export function useSupabase() {
  // This will be used in components that need Supabase access
  // The token will be passed from the Clerk session
  return {
    createClient: (token: string) => createSupabaseClient(token),
  };
}
