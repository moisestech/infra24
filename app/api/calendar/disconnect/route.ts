import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const disconnectRequestSchema = z.object({
  provider: z.enum(['google', 'microsoft'])
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { provider } = disconnectRequestSchema.parse(body)

    const supabase = getSupabaseAdmin()

    // Delete calendar tokens
    const { error: tokensError } = await supabase
      .from('user_calendar_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('provider', provider)

    if (tokensError) {
      throw tokensError
    }

    // Delete calendar events for this provider
    const { error: eventsError } = await supabase
      .from('calendar_events')
      .delete()
      .eq('user_id', userId)
      .eq('provider', provider)

    if (eventsError) {
      console.error('Error deleting calendar events:', eventsError)
    }

    // Clear availability cache for this provider
    const { error: cacheError } = await supabase
      .from('calendar_availability_cache')
      .delete()
      .eq('user_id', userId)
      .eq('provider', provider)

    if (cacheError) {
      console.error('Error clearing availability cache:', cacheError)
    }

    return NextResponse.json({
      success: true,
      message: `${provider} calendar disconnected successfully`
    })
  } catch (error) {
    console.error('Calendar disconnect error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect calendar' },
      { status: 500 }
    )
  }
}
