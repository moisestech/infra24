import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (for API routes)
export function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin can only be used on the server side');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

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

// Default client-side Supabase client (for components that don't need auth)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Hook for use in components
export function useSupabase() {
  // This will be used in components that need Supabase access
  // The token will be passed from the Clerk session
  return {
    createClient: (token: string) => createSupabaseClient(token),
  };
}
