/**
 * Admin Access Utilities
 * 
 * Determines if a user should have admin access based on:
 * 1. Their role in the database (super_admin, org_admin, moderator)
 * 2. Their email address (for specific admin emails)
 */

// List of email addresses that should have admin access regardless of role
const ADMIN_EMAILS = [
  'm@moises.tech',
  'digilab@oolitearts.org'
]

/**
 * Check if a user should have admin access
 * @param userRole - The user's role from the database
 * @param userEmail - The user's email address
 * @returns true if user should have admin access
 */
export function hasAdminAccess(userRole: string, userEmail?: string | null): boolean {
  // Check if user has admin role
  if (userRole === 'super_admin' || userRole === 'org_admin' || userRole === 'moderator') {
    return true
  }
  
  // Check if user's email is in the admin emails list
  if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    return true
  }
  
  return false
}

/**
 * Get the effective admin role for display purposes
 * @param userRole - The user's role from the database
 * @param userEmail - The user's email address
 * @returns The effective role ('admin' | 'super_admin' | 'user')
 */
export function getEffectiveAdminRole(userRole: string, userEmail?: string | null): 'user' | 'admin' | 'super_admin' {
  if (userRole === 'super_admin') {
    return 'super_admin'
  }
  
  if (hasAdminAccess(userRole, userEmail)) {
    return 'admin'
  }
  
  return 'user'
}
