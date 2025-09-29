import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('digital_lab_page'),
  organization_id: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.any()).optional()
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Route: /api/digital-lab/subscribe - Starting request')
    
    const body = await request.json()
    const { email, source, organization_id, metadata } = subscribeSchema.parse(body)

    console.log('📧 Processing email subscription:', { email, source, organization_id })

    // Check if email already exists
    const supabaseAdmin = getSupabaseAdmin()

    const { data: existingSubscription, error: checkError } = await supabaseAdmin
      .from('digital_lab_subscriptions')
      .select('id, email, status, created_at')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing subscription:', checkError)
      return NextResponse.json({ error: 'Failed to check subscription status' }, { status: 500 })
    }

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        console.log('✅ Email already subscribed:', email)
        return NextResponse.json({ 
          message: 'Email already subscribed',
          status: 'already_subscribed',
          subscription: existingSubscription
        })
      } else {
        // Reactivate subscription
        const { data: reactivatedSubscription, error: reactivateError } = await supabaseAdmin
          .from('digital_lab_subscriptions')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString(),
            metadata: {
              ...(existingSubscription as any).metadata || {},
              ...metadata,
              reactivated_at: new Date().toISOString()
            }
          })
          .eq('id', existingSubscription.id)
          .select()
          .single()

        if (reactivateError) {
          console.error('❌ Error reactivating subscription:', reactivateError)
          return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 })
        }

        console.log('✅ Subscription reactivated:', reactivatedSubscription.id)
        return NextResponse.json({ 
          message: 'Subscription reactivated successfully',
          status: 'reactivated',
          subscription: reactivatedSubscription
        })
      }
    }

    // Create new subscription
    const subscriptionData = {
      email,
      source,
      organization_id,
      status: 'active',
      metadata: {
        ...metadata,
        subscribed_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newSubscription, error: createError } = await supabaseAdmin
      .from('digital_lab_subscriptions')
      .insert(subscriptionData)
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating subscription:', createError)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    console.log('✅ New subscription created:', newSubscription.id)

    // TODO: Send welcome email
    // TODO: Add to email marketing platform
    // TODO: Trigger analytics event

    return NextResponse.json({ 
      message: 'Successfully subscribed to Digital Lab updates',
      status: 'subscribed',
      subscription: newSubscription
    })

  } catch (error) {
    console.error('Error in digital lab subscription API:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: error.issues 
      }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data: subscription, error } = await supabaseAdmin
      .from('digital_lab_subscriptions')
      .select('id, email, status, created_at, metadata')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error checking subscription:', error)
      return NextResponse.json({ error: 'Failed to check subscription' }, { status: 500 })
    }

    return NextResponse.json({ 
      subscribed: !!subscription && subscription.status === 'active',
      subscription: subscription || null
    })

  } catch (error) {
    console.error('Error in subscription check API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
