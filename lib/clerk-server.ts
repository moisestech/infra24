import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { Organization } from '@/types/organization';
import { ArtistProfile } from '@/types/artist';
import { Announcement } from '@/types/announcement';

// Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export class ClerkServerService {
  // Get current user from Clerk
  static async getCurrentUser() {
    const { userId } = await auth();
    return userId;
  }

  // Get current session from Clerk
  static async getSession() {
    const { userId } = await auth();
    if (!userId) return null;
    
    return { userId };
  }

  // Get user membership from org_memberships table
  static async getUserMembership(userId: string) {
    const { data, error } = await supabase
      .from('org_memberships')
      .select(`
        *,
        organizations (*)
      `)
      .eq('clerk_user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user membership:', error);
      return null;
    }

    return data;
  }

  // Update user membership in org_memberships table
  static async updateUserMembership(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('org_memberships')
      .update(updates)
      .eq('clerk_user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user membership:', error);
      throw error;
    }

    return data;
  }

  // Get or create user membership
  static async getOrCreateUserMembership(userId: string, userData?: any) {
    let membership = await this.getUserMembership(userId);
    
    if (!membership) {
      // User doesn't exist, but we assume they're created via webhook
      // Just return null for now - webhook should handle creation
      return null;
    }
    
    return membership;
  }

  // Get user's organization
  static async getUserOrganization(userId: string) {
    const membership = await this.getUserMembership(userId);
    if (!membership?.org_id) return null;

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', membership.org_id)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  // Check if user has permission
  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    const membership = await this.getUserMembership(userId);
    if (!membership) return false;

    // Super admins have all permissions
    if (membership.role === 'super_admin') return true;

    // Org admins have most permissions
    if (membership.role === 'org_admin') {
      const orgPermissions = [
        'manage_announcements',
        'manage_artists',
        'approve_claims',
        'view_analytics',
        'manage_members'
      ];
      return orgPermissions.includes(permission);
    }

    // Moderators have limited permissions
    if (membership.role === 'moderator') {
      const modPermissions = [
        'approve_claims',
        'view_analytics'
      ];
      return modPermissions.includes(permission);
    }

    // Residents have basic permissions
    if (membership.role === 'resident') {
      const residentPermissions = [
        'create_announcements',
        'view_artists',
        'claim_profile'
      ];
      return residentPermissions.includes(permission);
    }

    return false;
  }

  // Get all organizations (super admin only)
  static async getAllOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }

    return data || [];
  }

  // Get organization users
  static async getOrganizationUsers(orgId: string) {
    const { data, error } = await supabase
      .from('org_memberships')
      .select(`
        *,
        organizations (*)
      `)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error fetching organization users:', error);
      throw error;
    }

    return data || [];
  }

  // Create organization (super admin only)
  static async createOrganization(orgData: Partial<Organization>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert(orgData)
      .select()
      .single();

    if (error) {
      console.error('Error creating organization:', error);
      throw error;
    }

    return data;
  }

  // Update organization
  static async updateOrganization(orgId: string, updates: Partial<Organization>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', orgId)
      .select()
      .single();

    if (error) {
      console.error('Error updating organization:', error);
      throw error;
    }

    return data;
  }

  // Assign user to organization
  static async assignUserToOrganization(userId: string, orgId: string, role: string = 'resident') {
    const { data, error } = await supabase
      .from('org_memberships')
      .update({
        org_id: orgId,
        role
      })
      .eq('clerk_user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error assigning user to organization:', error);
      throw error;
    }

    return data;
  }

  // Get permissions for role
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

  // Delete user (super admin only)
  static async deleteUser(userId: string) {
    const { error } = await supabase
      .from('org_memberships')
      .delete()
      .eq('clerk_user_id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get user session with full membership data
  static async getUserSession() {
    const { userId } = await auth();
    if (!userId) return null;

    const membership = await this.getUserMembership(userId);
    if (!membership) return null;

    const permissions = this.getPermissionsForRole(membership.role);
    const organization = membership.organizations;

    return {
      userId,
      membership,
      organization,
      role: membership.role,
      permissions,
      isAuthenticated: true
    };
  }

  // Get artist profile for user
  static async getArtistProfile(userId: string) {
    const { data, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('claimed_by_clerk_user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error fetching artist profile:', error);
      return null;
    }

    return data;
  }

  // Create artist profile
  static async createArtistProfile(userId: string, orgId: string, profileData: Partial<ArtistProfile>) {
    const { data, error } = await supabase
      .from('artist_profiles')
      .insert({
        organization_id: orgId,
        claimed_by_clerk_user_id: userId,
        ...profileData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating artist profile:', error);
      throw error;
    }

    return data;
  }

  // Update artist profile
  static async updateArtistProfile(profileId: string, updates: Partial<ArtistProfile>) {
    const { data, error } = await supabase
      .from('artist_profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      console.error('Error updating artist profile:', error);
      throw error;
    }

    return data;
  }
}
