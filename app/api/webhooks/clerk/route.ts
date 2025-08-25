import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  if (eventType === 'user.created') {
    const { id: userId, email_addresses, first_name, last_name, image_url } = evt.data;
    
    const primaryEmail = email_addresses?.find((email: any) => email.id === evt.data.primary_email_address_id);
    
    if (primaryEmail) {
      try {
        // Create user membership in org_memberships table
        const { data, error } = await supabase
          .from('org_memberships')
          .insert({
            clerk_user_id: userId,
            role: 'resident', // Default role for new users
            org_id: null, // No organization assigned initially
            joined_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating user from webhook:', error);
          return new Response('Error creating user', { status: 500 });
        }

        console.log(`Created user profile for ${primaryEmail.email_address}`);
        return new Response('User created successfully', { status: 200 });
      } catch (error) {
        console.error('Error creating user profile from webhook:', error);
        return new Response('Error creating user', { status: 500 });
      }
    }
  }

  if (eventType === 'user.updated') {
    const { id: userId, email_addresses, first_name, last_name, image_url } = evt.data;
    
    try {
      // Update user membership in org_memberships table
      // Note: We don't store first_name, last_name, image_url in org_memberships
      // These are stored in Clerk and accessed via Clerk SDK
      console.log(`User ${userId} updated in Clerk - no action needed in org_memberships`);
      return new Response('User updated successfully', { status: 200 });
    } catch (error) {
      console.error('Error updating user profile from webhook:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id: userId } = evt.data;
    
    try {
      // Delete user membership from org_memberships table
      const { error } = await supabase
        .from('org_memberships')
        .delete()
        .eq('clerk_user_id', userId);

      if (error) {
        console.error('Error deleting user from webhook:', error);
        return new Response('Error deleting user', { status: 500 });
      }

      console.log(`Deleted user profile for ${userId}`);
      return new Response('User deleted successfully', { status: 200 });
    } catch (error) {
      console.error('Error deleting user profile from webhook:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
