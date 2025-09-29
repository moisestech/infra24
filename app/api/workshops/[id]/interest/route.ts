import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = await params

    console.log('🚀 API ROUTE: POST /api/workshops/[id]/interest called')
    console.log('🚀 Workshop ID:', workshopId)
    console.log('🚀 User ID:', userId)

    // Check if workshop exists
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('id, title')
      .eq('id', workshopId)
      .single()

    if (workshopError || !workshop) {
      console.log('❌ Workshop not found:', workshopError?.message)
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Check if user already expressed interest
    const { data: existingInterest, error: checkError } = await supabase
      .from('workshop_interest')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.log('❌ Error checking existing interest:', checkError.message)
      return NextResponse.json({ error: 'Failed to check interest' }, { status: 500 })
    }

    if (existingInterest) {
      return NextResponse.json({ 
        success: true, 
        message: 'Interest already recorded',
        alreadyInterested: true 
      })
    }

    // Add user interest
    const { data: interest, error: interestError } = await supabase
      .from('workshop_interest')
      .insert({
        workshop_id: workshopId,
        user_id: userId
      })
      .select()
      .single()

    if (interestError) {
      console.log('❌ Error adding interest:', interestError.message)
      return NextResponse.json({ error: 'Failed to record interest' }, { status: 500 })
    }

    // Update interest count on workshop
    const { error: updateError } = await supabase.rpc('increment_workshop_interest', {
      workshop_id: workshopId
    })

    if (updateError) {
      console.log('⚠️ Error updating interest count:', updateError.message)
      // Don't fail the request, just log the warning
    }

    console.log('✅ Interest recorded successfully')

    return NextResponse.json({
      success: true,
      message: 'Interest recorded successfully',
      data: interest
    })

  } catch (error) {
    console.error('Workshop interest API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = await params

    // Get interest count and user's interest status
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('interest_count')
      .eq('id', workshopId)
      .single()

    if (workshopError || !workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Check if user has expressed interest
    const { data: userInterest, error: interestError } = await supabase
      .from('workshop_interest')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('user_id', userId)
      .single()

    const isInterested = !interestError && userInterest

    return NextResponse.json({
      success: true,
      data: {
        interest_count: workshop.interest_count || 0,
        user_interested: isInterested
      }
    })

  } catch (error) {
    console.error('Get workshop interest API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
