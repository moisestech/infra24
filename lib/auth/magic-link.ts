import { createHash, randomBytes } from 'crypto';
import { getSupabaseAdmin } from '../supabase';

export interface MagicLinkData {
  email: string;
  surveyId: string;
  organizationId: string;
  expiresAt: Date;
  metadata?: {
    firstName?: string;
    lastName?: string;
    role?: string;
    department?: string;
  };
}

export interface MagicLinkResult {
  token: string;
  url: string;
  expiresAt: Date;
}

/**
 * Generate a magic link for survey access
 */
export async function generateMagicLink(data: MagicLinkData): Promise<MagicLinkResult> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Store the magic link in database
  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin
    .from('magic_links')
    .insert({
      token,
      email: data.email.toLowerCase(),
      survey_id: data.surveyId,
      organization_id: data.organizationId,
      expires_at: expiresAt.toISOString(),
      metadata: data.metadata || {},
      used: false,
      created_at: new Date().toISOString()
    });

  if (error) {
    throw new Error(`Failed to create magic link: ${error.message}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${baseUrl}/survey/${data.surveyId}?token=${token}`;

  return {
    token,
    url,
    expiresAt
  };
}

/**
 * Validate and consume a magic link token
 */
export async function validateMagicLink(token: string): Promise<{
  valid: boolean;
  data?: {
    email: string;
    surveyId: string;
    organizationId: string;
    metadata: any;
  };
  error?: string;
}> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data: linkData, error } = await supabaseAdmin
      .from('magic_links')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (error || !linkData) {
      return { valid: false, error: 'Invalid or expired link' };
    }

    // Check expiration
    if (new Date(linkData.expires_at) < new Date()) {
      return { valid: false, error: 'Link has expired' };
    }

    // Mark as used
    const supabaseAdminUpdate = getSupabaseAdmin()
      await supabaseAdminUpdate
      .from('magic_links')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('token', token);

    return {
      valid: true,
      data: {
        email: linkData.email,
        surveyId: linkData.survey_id,
        organizationId: linkData.organization_id,
        metadata: linkData.metadata
      }
    };
  } catch (error) {
    return { valid: false, error: 'Failed to validate link' };
  }
}

/**
 * Track magic link usage for analytics
 */
export async function trackMagicLinkUsage(token: string, action: 'opened' | 'started' | 'completed') {
  try {
    const supabaseAdminTrack = getSupabaseAdmin()
      await supabaseAdminTrack
      .from('magic_link_analytics')
      .insert({
        token,
        action,
        timestamp: new Date().toISOString(),
        user_agent: 'web', // Could be enhanced with actual user agent
        ip_address: 'unknown' // Could be enhanced with actual IP
      });
  } catch (error) {
    console.error('Failed to track magic link usage:', error);
  }
}

/**
 * Find or create user based on email and survey context
 */
export async function findOrCreateSurveyUser(email: string, organizationId: string, metadata?: any) {
  try {
    // First, try to find existing user
    const supabaseAdminFind = getSupabaseAdmin()
    const { data: existingUser, error: findError } = await supabaseAdminFind
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser && !findError) {
      // User exists, ensure they have access to this organization
      await ensureUserOrganizationAccess(existingUser.id, organizationId);
      return existingUser;
    }

    // Create new user
    const { data: newUser, error: createError } = await supabaseAdminFind
      .from('users')
      .insert({
        email: email.toLowerCase(),
        first_name: metadata?.firstName || '',
        last_name: metadata?.lastName || '',
        role: metadata?.role || 'survey_respondent',
        created_via: 'survey_magic_link',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError || !newUser) {
      throw new Error(`Failed to create user: ${createError?.message}`);
    }

    // Ensure organization access
    await ensureUserOrganizationAccess(newUser.id, organizationId);

    return newUser;
  } catch (error) {
    console.error('Failed to find or create survey user:', error);
    throw error;
  }
}

/**
 * Ensure user has access to organization (for surveys)
 */
async function ensureUserOrganizationAccess(userId: string, organizationId: string) {
  try {
    const supabaseAdminAccess = getSupabaseAdmin()
    const { error } = await supabaseAdminAccess
      .from('org_memberships')
      .upsert({
        user_id: userId,
        organization_id: organizationId,
        role: 'survey_respondent',
        status: 'active',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to ensure organization access:', error);
    }
  } catch (error) {
    console.error('Failed to ensure organization access:', error);
  }
}

