import { getStripeClient, PAYMENT_STATUS_MAP } from './config'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface CreatePaymentIntentParams {
  amount: number
  currency: string
  bookingId: string
  userId: string
  organizationId: string
  metadata?: Record<string, string>
}

export interface CreateCheckoutSessionParams {
  amount: number
  currency: string
  bookingId: string
  userId: string
  organizationId: string
  successUrl?: string
  cancelUrl?: string
  metadata?: Record<string, string>
}

export interface RefundParams {
  paymentIntentId: string
  amount?: number
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
}

export class StripeService {
  /**
   * Create a payment intent for a booking
   */
  static async createPaymentIntent(params: CreatePaymentIntentParams) {
    try {
      const stripe = getStripeClient()
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Convert to cents
        currency: params.currency,
        metadata: {
          booking_id: params.bookingId,
          user_id: params.userId,
          organization_id: params.organizationId,
          ...params.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        success: true,
        paymentIntent,
        clientSecret: paymentIntent.client_secret,
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Create a checkout session for a booking
   */
  static async createCheckoutSession(params: CreateCheckoutSessionParams) {
    try {
      const stripe = getStripeClient()
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: params.currency,
              product_data: {
                name: 'Workshop Booking',
                description: 'Booking for workshop session',
              },
              unit_amount: Math.round(params.amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: params.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/bookings/confirmation/{CHECKOUT_SESSION_ID}`,
        cancel_url: params.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/bookings`,
        metadata: {
          booking_id: params.bookingId,
          user_id: params.userId,
          organization_id: params.organizationId,
          ...params.metadata,
        },
      })

      return {
        success: true,
        session,
        sessionId: session.id,
        url: session.url,
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Retrieve a payment intent
   */
  static async getPaymentIntent(paymentIntentId: string) {
    try {
      const stripe = getStripeClient()
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      return {
        success: true,
        paymentIntent,
      }
    } catch (error) {
      console.error('Error retrieving payment intent:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Process a refund
   */
  static async processRefund(params: RefundParams) {
    try {
      const stripe = getStripeClient()
      const refund = await stripe.refunds.create({
        payment_intent: params.paymentIntentId,
        amount: params.amount ? Math.round(params.amount * 100) : undefined,
        reason: params.reason,
      })

      return {
        success: true,
        refund,
      }
    } catch (error) {
      console.error('Error processing refund:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Update booking payment status in database
   */
  static async updateBookingPaymentStatus(
    bookingId: string,
    paymentIntentId: string,
    status: string,
    amount?: number
  ) {
    try {
      const supabase = getSupabaseAdmin()
      
      const updateData: any = {
        stripe_payment_intent_id: paymentIntentId,
        payment_status: PAYMENT_STATUS_MAP[status as keyof typeof PAYMENT_STATUS_MAP] || 'pending',
        updated_at: new Date().toISOString(),
      }

      if (amount !== undefined) {
        updateData.payment_amount = amount
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)

      if (error) {
        throw error
      }

      // Also create/update payment transaction record
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .upsert({
          booking_id: bookingId,
          stripe_payment_intent_id: paymentIntentId,
          amount: amount || 0,
          currency: 'USD',
          status: status,
          payment_method_types: ['card'],
        })

      if (transactionError) {
        console.error('Error updating payment transaction:', transactionError)
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating booking payment status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get user's role for pricing calculation
   */
  static async getUserRole(userId: string, organizationId: string) {
    try {
      const supabase = getSupabaseAdmin()
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return data?.role || 'public'
    } catch (error) {
      console.error('Error getting user role:', error)
      return 'public' // Default to public pricing
    }
  }

  /**
   * Calculate pricing based on user role and resource pricing rules
   */
  static calculatePricing(
    basePrice: number,
    userRole: string,
    pricingRules: Record<string, number> = {}
  ): number {
    // Check if user role has specific pricing
    if (pricingRules[userRole] !== undefined) {
      return pricingRules[userRole]
    }

    // Check if user role gets free access
    if (pricingRules[userRole] === 0) {
      return 0
    }

    // Default to base price
    return basePrice
  }
}
