export type UserRole = 
  | 'super_admin'    // You - full system control
  | 'org_admin'      // Institution admin (Cathy at Bakehouse)
  | 'moderator'      // Content moderator
  | 'resident'       // Artist resident
  | 'guest';         // Public viewer

export type Permission = 
  | 'create_announcement'
  | 'edit_announcement'
  | 'delete_announcement'
  | 'approve_announcement'
  | 'manage_users'
  | 'view_analytics'
  | 'manage_organization'
  | 'view_all_organizations';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization_id: string;
  permissions: Permission[];
  profile_image?: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  is_active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string; // bakehouse, oolite, etc.
  description?: string;
  logo_url?: string;
  website_url?: string;
  contact_email: string;
  subscription_tier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'trial' | 'expired' | 'cancelled';
  trial_ends_at?: Date;
  subscription_ends_at?: Date;
  settings: {
    allow_public_viewing: boolean;
    require_approval: boolean;
    max_announcements_per_month: number;
    custom_domain?: string;
    branding: {
      primary_color: string;
      logo_url?: string;
      custom_css?: string;
    };
  };
  created_at: Date;
  updated_at: Date;
}

export interface UserSession {
  user: User;
  organization: Organization;
  permissions: Permission[];
  expires_at: Date;
}

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'create_announcement',
    'edit_announcement', 
    'delete_announcement',
    'approve_announcement',
    'manage_users',
    'view_analytics',
    'manage_organization',
    'view_all_organizations'
  ],
  org_admin: [
    'create_announcement',
    'edit_announcement',
    'delete_announcement', 
    'approve_announcement',
    'manage_users',
    'view_analytics',
    'manage_organization'
  ],
  moderator: [
    'create_announcement',
    'edit_announcement',
    'approve_announcement',
    'view_analytics'
  ],
  resident: [
    'create_announcement',
    'edit_announcement'
  ],
  guest: []
};

// Helper function to check permissions
export function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

// Helper function to get user's organization
export function getUserOrganization(user: User, organizations: Organization[]): Organization | null {
  return organizations.find(org => org.id === user.organization_id) || null;
}
