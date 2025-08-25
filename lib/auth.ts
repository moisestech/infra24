import React from 'react';
import { User, UserSession, Organization, hasPermission, Permission } from '@/types/user';

// Mock data for development - replace with real auth system
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'moises@smart-sign.com',
    name: 'Moises Sanabria',
    role: 'super_admin',
    organization_id: '1',
    permissions: ['create_announcement', 'edit_announcement', 'delete_announcement', 'approve_announcement', 'manage_users', 'view_analytics', 'manage_organization', 'view_all_organizations'],
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
  {
    id: '2',
    email: 'cathy@bacfl.org',
    name: 'Cathy Leff',
    role: 'org_admin',
    organization_id: '1',
    permissions: ['create_announcement', 'edit_announcement', 'delete_announcement', 'approve_announcement', 'manage_users', 'view_analytics', 'manage_organization'],
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
  {
    id: '3',
    email: 'christine@bacfl.org',
    name: 'Christine Cortes',
    role: 'moderator',
    organization_id: '1',
    permissions: ['create_announcement', 'edit_announcement', 'approve_announcement', 'view_analytics'],
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
  {
    id: '4',
    email: 'artist@example.com',
    name: 'Sample Artist',
    role: 'resident',
    organization_id: '1',
    permissions: ['create_announcement', 'edit_announcement'],
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  },
];

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: '1',
    name: 'Bakehouse Art Complex',
    slug: 'bakehouse',
    description: 'Miami\'s premier artist community',
    contact_email: 'info@bacfl.org',
    subscription_tier: 'premium',
    subscription_status: 'active',
    settings: {
      allow_public_viewing: true,
      require_approval: true,
      max_announcements_per_month: 100,
      branding: {
        primary_color: '#3b82f6',
      },
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    name: 'Oolite Arts',
    slug: 'oolite',
    description: 'Supporting Miami\'s visual artists',
    contact_email: 'info@oolitearts.org',
    subscription_tier: 'basic',
    subscription_status: 'trial',
    trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    settings: {
      allow_public_viewing: true,
      require_approval: false,
      max_announcements_per_month: 50,
      branding: {
        primary_color: '#10b981',
      },
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Session management
let currentSession: UserSession | null = null;

export class AuthService {
  // Login functionality
  static async login(email: string, password: string): Promise<UserSession | null> {
    // Mock login - replace with real authentication
    const user = MOCK_USERS.find(u => u.email === email && u.is_active);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const organization = MOCK_ORGANIZATIONS.find(org => org.id === user.organization_id);
    if (!organization) {
      throw new Error('Organization not found');
    }

    const session: UserSession = {
      user,
      organization,
      permissions: user.permissions,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    currentSession = session;
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart-sign-session', JSON.stringify(session));
    }

    return session;
  }

  // Logout functionality
  static async logout(): Promise<void> {
    currentSession = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smart-sign-session');
    }
  }

  // Get current session
  static getCurrentSession(): UserSession | null {
    if (currentSession) {
      return currentSession;
    }

    // Try to restore from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('smart-sign-session');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          if (new Date(session.expires_at) > new Date()) {
            currentSession = session;
            return session;
          } else {
            localStorage.removeItem('smart-sign-session');
          }
        } catch (error) {
          localStorage.removeItem('smart-sign-session');
        }
      }
    }

    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentSession() !== null;
  }

  // Check if user has specific permission
  static hasPermission(permission: Permission): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;
    
    return hasPermission(session.user, permission);
  }

  // Get current user
  static getCurrentUser(): User | null {
    const session = this.getCurrentSession();
    return session?.user || null;
  }

  // Get current organization
  static getCurrentOrganization(): Organization | null {
    const session = this.getCurrentSession();
    return session?.organization || null;
  }

  // Get all organizations (for super admin)
  static getAllOrganizations(): Organization[] {
    const session = this.getCurrentSession();
    if (!session || !this.hasPermission('view_all_organizations')) {
      return [];
    }
    return MOCK_ORGANIZATIONS;
  }

  // Check if user can access organization
  static canAccessOrganization(organizationId: string): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;
    
    // Super admin can access all organizations
    if (this.hasPermission('view_all_organizations')) {
      return true;
    }
    
    // Regular users can only access their own organization
    return session.user.organization_id === organizationId;
  }

  // Get users for organization (for admins)
  static getOrganizationUsers(organizationId: string): User[] {
    const session = this.getCurrentSession();
    if (!session || !this.hasPermission('manage_users')) {
      return [];
    }
    
    if (!this.canAccessOrganization(organizationId)) {
      return [];
    }
    
    return MOCK_USERS.filter(user => user.organization_id === organizationId);
  }

  // Create new user (for admins)
  static async createUser(userData: Partial<User>): Promise<User> {
    const session = this.getCurrentSession();
    if (!session || !this.hasPermission('manage_users')) {
      throw new Error('Unauthorized');
    }

    // Mock user creation - replace with real implementation
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      role: userData.role!,
      organization_id: session.user.organization_id,
      permissions: userData.permissions || [],
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
    };

    MOCK_USERS.push(newUser);
    return newUser;
  }

  // Update user (for admins)
  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const session = this.getCurrentSession();
    if (!session || !this.hasPermission('manage_users')) {
      throw new Error('Unauthorized');
    }

    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      ...updates,
      updated_at: new Date(),
    };

    return MOCK_USERS[userIndex];
  }
}

// React hook for authentication
export function useAuth() {
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const currentSession = AuthService.getCurrentSession();
    setSession(currentSession);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const newSession = await AuthService.login(email, password);
      setSession(newSession);
      return newSession;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setSession(null);
  };

  const hasPermission = (permission: Permission) => {
    return AuthService.hasPermission(permission);
  };

  return {
    session,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!session,
    user: session?.user || null,
    organization: session?.organization || null,
  };
}
