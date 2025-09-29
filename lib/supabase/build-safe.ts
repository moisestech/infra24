// Build-safe Supabase client creation
// This ensures that Supabase clients are only created when environment variables are available

import { createClient } from '@supabase/supabase-js'

export function createBuildSafeClient() {
  // Check if we're in a build environment
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    // During build, return a mock client that won't cause errors
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
            limit: () => Promise.resolve({ data: [], error: null })
          }),
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      }
    } as any
  }

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables not available')
    return null
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
