import { useUser } from '@clerk/nextjs';

export class ClerkClientService {
  // Client-side methods that can be used in components
  static async getUserSession() {
    // This will be called from client components
    // The actual data fetching should be done via API routes
    return null;
  }

  // Get permissions for role (static method that can be used anywhere)
  static getPermissionsForRole(role: string): string[] {
    switch (role) {
      case 'super_admin':
        return [
          'manage_all_organizations',
          'manage_announcements',
          'manage_artists',
          'approve_claims',
          'view_analytics',
          'manage_members',
          'manage_system'
        ];
      case 'org_admin':
        return [
          'manage_announcements',
          'manage_artists',
          'approve_claims',
          'view_analytics',
          'manage_members'
        ];
      case 'moderator':
        return [
          'approve_claims',
          'view_analytics',
          'moderate_content'
        ];
      case 'resident':
        return [
          'create_announcements',
          'view_artists',
          'claim_profile',
          'edit_own_profile'
        ];
      case 'guest':
        return [
          'view_public_content'
        ];
      default:
        return [];
    }
  }
}
