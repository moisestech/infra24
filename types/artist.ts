export type StudioType = 'Studio' | 'Associate' | 'Gallery';
export type ProfileType = 'artist' | 'staff';
export type RoleType = 'guest' | 'resident' | 'moderator' | 'org_admin' | 'super_admin';

export interface ArtistProfile {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  studio_number?: string;
  studio_type?: StudioType;
  studio_location?: string;
  phone?: string;
  bio?: string;
  website_url?: string;
  instagram_handle?: string;
  profile_image?: string;
  portfolio_images?: string[];
  achievements?: string[];
  awards?: string[];
  exhibitions?: string[];
  publications?: string[];
  education?: string[];
  specialties?: string[];
  media?: string[];
  year_started?: number;
  year_ended?: number;
  is_active: boolean;
  is_claimed: boolean;
  claimed_by_clerk_user_id?: string;
  claimed_by_membership_id?: string;
  claimed_at?: string;
  profile_type: ProfileType;
  created_at: string;
  updated_at: string;
  member_type_id?: string;
  metadata: Record<string, any>;
}

export interface ArtistProfileImage {
  id: string;
  artist_profile_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ArtistProfileTerm {
  artist_profile_id: string;
  term_id: string;
}

export interface ArtistClaimRequest {
  id: string;
  artist_profile_id: string;
  requester_clerk_id: string;
  requester_email?: string;
  requester_name?: string;
  claim_reason?: string;
  supporting_evidence?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by_clerk_id?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ArtistClaimToken {
  id: string;
  artist_profile_id: string;
  token: string;
  issued_to_email?: string;
  role_on_claim: RoleType;
  expires_at: string;
  used_at?: string;
  used_by_clerk_id?: string;
  created_by_clerk_id?: string;
  created_at: string;
}

export interface CreateArtistProfileRequest {
  name: string;
  email?: string;
  studio_number?: string;
  studio_type?: StudioType;
  studio_location?: string;
  phone?: string;
  bio?: string;
  website_url?: string;
  instagram_handle?: string;
  profile_image?: string;
  portfolio_images?: string[];
  achievements?: string[];
  awards?: string[];
  exhibitions?: string[];
  publications?: string[];
  education?: string[];
  specialties?: string[];
  media?: string[];
  year_started?: number;
  year_ended?: number;
  profile_type?: ProfileType;
  member_type_id?: string;
  metadata?: Record<string, any>;
}

export interface UpdateArtistProfileRequest {
  name?: string;
  email?: string;
  studio_number?: string;
  studio_type?: StudioType;
  studio_location?: string;
  phone?: string;
  bio?: string;
  website_url?: string;
  instagram_handle?: string;
  profile_image?: string;
  portfolio_images?: string[];
  achievements?: string[];
  awards?: string[];
  exhibitions?: string[];
  publications?: string[];
  education?: string[];
  specialties?: string[];
  media?: string[];
  year_started?: number;
  year_ended?: number;
  is_active?: boolean;
  profile_type?: ProfileType;
  member_type_id?: string;
  metadata?: Record<string, any>;
}

export interface CreateClaimRequestRequest {
  artist_profile_id: string;
  claim_reason?: string;
  supporting_evidence?: string;
}

export interface IssueClaimTokenRequest {
  artist_profile_id: string;
  issued_to_email?: string;
  role_override?: RoleType;
}
