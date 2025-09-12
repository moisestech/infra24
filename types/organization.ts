export type RoleType = 'guest' | 'resident' | 'moderator' | 'org_admin' | 'super_admin';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  horizontal_logo_url?: string;
  artist_icon?: string;
  banner_image?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrgMemberType {
  id: string;
  org_id: string;
  type_key: string;
  label: string;
  description?: string;
  is_staff: boolean;
  default_role_on_claim: RoleType;
  sort_order: number;
  created_at: string;
}

export interface OrgMembership {
  id: string;
  org_id?: string;
  user_id?: string;
  joined_at: string;
  role: RoleType;
  clerk_user_id?: string;
}

export interface OrgTaxonomy {
  id: string;
  org_id: string;
  key: string;
  label: string;
  description?: string;
}

export interface OrgTerm {
  id: string;
  taxonomy_id: string;
  parent_id?: string;
  key: string;
  label: string;
  sort_order: number;
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  logo_url?: string;
  horizontal_logo_url?: string;
  settings?: Record<string, any>;
}

export interface UpdateOrganizationRequest {
  name?: string;
  slug?: string;
  logo_url?: string;
  horizontal_logo_url?: string;
  settings?: Record<string, any>;
}

export interface CreateMemberTypeRequest {
  type_key: string;
  label: string;
  description?: string;
  is_staff?: boolean;
  default_role_on_claim?: RoleType;
  sort_order?: number;
}

export interface CreateTaxonomyRequest {
  key: string;
  label: string;
  description?: string;
}

export interface CreateTermRequest {
  taxonomy_id: string;
  parent_id?: string;
  key: string;
  label: string;
  sort_order?: number;
}
