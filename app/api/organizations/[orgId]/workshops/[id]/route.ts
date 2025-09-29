import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; id: string }> }
) {
  try {
    const { orgId, id } = await params
    const supabase = createClient()

    console.log('🔍 Fetching workshop details for:', { orgId, id })

    const { data: workshop, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single()

    if (error) {
      console.error('Error fetching workshop:', error)
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    console.log('✅ Found workshop:', workshop.title)
    return NextResponse.json(workshop)
  } catch (error) {
    console.error('Error in workshop details API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
