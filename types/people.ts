// Enhanced people types for announcements

export interface Person {
  id: string;
  name: string;
  role?: string;
  avatar_url?: string;
  email?: string;
  organization?: string;
  is_member?: boolean; // Whether they're a member of the current organization
  member_id?: string; // Reference to user/member record if they're a member
  external_profile_url?: string; // Link to their external profile/website
}

export interface AnnouncementPerson extends Person {
  relationship_type: 'organizer' | 'speaker' | 'featured_artist' | 'contact' | 'host' | 'participant';
  display_order?: number; // For ordering people in the UI
}

// Helper function to create a person from a user record
export function createPersonFromUser(user: any, relationshipType: AnnouncementPerson['relationship_type'] = 'participant'): AnnouncementPerson {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    avatar_url: user.profile_image || user.avatar_url,
    email: user.email,
    organization: user.organization?.name,
    is_member: true,
    member_id: user.id,
    relationship_type: relationshipType
  };
}

// Helper function to create an external person
export function createExternalPerson(
  name: string, 
  role?: string, 
  avatarUrl?: string, 
  relationshipType: AnnouncementPerson['relationship_type'] = 'participant'
): AnnouncementPerson {
  return {
    id: `external_${name.toLowerCase().replace(/\s+/g, '_')}`,
    name,
    role,
    avatar_url: avatarUrl,
    is_member: false,
    relationship_type: relationshipType
  };
}
